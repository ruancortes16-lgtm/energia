from datetime import datetime

from pydantic import BaseModel, Field


class LimitSettingsBase(BaseModel):
    daily_limit_kwh: float = Field(gt=0)
    weekly_limit_kwh: float = Field(gt=0)
    monthly_limit_kwh: float = Field(gt=0)
    peak_threshold_multiplier: float = Field(gt=1.0, le=5.0)


class LimitSettingsUpdate(LimitSettingsBase):
    pass


class LimitSettingsResponse(LimitSettingsBase):
    id: int
    updated_at: datetime

    model_config = {"from_attributes": True}
