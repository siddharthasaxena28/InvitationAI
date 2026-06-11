import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from database import get_db
from models.order import Order
from models.template import Template
from services.renderer import RendererService
from services.storage import StorageService

router = APIRouter(tags=["render"])

renderer = RendererService()
storage = StorageService()


class PreviewRequest(BaseModel):
    template_id: uuid.UUID
    customisation_json: Optional[dict] = None


class HdRenderRequest(BaseModel):
    download_token: str
    order_id: uuid.UUID


@router.post("/preview")
async def render_preview(
    req: PreviewRequest, db: AsyncSession = Depends(get_db)
):
    """
    Render a watermarked 1080px preview PNG for a template.
    Applies optional customisation_json overrides before rendering.
    Returns the uploaded S3/MinIO URL.
    """
    result = await db.execute(
        select(Template).where(
            Template.id == req.template_id, Template.is_active == True
        )
    )
    template = result.scalar_one_or_none()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    fabric_json = dict(template.fabric_json or {})
    if req.customisation_json:
        fabric_json.update(req.customisation_json)

    preview_bytes = await renderer.render_preview(
        fabric_json, template.orientation or "portrait"
    )
    key = f"previews/custom/{uuid.uuid4()}.png"
    url = await storage.upload_bytes(preview_bytes, key, "image/png")
    return {"preview_url": url}


@router.post("/hd")
async def render_hd(req: HdRenderRequest, db: AsyncSession = Depends(get_db)):
    """
    Trigger HD render for a paid order. Dispatches a Celery task.
    Returns task_id for polling via /render/status/{task_id}.
    """
    result = await db.execute(
        select(Order).where(
            Order.id == req.order_id,
            Order.download_token == req.download_token,
        )
    )
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(
            status_code=403, detail="Invalid or expired download token"
        )
    if order.status != "paid":
        raise HTTPException(status_code=403, detail="Payment not completed")

    template_result = await db.execute(
        select(Template).where(Template.id == order.template_id)
    )
    template = template_result.scalar_one_or_none()

    fabric_json = (
        order.customisation_json
        or (template.fabric_json if template else None)
        or {}
    )
    orientation = (template.orientation if template else None) or "portrait"

    from workers.tasks import render_hd_task

    task = render_hd_task.delay(str(order.id), fabric_json, orientation)

    return {
        "task_id": task.id,
        "status": "processing",
        "order_id": str(order.id),
    }


@router.get("/status/{task_id}")
async def get_render_status(task_id: str):
    """Poll the status of a Celery render task."""
    from workers.celery_app import celery_app

    task = celery_app.AsyncResult(task_id)

    if task.state == "SUCCESS":
        return {"status": "complete", "result": task.result}
    elif task.state == "FAILURE":
        return {"status": "failed", "error": str(task.result)}
    elif task.state == "STARTED":
        return {"status": "started"}

    return {"status": task.state.lower()}
