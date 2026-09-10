from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Incident
from app.schemas import ChatRequest, ChatResponse
from app.ai_service import answer_question

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
def chat(payload: ChatRequest, db: Session = Depends(get_db)):
    incidents = db.query(Incident).order_by(Incident.started_at.desc()).limit(30).all()

    context_lines = []
    for inc in incidents:
        context_lines.append(
            f"- Service '{inc.service.name}' | started: {inc.started_at} | "
            f"status: {inc.status} | error: {inc.raw_error} | summary: {inc.ai_summary}"
        )
    context = "\n".join(context_lines) if context_lines else "No incidents recorded yet."

    answer = answer_question(payload.question, context, payload.language)
    return ChatResponse(answer=answer)
