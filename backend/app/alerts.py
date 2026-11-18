import logging

import requests
from sqlalchemy.orm import Session

from app.config import settings

logger = logging.getLogger(__name__)


def send_alert(db: Session, message: str) -> None:
    from app.models import AlertRoute

    routes = db.query(AlertRoute).filter(AlertRoute.is_active.is_(True)).all()
    if not routes:
        if settings.SLACK_WEBHOOK_URL:
            _post_alert(settings.SLACK_WEBHOOK_URL, "slack", message, "legacy Slack webhook")
        return

    for route in routes:
        _post_alert(route.webhook_url, route.provider, message, f"route {route.id}")


def _post_alert(url: str, provider: str, message: str, destination: str) -> None:
    payload = {"text": message} if provider == "slack" else {"content": message}
    try:
        response = requests.post(url, json=payload, timeout=5, allow_redirects=False)
        response.raise_for_status()
    except requests.RequestException as error:
        status = error.response.status_code if error.response is not None else "unavailable"
        logger.error(
            "Alert delivery failed for %s (%s): %s",
            destination,
            provider,
            status,
        )
