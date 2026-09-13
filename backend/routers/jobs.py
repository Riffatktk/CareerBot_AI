"""Job listing endpoints, backed by the database.

Jobs are the rows seeded by the most recent agent for the current session
(see seed.py / POST /api/agent/start). Filtering and sorting are exposed as
optional query params for future server-side use, but the existing frontend
filters/sorts client-side and simply fetches the full list — so this
endpoint returns a plain JSON array (not a paginated envelope) to match
what it already expects.
"""

from typing import Optional

from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.models import AgentState, Job, User
from schemas.schemas import JobResponse
from utils import DEFAULT_SESSION_ID, deserialize_list, format_iso

router = APIRouter(prefix="/jobs", tags=["jobs"])


def _to_job_response(job: Job) -> JobResponse:
    return JobResponse(
        id=job.id,
        title=job.title,
        company=job.company,
        description_summary=job.description_summary,
        salary_min=job.salary_min,
        salary_max=job.salary_max,
        work_mode=job.work_mode,
        location=job.location,
        apply_url=job.apply_url,
        match_score=job.match_score,
        match_reason=job.match_reason,
        source=job.source,
        tags=deserialize_list(job.tags),
        posted_at=format_iso(job.posted_at),
        found_at=format_iso(job.found_at),
    )


@router.get("", response_model=list[JobResponse])
async def list_jobs(
    session_id: Optional[str] = None,
    session_id_header: Optional[str] = Header(None, alias="session_id"),
    work_mode: Optional[str] = None,
    sort: str = "match_score",
    db: AsyncSession = Depends(get_db),
):
    resolved_session_id = session_id or session_id_header or DEFAULT_SESSION_ID

    user_result = await db.execute(select(User).where(User.session_id == resolved_session_id))
    user = user_result.scalar_one_or_none()
    if user is None:
        return []

    agent_result = await db.execute(
        select(AgentState)
        .where(AgentState.user_id == user.id)
        .order_by(AgentState.created_at.desc())
    )
    agent = agent_result.scalars().first()
    if agent is None:
        return []

    query = select(Job).where(Job.agent_id == agent.id)

    if work_mode and work_mode.lower() != "all":
        query = query.where(Job.work_mode == work_mode)

    if sort == "newest":
        query = query.order_by(Job.posted_at.desc())
    elif sort == "salary":
        query = query.order_by(Job.salary_max.desc().nulls_last())
    else:
        query = query.order_by(Job.match_score.desc())

    result = await db.execute(query)
    jobs = result.scalars().all()

    return [_to_job_response(job) for job in jobs]


@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return _to_job_response(job)
