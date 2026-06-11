import json
import uuid
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import String

from database import get_db
from models.template import Template
from schemas.template import TemplateResponse, TemplateListResponse

router = APIRouter(tags=["templates"])


@router.get("/", response_model=TemplateListResponse)
async def list_templates(
    occasion_slug: Optional[str] = Query(None),
    style_tags: Optional[List[str]] = Query(None),
    orientation: Optional[str] = Query(None),
    price_max: Optional[int] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """
    List active templates with optional filters.
    style_tags: overlap filter — returns templates sharing at least one tag.
    """
    query = select(Template).where(Template.is_active == True)

    if occasion_slug:
        query = query.where(Template.occasion_slug == occasion_slug)

    if orientation:
        query = query.where(Template.orientation == orientation)

    if price_max is not None:
        query = query.where(Template.price_inr <= price_max)

    if style_tags:
        # Filter templates that have at least one of the requested style tags
        # Uses PostgreSQL &&  (overlap) operator on arrays
        from sqlalchemy import cast
        from sqlalchemy.dialects.postgresql import ARRAY as PG_ARRAY

        query = query.where(
            Template.style_tags.overlap(style_tags)
        )

    # Count total matching records
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Paginate
    offset = (page - 1) * per_page
    query = query.order_by(Template.created_at.desc()).offset(offset).limit(per_page)

    result = await db.execute(query)
    templates = result.scalars().all()

    return TemplateListResponse(
        items=[TemplateResponse.model_validate(t) for t in templates],
        total=total,
        page=page,
        per_page=per_page,
    )


@router.get("/{template_id}", response_model=TemplateResponse)
async def get_template(
    template_id: uuid.UUID, db: AsyncSession = Depends(get_db)
):
    """Retrieve a single template by ID including full fabric_json."""
    result = await db.execute(
        select(Template).where(
            Template.id == template_id, Template.is_active == True
        )
    )
    template = result.scalar_one_or_none()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return TemplateResponse.model_validate(template)


class GenerateRequest:
    pass


from pydantic import BaseModel


class GenerateBatchRequest(BaseModel):
    occasion_slug: str
    count: int = 5


@router.post("/generate", status_code=status.HTTP_202_ACCEPTED)
async def generate_templates(req: GenerateBatchRequest):
    """
    Admin endpoint — dispatch a Celery task to AI-generate templates for an occasion.
    """
    from workers.tasks import generate_template_batch_task

    task = generate_template_batch_task.delay(req.occasion_slug, req.count)
    return {
        "task_id": task.id,
        "status": "queued",
        "occasion_slug": req.occasion_slug,
        "count": req.count,
    }


class PreviewRenderRequest(BaseModel):
    template_id: uuid.UUID
    customisation_json: Optional[dict] = None


@router.post("/preview-render")
async def preview_render(
    req: PreviewRenderRequest, db: AsyncSession = Depends(get_db)
):
    """
    Render a watermarked preview PNG for a template with optional customisations.
    Returns the S3/MinIO URL of the rendered preview.
    """
    result = await db.execute(
        select(Template).where(
            Template.id == req.template_id, Template.is_active == True
        )
    )
    template = result.scalar_one_or_none()
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")

    from services.renderer import RendererService
    from services.storage import StorageService
    import uuid as _uuid

    fabric_json = dict(template.fabric_json or {})
    if req.customisation_json:
        # Shallow merge: override top-level keys (e.g. updated objects list)
        fabric_json.update(req.customisation_json)

    renderer = RendererService()
    storage = StorageService()

    preview_bytes = await renderer.render_preview(
        fabric_json, template.orientation or "portrait"
    )
    key = f"previews/custom/{_uuid.uuid4()}.png"
    url = await storage.upload_bytes(preview_bytes, key, "image/png")

    return {"preview_url": url, "template_id": str(req.template_id)}
