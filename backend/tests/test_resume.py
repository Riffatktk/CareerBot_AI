import pytest
import io

@pytest.mark.asyncio
async def test_upload_resume_invalid_type(client):
    """Reject non-PDF/DOCX files."""
    fake_file = io.BytesIO(b"not a real file")
    response = await client.post(
        "/api/resume/upload",
        files={"file": ("resume.txt", fake_file, "text/plain")},
    )
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_upload_resume_pdf_accepted(client, monkeypatch):
    """Accept a PDF file and return parsed resume data."""
    # Mock the extract and parse functions to avoid real AI calls in tests
    async def mock_extract(content, filename):
        return "John Doe\nSoftware Engineer\nPython, FastAPI, React"

    async def mock_parse(text):
        return {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": None,
            "location": "New York, NY",
            "experience_years": 3,
            "skills": ["Python", "FastAPI", "React"],
            "job_titles": ["Software Engineer"],
            "education": "BSc Computer Science",
            "summary": "Software engineer with 3 years experience.",
            "experience": [],
            "match_keywords": ["Python", "FastAPI"],
        }

    import routers.resume as resume_module
    monkeypatch.setattr(resume_module, "extract_text_from_file", mock_extract)
    monkeypatch.setattr(resume_module, "parse_resume_with_gemini", mock_parse)

    fake_pdf = io.BytesIO(b"%PDF-1.4 fake pdf content")
    response = await client.post(
        "/api/resume/upload",
        files={"file": ("resume.pdf", fake_pdf, "application/pdf")},
    )
    assert response.status_code == 200
    data = response.json()
    assert "resume_id" in data
    assert data["parsed"]["name"] == "John Doe"
    assert "Python" in data["parsed"]["skills"]
