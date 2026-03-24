from __future__ import annotations

from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.models.entities import Alert, Reading
from app.services.analytics_service import detect_peak_for_reading, get_consumption_totals, get_or_create_limits


def create_alert(
    db: Session,
    *,
    alert_type: str,
    severity: str,
    title: str,
    description: str,
    reading_id: int | None = None,
    triggered_at: datetime | None = None,
) -> Alert:
    alert = Alert(
        type=alert_type,
        severity=severity,
        title=title,
        description=description,
        reading_id=reading_id,
        triggered_at=triggered_at or datetime.utcnow(),
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert


def has_recent_similar_alert(db: Session, *, alert_type: str, reference_time: datetime) -> bool:
    window_start = reference_time - timedelta(hours=12)
    return (
        db.query(Alert)
        .filter(
            Alert.type == alert_type,
            Alert.resolved.is_(False),
            Alert.triggered_at >= window_start,
            Alert.triggered_at <= reference_time,
        )
        .first()
        is not None
    )


def evaluate_reading_alerts(db: Session, reading: Reading) -> list[Alert]:
    limits = get_or_create_limits(db)
    totals = get_consumption_totals(db, reading.recorded_at)
    generated: list[Alert] = []

    threshold_checks = [
        ("daily_limit", totals["daily"], limits.daily_limit_kwh, "Limite diário ultrapassado"),
        ("weekly_limit", totals["weekly"], limits.weekly_limit_kwh, "Limite semanal ultrapassado"),
        ("monthly_limit", totals["monthly"], limits.monthly_limit_kwh, "Limite mensal ultrapassado"),
    ]

    for alert_type, value, limit, title in threshold_checks:
        if value > limit and not has_recent_similar_alert(db, alert_type=alert_type, reference_time=reading.recorded_at):
            generated.append(
                create_alert(
                    db,
                    alert_type=alert_type,
                    severity="high" if value > limit * 1.15 else "medium",
                    title=title,
                    description=f"Consumo acumulado em {value:.2f} kWh para um limite configurado de {limit:.2f} kWh.",
                    reading_id=reading.id,
                    triggered_at=reading.recorded_at,
                )
            )

    is_peak, severity = detect_peak_for_reading(db, reading, limits)
    if is_peak:
        generated.append(
            create_alert(
                db,
                alert_type="peak_detected",
                severity=severity,
                title="Pico de consumo identificado",
                description=f"A leitura de {reading.consumption_kwh:.2f} kWh ficou acima do comportamento recente.",
                reading_id=reading.id,
                triggered_at=reading.recorded_at,
            )
        )

    return generated
