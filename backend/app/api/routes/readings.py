from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.reading import ReadingCreate, ReadingResponse
from app.services.reading_service import create_reading, list_readings

router = APIRouter(prefix="/readings", tags=["readings"])


@router.get("", response_model=list[ReadingResponse])
def get_readings(
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return list_readings(db, limit=limit)


@router.get("/history", response_model=list[ReadingResponse])
def get_readings_history(
    limit: int = Query(default=200, ge=1, le=500),
    db: Session = Depends(get_db),
):
    return list_readings(db, limit=limit)


@router.post("", response_model=ReadingResponse, status_code=201)
def post_reading(payload: ReadingCreate, db: Session = Depends(get_db)):
    return create_reading(db, payload)
