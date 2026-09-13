"""Pydantic request/response schemas for the CareerBot AI API."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class ResumeUploadResponse(BaseModel):
    resume_id: str
    filename: str
    file_size_kb: int
    parsed: dict


class AgentStartRequest(BaseModel):
    # Optional because the frontend's "Restart Agent" action may call this
    # with resume_id: null when no resume is loaded in the client store for
    # the current session.
    resume_id: Optional[str] = None
    # The existing frontend posts { resume_id, prompt }. `user_prompt` is
    # kept as the canonical field name per spec; `prompt` is accepted as an
    # alias so the current client payload validates without modification.
    user_prompt: Optional[str] = None
    prompt: Optional[str] = None
    session_id: Optional[str] = None

    @property
    def effective_prompt(self) -> str:
        return self.user_prompt or self.prompt or ""


class AgentStartResponse(BaseModel):
    agent_id: str
    status: str
    next_run: Optional[str]
    created_at: str
    message: str


class AgentStatusResponse(BaseModel):
    agent_id: str
    status: str
    last_run: Optional[str]
    next_run: Optional[str]
    total_jobs_found: int
    total_runs: int
    uptime_days: int
    avg_jobs_per_run: float
    run_history: List[dict]


class JobResponse(BaseModel):
    id: str
    title: str
    company: str
    description_summary: Optional[str]
    salary_min: Optional[int]
    salary_max: Optional[int]
    work_mode: str
    location: Optional[str]
    apply_url: str
    match_score: int
    match_reason: Optional[str]
    source: str
    tags: List[str]
    posted_at: Optional[str]
    found_at: str

    class Config:
        from_attributes = True
