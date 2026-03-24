from __future__ import annotations

from collections import defaultdict
from datetime import datetime, time, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.entities import Alert, ConsumptionLimit, Reading


def start_of_day(reference: datetime) -> datetime:
    return datetime.combine(reference.date(), time.min)


def get_or_create_limits(db: Session) -> ConsumptionLimit:
    limits = db.query(ConsumptionLimit).first()
    if limits:
        return limits

    limits = ConsumptionLimit()
    db.add(limits)
    db.commit()
    db.refresh(limits)
    return limits


def get_consumption_totals(db: Session, reference: datetime | None = None) -> dict[str, float]:
    reference = reference or datetime.utcnow()
    day_start = start_of_day(reference)
    week_start = day_start - timedelta(days=6)
    month_start = day_start.replace(day=1)

    def total_since(dt: datetime) -> float:
        result = db.query(func.coalesce(func.sum(Reading.consumption_kwh), 0.0)).filter(Reading.recorded_at >= dt).scalar()
        return round(float(result or 0.0), 2)

    return {
        "daily": total_since(day_start),
        "weekly": total_since(week_start),
        "monthly": total_since(month_start),
    }


def build_consumption_chart(db: Session, days: int = 30) -> list[dict[str, float | str]]:
    start_date = start_of_day(datetime.utcnow()) - timedelta(days=days - 1)
    readings = (
        db.query(Reading)
        .filter(Reading.recorded_at >= start_date)
        .order_by(Reading.recorded_at.asc())
        .all()
    )

    totals: dict[str, float] = defaultdict(float)
    for reading in readings:
        label = reading.recorded_at.strftime("%d/%m")
        totals[label] += reading.consumption_kwh

    chart = []
    for offset in range(days):
        current = start_date + timedelta(days=offset)
        label = current.strftime("%d/%m")
        chart.append({"label": label, "consumption": round(totals.get(label, 0.0), 2)})
    return chart


def detect_peak_for_reading(db: Session, reading: Reading, limits: ConsumptionLimit | None = None) -> tuple[bool, str]:
    limits = limits or get_or_create_limits(db)
    previous_readings = (
        db.query(Reading)
        .filter(Reading.id != reading.id, Reading.recorded_at <= reading.recorded_at)
        .order_by(Reading.recorded_at.desc())
        .limit(10)
        .all()
    )

    if len(previous_readings) < 3:
        return False, "low"

    average = sum(item.consumption_kwh for item in previous_readings) / len(previous_readings)
    threshold = average * limits.peak_threshold_multiplier
    is_peak = reading.consumption_kwh >= threshold

    if not is_peak:
        return False, "low"
    if reading.consumption_kwh >= threshold * 1.25:
        return True, "high"
    return True, "medium"


def list_peak_readings(db: Session, limit: int = 5) -> list[dict[str, str | float | int]]:
    limits = get_or_create_limits(db)
    readings = db.query(Reading).order_by(Reading.recorded_at.desc()).limit(80).all()
    peaks: list[dict[str, str | float | int]] = []

    for reading in readings:
        is_peak, severity = detect_peak_for_reading(db, reading, limits)
        if is_peak:
            peaks.append(
                {
                    "id": reading.id,
                    "meter_name": reading.meter_name,
                    "consumption_kwh": round(reading.consumption_kwh, 2),
                    "recorded_at": reading.recorded_at.isoformat(),
                    "severity": severity,
                }
            )
        if len(peaks) >= limit:
            break
    return peaks


def build_indicators(db: Session) -> list[dict[str, str]]:
    totals = get_consumption_totals(db)
    limits = get_or_create_limits(db)
    active_alerts = db.query(Alert).filter(Alert.resolved.is_(False)).count()

    def ratio(value: float, limit: float) -> float:
        return (value / limit * 100.0) if limit else 0.0

    daily_ratio = ratio(totals["daily"], limits.daily_limit_kwh)
    weekly_ratio = ratio(totals["weekly"], limits.weekly_limit_kwh)
    monthly_ratio = ratio(totals["monthly"], limits.monthly_limit_kwh)

    return [
        {
            "label": "Meta diária",
            "value": f"{daily_ratio:.0f}%",
            "trend": "Dentro do esperado" if daily_ratio <= 100 else "Acima do limite",
            "tone": "positive" if daily_ratio <= 100 else "critical",
        },
        {
            "label": "Meta semanal",
            "value": f"{weekly_ratio:.0f}%",
            "trend": "Ritmo saudável" if weekly_ratio <= 100 else "Atenção necessária",
            "tone": "positive" if weekly_ratio <= 100 else "warning",
        },
        {
            "label": "Meta mensal",
            "value": f"{monthly_ratio:.0f}%",
            "trend": "Consumo projetado estável" if monthly_ratio <= 100 else "Risco de extrapolar",
            "tone": "positive" if monthly_ratio <= 100 else "critical",
        },
        {
            "label": "Alertas ativos",
            "value": str(active_alerts),
            "trend": "Monitoramento contínuo",
            "tone": "warning" if active_alerts else "neutral",
        },
    ]
