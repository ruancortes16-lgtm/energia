from pydantic import BaseModel


class IndicatorItem(BaseModel):
    label: str
    value: str
    trend: str
    tone: str


class ChartPoint(BaseModel):
    label: str
    consumption: float


class PeakItem(BaseModel):
    id: int
    meter_name: str
    consumption_kwh: float
    recorded_at: str
    severity: str


class DashboardResponse(BaseModel):
    daily_consumption: float
    weekly_consumption: float
    monthly_consumption: float
    active_alerts: int
    indicators: list[IndicatorItem]
    chart: list[ChartPoint]
    peaks: list[PeakItem]
