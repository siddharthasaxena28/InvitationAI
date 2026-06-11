import logging
from config import get_settings

logger = logging.getLogger(__name__)


async def send_invitation_email(
    to: str,
    subject: str,
    html_content: str,
    attachment_bytes: bytes | None = None,
    attachment_name: str = "invitation.png",
) -> bool:
    """
    Send an email via SendGrid. Falls back to a log stub when API key is absent.
    Returns True on success, False on failure.
    """
    settings = get_settings()

    if not settings.sendgrid_api_key:
        logger.info(f"[EMAIL STUB] To: {to} | Subject: {subject}")
        return True

    import sendgrid
    import base64
    from sendgrid.helpers.mail import (
        Mail,
        Attachment,
        FileContent,
        FileName,
        FileType,
        Disposition,
    )

    message = Mail(
        from_email="noreply@inviteai.in",
        to_emails=to,
        subject=subject,
        html_content=html_content,
    )

    if attachment_bytes:
        encoded = base64.b64encode(attachment_bytes).decode()
        attachment = Attachment(
            FileContent(encoded),
            FileName(attachment_name),
            FileType("image/png"),
            Disposition("attachment"),
        )
        message.attachment = attachment

    try:
        sg = sendgrid.SendGridAPIClient(api_key=settings.sendgrid_api_key)
        response = sg.send(message)
        success = response.status_code in (200, 202)
        if not success:
            logger.warning(
                f"SendGrid returned status {response.status_code} for {to}"
            )
        return success
    except Exception as e:
        logger.error(f"SendGrid error sending to {to}: {e}")
        return False


async def send_download_link(to: str, download_url: str, template_title: str) -> bool:
    """Send a 'Your invitation is ready' email with the HD download link."""
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
      <h1 style="color: #4F46E5;">Your InviteAI Invitation is Ready! 🎉</h1>
      <p>Your customised <strong>{template_title}</strong> invitation is ready to download.</p>
      <a href="{download_url}"
         style="background: #4F46E5; color: white; padding: 12px 24px;
                border-radius: 8px; text-decoration: none; display: inline-block;
                margin: 16px 0;">
        Download Your Invitation
      </a>
      <p style="margin-top: 24px; color: #6B7280; font-size: 14px;">
        This link is valid for 24 hours. Create more invitations at
        <a href="https://inviteai.in">inviteai.in</a>
      </p>
    </div>
    """
    return await send_invitation_email(
        to, f"Your {template_title} Invitation is Ready!", html
    )
