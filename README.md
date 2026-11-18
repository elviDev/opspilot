# OpsPilot

AI-powered monitoring dashboard that tracks uptime, detects incidents, and explains what broke in your language.

![OpsPilot dashboard screenshot](docs/screenshot.png)

OpsPilot watches your services in real time and uses AI to explain what's happening when something breaks. Instead of digging through raw logs to figure out why a service went down, OpsPilot summarizes the incident, points to a likely cause, and lets you ask follow-up questions directly, in whatever language you're most comfortable with, like having a support engineer's instincts built into your dashboard.

## Features

- **Real-time monitoring** â€” scheduled health checks against any list of URLs/APIs, tracking status codes, response time, and uptime.
- **AI incident summaries** â€” when a service fails, Gemini reads the error and explains what likely broke, why, and what to check next, in plain language.
- **Multi-language support** â€” incident summaries and chat answers can be generated in the user's preferred language.
- **AI chat assistant** â€” ask questions like "why did the payments service go down last night" and get an answer pulled from real incident history.
- **Slack and Discord alert routing** — configure multiple webhook destinations for outage and recovery notifications.
- **Maintenance windows** — schedule global or service-specific maintenance; checks continue while incidents and alerts are suppressed.
- **Incident acknowledgement** — acknowledge ongoing incidents from the dashboard.
- **Clean dashboard** â€” built with Next.js, React, and Tailwind, showing uptime, response time trends, and incident history at a glance.

## Tech stack

| Layer      | Tech                                   |
|------------|-----------------------------------------|
| Frontend   | Next.js (App Router), React, Tailwind CSS, Recharts |
| Backend    | FastAPI (Python)                        |
| Database   | PostgreSQL, SQLAlchemy                  |
| AI         | Google Gemini API                       |
| Alerts     | Slack and Discord webhooks              |
| Scheduling | APScheduler                             |

## Project structure