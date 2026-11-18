from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import AlertRoute
from app.schemas import AlertRouteCreate, AlertRouteOut

router = APIRouter(prefix="/alerts/routes", tags=["alert routes"])


@router.get("/", response_model=list[AlertRouteOut])
def list_alert_routes(db: Session = Depends(get_db)):
    return db.query(AlertRoute).order_by(AlertRoute.id.asc()).all()


@router.post("/", response_model=AlertRouteOut)
def create_alert_route(payload: AlertRouteCreate, db: Session = Depends(get_db)):
    route = AlertRoute(**payload.model_dump())
    db.add(route)
    db.commit()
    db.refresh(route)
    return route


@router.delete("/{route_id}")
def delete_alert_route(route_id: int, db: Session = Depends(get_db)):
    route = db.query(AlertRoute).filter(AlertRoute.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Alert route not found")
    db.delete(route)
    db.commit()
    return {"ok": True}
