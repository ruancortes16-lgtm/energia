from __future__ import annotations

from datetime import datetime, timedelta
from random import Random

from sqlalchemy.orm import Session

from app.models.entities import Reading
from app.schemas.reading import ReadingCreate
from app.services.alert_service import evaluate_reading_alerts


def list_readings(db: Session, limit: int = 100) -> list[Reading]:
    return db.query(Reading).order_by(Reading.recorded_at.desc()).limit(limit).all()


def create_reading(db: Session, payload: ReadingCreate, *, evaluate_alerts: bool = True) -> Reading:
    reading = Reading(**payload.model_dump())
    db.add(reading)
    db.commit()
    db.refresh(reading)

    if evaluate_alerts:
        evaluate_reading_alerts(db, reading)
    return reading


def seed_readings(db: Session) -> None:
    if db.query(Reading).count() > 0:
        return

    random = Random(42)
    now = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
    samples: list[ReadingCreate] = []

    for day_offset in range(44, -1, -1):
        base_date = now - timedelta(days=day_offset)
        for hour in (8, 13, 19):
            reference = base_date.replace(hour=hour)
            base_consumption = 24 + (day_offset % 6) * 2.2 + random.uniform(-3.5, 4.5)
            if reference.weekday() in (4, 5):
                base_consumption += 6.5
            if day_offset in (7, 15, 23, 31) and hour == 19:
                base_consumption += 18
            if day_offset in (2, 9) and hour == 13:
                base_consumption += 24

            samples.append(
                ReadingCreate(
                    meter_name="Medidor Principal",
                    consumption_kwh=round(max(base_consumption, 9.5), 2),
                    recorded_at=reference,
                    latitude=-23.55052 + random.uniform(-0.015, 0.015),
                    longitude=-46.633308 + random.uniform(-0.015, 0.015),
                    notes="Leitura simulada para ambiente inicial.",
                )
            )

    for sample in samples:
        create_reading(db, sample, evaluate_alerts=True)
