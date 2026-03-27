from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = "EnergIA API"
    api_prefix: str = "/api"
    database_url: str = f"sqlite:///{BASE_DIR / 'energia.db'}"
    cors_origins: list[str] = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://energia-tja6.vercel.app",
]
    seed_enabled: bool = True

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
