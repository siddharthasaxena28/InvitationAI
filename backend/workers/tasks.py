import asyncio
import uuid
import logging
from workers.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=30)
def render_hd_task(
    self, order_id: str, fabric_json: dict, orientation: str = "portrait"
):
    """
    Render HD PNG + PDF for an order and upload both to S3/MinIO.
    Returns dict with png_url, pdf_url, status.
    """

    async def _run():
        from services.renderer import RendererService
        from services.storage import StorageService

        renderer = RendererService()
        storage = StorageService()

        png_bytes = await renderer.render_hd_png(fabric_json, orientation)
        pdf_bytes = renderer.render_pdf(png_bytes, orientation)

        png_key = f"orders/{order_id}/invitation_hd.png"
        pdf_key = f"orders/{order_id}/invitation.pdf"

        png_url = await storage.upload_bytes(png_bytes, png_key, "image/png")
        pdf_url = await storage.upload_bytes(
            pdf_bytes, pdf_key, "application/pdf"
        )

        return {
            "png_url": png_url,
            "pdf_url": pdf_url,
            "status": "complete",
        }

    try:
        return asyncio.run(_run())
    except Exception as exc:
        logger.error(f"render_hd_task failed for order {order_id}: {exc}")
        raise self.retry(exc=exc)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def generate_template_batch_task(self, occasion_slug: str, count: int = 5):
    """
    Generate AI-designed templates for an occasion and persist them to the DB.
    """

    async def _run():
        from services.ai_generator import generate_template_spec
        from services.image_generator import generate_template_background
        from services.renderer import RendererService
        from services.storage import StorageService
        from models.template import Template
        from database import AsyncSessionLocal

        renderer = RendererService()
        storage = StorageService()
        styles = ["floral", "minimal", "bold", "elegant", "festive"]

        async with AsyncSessionLocal() as db:
            for i in range(min(count, 10)):
                style = styles[i % len(styles)]
                spec = await generate_template_spec(occasion_slug, style)
                bg_url = await generate_template_background(
                    occasion_slug,
                    spec.get("style_tags", []),
                    spec.get("colour_palette", []),
                )

                fabric_json = _spec_to_fabric_json(spec, bg_url)
                preview_bytes = await renderer.render_preview(
                    fabric_json, spec.get("layout", "portrait")
                )
                preview_key = f"templates/previews/{uuid.uuid4()}.png"
                preview_url = await storage.upload_bytes(
                    preview_bytes, preview_key, "image/png"
                )

                template = Template(
                    occasion_slug=occasion_slug,
                    title=spec.get("title", f"{occasion_slug} Invitation"),
                    style_tags=spec.get("style_tags", [style]),
                    colour_palette=spec.get(
                        "colour_palette",
                        ["#4F46E5", "#7C3AED", "#EEF2FF", "#FFFFFF"],
                    ),
                    orientation=spec.get("layout", "portrait"),
                    price_inr=[0, 29, 49, 99][i % 4],
                    preview_url=preview_url,
                    hd_template_url=bg_url,
                    fabric_json=fabric_json,
                    ai_prompt=f"{occasion_slug} {style} style",
                )
                db.add(template)

            await db.commit()

        return {
            "status": "complete",
            "occasion": occasion_slug,
            "count": min(count, 10),
        }

    try:
        return asyncio.run(_run())
    except Exception as exc:
        logger.error(
            f"generate_template_batch_task failed for {occasion_slug}: {exc}"
        )
        raise self.retry(exc=exc)


def _spec_to_fabric_json(spec: dict, bg_url: str | None = None) -> dict:
    """Convert a Claude-generated design spec to a Fabric.js 5.x canvas JSON."""
    objects = []

    for layer in spec.get("layers", []):
        pos = layer.get("position", {})
        style = layer.get("style", {})
        layer_type = layer.get("type", "")

        if layer_type == "background":
            obj = {
                "type": "rect",
                "version": "5.5.2",
                "left": 0,
                "top": 0,
                "width": pos.get("w", 800),
                "height": pos.get("h", 1200),
                "fill": style.get("fill", "#4F46E5"),
                "selectable": False,
                "evented": False,
            }
            objects.append(obj)

        elif layer_type in ("text", "decorative"):
            obj = {
                "type": "textbox",
                "version": "5.5.2",
                "left": pos.get("x", 0),
                "top": pos.get("y", 0),
                "width": pos.get("w", 600),
                "height": pos.get("h", 80),
                "text": layer.get("content", ""),
                "fontSize": style.get("fontSize", 32),
                "fontFamily": style.get("fontFamily", "Inter"),
                "fill": style.get("fill", "#FFFFFF"),
                "textAlign": "center",
                "editable": True,
            }
            objects.append(obj)

        elif layer_type == "shape":
            obj = {
                "type": "rect",
                "version": "5.5.2",
                "left": pos.get("x", 0),
                "top": pos.get("y", 0),
                "width": pos.get("w", 100),
                "height": pos.get("h", 100),
                "fill": style.get("fill", "#CCCCCC"),
                "rx": style.get("rx", 0),
                "ry": style.get("ry", 0),
                "selectable": True,
                "evented": True,
            }
            objects.append(obj)

    # Insert background image after background rect (index 1)
    if bg_url:
        bg_image = {
            "type": "image",
            "version": "5.5.2",
            "src": bg_url,
            "left": 0,
            "top": 0,
            "scaleX": 1,
            "scaleY": 1,
            "selectable": False,
            "evented": False,
            "opacity": 0.35,
        }
        insert_at = 1 if objects else 0
        objects.insert(insert_at, bg_image)

    palette = spec.get("colour_palette", ["#4F46E5"])
    return {
        "version": "5.5.2",
        "objects": objects,
        "background": palette[0] if palette else "#4F46E5",
    }


@celery_app.task(bind=True, max_retries=2)
def send_email_task(self, to: str, subject: str, html_content: str):
    """Async email dispatch wrapped for Celery."""
    asyncio.run(_send_email_async(to, subject, html_content))


async def _send_email_async(to: str, subject: str, html: str) -> None:
    from services.email_service import send_invitation_email

    await send_invitation_email(to, subject, html)
