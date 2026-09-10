from datetime import datetime
from typing import Optional
from pydantic import BaseModel


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

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    question: str
    language: str = "en"


class ChatResponse(BaseModel):
    answer: str
