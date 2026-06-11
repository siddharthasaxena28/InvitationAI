import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from database import Base


class RsvpResponse(Base):
    __tablename__ = "rsvp_responses"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    order_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("orders.id"), nullable=False
    )
    guest_email: Mapped[str] = mapped_column(String(200))
    response: Mapped[str] = mapped_column(String(10))  # yes | no | maybe
    responded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
