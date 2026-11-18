import unittest
from unittest.mock import patch

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.alerts import send_alert
from app.database import Base
from app.models import AlertRoute
from app.schemas import AlertRouteCreate


class AlertRouteTests(unittest.TestCase):
    def setUp(self):
        engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(engine)
        self.session = sessionmaker(bind=engine)()
        self.addCleanup(engine.dispose)
        self.addCleanup(self.session.close)

    def test_alerts_are_sent_to_each_configured_provider(self):
        self.session.add_all(
            [
                AlertRoute(
                    name="Ops Slack",
                    provider="slack",
                    webhook_url="https://hooks.slack.com/services/T000/B000/test",
                ),
                AlertRoute(
                    name="Ops Discord",
                    provider="discord",
                    webhook_url="https://discord.com/api/webhooks/123/test",
                ),
            ]
        )
        self.session.commit()
        with patch("app.alerts.requests.post") as post:
            send_alert(self.session, "Service is down")

        self.assertEqual(post.call_count, 2)
        payloads = [call.kwargs["json"] for call in post.call_args_list]
        self.assertCountEqual(payloads, [{"text": "Service is down"}, {"content": "Service is down"}])

    def test_provider_must_match_webhook_host(self):
        with self.assertRaises(ValueError):
            AlertRouteCreate(
                name="Ops Slack",
                provider="slack",
                webhook_url="https://discord.com/api/webhooks/123/test",
            )


if __name__ == "__main__":
    unittest.main()
