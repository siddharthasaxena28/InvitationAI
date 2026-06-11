import logging
from urllib.parse import quote
from config import get_settings

logger = logging.getLogger(__name__)


def build_whatsapp_share_url(
    event_title: str, event_date: str, venue: str, download_url: str
) -> str:
    """Build a wa.me share URL with a pre-filled invitation message."""
    message = (
        f"You are invited! 🎉\n"
        f"{event_title}\n"
        f"📅 Date: {event_date}\n"
        f"📍 Venue: {venue}\n"
        f"Download your invite: {download_url}\n"
        f"\nCreated with InviteAI • inviteai.in"
    )
    return f"https://wa.me/?text={quote(message)}"


async def send_whatsapp_message(
    to_number: str, message: str, media_url: str | None = None
) -> bool:
    """
    Send a WhatsApp message via Twilio.
    Stubs silently if Twilio credentials are not configured.
    """
    settings = get_settings()

    if not settings.twilio_account_sid or not settings.twilio_auth_token:
        logger.info(
            f"[WHATSAPP STUB] To: {to_number} | Message: {message[:80]}..."
        )
        return True

    try:
        from twilio.rest import Client

        client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
        to_whatsapp = f"whatsapp:+{to_number.lstrip('+')}"
        msg_params: dict = {
            "from_": settings.twilio_whatsapp_from,
            "to": to_whatsapp,
            "body": message,
        }
        if media_url:
            msg_params["media_url"] = [media_url]

        client.messages.create(**msg_params)
        return True
    except Exception as e:
        logger.error(f"Twilio WhatsApp error sending to {to_number}: {e}")
        return False
