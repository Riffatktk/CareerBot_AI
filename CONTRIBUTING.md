# Contributing to CareerBot AI

Thank you for your interest in improving CareerBot AI. This document
covers prerequisites, workflow conventions, and what is expected of a
pull request before it can be merged.

## Prerequisites

Before contributing, make sure you have:

- Node.js 18 or later and npm
- Python 3.11 or later
- Git
- A GitHub account with a fork of this repository

Familiarity with React, FastAPI, and Tailwind CSS will help you navigate
the codebase quickly, but is not required to submit a first contribution.

## Forking and Cloning

1. Fork the repository using the "Fork" button on the repository page.
2. Clone your fork locally:
   ```
   git clone https://github.com/<your-username>/careerbot-ai.git
   cd careerbot-ai
   ```
3. Add the original repository as an upstream remote:
   ```
   git remote add upstream https://github.com/<original-org>/careerbot-ai.git
   ```
4. Keep your fork up to date before starting new work:
   ```
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

## Running the Development Environment

Follow the backend and frontend setup steps in `README.md`, or run both
services at once with Docker Compose:

```
docker compose up --build
```

The frontend runs at `http://localhost:5173` and the backend at
`http://localhost:8000`, with hot reload enabled for both.

## Branch Naming Convention

Create a new branch for every change, off an up-to-date `main`:

- `feature/description` — new functionality (e.g. `feature/job-alerts-email`)
- `fix/description` — bug fixes (e.g. `fix/dashboard-status-poll`)
- `docs/description` — documentation-only changes (e.g. `docs/update-api-reference`)

Use lowercase, hyphen-separated words in the description.

## Commit Message Format

This project follows [Conventional Commits](https://www.conventionalcommits.org/).
Each commit message should be structured as:

```
<type>: <short summary>

<optional body>
```

Common types:

- `feat:` — a new feature
- `fix:` — a bug fix
- `docs:` — documentation changes only
- `style:` — formatting changes that do not affect logic
- `refactor:` — code changes that neither fix a bug nor add a feature
- `chore:` — tooling, dependencies, or build process changes

Examples:

```
feat: add salary-based sort option to job filters
fix: correct next-run calculation after manual run
docs: document AGENT_RUN_HOUR and AGENT_RUN_MINUTE
```

Keep the summary line under 72 characters, written in the imperative mood.

## Code Style

### Backend (Python)

- Format all code with [Black](https://black.readthedocs.io/) using
  default settings.
- Sort imports with [isort](https://pycqa.github.io/isort/), configured to
  be Black-compatible.
- Type hints are required on all function signatures.
- Run both tools before committing:
  ```
  black backend/
  isort backend/
  ```

### Frontend (JavaScript/React)

- Lint with ESLint (React and React Hooks plugins enabled):
  ```
  npm run lint
  ```
- Format with Prettier using the project's default configuration.
- Remove unused imports and variables before committing — the lint step
  will fail the build if any remain.
- Prefer function components with hooks; keep shared logic in `hooks/`,
  `api/`, or `store/` rather than duplicating it across components.

## Pull Request Checklist

Before opening a pull request, confirm that:

- [ ] The branch is up to date with `main` and merge conflicts are resolved
- [ ] The backend runs with `uvicorn main:app --reload` without errors
- [ ] The frontend runs with `npm run dev` without errors or new console
      warnings
- [ ] `npm run lint` passes with no errors
- [ ] Python code is formatted with Black and import-sorted with isort
- [ ] New or changed behavior is covered by tests where practical
- [ ] Documentation (README, inline comments where non-obvious) is updated
      to reflect the change
- [ ] The PR description explains what changed and why, and links any
      related issue

## Reporting Bugs

Open an issue that includes:

- A clear, descriptive title
- Steps to reproduce the problem
- Expected behavior versus actual behavior
- Relevant console output, logs, or screenshots
- Your environment (OS, Node/Python version, browser)

## Suggesting Features

Open an issue describing the problem you are trying to solve before
proposing a specific implementation — this gives maintainers room to
evaluate alternatives. Include the use case, who benefits from it, and
any relevant prior art or references.

## Code of Conduct

By participating in this project, you agree to abide by the
`CODE_OF_CONDUCT.md`.
