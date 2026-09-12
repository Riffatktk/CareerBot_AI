<div align="center">

# CareerBot AI

**Autonomous AI-Powered Job Finding Assistant**

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Free_Tier-4285F4?style=flat-square&logo=google&logoColor=white)](https://aistudio.google.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)

[Features](#features) · [Architecture](#architecture) · [Tech Stack](#tech-stack) · [Getting Started](#getting-started) · [API Reference](#api-reference) · [Team](#team)

</div>

---

## Overview

CareerBot AI is an autonomous job-hunting assistant that removes the daily grind of manually browsing job boards. The user uploads their resume once, issues a single prompt, and the agent runs on a continuous schedule — waking at **9:00 AM every day** to retrieve jobs posted in the past 24 hours that match the candidate's profile.

Google Gemini AI parses the uploaded resume and scores each job listing for relevance. LinkedIn, Indeed, and Glassdoor are scraped simultaneously through a single open-source library. Results are delivered to a web dashboard as structured, ranked job cards with direct application links.

> Built for the Panaversity Agentic AI Course Hackathon — September 2026

---

## Features

- **Resume Parsing** — Accepts PDF and DOCX files. Gemini AI automatically extracts skills, years of experience, job titles, and education.
- **Loop Engineering** — A single prompt activates the agent. It then operates in a fully autonomous daily cycle until the user manually stops it.
- **Daily Scheduled Scan** — APScheduler triggers a job search every morning at 9:00 AM, covering only listings posted in the preceding 24 hours.
- **AI Match Scoring** — Every job is scored against the parsed resume profile with a percentage relevance score and a plain-English explanation.
- **Multi-Platform Coverage** — JobSpy scrapes LinkedIn, Indeed, and Glassdoor in a single function call with no platform API keys required.
- **Structured Job Cards** — Each result includes job title, company, AI-summarised description, salary range, work mode (remote / onsite / hybrid), location, posting date, match score, and a direct application link.
- **Immediate Trigger** — A "Run Now" action allows instant agent execution for testing and demonstration without waiting for the scheduled time.
- **Zero-Cost AI** — Powered by the Google Gemini 1.5 Flash free tier (1,500 requests per day) with Groq API as a configured fallback.

---

## Architecture

```
+---------------------------------------------------------------+
|                   USER BROWSER  (React.js)                    |
|  Resume Upload  |  Job Dashboard  |  Agent Controls  |  History  |
+-----------------------------+---------------------------------+
                              |  REST API (HTTP)
+-----------------------------v---------------------------------+
|                  BACKEND  (FastAPI + Python)                  |
|   Resume Parser  |  AI Agent  |  Job Scraper  |  Scheduler   |
+------+-------------------+------------------+----------+-----+
       |                   |                  |          |
  PyMuPDF /          Gemini API         LinkedIn /    SQLite /
  python-docx        (Free AI)          Indeed /      PostgreSQL
                                        Glassdoor
```

### Agent Loop

```
[USER STARTS AGENT]
        |
        v
Scheduler registers a daily cron job at 9:00 AM
        |
        v
+------------------------------------------+
|  9:00 AM  --  Wake up                   |
|  --> Scrape LinkedIn / Indeed (24 h)    |
|  --> AI scores and ranks each listing   |
|  --> Persist results to database        |
|  --> Update job dashboard               |
|  --> Sleep until next 9:00 AM          | <---- LOOP
+------------------------------------------+
        |
[USER MANUALLY STOPS]  -->  Agent enters IDLE state
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend Framework | React.js 18 + Vite | Single-page application |
| Styling | Tailwind CSS + shadcn/ui | UI components and layout |
| State Management | Zustand + React Query | Global state and API polling |
| HTTP Client | Axios | REST calls from frontend to backend |
| Backend Framework | FastAPI + Uvicorn | REST API server with async support |
| Task Scheduler | APScheduler 3 | Daily 9:00 AM cron job |
| AI Provider | Google Gemini 1.5 Flash | Resume parsing and job relevance scoring |
| AI Fallback | Groq API (Llama 3, free) | Backup if Gemini rate limits are reached |
| Job Data | JobSpy (Python) | LinkedIn + Indeed + Glassdoor scraper |
| Resume Parsing | PyMuPDF + python-docx | Text extraction from PDF and DOCX files |
| Data Validation | Pydantic v2 | Request and response schema validation |
| Database (Dev) | SQLite | Zero-configuration local database |
| Database (Prod) | PostgreSQL | Production-grade relational database |
| ORM | SQLAlchemy 2 + Alembic | Database models and migrations |
| Containerisation | Docker + Docker Compose | Consistent local and production environment |
| Frontend Deploy | Vercel (free tier) | Static site hosting |
| Backend Deploy | Railway (free tier) | Cloud hosting for FastAPI and scheduler |

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- Python 3.11 or later
- Git
- A Google Gemini API key — available free at [aistudio.google.com](https://aistudio.google.com) (no credit card required)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/careerbot-ai.git
cd careerbot-ai
```

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Open .env and set GEMINI_API_KEY and any other required values

# Apply database migrations
alembic upgrade head

# Start the development server
uvicorn main:app --reload
# Server runs at  http://localhost:8000
# Auto-generated API docs at  http://localhost:8000/docs
```

### 3. Frontend Setup

```bash
# Open a new terminal from the project root
cd frontend

npm install
npm run dev
# Application runs at  http://localhost:5173
```

### 4. Docker Compose (Optional)

To run the frontend, backend, and database together in isolated containers:

```bash
docker-compose up --build
```

---

## Environment Variables

Copy `/backend/.env.example` to `/backend/.env` and populate the following:

```env
# AI
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here        # Optional fallback

# Database
DATABASE_URL=sqlite:///./careerbot.db      # SQLite for development
# DATABASE_URL=postgresql://user:pass@host/db  # PostgreSQL for production

# Agent Schedule
AGENT_RUN_HOUR=9                           # 24-hour format
AGENT_RUN_MINUTE=0

# Server
CORS_ORIGINS=http://localhost:5173
SECRET_KEY=your_secret_key_here
```

---

## Project Structure

```
careerbot-ai/
|
+-- frontend/                       React.js application
|   +-- src/
|   |   +-- components/
|   |   |   +-- JobCard.jsx         Individual job listing card
|   |   |   +-- AgentPanel.jsx      Agent start / stop controls
|   |   |   +-- ResumeUpload.jsx    Drag-and-drop upload component
|   |   +-- pages/
|   |   |   +-- Dashboard.jsx       Main job feed with filters
|   |   |   +-- Upload.jsx          Resume upload and parsing page
|   |   |   +-- History.jsx         Past agent run history
|   |   +-- store/                  Zustand state management
|   |   +-- api/                    Axios API client and hooks
|   +-- package.json
|
+-- backend/                        FastAPI application
|   +-- main.py                     Application entry point and CORS config
|   +-- routers/
|   |   +-- resume.py               /api/resume endpoints
|   |   +-- agent.py                /api/agent endpoints
|   |   +-- jobs.py                 /api/jobs endpoints
|   +-- services/
|   |   +-- resume_parser.py        PyMuPDF and python-docx extraction
|   |   +-- ai_service.py           Gemini API integration and prompts
|   |   +-- job_scraper.py          JobSpy integration and filtering
|   |   +-- scheduler.py            APScheduler configuration
|   +-- models/                     SQLAlchemy ORM models
|   +-- schemas/                    Pydantic request and response schemas
|   +-- alembic/                    Database migration scripts
|   +-- requirements.txt
|   +-- .env.example
|
+-- docker-compose.yml
+-- README.md
```

---

## API Reference

Full interactive documentation is available at `http://localhost:8000/docs` once the backend is running.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/resume/upload` | Upload and parse a resume file (PDF or DOCX) |
| `POST` | `/api/agent/start` | Start the autonomous agent loop |
| `POST` | `/api/agent/stop` | Stop the agent and cancel the scheduler |
| `POST` | `/api/agent/run-now` | Trigger an immediate job scan |
| `GET` | `/api/agent/status` | Retrieve agent state, last run time, and next scheduled run |
| `GET` | `/api/jobs` | List all found jobs with pagination and sorting |
| `GET` | `/api/jobs/{id}` | Retrieve full details for a single job listing |

### Start Agent — Request

```bash
curl -X POST http://localhost:8000/api/agent/start \
  -H "Content-Type: application/json" \
  -d '{
    "resume_id": "abc123",
    "user_prompt": "Find senior Python developer roles, preferably remote"
  }'
```

### Start Agent — Response

```json
{
  "agent_id": "agt_xyz789",
  "status": "ACTIVE",
  "next_run": "2026-09-13T09:00:00Z",
  "message": "Agent started. First scan scheduled for 09:00 AM tomorrow."
}
```

### Job Object

```json
{
  "id": "job_001",
  "title": "Senior Python Developer",
  "company": "Acme Corp",
  "description_summary": "Backend role focused on FastAPI microservices and cloud infrastructure.",
  "salary_min": 120000,
  "salary_max": 160000,
  "work_mode": "Remote",
  "location": null,
  "apply_url": "https://linkedin.com/jobs/view/12345",
  "match_score": 92,
  "match_reason": "Strong alignment on Python, FastAPI, and 5+ years of backend experience.",
  "posted_at": "2026-09-12T14:30:00Z",
  "source": "LinkedIn"
}
```

---

## Database Schema

```
users
  id, email, created_at

resumes
  id, user_id, file_path, parsed_skills[], parsed_titles[],
  experience_years, raw_text, created_at

agent_state
  id, user_id, status, next_run_at, last_run_at, total_runs

jobs
  id, agent_id, title, company, description_summary,
  salary_min, salary_max, work_mode, location, apply_url,
  match_score, match_reason, posted_at, found_at, source
```

---

## Notes

### API Rate Limits

The Google Gemini 1.5 Flash free tier allows 1,500 requests per day and 15 requests per minute. To stay within these limits, the job scoring service batches multiple job descriptions into a single API call rather than making one call per listing. The Groq API (Llama 3, also free) is configured as an automatic fallback if the Gemini quota is exhausted.

### Job Scraping

CareerBot AI uses [JobSpy](https://github.com/Bunsly/JobSpy), an open-source Python library that scrapes LinkedIn, Indeed, and Glassdoor without requiring platform API keys. Random delays of 2–5 seconds are applied between requests to reduce the risk of IP blocking. A set of cached mock job listings is included in `/backend/tests/mock_data/` as a fallback for live demonstrations if scraping is temporarily unavailable.

### Development Shortcuts

For the hackathon MVP, user authentication is handled via a session ID stored in the browser rather than a full auth system. SQLite is used locally so no database server setup is required. The "Run Now" endpoint (`POST /api/agent/run-now`) allows immediate agent execution during demonstrations without waiting for the scheduled 9:00 AM trigger.

---

## Roadmap

- [x] Resume upload and AI-driven parsing
- [x] Autonomous daily scheduler (Loop Engineering)
- [x] Multi-platform job scraping (LinkedIn, Indeed, Glassdoor)
- [x] AI match scoring and explanation
- [x] Filterable job dashboard
- [ ] Email and push notifications when new listings are found
- [ ] Per-job resume tailoring suggestions
- [ ] User authentication and multi-user support
- [ ] One-click application tracking

---

## Team

| Name | Role | Responsibilities |
|---|---|---|
| TBD | Frontend Developer | React UI, job cards, agent control panel, responsive design |
| TBD | Backend Developer | FastAPI endpoints, SQLAlchemy models, file handling, CORS |
| TBD | AI / Scraping Developer | Gemini prompts, JobSpy integration, APScheduler configuration |
| TBD | DevOps / Tech Lead | Docker, deployment, GitHub setup, code review, integration testing |

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built for the Panaversity Agentic AI Course Hackathon · September 2026

</div>
