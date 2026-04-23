import logging
from fastapi import APIRouter, HTTPException

from app.models.commission import CommissionSubmission, CommissionResponse
from app.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


async def send_notification_email(submission: CommissionSubmission) -> bool:
    """Send a notification email about the commission request.

    Uses SMTP settings from config. Returns True if sent successfully.
    Falls back to logging if SMTP is not configured.
    """
    if not settings.smtp_host or not settings.notification_email:
        logger.info(
            "SMTP not configured — logging commission submission: "
            "service=%s, name=%s, email=%s, addons=%s",
            submission.service_slug,
            submission.contact_name,
            submission.contact_email,
            submission.addons,
        )
        return True

    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"New Commission Request: {submission.service_slug}"
    msg["From"] = settings.smtp_user
    msg["To"] = settings.notification_email

    body = (
        f"New commission request received!\n\n"
        f"Service: {submission.service_slug}\n"
        f"Name: {submission.contact_name}\n"
        f"Email: {submission.contact_email}\n\n"
        f"Fields:\n"
    )
    for key, value in submission.fields.items():
        body += f"  {key}: {value}\n"

    if submission.addons:
        body += f"\nAdd-ons: {', '.join(submission.addons)}\n"

    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.starttls()
            if settings.smtp_user and settings.smtp_pass:
                server.login(settings.smtp_user, settings.smtp_pass)
            server.sendmail(settings.smtp_user, settings.notification_email, msg.as_string())
        return True
    except Exception:
        logger.exception("Failed to send notification email")
        return False


@router.post("/commissions", response_model=CommissionResponse)
async def submit_commission(submission: CommissionSubmission):
    """Handle a commission form submission."""
    logger.info(
        "Received commission submission for service '%s' from %s (%s)",
        submission.service_slug,
        submission.contact_name,
        submission.contact_email,
    )

    email_sent = await send_notification_email(submission)

    if not email_sent:
        raise HTTPException(
            status_code=500,
            detail="Failed to process your request. Please try again later.",
        )

    return CommissionResponse(
        status="success",
        message="Commission request submitted successfully! I'll get back to you soon.",
    )