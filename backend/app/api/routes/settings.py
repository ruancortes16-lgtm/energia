from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.setting import LimitSettingsResponse, LimitSettingsUpdate
from app.services.analytics_service import get_or_create_limits

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("/limits", response_model=LimitSettingsResponse)
def get_limits(db: Session = Depends(get_db)):
    return get_or_create_limits(db)


@router.put("/limits", response_model=LimitSettingsResponse)
def update_limits(payload: LimitSettingsUpdate, db: Session = Depends(get_db)):
    limits = get_or_create_limits(db)
    for field, value in payload.model_dump().items():
        setattr(limits, field, value)
    db.commit()
    db.refresh(limits)
    return limits
