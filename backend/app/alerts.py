import requests
from app.config import settings


def send_slack_alert(message: str) -> None:
    if not settings.SLACK_WEBHOOK_URL:
        return
    try:
        requests.post(settings.SLACK_WEBHOOK_URL, json={"text": message}, timeout=5)
    except requests.RequestException:
        # Don't let a Slack failure break the monitoring loop
        pass
