"""Live job scraping via JobSpy (LinkedIn / Indeed / Glassdoor)."""

import asyncio
import uuid
import json
from datetime import datetime, timezone
from typing import Optional


async def scrape_jobs(
    search_terms: list[str],
    location: str = "United States",
    results_wanted: int = 15,
    hours_old: int = 24,
) -> list[dict]:
    """
    Scrape jobs from LinkedIn, Indeed, and Glassdoor using JobSpy.
    Returns a list of job dicts ready for database insertion.
    Falls back to empty list on scraping failure.
    """
    try:
        from jobspy import scrape_jobs as jobspy_scrape
        import pandas as pd

        query = " OR ".join(search_terms[:3])  # Use top 3 keywords

        def _scrape():
            jobs_df = jobspy_scrape(
                site_name=["linkedin", "indeed", "glassdoor"],
                search_term=query,
                location=location,
                results_wanted=results_wanted,
                hours_old=hours_old,
                country_indeed="USA",
            )
            return jobs_df

        df = await asyncio.to_thread(_scrape)

        if df is None or df.empty:
            return []

        jobs = []
        for _, row in df.iterrows():
            # Safely extract salary values
            salary_min = None
            salary_max = None
            if pd.notna(row.get("min_amount")):
                salary_min = int(row["min_amount"])
            if pd.notna(row.get("max_amount")):
                salary_max = int(row["max_amount"])

            # Determine work mode
            work_mode = "Onsite"
            job_type = str(row.get("job_type", "")).lower()
            is_remote = str(row.get("is_remote", "")).lower()
            if is_remote == "true" or "remote" in job_type:
                work_mode = "Remote"
            elif "hybrid" in job_type:
                work_mode = "Hybrid"

            # Extract location
            location_str = None
            if work_mode != "Remote":
                city = str(row.get("city", "")) if pd.notna(row.get("city")) else ""
                state = str(row.get("state", "")) if pd.notna(row.get("state")) else ""
                location_str = f"{city}, {state}".strip(", ") or None

            # Extract source
            site = str(row.get("site", "linkedin")).lower()
            source_map = {
                "linkedin": "LinkedIn",
                "indeed": "Indeed",
                "glassdoor": "Glassdoor",
            }
            source = source_map.get(site, "LinkedIn")

            # Extract description
            desc = str(row.get("description", "")) if pd.notna(row.get("description")) else ""
            description_summary = desc[:400] if desc else None

            # Extract tags from job description keywords
            title_words = str(row.get("title", "")).split()
            tags = [w for w in title_words if len(w) > 3][:6]

            # Extract apply URL
            apply_url = str(row.get("job_url", "")) if pd.notna(row.get("job_url")) else ""
            if not apply_url:
                continue  # Skip jobs without apply URL

            # Parse posted date
            posted_at = None
            date_posted = row.get("date_posted")
            if pd.notna(date_posted):
                try:
                    if isinstance(date_posted, str):
                        posted_at = datetime.fromisoformat(date_posted).replace(
                            tzinfo=timezone.utc
                        )
                    else:
                        posted_at = date_posted
                except Exception:
                    posted_at = None

            job = {
                "id": str(uuid.uuid4()),
                "title": str(row.get("title", "Software Engineer")),
                "company": str(row.get("company", "Unknown Company")),
                "description_summary": description_summary,
                "salary_min": salary_min,
                "salary_max": salary_max,
                "work_mode": work_mode,
                "location": location_str,
                "apply_url": apply_url,
                "match_score": 70,  # Default — will be updated by Gemini scoring
                "match_reason": "Score pending AI analysis.",
                "source": source,
                "tags": json.dumps(tags),
                "posted_at": posted_at,
            }
            jobs.append(job)

        return jobs[:results_wanted]

    except Exception as e:
        print(f"[JobScraper] Scraping failed: {e}. Falling back to seed data.")
        return []
