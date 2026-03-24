from datetime import datetime

from pydantic import BaseModel


class AlertResponse(BaseModel):
    id: int
    type: str
    severity: str
    title: str
    description: str
    triggered_at: datetime
    resolved: bool
    reading_id: int | None

    model_config = {"from_attributes": True}
