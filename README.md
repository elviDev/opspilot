# OpsPilot

AI-powered monitoring dashboard that tracks uptime, detects incidents, and explains what broke in your language.

OpsPilot watches your services in real time and uses AI to explain what's happening when something breaks. Instead of digging through raw logs to figure out why a service went down, OpsPilot summarizes the incident, points to a likely cause, and lets you ask follow-up questions directly, in whatever language you're most comfortable with, like having a support engineer's instincts built into your dashboard.

## Features

- **Real-time monitoring** — scheduled health checks against any list of URLs/APIs, tracking status codes, response time, and uptime.
- **AI incident summaries** — when a service fails, Claude reads the error and explains what likely broke, why, and what to check next, in plain language.
- **Multi-language support** — incident summaries and chat answers can be generated in the user's preferred language.
- **AI chat assistant** — ask questions like "why did the payments service go down last night" and get an answer pulled from real incident history.
- **Slack alerts** — get notified the moment something goes down or recovers.
- **Clean dashboard** — built with Next.js, React, and Tailwind, showing uptime, response time trends, and incident history at a glance.

## Tech stack

| Layer      | Tech                                   |
|------------|-----------------------------------------|
| Frontend   | Next.js (App Router), React, Tailwind CSS, Recharts |
| Backend    | FastAPI (Python)                        |
| Database   | PostgreSQL, SQLAlchemy                  |
| AI         | Claude API                              |
| Alerts     | Slack webhooks                          |
| Scheduling | APScheduler                             |

## Project structure

```
opspilot/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app entrypoint
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── scheduler.py     # Background health check job
│   │   ├── ai_service.py    # Claude API integration
│   │   ├── alerts.py        # Slack webhook helper
│   │   └── routers/         # API endpoints
│   └── requirements.txt
├── frontend/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # Dashboard UI components
│   └── lib/api.ts           # Backend API client
└── docker-compose.yml        # Local Postgres for development
```

## Getting started

### 1. Database

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # then add your ANTHROPIC_API_KEY
uvicorn app.main:app --reload
```

API runs at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Dashboard runs at `http://localhost:3000`.

### 4. Add a service to monitor

```bash
curl -X POST http://localhost:8000/services/ \
  -H "Content-Type: application/json" \
  -d '{"name": "My API", "url": "https://example.com/health"}'
```

OpsPilot will start checking it automatically on the interval set in `.env`.

## Roadmap

- [ ] Anomaly detection based on historical response time patterns
- [ ] Smart alert grouping when multiple services fail from one root cause
- [ ] User authentication and multi-team support
- [ ] Email alerts as an alternative to Slack

## Why I built this

I'm an application support engineer, and this project mirrors the core of the job: watching systems, catching problems early, and explaining what happened clearly and fast. Built as a way to combine that domain knowledge with modern full-stack and AI tooling.
