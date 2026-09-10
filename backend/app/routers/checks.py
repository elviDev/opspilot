from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Check
from app.schemas import CheckOut

router = APIRouter(prefix="/checks", tags=["checks"])


@router.get("/{service_id}", response_model=list[CheckOut])
def get_checks(service_id: int, limit: int = 100, db: Session = Depends(get_db)):
    return (
        db.query(Check)
        .filter(Check.service_id == service_id)
        .order_by(Check.checked_at.desc())
        .limit(limit)
        .all()
    )


@router.get("/{service_id}/uptime")
def get_uptime(service_id: int, db: Session = Depends(get_db)):
    total = db.query(func.count(Check.id)).filter(Check.service_id == service_id).scalar()
    up = (
        db.query(func.count(Check.id))
        .filter(Check.service_id == service_id, Check.is_up == True)
        .scalar()
    )
    avg_response = (
        db.query(func.avg(Check.response_time_ms))
        .filter(Check.service_id == service_id, Check.is_up == True)
        .scalar()
    )
    uptime_pct = round((up / total) * 100, 2) if total else 100.0
    return {
        "service_id": service_id,
        "uptime_percent": uptime_pct,
        "avg_response_time_ms": round(avg_response, 2) if avg_response else None,
        "total_checks": total,
    }
