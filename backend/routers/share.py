import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from database import get_db
from models.order import Order
from models.rsvp import RsvpResponse
from schemas.order import RsvpResponseCreate, RsvpResponseOut
from services.whatsapp_service import build_whatsapp_share_url
from services.email_service import send_invitation_email

router = APIRouter(tags=["share"])


class WhatsAppShareRequest(BaseModel):
    event_title: str
    event_date: str
    venue: str
    download_url: str


class EmailShareRequest(BaseModel):
    to_emails: List[str]
    subject: str
    event_title: str
    download_url: str


@router.post("/whatsapp")
async def share_whatsapp(req: WhatsAppShareRequest):
    """Build a wa.me share URL for the invitation."""
    url = build_whatsapp_share_url(
        req.event_title, req.event_date, req.venue, req.download_url
    )
    return {"whatsapp_url": url}


@router.post("/email")
async def share_email(req: EmailShareRequest):
    """
    Send invitation emails to a list of guests (max 50 per request).
    Returns per-recipient send status.
    """
    html = f"""
    <div style="font-family: Arial; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #4F46E5;">You're Invited! 🎉</h2>
      <h3>{req.event_title}</h3>
      <p>
        You have been invited to this special event.
        Click below to view and download your invitation:
      </p>
      <a href="{req.download_url}"
         style="background:#4F46E5;color:white;padding:12px 24px;border-radius:8px;
                text-decoration:none;display:inline-block;margin:16px 0;">
        View Invitation
      </a>
      <p style="color:#6B7280;font-size:12px;">
        Sent via InviteAI &bull; <a href="https://inviteai.in">inviteai.in</a>
      </p>
    </div>
    """
    results = []
    for email in req.to_emails[:50]:  # cap at 50 recipients
        ok = await send_invitation_email(email, req.subject, html)
        results.append({"email": email, "sent": ok})

    return {"results": results, "total_sent": sum(1 for r in results if r["sent"])}


@router.get("/rsvp/{token}")
async def get_rsvp_page(token: str, db: AsyncSession = Depends(get_db)):
    """Validate an RSVP link and return order metadata."""
    result = await db.execute(
        select(Order).where(Order.download_token == token)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="RSVP link not found")
    return {"order_id": str(order.id), "valid": True}


@router.post("/rsvp/{token}/respond")
async def submit_rsvp(
    token: str,
    req: RsvpResponseCreate,
    db: AsyncSession = Depends(get_db),
):
    """Record a guest's RSVP response."""
    result = await db.execute(
        select(Order).where(Order.download_token == token)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="RSVP link not found")

    rsvp = RsvpResponse(
        order_id=order.id,
        guest_email=req.guest_email,
        response=req.response,
    )
    db.add(rsvp)
    await db.commit()

    return {"status": "recorded", "response": req.response}


@router.get("/rsvp/{token}/responses")
async def get_rsvp_responses(token: str, db: AsyncSession = Depends(get_db)):
    """Return aggregated RSVP counts and individual responses for an event."""
    result = await db.execute(
        select(Order).where(Order.download_token == token)
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Not found")

    rsvps_result = await db.execute(
        select(RsvpResponse).where(RsvpResponse.order_id == order.id)
    )
    responses = rsvps_result.scalars().all()

    return {
        "order_id": str(order.id),
        "total": len(responses),
        "yes": sum(1 for r in responses if r.response == "yes"),
        "no": sum(1 for r in responses if r.response == "no"),
        "maybe": sum(1 for r in responses if r.response == "maybe"),
        "responses": [
            {
                "email": r.guest_email,
                "response": r.response,
                "at": r.responded_at.isoformat(),
            }
            for r in responses
        ],
    }
