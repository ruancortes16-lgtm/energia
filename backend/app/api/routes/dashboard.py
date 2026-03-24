from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.dashboard import DashboardResponse
from app.services.analytics_service import (
    build_consumption_chart,
    build_indicators,
    get_consumption_totals,
    list_peak_readings,
)
from app.models.entities import Alert

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/overview", response_model=DashboardResponse)
def get_dashboard_overview(db: Session = Depends(get_db)):
    totals = get_consumption_totals(db)
    active_alerts = db.query(Alert).filter(Alert.resolved.is_(False)).count()

    return {
        "daily_consumption": totals["daily"],
        "weekly_consumption": totals["weekly"],
        "monthly_consumption": totals["monthly"],
        "active_alerts": active_alerts,
        "indicators": build_indicators(db),
        "chart": build_consumption_chart(db),
        "peaks": list_peak_readings(db),
    }
