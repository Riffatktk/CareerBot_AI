"""Small helper utilities shared across routers."""

import json
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional


def serialize_list(data: list) -> str:
    """Convert Python list to JSON string for database storage."""
    return json.dumps(data) if data else "[]"


def deserialize_list(data: Optional[str]) -> list:
    """Convert JSON string from database back to Python list."""
    if not data:
        return []
    try:
        return json.loads(data)
    except (json.JSONDecodeError, TypeError):
        return []


def serialize_dict(data: dict) -> str:
    """Convert Python dict to JSON string for database storage."""
    return json.dumps(data) if data else "{}"


def deserialize_dict(data: Optional[str]) -> dict:
    """Convert JSON string from database back to Python dict."""
    if not data:
        return {}
    try:
        return json.loads(data)
    except (json.JSONDecodeError, TypeError):
        return {}


def get_next_run_time() -> datetime:
    """Get tomorrow at 09:00 AM UTC."""
    now = datetime.now(timezone.utc)
    tomorrow = now + timedelta(days=1)
    return tomorrow.replace(hour=9, minute=0, second=0, microsecond=0)


def ensure_utc(dt: Optional[datetime]) -> Optional[datetime]:
    """Attach UTC tzinfo to a naive datetime.

    SQLite (via aiosqlite) drops tzinfo on round-trip, so any datetime read
    back from the database is naive even though every datetime this app
    writes is `datetime.now(timezone.utc)`. Treat naive datetimes as UTC
    rather than assuming local time.
    """
    if dt is None:
        return None
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def format_iso(dt: Optional[datetime]) -> Optional[str]:
    """Format datetime to ISO string, normalizing naive (DB-read) datetimes to UTC."""
    if not dt:
        return None
    return ensure_utc(dt).isoformat()


def get_or_create_session_id(session_id: Optional[str]) -> str:
    """Return existing session_id or generate a new one."""
    return session_id if session_id else str(uuid.uuid4())


# The current frontend does not send any session identifier (no header,
# cookie, or query param). Until it does, every request that omits one
# resolves to this single stable session so that a resume upload, agent
# start/stop/run-now, and job listing all correlate to the same user —
# functionally a single-user local deployment.
DEFAULT_SESSION_ID = "local-default-session"
