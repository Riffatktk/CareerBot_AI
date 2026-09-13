# CareerBot AI

![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38BDF8?logo=tailwindcss&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini-1.5_Flash-4285F4?logo=googlegemini&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

CareerBot AI is a single-prompt, autonomous job-finding agent. A candidate
uploads a resume (or picks a one-click demo profile), describes the roles
they want, and starts the agent. From that point on, the agent runs on a
daily 9:00 AM UTC schedule, scraping LinkedIn, Indeed, and Glassdoor via
JobSpy, scoring every listing against the candidate's Gemini-parsed
skills, and surfacing a ranked, filterable feed on a live dashboard. The
project is a React single-page frontend talking to a FastAPI backend
entirely over HTTP, so each half can be developed and deployed
independently. Resume parsing, job match scoring, live scraping, and the
daily autonomous scan are all real — the initial agent start still seeds
a fixed set of mock jobs so the dashboard has something to show
immediately, with real scraped/scored listings arriving on the first
"Run Now" or scheduled scan.

## Features

- One-click demo profiles or real PDF/DOCX resume upload, with drag-and-drop
  validation and a live preview
- Full agent lifecycle control — start, stop, restart, and trigger an
  immediate out-of-schedule scan — with optimistic UI feedback throughout
- A resume profile view with a parsed skills timeline, work history, and
  a demand-by-skill chart matched against the job market
- A live job feed with client-side search, work-mode filtering, and
  sorting that update instantly with no re-fetch
- A slide-over job detail drawer with match rationale and resume-keyword
  highlighting on required skills
- An agent control center with a real-time countdown to the next
  scheduled scan, a visual daily-schedule timeline, and per-source
  toggles
- A run history log with trend and source-breakdown charts, plus a
  per-run match-score distribution breakdown
- Light and dark themes built on CSS custom properties, with system
  preference detection, persistence, and zero flash of unstyled content
- Fluid Framer Motion animations throughout — staggered card entry,
  drawer slide, status pulses, and animated chart arcs

## Architecture

### Three-Tier System

```
+-------------------+        HTTP/JSON        +--------------------+
|                   |  ------------------->    |                    |
|   React Frontend  |                           |   FastAPI Backend  |
|  (Vite, :5173)    |  <-------------------    |      (:8000)       |
|                   |                           |                    |
+-------------------+                           +---------+----------+
                                                           |
                                                           v
                                        +----------------------------------+
                                        |     External Integrations         |
                                        |  - Gemini 1.5 Flash (parsing/AI)  |
                                        |  - JobSpy: LinkedIn/Indeed/       |
                                        |    Glassdoor (scraping)           |
                                        |  - SQLite (dev) / PostgreSQL      |
                                        |    (prod) — storage               |
                                        +----------------------------------+
```

### Agent Loop

```
        +---------------------+
        |  Resume Uploaded +   |
        |  Preference Prompt   |
        +-----------+----------+
                     |
                     v
        +---------------------+
        |   Agent Started      |
        |   (status: ACTIVE)   |
        +-----------+----------+
                     |
      +--------------+---------------+
      |    Scheduler Tick (09:00)    | <--- or triggered manually
      |      or "Run Now"            |      via "Run Now"
      +--------------+---------------+
                     |
                     v
        +---------------------+
        |  Scrape Job Boards   |
        |  (LinkedIn/Indeed/   |
        |   Glassdoor)         |
        +-----------+----------+
                     |
                     v
        +---------------------+
        |  AI Match Scoring    |
        |  (resume vs. job)    |
        +-----------+----------+
                     |
                     v
        +---------------------+
        |  Persist + Rank Jobs |
        +-----------+----------+
                     |
                     v
        +---------------------+
        |  Dashboard Updated   |
        +-----------+----------+
                     |
                     +-----------------> back to Scheduler Tick
```

## Tech Stack

| Layer              | Technology                      | Purpose                                              |
| ------------------ | -------------------------------- | ------------------------------------------------------ |
| Frontend Framework | React 18 + Vite                  | Component-based UI with a fast dev server              |
| Styling            | Tailwind CSS 3                   | Utility-first styling driven by CSS custom properties   |
| Components         | shadcn/ui, CVA, Radix Slot       | Accessible, composable UI primitives                    |
| State (client)     | Zustand                          | Global state for agent status and theme                |
| Data Fetching      | TanStack React Query v5          | Server-state caching, polling, and error handling       |
| HTTP Client        | Axios                            | Centralized API client with interceptors                |
| Routing            | React Router v6                  | Client-side navigation                                  |
| Animation          | Framer Motion                    | Page transitions, staggered lists, drawer, status pulse |
| Charts             | Recharts                         | Skill demand, scan trends, and source-breakdown charts  |
| File Upload        | react-dropzone                   | Drag-and-drop resume upload                             |
| Dates              | date-fns                         | Relative time and datetime formatting                   |
| Icons              | Lucide React                     | Consistent icon set                                     |
| Class Utilities    | clsx, tailwind-merge             | Conditional and conflict-free class composition         |
| Backend Framework  | FastAPI                          | Async Python API server                                 |
| Backend Server     | Uvicorn                          | ASGI server for FastAPI                                 |
| ORM                | SQLAlchemy 2.0 (async)           | Database models and queries                              |
| Migrations         | Alembic                          | Versioned schema migrations                              |
| Database Drivers   | aiosqlite (dev), asyncpg (prod)  | Async drivers for SQLite and PostgreSQL                  |
| Containerization   | Docker Compose                   | Local multi-service orchestration                       |

## Getting Started

### Prerequisites

- Node.js 18 or later and npm
- Python 3.11 or later
- Docker and Docker Compose (optional, for containerized setup)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```
2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Copy the environment template:
   ```
   cp .env.example .env
   ```
5. Start the API server:
   ```
   uvicorn main:app --reload
   ```
6. The API is now available at `http://localhost:8000`, with interactive
   docs at `http://localhost:8000/docs`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser. The frontend expects the
   backend to be running at `http://localhost:8000`.

### Database Setup

The backend persists to SQLite by default (via `aiosqlite`) and to
PostgreSQL in production (via `asyncpg`), using SQLAlchemy 2.0's async
ORM. Tables are created automatically on startup — `uvicorn main:app
--reload` calls `init_db()` in its lifespan handler, which runs
`Base.metadata.create_all` against `DATABASE_URL` from `.env`
(`sqlite+aiosqlite:///./careerbot.db` by default) — so no manual step is
required to get a working database for local development.

An Alembic scaffold (`backend/alembic.ini`, `backend/alembic/env.py`,
`backend/alembic/script.py.mako`) is included for versioned schema
migrations, configured for SQLAlchemy's async-engine migration pattern
so it targets the same `DATABASE_URL` the app uses. It has not been
initialized with a first revision yet — `alembic/versions/` is currently
empty. To generate and apply one:

```
cd backend
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```

Run `alembic revision --autogenerate` again after changing any model in
`backend/models/models.py`, then `alembic upgrade head` to apply it.

### Docker Compose

1. From the repository root, copy the environment template (the backend
   service loads it via `env_file`, so this step is required — Compose
   will fail to start otherwise):
   ```
   cp .env.example .env
   ```
2. Build and start both services:
   ```
   docker compose up --build
   ```
3. The frontend will be available at `http://localhost:5173` and the
   backend at `http://localhost:8000`. Source directories are mounted as
   volumes, so changes to either service hot-reload automatically.
4. Stop the stack with:
   ```
   docker compose down
   ```

### Running Tests

```
cd backend
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
pytest
```

## Deployment

### Frontend — Vercel

1. Push the repository to GitHub.
2. Go to vercel.com and import the repository.
3. Set the root directory to `frontend`.
4. Add environment variable: `VITE_API_URL` = your Railway backend URL.
5. Deploy. Vercel handles the build automatically.

### Backend — Railway

1. Go to railway.app and create a new project.
2. Connect your GitHub repository.
3. Set the root directory to `backend`.
4. Add environment variables in Railway dashboard:
   - `GEMINI_API_KEY`
   - `DATABASE_URL` (Railway provides PostgreSQL — use the provided URL)
   - `SECRET_KEY`
5. Railway detects the Procfile and deploys automatically.

### Database — PostgreSQL on Railway

Railway offers a free PostgreSQL addon.
Add it to your project and copy the `DATABASE_URL` it provides.
The backend auto-creates all tables on startup via `init_db()`.

## Environment Variables

All variables are defined in `backend/.env.example`.

| Variable            | Description                                                          |
| -------------------- | ----------------------------------------------------------------------- |
| `GEMINI_API_KEY`     | API key for Google Gemini, used for resume parsing and match scoring |
| `GROQ_API_KEY`       | API key for Groq, an alternate fast-inference LLM provider            |
| `DATABASE_URL`       | Database connection string (SQLite by default)                        |
| `AGENT_RUN_HOUR`     | Hour of day (24h) the scheduled agent scan runs                       |
| `AGENT_RUN_MINUTE`   | Minute of the hour the scheduled agent scan runs                      |
| `CORS_ORIGINS`       | Comma-separated list of origins allowed to call the API                |
| `SECRET_KEY`         | Secret key used for signing application-level tokens                  |

## Project Structure

```
careerbot-ai/
├── frontend/
│   ├── public/
│   │   └── favicon.svg           # Browser tab icon
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js         # Axios instance + typed API functions
│   │   ├── components/
│   │   │   ├── layout/           # Navbar (with mobile tab bar), PageWrapper
│   │   │   ├── agent/            # Status strip, control cards, activity log
│   │   │   ├── jobs/             # Job card, grid, drawer, filters, skeleton
│   │   │   ├── resume/           # Upload zone, file preview, demo profile card
│   │   │   └── shared/           # Cross-cutting UI: badges, spinner, empty/error states
│   │   ├── hooks/                # useTheme, useAgent, useJobs, useResumeUpload
│   │   ├── pages/                # Landing, Resume Profile, Job Feed, Agent Control, Run History, 404
│   │   ├── store/                # Zustand stores (agent + resume, theme)
│   │   ├── styles/                # Global CSS and design tokens
│   │   ├── utils/                 # Formatters and shared constants
│   │   ├── App.jsx                # Router and provider setup
│   │   └── main.jsx                # React root entrypoint
│   ├── index.html                 # HTML entrypoint with anti-flash theme script
│   ├── package.json
│   ├── vite.config.js              # Vite config, path alias, dev proxy
│   ├── tailwind.config.js          # Tailwind theme tokens and dark mode config
│   ├── postcss.config.js
│   ├── vercel.json                 # SPA rewrites + security headers for Vercel
│   ├── .env.example                # VITE_API_URL template (local)
│   └── .env.production             # VITE_API_URL for the deployed backend
├── backend/
│   ├── main.py                     # FastAPI app instance, lifespan (init_db + scheduler), CORS, routers
│   ├── database.py                 # Async SQLAlchemy engine/session config
│   ├── models/
│   │   └── models.py                # SQLAlchemy ORM models (User, Resume, AgentState, RunLog, Job)
│   ├── schemas/
│   │   └── schemas.py               # Pydantic request/response schemas
│   ├── routers/
│   │   ├── resume.py               # Resume upload endpoint — PyMuPDF/docx extraction + Gemini parsing
│   │   ├── agent.py                # Agent lifecycle endpoints — JobSpy scraping + Gemini scoring on run
│   │   └── jobs.py                 # Job listing endpoints (DB-backed)
│   ├── services/
│   │   ├── ai_service.py            # Gemini resume parsing + job match scoring
│   │   ├── resume_parser.py         # PDF/DOCX text extraction
│   │   ├── job_scraper.py           # JobSpy scraping (LinkedIn/Indeed/Glassdoor)
│   │   └── scheduler.py             # APScheduler daily 09:00 UTC scan for all active agents
│   ├── tests/                       # pytest suite (health, resume, agent, jobs)
│   ├── utils.py                     # Shared helpers (serialization, timestamps, session resolution)
│   ├── seed.py                      # Mock job data seeded into the DB on agent start
│   ├── alembic/                     # Async-pattern migration environment (see Database Setup)
│   ├── alembic.ini
│   ├── pytest.ini
│   ├── Procfile                    # Railway/Render start command
│   ├── railway.json                # Railway build/deploy config
│   ├── requirements.txt            # Backend Python dependencies
│   └── .env.example                # Environment variable template
├── docker-compose.yml               # Frontend + backend service orchestration
├── .env.example                     # Root env template (used by docker-compose env_file)
├── .gitignore
├── README.md
├── CONTRIBUTING.md
└── CODE_OF_CONDUCT.md
```

## API Reference

| Method | Endpoint              | Description                                                |
| ------ | ---------------------- | ------------------------------------------------------------ |
| POST   | `/api/resume/upload`   | Upload a resume file and receive a parsed representation     |
| POST   | `/api/agent/start`     | Start the agent with a resume ID and preference prompt       |
| POST   | `/api/agent/stop`      | Stop the currently running agent                              |
| POST   | `/api/agent/run-now`   | Trigger an immediate, out-of-schedule agent run                |
| GET    | `/api/agent/status`    | Fetch current agent status, stats, and run history             |
| GET    | `/api/jobs`             | List all discovered job matches                                |
| GET    | `/api/jobs/{id}`        | Fetch a single job listing by ID (e.g. `job_001`)               |

### Example: Starting the agent

```
curl -X POST http://localhost:8000/api/agent/start \
  -H "Content-Type: application/json" \
  -d '{"resume_id": "res_mock_001", "prompt": "Senior backend roles, remote, fintech"}'
```

```json
{
  "agent_id": "agt_mock_001",
  "status": "ACTIVE",
  "next_run": "2026-01-16T09:00:00+00:00",
  "created_at": "2026-01-15T14:22:10+00:00",
  "message": "Agent started. First scan at 09:00 AM tomorrow."
}
```

### Example: Fetching agent status

```
curl http://localhost:8000/api/agent/status
```

```json
{
  "agent_id": "agt_mock_001",
  "status": "ACTIVE",
  "last_run": "2026-01-15T12:22:10+00:00",
  "next_run": "2026-01-16T09:00:00+00:00",
  "total_jobs_found": 47,
  "total_runs": 4,
  "uptime_days": 4,
  "avg_jobs_per_run": 11.75,
  "run_history": [
    {
      "run_number": 4,
      "ran_at": "2026-01-15T12:22:10+00:00",
      "jobs_found": 12,
      "duration_seconds": 47,
      "status": "SUCCESS",
      "sources": { "LinkedIn": 6, "Indeed": 4, "Glassdoor": 2 }
    }
  ]
}
```

## Database Schema

Implemented via SQLAlchemy models in `backend/models/models.py`, created
automatically on startup (see [Database Setup](#database-setup)).

```
users
  id                   string(36) PRIMARY KEY
  email                string UNIQUE NOT NULL
  session_id           string UNIQUE NOT NULL
  created_at           datetime NOT NULL

resumes
  id                   string(36) PRIMARY KEY
  user_id              string(36) REFERENCES users(id)
  filename             string NOT NULL
  file_size_kb         integer
  name, email, phone, location  string
  experience_years     integer
  skills, job_titles, education, summary, match_keywords  text (JSON-encoded lists)
  experience           text (JSON-encoded list of {company, title, duration, description})
  uploaded_at          datetime NOT NULL

agent_states
  id                   string(36) PRIMARY KEY
  user_id              string(36) REFERENCES users(id)
  resume_id            string(36) REFERENCES resumes(id)
  prompt               text
  status               string NOT NULL   -- ACTIVE | STOPPED
  total_jobs_found      integer NOT NULL DEFAULT 0
  total_runs            integer NOT NULL DEFAULT 0
  last_run_at           datetime
  next_run_at           datetime
  created_at            datetime NOT NULL

run_logs
  id                   string(36) PRIMARY KEY
  agent_id             string(36) REFERENCES agent_states(id)
  run_number           integer NOT NULL
  ran_at               datetime NOT NULL
  duration_seconds     integer
  jobs_found           integer NOT NULL DEFAULT 0
  sources_breakdown    text (JSON-encoded dict, e.g. {"LinkedIn": 6})
  status               string NOT NULL   -- SUCCESS | FAILED

jobs
  id                   string(36) PRIMARY KEY
  agent_id             string(36) REFERENCES agent_states(id)
  title                string NOT NULL
  company              string NOT NULL
  description_summary  text
  salary_min           integer
  salary_max           integer
  work_mode            string   -- Remote | Onsite | Hybrid
  location             string
  apply_url            string NOT NULL
  match_score          integer
  match_reason         text
  source               string
  tags                 text (JSON-encoded list)
  posted_at            datetime
  found_at             datetime NOT NULL
```

## Notes

### API Rate Limits

LinkedIn, Indeed, and Glassdoor each impose strict rate limits on their
job search APIs. A production scraper should implement exponential
backoff and bound request volume per scheduled run to stay within each
platform's terms of service.

### Job Scraping Behavior

A production scraper is expected to deduplicate listings across sources
by normalized title, company, and location before scoring, so the same
role is never surfaced more than once in the job feed.

### Development Shortcuts

The backend persists real data — resumes, agent state, run history, and
jobs all live in the database and survive a page refresh or server
restart. Resume parsing (`POST /api/resume/upload`) and job match
scoring both call Gemini 1.5 Flash for real; if `GEMINI_API_KEY` is
unset or the call fails, both fall back to a safe default (an "Unknown"
profile, or a static 70% match score) rather than erroring out.
Starting the agent still seeds a fixed set of 15 mock jobs
(`backend/seed.py`) so the dashboard has data immediately — "Run Now"
and the daily 09:00 UTC scheduler both then scrape real listings via
JobSpy (LinkedIn/Indeed/Glassdoor) and score them with Gemini. If
scraping returns nothing (rate-limited, blocked, or no results), the run
completes with zero new jobs rather than failing.

The app has no login flow yet, so every request that omits a session
identifier resolves to a single shared `local-default-session` — in
effect a single-user local deployment until real auth is added.

## Roadmap

- [x] Resume upload and one-click demo profiles
- [x] Agent lifecycle controls with a live countdown to the next scan
- [x] Job feed with client-side search, filtering, and sorting
- [x] Resume profile view with skill-demand charting
- [x] Run history with trend and source-breakdown charts
- [x] Persistent storage with the schema above
- [x] Real resume parsing (PDF/DOCX) with Gemini
- [x] Live job board scraping (JobSpy) and Gemini match scoring
- [x] Daily 09:00 UTC autonomous scan via APScheduler
- [ ] Cross-source deduplication by normalized title/company/location
- [ ] User authentication and multi-user support

## Team

| Role | Responsibilities |
|---|---|
| Frontend Developer | React UI, job cards, agent control panel, theme system, Framer Motion animations |
| Backend Developer | FastAPI endpoints, SQLAlchemy models, database schema, migrations |
| AI / Scraping Developer | Gemini API integration, resume parsing, job scoring, JobSpy scraping |
| DevOps / Tech Lead | Docker, Vercel deployment, Railway backend, CI/CD, code review |

> Built for the Panaversity Agentic AI Course Hackathon — September 2026

## License

This project is licensed under the MIT License. See the `LICENSE` file for
details.
