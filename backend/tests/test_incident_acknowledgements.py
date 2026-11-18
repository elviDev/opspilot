import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base
from app.models import Incident, Service
from app.routers.incidents import acknowledge_incident


class IncidentAcknowledgementTests(unittest.TestCase):
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

    def test_acknowledgement_is_idempotent(self):
        service = Service(name="Payments", url="https://example.test/health")
        self.session.add(service)
        self.session.commit()
        incident = Incident(service_id=service.id, status="open")
        self.session.add(incident)
        self.session.commit()

        first = acknowledge_incident(incident.id, self.session)
        second = acknowledge_incident(incident.id, self.session)

        self.assertEqual(first.incident_id, incident.id)
        self.assertEqual(second.incident_id, incident.id)
        self.assertEqual(first.acknowledged_at, second.acknowledged_at)


if __name__ == "__main__":
    unittest.main()
