import uuid
from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, ConfigDict


class OrderCreate(BaseModel):
    template_id: uuid.UUID
    email: Optional[str] = None
    customisation_json: Optional[dict] = None


class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    template_id: uuid.UUID
    user_id: Optional[uuid.UUID] = None
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    amount_inr: int
    status: str
    download_token: Optional[str] = None
    customisation_json: Optional[dict] = None
    email: Optional[str] = None
    created_at: datetime


class RsvpResponseCreate(BaseModel):
    guest_email: str
    response: Literal["yes", "no", "maybe"]


class RsvpResponseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    order_id: uuid.UUID
    guest_email: str
    response: str
    responded_at: datetime
