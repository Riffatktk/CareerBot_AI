"""Resume upload/parsing endpoint, backed by the database.

File text is extracted with PyMuPDF/python-docx and parsed into structured
fields by Gemini (see services/resume_parser.py and services/ai_service.py).
"""

import os
from typing import Optional

from fastapi import APIRouter, Depends, File, Header, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.models import Resume, User
from schemas.schemas import ResumeUploadResponse
from services.ai_service import parse_resume_with_gemini
from services.resume_parser import extract_text_from_file
from utils import DEFAULT_SESSION_ID, serialize_list

router = APIRouter(prefix="/resume", tags=["resume"])

ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024


@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    session_id: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File is too large. Maximum size is 10 MB.")

    file_size_kb = max(1, round(len(content) / 1024))

    resolved_session_id = session_id or DEFAULT_SESSION_ID

    result = await db.execute(select(User).where(User.session_id == resolved_session_id))
    user = result.scalar_one_or_none()
    if user is None:
        user = User(session_id=resolved_session_id)
        db.add(user)
        await db.flush()

    try:
        raw_text = await extract_text_from_file(content, file.filename)
    except ValueError:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")
    except Exception:
        # Covers both a malformed/corrupted upload (PyMuPDF raises a plain
        # RuntimeError like "Failed to open stream" for these — a bad
        # request, not a server error) and any other extraction failure.
        raise HTTPException(status_code=400, detail="Could not read this file. It may be corrupted or password-protected.")

    parsed = await parse_resume_with_gemini(raw_text)

    parsed_name = parsed.get("name")
    parsed_email = parsed.get("email")
    parsed_phone = parsed.get("phone")
    parsed_location = parsed.get("location")
    parsed_experience_years = parsed.get("experience_years", 0)
    parsed_skills = parsed.get("skills", [])
    parsed_job_titles = parsed.get("job_titles", [])
    parsed_education = parsed.get("education")
    parsed_summary = parsed.get("summary")
    parsed_experience = parsed.get("experience", [])
    match_keywords = parsed.get("match_keywords", [])

    resume = Resume(
        user_id=user.id,
        filename=file.filename,
        file_size_kb=file_size_kb,
        raw_text=raw_text,
        parsed_name=parsed_name,
        parsed_email=parsed_email,
        parsed_phone=parsed_phone,
        parsed_location=parsed_location,
        parsed_experience_years=parsed_experience_years,
        parsed_skills=serialize_list(parsed_skills),
        parsed_job_titles=serialize_list(parsed_job_titles),
        parsed_education=parsed_education,
        parsed_summary=parsed_summary,
        parsed_experience=serialize_list(parsed_experience),
        match_keywords=serialize_list(match_keywords),
    )
    db.add(resume)
    await db.flush()

    return ResumeUploadResponse(
        resume_id=resume.id,
        filename=resume.filename,
        file_size_kb=resume.file_size_kb,
        parsed={
            "name": parsed_name,
            "email": parsed_email,
            "phone": parsed_phone,
            "location": parsed_location,
            "experience_years": parsed_experience_years,
            "skills": parsed_skills,
            "job_titles": parsed_job_titles,
            "education": parsed_education,
            "summary": parsed_summary,
            "experience": parsed_experience,
            "match_keywords": match_keywords,
        },
    )
