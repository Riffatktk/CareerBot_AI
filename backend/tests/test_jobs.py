import pytest

@pytest.mark.asyncio
async def test_get_jobs_empty(client):
    """Return an empty list when no jobs exist.

    NOTE: GET /api/jobs returns a plain JSON array, not a {jobs, total}
    envelope — this deliberately matches frontend/src/api/client.js's
    getJobs(), which returns response.data directly and treats it as an
    array (see README "Development Shortcuts" / earlier deviation notes).
    Asserting the envelope shape here would fail against the real endpoint.
    """
    response = await client.get("/api/jobs")
    assert response.status_code == 200
    data = response.json()
    assert data == []

@pytest.mark.asyncio
async def test_get_job_not_found(client):
    """Return 404 for non-existent job ID."""
    response = await client.get("/api/jobs/nonexistent_id")
    assert response.status_code == 404
