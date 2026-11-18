import unittest
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base
from app.models import Incident, MaintenanceWindow, Service
from app.scheduler import _check_service


class MaintenanceWindowTests(unittest.TestCase):
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

    def test_maintenance_suppresses_alerts_until_window_ends(self):
        service = Service(name="Payments", url="https://example.test/health")
        self.session.add(service)
        self.session.commit()
        now = datetime.now(timezone.utc)
        window = MaintenanceWindow(
            service_id=service.id,
            title="Database upgrade",
            starts_at=now - timedelta(minutes=1),
            ends_at=now + timedelta(hours=1),
        )
        self.session.add(window)
        self.session.commit()

        with (
            patch("app.scheduler.requests.get", return_value=type("Response", (), {"status_code": 503})()),
            patch("app.scheduler.settings.FAILURE_THRESHOLD", 1),
            patch("app.scheduler.summarize_incident", return_value="Service is unavailable"),
            patch("app.scheduler.send_alert") as send_alert_mock,
        ):
            _check_service(self.session, service)
            self.assertEqual(self.session.query(Incident).count(), 0)
            send_alert_mock.assert_not_called()

            window.ends_at = now - timedelta(seconds=1)
            self.session.commit()
            _check_service(self.session, service)

        self.assertEqual(self.session.query(Incident).count(), 1)
        send_alert_mock.assert_called_once()


if __name__ == "__main__":
    unittest.main()
