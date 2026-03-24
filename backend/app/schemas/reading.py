from datetime import datetime

from pydantic import BaseModel, Field


class ReadingBase(BaseModel):
    meter_name: str = Field(default="Medidor Principal", max_length=120)
    consumption_kwh: float = Field(gt=0)
    recorded_at: datetime
    latitude: float = Field(default=-23.55052)
    longitude: float = Field(default=-46.633308)
    notes: str | None = None


class ReadingCreate(ReadingBase):
    pass


class ReadingResponse(ReadingBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
