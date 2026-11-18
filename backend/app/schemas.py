from datetime import datetime, timezone
from typing import Literal, Optional
from urllib.parse import urlsplit

from pydantic import BaseModel, ConfigDict, field_validator, model_validator


class ServiceCreate(BaseModel):
    name: str
    url: str


class ServiceOut(BaseModel):
    id: int
    name: str
    url: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class CheckOut(BaseModel):
    id: int
    service_id: int
    status_code: Optional[int]
    response_time_ms: Optional[float]
    is_up: bool
    checked_at: datetime

    class Config:
        from_attributes = True


class IncidentOut(BaseModel):
    id: int
    service_id: int
    started_at: datetime
    resolved_at: Optional[datetime]
    ai_summary: Optional[str]
    status: str
    acknowledged_at: Optional[datetime]

    class Config:
        from_attributes = True


class IncidentAcknowledgementOut(BaseModel):
    incident_id: int
    acknowledged_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MaintenanceWindowCreate(BaseModel):
    service_id: Optional[int] = None
    title: str
    starts_at: datetime
    ends_at: datetime

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        title = value.strip()
        if not title or len(title) > 120:
            raise ValueError("Title must be between 1 and 120 characters")
        return title

    @field_validator("starts_at", "ends_at")
    @classmethod
    def require_timezone(cls, value: datetime) -> datetime:
        if value.tzinfo is None or value.utcoffset() is None:
            raise ValueError("Maintenance times must include a timezone")
        return value

    @model_validator(mode="after")
    def validate_range(self):
        if self.ends_at <= self.starts_at:
            raise ValueError("End time must be after start time")
        if self.ends_at <= datetime.now(timezone.utc):
            raise ValueError("End time must be in the future")
        return self


class MaintenanceWindowOut(BaseModel):
    id: int
    service_id: Optional[int]
    service_name: Optional[str] = None
    title: str
    starts_at: datetime
    ends_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ChatRequest(BaseModel):
    question: str
    language: str = "en"


class ChatResponse(BaseModel):
    answer: str


class AlertRouteCreate(BaseModel):
    name: str
    provider: Literal["slack", "discord"]
    webhook_url: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        name = value.strip()
        if not name or len(name) > 80:
            raise ValueError("Name must be between 1 and 80 characters")
        return name

    @field_validator("webhook_url")
    @classmethod
    def validate_webhook_url(cls, value: str) -> str:
        parts = urlsplit(value)
        try:
            port = parts.port
        except ValueError as error:
            raise ValueError("Enter a valid webhook URL") from error
        valid_slack = parts.hostname == "hooks.slack.com" and parts.path.startswith("/services/")
        valid_discord = (
            parts.hostname in {"discord.com", "discordapp.com"}
            and parts.path.startswith("/api/webhooks/")
        )
        if (
            parts.scheme != "https"
            or parts.username
            or parts.password
            or (port is not None and port != 443)
            or parts.query
            or parts.fragment
            or not (valid_slack or valid_discord)
        ):
            raise ValueError("Use a valid HTTPS Slack or Discord incoming webhook URL")
        return value

    @model_validator(mode="after")
    def validate_provider_url(self):
        parts = urlsplit(self.webhook_url)
        matches_provider = (
            self.provider == "slack" and parts.hostname == "hooks.slack.com"
        ) or (
            self.provider == "discord"
            and parts.hostname in {"discord.com", "discordapp.com"}
        )
        if not matches_provider:
            raise ValueError("Webhook URL must match the selected provider")
        return self


class AlertRouteOut(BaseModel):
    id: int
    name: str
    provider: Literal["slack", "discord"]
    is_active: bool

    class Config:
        from_attributes = True
