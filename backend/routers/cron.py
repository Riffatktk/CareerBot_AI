from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from config import settings
from database import get_db
from models.agent_state import AgentState, AgentStatus
from services.scheduler import _execute_scan

router = APIRouter(prefix="/api/cron", tags=["cron"])


@router.get("/daily-scan")
def daily_scan(
    authorization: str | None = Header(None),
    db: Session = Depends(get_db),
):
    if settings.cron_secret:
        expected = f"Bearer {settings.cron_secret}"
        if authorization != expected:
            raise HTTPException(status_code=401, detail="Invalid or missing cron secret.")

    active_agent_ids = [
        agent_id for (agent_id,) in db.query(AgentState.id).filter(AgentState.status == AgentStatus.ACTIVE)
    ]

    for agent_id in active_agent_ids:
        _execute_scan(agent_id)

    return {"scanned_agents": len(active_agent_ids)}