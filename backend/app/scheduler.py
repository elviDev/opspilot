import time
import requests
from apscheduler.schedulers.background import BackgroundScheduler

from app.database import SessionLocal
from app.models import Service, Check, Incident
from app.config import settings
from app.alerts import send_slack_alert
from app.ai_service import summarize_incident

scheduler = BackgroundScheduler()


def run_checks():
    db = SessionLocal()
    try:
        services = db.query(Service).filter(Service.is_active == True).all()
        for service in services:
            _check_service(db, service)
    finally:
        db.close()


def _check_service(db, service: Service):
    start = time.time()
    is_up = False
    status_code = None
    error_message = None

    try:
        resp = requests.get(service.url, timeout=10)
        status_code = resp.status_code
        is_up = resp.status_code < 400
        if not is_up:
            error_message = f"Received HTTP {resp.status_code}"
    except requests.RequestException as e:
        error_message = str(e)

    response_time_ms = round((time.time() - start) * 1000, 2)

    check = Check(
        service_id=service.id,
        status_code=status_code,
        response_time_ms=response_time_ms,
        is_up=is_up,
        error_message=error_message,
    )
    db.add(check)

    if is_up:
        # Recovered: close any open incident
        service.consecutive_failures = 0
        open_incident = (
            db.query(Incident)
            .filter(Incident.service_id == service.id, Incident.status == "open")
            .first()
        )
        if open_incident:
            open_incident.status = "resolved"
            from sqlalchemy.sql import func
            open_incident.resolved_at = func.now()
            send_slack_alert(f":white_check_mark: *{service.name}* has recovered.")
    else:
        service.consecutive_failures += 1
        if service.consecutive_failures >= settings.FAILURE_THRESHOLD:
            existing_open = (
                db.query(Incident)
                .filter(Incident.service_id == service.id, Incident.status == "open")
                .first()
            )
            if not existing_open:
                summary = None
                try:
                    summary = summarize_incident(service.name, error_message or "Unknown error", "en")
                except Exception as e:
                    print(f"AI summary failed: {e}")
                    summary = None

                incident = Incident(
                    service_id=service.id,
                    raw_error=error_message,
                    ai_summary=summary,
                    status="open",
                )
                db.add(incident)
                send_slack_alert(
                    f":rotating_light: *{service.name}* appears to be down.\n{summary or error_message}"
                )

    db.commit()


def start_scheduler():
    scheduler.add_job(run_checks, "interval", seconds=settings.CHECK_INTERVAL_SECONDS, id="run_checks")
    scheduler.start()
