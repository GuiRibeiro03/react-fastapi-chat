# backend/app/config.py
# ==============================================================================
# Centralised settings — all environment variables flow through here.
# Usage anywhere in the app:
#
#   from app.config import settings
#   print(settings.app_port)
#
# pydantic-settings automatically reads from the .env file and validates types.
# Install: pip install pydantic-settings
# ==============================================================================

from functools import lru_cache
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ------------------------------------------------------------------
    # Server
    # ------------------------------------------------------------------
    app_host: str = "127.0.0.1"
    app_port: int = 8000
    app_env: str = "development"
    app_debug: bool = True

    # ------------------------------------------------------------------
    # CORS
    # ------------------------------------------------------------------
    # Stored as a comma-separated string in .env, parsed into a list here.
    cors_origins: str = "http://localhost:3000"
    cors_allow_credentials: bool = True
    cors_allow_methods: str = "GET,POST,OPTIONS"
    cors_allow_headers: str = "Content-Type,Authorization"

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str) -> str:
        # Keep as string; split into list via the property below.
        return v

    @property
    def cors_origins_list(self) -> List[str]:
        """Return CORS origins as a Python list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    @property
    def cors_allow_methods_list(self) -> List[str]:
        return [m.strip() for m in self.cors_allow_methods.split(",")]

    @property
    def cors_allow_headers_list(self) -> List[str]:
        return [h.strip() for h in self.cors_allow_headers.split(",")]

    # ------------------------------------------------------------------
    # WebSocket
    # ------------------------------------------------------------------
    ws_max_connections: int = 100
    ws_keepalive_interval: int = 30

    # ------------------------------------------------------------------
    # Security
    # ------------------------------------------------------------------
    secret_key: str = "CHANGE_ME_use_openssl_rand_hex_32"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60

    # ------------------------------------------------------------------
    # Database
    # ------------------------------------------------------------------
    database_url: str = "sqlite:///./chat.db"

    # ------------------------------------------------------------------
    # Logging
    # ------------------------------------------------------------------
    log_level: str = "DEBUG"

    # ------------------------------------------------------------------
    # Pydantic-settings config
    # ------------------------------------------------------------------
    model_config = SettingsConfigDict(
        env_file=".env",          # Load from .env file in the working directory
        env_file_encoding="utf-8",
        case_sensitive=False,     # APP_HOST and app_host are equivalent
        extra="ignore",           # Silently ignore unknown env vars
    )

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"

    @property
    def is_development(self) -> bool:
        return self.app_env.lower() == "development"


@lru_cache
def get_settings() -> Settings:
    """
    Return a cached Settings instance.
    Using @lru_cache means the .env file is only read once per process,
    not on every import. Call get_settings() to access settings anywhere,
    or use the pre-built `settings` singleton below.
    """
    return Settings()


# Singleton — import this directly in most modules:
#   from app.config import settings
settings: Settings = get_settings()