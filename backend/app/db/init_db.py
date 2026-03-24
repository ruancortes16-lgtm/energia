from sqlalchemy.orm import Session

from app.db.database import Base, engine
from app.services.analytics_service import get_or_create_limits
from app.services.reading_service import seed_readings


def initialize_database() -> None:
    Base.metadata.create_all(bind=engine)


def seed_database(db: Session) -> None:
    get_or_create_limits(db)
    seed_readings(db)
