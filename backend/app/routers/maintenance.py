from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import MaintenanceWindow, Service
from app.schemas import MaintenanceWindowCreate, MaintenanceWindowOut

router = APIRouter(prefix="/maintenance", tags=["maintenance"])


@router.get("/", response_model=list[MaintenanceWindowOut])
def list_maintenance_windows(db: Session = Depends(get_db)):
    return (
        db.query(MaintenanceWindow)
        .filter(MaintenanceWindow.ends_at > datetime.now(timezone.utc))
        .order_by(MaintenanceWindow.starts_at.asc())
        .all()
    )


@router.post("/", response_model=MaintenanceWindowOut)
def create_maintenance_window(payload: MaintenanceWindowCreate, db: Session = Depends(get_db)):
    if payload.service_id is not None and not db.query(Service.id).filter(
        Service.id == payload.service_id
    ).first():
        raise HTTPException(status_code=404, detail="Service not found")

    window = MaintenanceWindow(**payload.model_dump())
    db.add(window)
    db.commit()
    db.refresh(window)
    return window


@router.delete("/{window_id}")
def delete_maintenance_window(window_id: int, db: Session = Depends(get_db)):
    window = db.query(MaintenanceWindow).filter(MaintenanceWindow.id == window_id).first()
    if not window:
        raise HTTPException(status_code=404, detail="Maintenance window not found")
    db.delete(window)
    db.commit()
    return {"ok": True}
