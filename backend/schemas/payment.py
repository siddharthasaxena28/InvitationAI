import uuid
from typing import Optional
from pydantic import BaseModel


class CreateOrderRequest(BaseModel):
    template_id: uuid.UUID
    amount_inr: int
    email: Optional[str] = None


class CreateOrderResponse(BaseModel):
    razorpay_order_id: str
    amount_inr: int
    order_id: uuid.UUID


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    order_id: uuid.UUID


class VerifyPaymentResponse(BaseModel):
    success: bool
    download_token: str
    order_id: uuid.UUID
