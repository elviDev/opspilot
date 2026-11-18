from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    url = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    consecutive_failures = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    checks = relationship("Check", back_populates="service", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="service", cascade="all, delete-orphan")
    maintenance_windows = relationship(
        "MaintenanceWindow",
        back_populates="service",
        cascade="all, delete-orphan",
    )


class Check(Base):
    __tablename__ = "checks"

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    status_code = Column(Integer, nullable=True)
    response_time_ms = Column(Float, nullable=True)
    is_up = Column(Boolean, nullable=False)
    error_message = Column(Text, nullable=True)
    checked_at = Column(DateTime(timezone=True), server_default=func.now())

    service = relationship("Service", back_populates="checks")


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    raw_error = Column(Text, nullable=True)
    ai_summary = Column(Text, nullable=True)
    ai_language = Column(String, default="en")
    status = Column(String, default="open")  # open | resolved

    service = relationship("Service", back_populates="incidents")
    acknowledgement = relationship(
        "IncidentAcknowledgement",
        back_populates="incident",
        cascade="all, delete-orphan",
        uselist=False,
    )

    @property
    def acknowledged_at(self):
        return self.acknowledgement.acknowledged_at if self.acknowledgement else None


class IncidentAcknowledgement(Base):
    __tablename__ = "incident_acknowledgements"

    incident_id = Column(Integer, ForeignKey("incidents.id", ondelete="CASCADE"), primary_key=True)
    acknowledged_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    incident = relationship("Incident", back_populates="acknowledgement")


class MaintenanceWindow(Base):
    __tablename__ = "maintenance_windows"

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey("services.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(120), nullable=False)
    starts_at = Column(DateTime(timezone=True), nullable=False)
    ends_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    service = relationship("Service", back_populates="maintenance_windows")

    @property
    def service_name(self):
        return self.service.name if self.service else None


class AlertRoute(Base):
    __tablename__ = "alert_routes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), nullable=False)
    provider = Column(String(20), nullable=False)
    webhook_url = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
