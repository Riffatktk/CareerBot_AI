"""SQLAlchemy ORM models for CareerBot AI.

Five tables: users (session identity), resumes (uploaded + parsed resume
data), agent_state (one row per agent run-loop), run_logs (history of each
scan), and jobs (listings discovered by a given agent).
"""

import uuid
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id: Mapped[str] = mapped_column(String(36), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    resumes: Mapped[List["Resume"]] = relationship(
        "Resume", back_populates="user", cascade="all, delete-orphan"
    )
    agent_states: Mapped[List["AgentState"]] = relationship(
        "AgentState", back_populates="user", cascade="all, delete-orphan"
    )


class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_size_kb: Mapped[int] = mapped_column(Integer, nullable=False)
    raw_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    parsed_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    parsed_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    parsed_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    parsed_location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    parsed_experience_years: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    parsed_skills: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    parsed_job_titles: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    parsed_education: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    parsed_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    parsed_experience: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    match_keywords: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user: Mapped["User"] = relationship("User", back_populates="resumes")


class AgentState(Base):
    __tablename__ = "agent_state"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    resume_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("resumes.id"), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="IDLE")
    user_prompt: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    total_jobs_found: Mapped[int] = mapped_column(Integer, default=0)
    total_runs: Mapped[int] = mapped_column(Integer, default=0)
    last_run_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    next_run_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user: Mapped["User"] = relationship("User", back_populates="agent_states")
    run_logs: Mapped[List["RunLog"]] = relationship(
        "RunLog", back_populates="agent", cascade="all, delete-orphan"
    )
    jobs: Mapped[List["Job"]] = relationship(
        "Job", back_populates="agent", cascade="all, delete-orphan"
    )


class RunLog(Base):
    __tablename__ = "run_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    agent_id: Mapped[str] = mapped_column(String(36), ForeignKey("agent_state.id"), nullable=False)
    run_number: Mapped[int] = mapped_column(Integer, nullable=False)
    ran_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    jobs_found: Mapped[int] = mapped_column(Integer, default=0)
    duration_seconds: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="SUCCESS")
    sources_breakdown: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    agent: Mapped["AgentState"] = relationship("AgentState", back_populates="run_logs")


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    agent_id: Mapped[str] = mapped_column(String(36), ForeignKey("agent_state.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    company: Mapped[str] = mapped_column(String(255), nullable=False)
    description_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    salary_min: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    salary_max: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    work_mode: Mapped[str] = mapped_column(String(20), nullable=False)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    apply_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    match_score: Mapped[int] = mapped_column(Integer, nullable=False)
    match_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    source: Mapped[str] = mapped_column(String(50), nullable=False)
    tags: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    posted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    found_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    agent: Mapped["AgentState"] = relationship("AgentState", back_populates="jobs")
