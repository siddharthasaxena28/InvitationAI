from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # Database
    database_url: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/inviteai",
        alias="DATABASE_URL",
    )
    # Redis / Celery
    redis_url: str = Field(default="redis://localhost:6379/0", alias="REDIS_URL")
    celery_broker_url: str = Field(
        default="redis://localhost:6379/0", alias="CELERY_BROKER_URL"
    )
    celery_result_backend: str = Field(
        default="redis://localhost:6379/0", alias="CELERY_RESULT_BACKEND"
    )

    # AI providers
    anthropic_api_key: str = Field(default="", alias="ANTHROPIC_API_KEY")
    openai_api_key: str = Field(default="", alias="OPENAI_API_KEY")

    # Razorpay
    razorpay_key_id: str = Field(default="", alias="RAZORPAY_KEY_ID")
    razorpay_key_secret: str = Field(default="", alias="RAZORPAY_KEY_SECRET")

    # Stripe (optional, future)
    stripe_secret_key: str = Field(default="", alias="STRIPE_SECRET_KEY")
    stripe_webhook_secret: str = Field(default="", alias="STRIPE_WEBHOOK_SECRET")

    # AWS / MinIO
    aws_access_key_id: str = Field(default="minioadmin", alias="AWS_ACCESS_KEY_ID")
    aws_secret_access_key: str = Field(
        default="minioadmin", alias="AWS_SECRET_ACCESS_KEY"
    )
    s3_bucket_name: str = Field(default="inviteai", alias="S3_BUCKET_NAME")
    minio_endpoint: str = Field(
        default="http://minio:9000", alias="MINIO_ENDPOINT"
    )

    # SendGrid
    sendgrid_api_key: str = Field(default="", alias="SENDGRID_API_KEY")

    # Twilio / WhatsApp
    twilio_account_sid: str = Field(default="", alias="TWILIO_ACCOUNT_SID")
    twilio_auth_token: str = Field(default="", alias="TWILIO_AUTH_TOKEN")
    twilio_whatsapp_from: str = Field(
        default="whatsapp:+14155238886", alias="TWILIO_WHATSAPP_FROM"
    )

    # JWT
    jwt_secret_key: str = Field(default="dev-secret-key", alias="JWT_SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    jwt_expire_minutes: int = Field(default=10080, alias="JWT_EXPIRE_MINUTES")

    # CORS
    allowed_origins: List[str] = Field(
        default=["http://localhost:3000"], alias="ALLOWED_ORIGINS"
    )

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "populate_by_name": True,
    }


@lru_cache()
def get_settings() -> Settings:
    return Settings()
