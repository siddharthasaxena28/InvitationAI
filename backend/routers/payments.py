import json
import uuid

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database import get_db
from models.order import Order
from models.template import Template
from schemas.payment import (
    CreateOrderRequest,
    CreateOrderResponse,
    VerifyPaymentRequest,
    VerifyPaymentResponse,
)
from services.payment_service import (
    create_razorpay_order,
    verify_payment_signature,
    generate_download_token,
    verify_webhook_signature,
)

router = APIRouter(tags=["payments"])


@router.post("/create-order", response_model=CreateOrderResponse)
async def create_order(
    req: CreateOrderRequest, db: AsyncSession = Depends(get_db)
):
    """
    Create a Razorpay order for a template purchase.
    Returns the Razorpay order ID plus internal order ID.
    """
    result = await db.execute(
        select(Template).where(
            Template.id == req.template_id, Template.is_active == True
        )
    )
    template = result.scalar_one_or_none()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    order = Order(
        template_id=req.template_id,
        amount_inr=req.amount_inr,
        email=req.email,
        status="pending",
    )
    db.add(order)
    await db.flush()  # get order.id

    rzp_order = create_razorpay_order(req.amount_inr, str(order.id))
    order.razorpay_order_id = rzp_order["id"]
    await db.commit()
    await db.refresh(order)

    return CreateOrderResponse(
        razorpay_order_id=rzp_order["id"],
        amount_inr=req.amount_inr,
        order_id=order.id,
    )


@router.post("/verify", response_model=VerifyPaymentResponse)
async def verify_payment(
    req: VerifyPaymentRequest, db: AsyncSession = Depends(get_db)
):
    """
    Verify Razorpay payment signature and mark the order as paid.
    Returns a secure download token on success.
    """
    if not verify_payment_signature(
        req.razorpay_order_id, req.razorpay_payment_id, req.razorpay_signature
    ):
        raise HTTPException(status_code=400, detail="Invalid payment signature")

    result = await db.execute(select(Order).where(Order.id == req.order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    token = generate_download_token()
    order.status = "paid"
    order.razorpay_payment_id = req.razorpay_payment_id
    order.download_token = token
    await db.commit()

    # Optionally send download-link email
    if order.email:
        try:
            from workers.tasks import send_email_task
            from services.email_service import send_download_link

            # Fire-and-forget via Celery
            download_url = f"https://inviteai.in/download/{token}"
            send_email_task.delay(
                order.email,
                "Your InviteAI Invitation is Ready!",
                f"<p>Download your invitation: <a href='{download_url}'>{download_url}</a></p>",
            )
        except Exception:
            pass  # never block payment confirm on email errors

    return VerifyPaymentResponse(
        success=True, download_token=token, order_id=order.id
    )


@router.post("/webhook")
async def razorpay_webhook(
    request: Request, db: AsyncSession = Depends(get_db)
):
    """
    Razorpay webhook handler for payment.captured events.
    Marks order as paid and generates a download token if not already done.
    """
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")

    if not verify_webhook_signature(body, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    event = json.loads(body)
    event_type = event.get("event")

    if event_type == "payment.captured":
        payment = event["payload"]["payment"]["entity"]
        rzp_order_id = payment.get("order_id")

        result = await db.execute(
            select(Order).where(Order.razorpay_order_id == rzp_order_id)
        )
        order = result.scalar_one_or_none()

        if order and order.status != "paid":
            order.status = "paid"
            order.razorpay_payment_id = payment["id"]
            if not order.download_token:
                order.download_token = generate_download_token()
            await db.commit()

    return {"status": "ok"}


@router.get("/order/{order_id}")
async def get_order_status(order_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Get the payment/processing status of an order."""
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return {
        "order_id": str(order.id),
        "status": order.status,
        "has_token": bool(order.download_token),
        "amount_inr": order.amount_inr,
    }
