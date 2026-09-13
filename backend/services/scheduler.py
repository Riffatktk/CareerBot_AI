"""APScheduler daily 09:00 UTC job-scan trigger for all active agents."""

import asyncio
import logging
from datetime import datetime, timezone
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

if not logging.getLogger().handlers:
    # Nothing else in this app configures logging, so without a basic
    # handler here these INFO-level scheduler logs would be silently
    # dropped by Python's default "last resort" handler (WARNING+ only).
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

logger = logging.getLogger(__name__)
scheduler = AsyncIOScheduler(timezone="UTC")


async def run_daily_scan_for_all_active_agents():
    """
    Called every day at 09:00 AM UTC.
    Finds all ACTIVE agents in the database and triggers a job scan for each.
    """
    try:
        from database import AsyncSessionLocal
        from models.models import AgentState, Resume, Job, RunLog
        from services.job_scraper import scrape_jobs
        from services.ai_service import score_jobs_batch
        from utils import deserialize_list, serialize_dict, get_next_run_time
        from sqlalchemy import select
        import uuid
        import json

        async with AsyncSessionLocal() as db:
            # Fetch all ACTIVE agents
            result = await db.execute(
                select(AgentState).where(AgentState.status == "ACTIVE")
            )
            agents = result.scalars().all()

            logger.info(f"[Scheduler] Daily scan triggered. {len(agents)} active agents found.")

            for agent in agents:
                try:
                    # Fetch resume for this agent
                    resume_result = await db.execute(
                        select(Resume).where(Resume.id == agent.resume_id)
                    )
                    resume = resume_result.scalar_one_or_none()
                    if not resume:
                        continue

                    skills = deserialize_list(resume.match_keywords)
                    if not skills:
                        skills = deserialize_list(resume.parsed_skills)[:5]

                    # Scrape jobs
                    scraped = await scrape_jobs(
                        search_terms=skills[:5],
                        results_wanted=15,
                        hours_old=24,
                    )

                    jobs_found = 0
                    if scraped:
                        # Score with Gemini — pass a parallel list with tags
                        # deserialized (each scraped job's "tags" is a
                        # JSON-encoded string, the format the Job.tags column
                        # expects, not the list score_jobs_batch needs).
                        score_input = [
                            {
                                "title": job_data.get("title", ""),
                                "tags": deserialize_list(job_data.get("tags")),
                                "description_summary": job_data.get("description_summary") or "",
                            }
                            for job_data in scraped
                        ]
                        scored_meta = await score_jobs_batch(
                            skills=deserialize_list(resume.parsed_skills),
                            experience_years=resume.parsed_experience_years or 0,
                            job_titles=deserialize_list(resume.parsed_job_titles),
                            jobs=score_input,
                        )
                        for job_data, meta in zip(scraped, scored_meta):
                            job_data["match_score"] = meta.get("match_score", 70)
                            job_data["match_reason"] = meta.get("match_reason", "")
                        scored = scraped

                        # Insert jobs into database
                        source_counts = {}
                        for job_data in scored:
                            job_data["agent_id"] = agent.id
                            job = Job(**{k: v for k, v in job_data.items()
                                       if k != "tags"},
                                     tags=job_data.get("tags", "[]"))
                            db.add(job)
                            src = job_data.get("source", "Unknown")
                            source_counts[src] = source_counts.get(src, 0) + 1

                        jobs_found = len(scored)

                        # Create run log
                        run_log = RunLog(
                            id=str(uuid.uuid4()),
                            agent_id=agent.id,
                            run_number=agent.total_runs + 1,
                            jobs_found=jobs_found,
                            duration_seconds=None,
                            status="SUCCESS",
                            sources_breakdown=serialize_dict(source_counts),
                        )
                        db.add(run_log)

                    # Update agent state
                    agent.total_runs += 1
                    agent.total_jobs_found += jobs_found
                    agent.last_run_at = datetime.now(timezone.utc)
                    agent.next_run_at = get_next_run_time()

                    await db.commit()
                    logger.info(f"[Scheduler] Agent {agent.id}: {jobs_found} jobs found.")

                except Exception as agent_error:
                    logger.error(f"[Scheduler] Error processing agent {agent.id}: {agent_error}")
                    await db.rollback()

    except Exception as e:
        logger.error(f"[Scheduler] Daily scan failed: {e}")


def start_scheduler():
    """Start the APScheduler with the daily 9 AM UTC cron job."""
    scheduler.add_job(
        run_daily_scan_for_all_active_agents,
        trigger=CronTrigger(hour=9, minute=0, timezone="UTC"),
        id="daily_job_scan",
        name="Daily Job Scan — 09:00 AM UTC",
        replace_existing=True,
        misfire_grace_time=3600,  # Allow up to 1 hour late if server was down
    )
    scheduler.start()
    logger.info("[Scheduler] APScheduler started. Daily scan scheduled at 09:00 AM UTC.")


def stop_scheduler():
    """Stop the scheduler gracefully."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("[Scheduler] APScheduler stopped.")
