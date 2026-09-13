import pytest

@pytest.mark.asyncio
async def test_agent_status_no_session(client):
    """Return default IDLE status when no agent exists."""
    response = await client.get("/api/agent/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "IDLE"
    assert data["total_jobs_found"] == 0

@pytest.mark.asyncio
async def test_agent_start_missing_resume(client):
    """Return 404 when resume_id does not exist."""
    response = await client.post(
        "/api/agent/start",
        json={
            "resume_id": "nonexistent_id",
            "user_prompt": "Find Python developer jobs",
        },
    )
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_agent_stop_no_active_agent(client):
    """Return 404 when no active agent to stop."""
    response = await client.post("/api/agent/stop")
    assert response.status_code == 404
