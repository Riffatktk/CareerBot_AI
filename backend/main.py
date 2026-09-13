"""CareerBot AI backend entrypoint.

Every response is backed by a real SQLite (dev) / PostgreSQL (prod)
database via SQLAlchemy, created on startup and persisted across requests
and restarts. Resume parsing runs through Gemini, and job discovery
happens via JobSpy scraping plus Gemini match scoring — triggered either
on demand ("Run Now") or automatically once a day at 09:00 UTC by the
APScheduler job registered below.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db

# Importing the models module registers every table on Base.metadata
# before init_db() calls Base.metadata.create_all().
import models.models  # noqa: F401

from routers import agent, jobs, resume
from services.scheduler import start_scheduler, stop_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(
    title="CareerBot AI API",
    description="Autonomous AI-powered job finding assistant",
    version="0.2.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/api")
app.include_router(agent.router, prefix="/api")
app.include_router(jobs.router, prefix="/api")


@app.get("/")
async def health_check():
    return {"status": "ok", "service": "CareerBot AI"}
