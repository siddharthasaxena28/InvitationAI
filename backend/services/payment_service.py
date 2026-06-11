import hmac
import hashlib
import secrets
import uuid as uuid_module
import logging
from config import get_settings

logger = logging.getLogger(__name__)


def create_razorpay_order(amount_inr: int, receipt: str) -> dict:
    """
    Create a Razorpay order and return the order dict.
    Returns a stub dict when Razorpay key is not configured.
    """
    settings = get_settings()

    if not settings.razorpay_key_id:
        logger.info(
            f"[RAZORPAY STUB] Creating fake order for receipt={receipt}, "
            f"amount={amount_inr}"
        )
        return {
            "id": f"order_stub_{uuid_module.uuid4().hex[:16]}",
            "amount": amount_inr * 100,
            "currency": "INR",
            "receipt": receipt,
        }

    import razorpay

    client = razorpay.Client(
        auth=(settings.razorpay_key_id, settings.razorpay_key_secret)
    )
    order = client.order.create(
        {
            "amount": amount_inr * 100,  # paise
            "currency": "INR",
            "receipt": receipt,
            "payment_capture": 1,
        }
    )
    return order


def verify_payment_signature(
    razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str
) -> bool:
    """
    Verify Razorpay HMAC-SHA256 signature. Security-critical — uses
    hmac.compare_digest to prevent timing attacks.
    Returns True in stub mode (no key secret configured).
    """
    settings = get_settings()

    if not settings.razorpay_key_secret:
        logger.warning(
            "Razorpay key secret not set — accepting signature in stub mode"
        )
        return True

    message = f"{razorpay_order_id}|{razorpay_payment_id}"
    expected = hmac.new(
        settings.razorpay_key_secret.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, razorpay_signature)


def generate_download_token() -> str:
    """Generate a cryptographically secure 32-byte URL-safe token."""
    return secrets.token_urlsafe(32)


def verify_webhook_signature(payload: bytes, signature: str) -> bool:
    """
    Verify Razorpay webhook HMAC-SHA256 signature.
    Returns True in stub mode.
    """
    settings = get_settings()

    if not settings.razorpay_key_secret:
        return True

    expected = hmac.new(
        settings.razorpay_key_secret.encode("utf-8"),
        payload,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
