from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Reading(Base):
    __tablename__ = "readings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    meter_name: Mapped[str] = mapped_column(String(120), default="Medidor Principal")
    consumption_kwh: Mapped[float] = mapped_column(Float)
    recorded_at: Mapped[datetime] = mapped_column(DateTime, index=True)
    latitude: Mapped[float] = mapped_column(Float, default=-23.55052)
    longitude: Mapped[float] = mapped_column(Float, default=-46.633308)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    alerts: Mapped[list["Alert"]] = relationship(back_populates="reading")


class ConsumptionLimit(Base):
    __tablename__ = "consumption_limits"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    daily_limit_kwh: Mapped[float] = mapped_column(Float, default=120.0)
    weekly_limit_kwh: Mapped[float] = mapped_column(Float, default=780.0)
    monthly_limit_kwh: Mapped[float] = mapped_column(Float, default=3200.0)
    peak_threshold_multiplier: Mapped[float] = mapped_column(Float, default=1.35)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    type: Mapped[str] = mapped_column(String(50))
    severity: Mapped[str] = mapped_column(String(20), default="medium")
    title: Mapped[str] = mapped_column(String(140))
    description: Mapped[str] = mapped_column(Text)
    triggered_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    resolved: Mapped[bool] = mapped_column(Boolean, default=False)
    reading_id: Mapped[int | None] = mapped_column(ForeignKey("readings.id"), nullable=True)

    reading: Mapped[Reading | None] = relationship(back_populates="alerts")
