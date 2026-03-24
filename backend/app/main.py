from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import alerts, dashboard, health, readings, settings
from app.core.config import settings as app_settings
from app.db.database import SessionLocal
from app.db.init_db import initialize_database, seed_database
from app.services.ai_service import AIInsightService
from app.services.weather_service import WeatherService


@asynccontextmanager
async def lifespan(_: FastAPI):
    initialize_database()
    with SessionLocal() as db:
        if app_settings.seed_enabled:
            seed_database(db)
    yield


app = FastAPI(title=app_settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=app_settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix=app_settings.api_prefix)
app.include_router(readings.router, prefix=app_settings.api_prefix)
app.include_router(settings.router, prefix=app_settings.api_prefix)
app.include_router(alerts.router, prefix=app_settings.api_prefix)
app.include_router(dashboard.router, prefix=app_settings.api_prefix)


@app.get("/")
def root():
    weather_context = WeatherService().get_forecast_context()
    ai_context = AIInsightService().get_capabilities()
    return {
        "name": app_settings.app_name,
        "status": "running",
        "future_integrations": {
            "weather": weather_context,
            "ai": ai_context,
        },
    }
