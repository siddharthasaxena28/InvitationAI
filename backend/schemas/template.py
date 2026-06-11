import uuid
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class TemplateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    occasion_slug: str
    title: str
    style_tags: List[str]
    colour_palette: List[str]
    orientation: str
    price_inr: int
    preview_url: Optional[str] = None
    hd_template_url: Optional[str] = None
    fabric_json: Optional[dict] = None
    ai_prompt: Optional[str] = None
    is_active: bool
    created_at: datetime


class TemplateListResponse(BaseModel):
    items: List[TemplateResponse]
    total: int
    page: int
    per_page: int
