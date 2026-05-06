from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    DATABASE_URL: str
    PUBLIC_SITE_URL: str = "http://localhost:8000"

    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin"

    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_ADMIN_CHAT_ID: str = ""


settings = Settings()
