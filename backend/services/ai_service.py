"""Gemini-backed resume parsing and job match scoring."""

import os
import json
import asyncio
from typing import Optional
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))

# "gemini-1.5-flash" (the model named in the original spec) has been
# retired and is no longer served by the Gemini API. gemini-2.5-flash is
# also retired for new users as of this key's project — the API's own
# 404 error names gemini-3.6-flash as the current replacement, confirmed
# working against this key.
model = genai.GenerativeModel("gemini-3.6-flash")

RESUME_PARSE_PROMPT = """
You are a resume parser. Extract structured data from the resume text below.
Respond with ONLY a valid JSON object — no markdown, no backticks, no explanation.

Extract these fields:
{
  "name": "full name of the candidate",
  "email": "email address or null",
  "phone": "phone number or null",
  "location": "city and country or null",
  "experience_years": integer total years of experience or 0,
  "skills": ["list", "of", "technical", "skills"],
  "job_titles": ["list", "of", "past", "job", "titles"],
  "education": "highest degree and university as a single string or null",
  "summary": "2 sentence professional summary",
  "experience": [
    {
      "company": "company name",
      "title": "job title",
      "duration": "start year – end year or Present",
      "description": "one sentence about responsibilities"
    }
  ],
  "match_keywords": ["top", "10", "skills", "for", "job", "matching"]
}

Resume text:
{resume_text}
"""

JOB_SCORE_PROMPT = """
You are a job matching engine. Score how well this candidate matches this job.
Respond with ONLY a valid JSON object — no markdown, no backticks, no explanation.

Candidate skills: {skills}
Candidate experience years: {experience_years}
Candidate job titles: {job_titles}

Job title: {job_title}
Job tags/requirements: {job_tags}
Job description: {job_description}

Return:
{
  "match_score": integer between 0 and 100,
  "match_reason": "one sentence explaining why this is or is not a strong match"
}
"""


async def parse_resume_with_gemini(resume_text: str) -> dict:
    """Send resume text to Gemini and return structured parsed data."""
    try:
        prompt = RESUME_PARSE_PROMPT.replace("{resume_text}", resume_text[:8000])
        response = await asyncio.to_thread(
            model.generate_content, prompt
        )
        raw = response.text.strip()
        # Strip markdown fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        parsed = json.loads(raw.strip())
        return parsed
    except Exception as e:
        # Return safe fallback if Gemini fails
        return {
            "name": "Unknown",
            "email": None,
            "phone": None,
            "location": None,
            "experience_years": 0,
            "skills": [],
            "job_titles": [],
            "education": None,
            "summary": "Could not parse resume automatically.",
            "experience": [],
            "match_keywords": [],
            "error": str(e),
        }


async def score_job_with_gemini(
    skills: list,
    experience_years: int,
    job_titles: list,
    job_title: str,
    job_tags: list,
    job_description: str,
) -> dict:
    """Score a job against a candidate profile using Gemini."""
    try:
        prompt = (
            JOB_SCORE_PROMPT
            .replace("{skills}", ", ".join(skills))
            .replace("{experience_years}", str(experience_years))
            .replace("{job_titles}", ", ".join(job_titles))
            .replace("{job_title}", job_title)
            .replace("{job_tags}", ", ".join(job_tags))
            .replace("{job_description}", job_description[:500])
        )
        response = await asyncio.to_thread(
            model.generate_content, prompt
        )
        raw = response.text.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        result = json.loads(raw.strip())
        return result
    except Exception:
        # Fallback: static score if Gemini fails
        return {
            "match_score": 70,
            "match_reason": "Score estimated — AI scoring temporarily unavailable.",
        }


async def score_jobs_batch(
    skills: list,
    experience_years: int,
    job_titles: list,
    jobs: list,
) -> list:
    """
    Score a list of jobs against a candidate profile.
    Batches calls to stay within Gemini rate limits.
    Adds a 1 second delay between each call.
    Returns the jobs list with match_score and match_reason updated.
    """
    scored = []
    for job in jobs:
        result = await score_job_with_gemini(
            skills=skills,
            experience_years=experience_years,
            job_titles=job_titles,
            job_title=job.get("title", ""),
            job_tags=job.get("tags", []),
            job_description=job.get("description_summary", ""),
        )
        job["match_score"] = result.get("match_score", 70)
        job["match_reason"] = result.get("match_reason", "")
        scored.append(job)
        await asyncio.sleep(1.0)  # Respect 15 req/min free tier limit
    return scored
