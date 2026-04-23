from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    cors_origins: list[str] = ["http://localhost:4321", "http://localhost:8000"]
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_pass: str = ""
    notification_email: str = ""
    site_url: str = "http://localhost:4321"

    model_config = {"env_file": ".env", "env_prefix": "API_"}


settings = Settings()