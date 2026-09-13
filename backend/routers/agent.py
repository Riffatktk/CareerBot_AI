"""Agent lifecycle endpoints, backed by the database.

Manages one AgentState row per user session and a RunLog history per run.
Starting an agent seeds a fixed set of mock jobs so the dashboard has data
immediately; "Run Now" (and the daily scheduler — see services/scheduler.py)
scrape real listings via JobSpy and score them with Gemini.
"""

from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.models import AgentState, Job, Resume, RunLog, User
from schemas.schemas import AgentStartRequest, AgentStartResponse, AgentStatusResponse
from seed import seed_mock_jobs
from services.ai_service import score_jobs_batch
from services.job_scraper import scrape_jobs
from utils import (
    DEFAULT_SESSION_ID,
    deserialize_dict,
    deserialize_list,
    ensure_utc,
    format_iso,
    get_next_run_time,
    serialize_dict,
)

router = APIRouter(prefix="/agent", tags=["agent"])


async def _get_or_create_user(db: AsyncSession, session_id: str) -> User:
    result = await db.execute(select(User).where(User.session_id == session_id))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(session_id=session_id)
        db.add(user)
        await db.flush()
    return user


async def _get_active_agent(db: AsyncSession, user_id: str) -> Optional[AgentState]:
    result = await db.execute(
        select(AgentState)
        .where(AgentState.user_id == user_id, AgentState.status == "ACTIVE")
        .order_by(AgentState.created_at.desc())
    )
    return result.scalars().first()


async def _get_latest_agent(db: AsyncSession, user_id: str) -> Optional[AgentState]:
    result = await db.execute(
        select(AgentState)
        .where(AgentState.user_id == user_id)
        .order_by(AgentState.created_at.desc())
    )
    return result.scalars().first()


@router.post("/start", response_model=AgentStartResponse)
async def start_agent(
    payload: AgentStartRequest,
    session_id_header: Optional[str] = Header(None, alias="session_id"),
    db: AsyncSession = Depends(get_db),
):
    resolved_session_id = payload.session_id or session_id_header or DEFAULT_SESSION_ID
    user = await _get_or_create_user(db, resolved_session_id)

    if not payload.resume_id:
        raise HTTPException(status_code=404, detail="Resume not found.")

    result = await db.execute(select(Resume).where(Resume.id == payload.resume_id))
    resume = result.scalar_one_or_none()
    if resume is None:
        raise HTTPException(status_code=404, detail="Resume not found.")

    existing = await _get_active_agent(db, user.id)
    if existing is not None:
        return AgentStartResponse(
            agent_id=existing.id,
            status=existing.status,
            next_run=format_iso(existing.next_run_at),
            created_at=format_iso(existing.created_at),
            message="Agent is already active.",
        )

    now = datetime.now(timezone.utc)
    next_run = get_next_run_time()

    agent = AgentState(
        user_id=user.id,
        resume_id=payload.resume_id,
        status="ACTIVE",
        user_prompt=payload.effective_prompt,
        next_run_at=next_run,
    )
    db.add(agent)
    await db.flush()

    await seed_mock_jobs(db, agent.id)

    run_log = RunLog(
        agent_id=agent.id,
        run_number=1,
        ran_at=now,
        jobs_found=15,
        duration_seconds=47,
        status="SUCCESS",
        sources_breakdown=serialize_dict({"LinkedIn": 6, "Indeed": 5, "Glassdoor": 4}),
    )
    db.add(run_log)

    agent.total_jobs_found = 15
    agent.total_runs = 1
    agent.last_run_at = now

    await db.flush()

    return AgentStartResponse(
        agent_id=agent.id,
        status=agent.status,
        next_run=format_iso(agent.next_run_at),
        created_at=format_iso(agent.created_at),
        message="Agent started. First scan at 09:00 AM tomorrow.",
    )


@router.post("/stop")
async def stop_agent(
    session_id: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    resolved_session_id = session_id or DEFAULT_SESSION_ID

    result = await db.execute(select(User).where(User.session_id == resolved_session_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="No active agent found.")

    agent = await _get_active_agent(db, user.id)
    if agent is None:
        raise HTTPException(status_code=404, detail="No active agent found.")

    agent.status = "STOPPED"
    await db.flush()

    return {"agent_id": agent.id, "status": "STOPPED", "message": "Agent stopped."}


@router.post("/run-now")
async def run_agent_now(
    session_id: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    resolved_session_id = session_id or DEFAULT_SESSION_ID

    result = await db.execute(select(User).where(User.session_id == resolved_session_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="No active agent found.")

    agent = await _get_active_agent(db, user.id)
    if agent is None:
        raise HTTPException(status_code=404, detail="No active agent found.")

    resume = None
    if agent.resume_id:
        resume_result = await db.execute(select(Resume).where(Resume.id == agent.resume_id))
        resume = resume_result.scalar_one_or_none()

    parsed_skills: list = []
    parsed_job_titles: list = []
    parsed_experience_years = 0
    search_terms: list = []
    if resume is not None:
        parsed_skills = deserialize_list(resume.parsed_skills)
        parsed_job_titles = deserialize_list(resume.parsed_job_titles)
        parsed_experience_years = resume.parsed_experience_years or 0
        search_terms = deserialize_list(resume.match_keywords)
        if not search_terms:
            search_terms = parsed_skills[:5]

    scraped = await scrape_jobs(
        search_terms=search_terms[:5],
        location="United States",
        results_wanted=15,
        hours_old=24,
    )

    now = datetime.now(timezone.utc)

    if not scraped:
        agent.total_runs += 1
        agent.last_run_at = now
        run_log = RunLog(
            agent_id=agent.id,
            run_number=agent.total_runs,
            ran_at=now,
            jobs_found=0,
            duration_seconds=None,
            status="SUCCESS",
            sources_breakdown=serialize_dict({}),
        )
        db.add(run_log)
        await db.flush()
        return {
            "status": "ACTIVE",
            "jobs_found_this_run": 0,
            "scan_duration_seconds": None,
            "message": "Scan complete. No new listings found in the last 24 hours.",
        }

    # Gemini needs real tag lists for the scoring prompt, but each scraped
    # job's "tags" is a JSON-encoded string (the format the Job.tags column
    # and the rest of the app expect) — score a lightweight parallel list
    # with tags deserialized, then copy the resulting scores back onto the
    # original (string-tags) dicts used for the DB insert below.
    score_input = [
        {
            "title": job_data.get("title", ""),
            "tags": deserialize_list(job_data.get("tags")),
            "description_summary": job_data.get("description_summary") or "",
        }
        for job_data in scraped
    ]
    scored_meta = await score_jobs_batch(
        skills=parsed_skills,
        experience_years=parsed_experience_years,
        job_titles=parsed_job_titles,
        jobs=score_input,
    )
    for job_data, meta in zip(scraped, scored_meta):
        job_data["match_score"] = meta.get("match_score", 70)
        job_data["match_reason"] = meta.get("match_reason", "")

    source_counts: dict = {}
    for job_data in scraped:
        job_data["agent_id"] = agent.id
        db.add(Job(**job_data))
        src = job_data.get("source", "Unknown")
        source_counts[src] = source_counts.get(src, 0) + 1

    jobs_found = len(scraped)
    agent.total_runs += 1
    agent.total_jobs_found += jobs_found
    agent.last_run_at = now

    run_log = RunLog(
        agent_id=agent.id,
        run_number=agent.total_runs,
        ran_at=now,
        jobs_found=jobs_found,
        duration_seconds=None,
        status="SUCCESS",
        sources_breakdown=serialize_dict(source_counts),
    )
    db.add(run_log)

    await db.flush()

    return {
        "status": "ACTIVE",
        "jobs_found_this_run": jobs_found,
        "scan_duration_seconds": None,
        "message": f"Scan complete. {jobs_found} new jobs found.",
    }


@router.get("/status", response_model=AgentStatusResponse)
async def get_agent_status(
    session_id: Optional[str] = None,
    session_id_header: Optional[str] = Header(None, alias="session_id"),
    db: AsyncSession = Depends(get_db),
):
    resolved_session_id = session_id or session_id_header or DEFAULT_SESSION_ID

    empty_response = AgentStatusResponse(
        agent_id="",
        status="IDLE",
        last_run=None,
        next_run=None,
        total_jobs_found=0,
        total_runs=0,
        uptime_days=0,
        avg_jobs_per_run=0.0,
        run_history=[],
    )

    if not resolved_session_id:
        return empty_response

    result = await db.execute(select(User).where(User.session_id == resolved_session_id))
    user = result.scalar_one_or_none()
    if user is None:
        return empty_response

    agent = await _get_latest_agent(db, user.id)
    if agent is None:
        return empty_response

    logs_result = await db.execute(
        select(RunLog).where(RunLog.agent_id == agent.id).order_by(RunLog.run_number.desc())
    )
    logs = logs_result.scalars().all()

    now = datetime.now(timezone.utc)
    uptime_days = max(0, (now - ensure_utc(agent.created_at)).days)
    avg_jobs_per_run = round(agent.total_jobs_found / agent.total_runs, 2) if agent.total_runs > 0 else 0.0

    run_history = [
        {
            "run_number": log.run_number,
            "ran_at": format_iso(log.ran_at),
            "jobs_found": log.jobs_found,
            "duration_seconds": log.duration_seconds,
            "status": log.status,
            "sources": deserialize_dict(log.sources_breakdown),
        }
        for log in logs
    ]

    return AgentStatusResponse(
        agent_id=agent.id,
        status=agent.status,
        last_run=format_iso(agent.last_run_at),
        next_run=format_iso(agent.next_run_at),
        total_jobs_found=agent.total_jobs_found,
        total_runs=agent.total_runs,
        uptime_days=uptime_days,
        avg_jobs_per_run=avg_jobs_per_run,
        run_history=run_history,
    )
