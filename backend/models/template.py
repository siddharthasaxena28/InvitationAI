import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Boolean, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB, ARRAY
from database import Base


class Template(Base):
    __tablename__ = "templates"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    occasion_slug: Mapped[str] = mapped_column(
        String(100), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(200))
    style_tags: Mapped[list] = mapped_column(ARRAY(String), default=list)
    colour_palette: Mapped[list] = mapped_column(ARRAY(String), default=list)
    orientation: Mapped[str] = mapped_column(String(20), default="portrait")
    price_inr: Mapped[int] = mapped_column(Integer, default=0)
    preview_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    hd_template_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    fabric_json: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    ai_prompt: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
