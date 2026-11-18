from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models import Incident, IncidentAcknowledgement
from app.schemas import IncidentAcknowledgementOut, IncidentOut
from app.ai_service import summarize_incident

router = APIRouter(prefix="/incidents", tags=["incidents"])


@router.get("/", response_model=list[IncidentOut])
def list_incidents(db: Session = Depends(get_db)):
    return (
        db.query(Incident)
        .options(selectinload(Incident.acknowledgement))
        .order_by(Incident.started_at.desc())
        .all()
    )


@router.post("/{incident_id}/acknowledge", response_model=IncidentAcknowledgementOut)
def acknowledge_incident(incident_id: int, db: Session = Depends(get_db)):
    incident = (
        db.query(Incident)
        .filter(Incident.id == incident_id)
        .with_for_update()
        .first()
    )
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    if incident.status != "open":
        raise HTTPException(status_code=409, detail="Only ongoing incidents can be acknowledged")

    acknowledgement = (
        db.query(IncidentAcknowledgement)
        .filter(IncidentAcknowledgement.incident_id == incident_id)
        .first()
    )
    if acknowledgement is None:
        acknowledgement = IncidentAcknowledgement(incident_id=incident_id)
        db.add(acknowledgement)
        db.commit()
        db.refresh(acknowledgement)
    return acknowledgement


@router.post("/{incident_id}/translate", response_model=IncidentOut)
def translate_incident(incident_id: int, language: str, db: Session = Depends(get_db)):
    """Re-generate the AI summary for an incident in a different language."""
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    summary = summarize_incident(incident.service.name, incident.raw_error or "Unknown error", language)
    incident.ai_summary = summary
    incident.ai_language = language
    db.commit()
    db.refresh(incident)
    return incident
