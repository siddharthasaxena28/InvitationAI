import uuid
from typing import List, Optional
from pydantic import BaseModel


class MagicCopyRequest(BaseModel):
    occasion: str
    host_name: str
    event_date: str
    venue: str
    additional_context: Optional[str] = None
    language: str = "en"
    tone: str = "warm"


class StyleSuggestRequest(BaseModel):
    occasion: str
    mood: str


class StyleSuggestion(BaseModel):
    name: str
    palette: List[str]  # exactly 4 hex colours


class StyleSuggestResponse(BaseModel):
    suggestions: List[StyleSuggestion]


class TranslateRequest(BaseModel):
    text_layers: List[str]
    target_language: str


class TranslateResponse(BaseModel):
    translated_layers: List[str]


class QualityCheckRequest(BaseModel):
    template_id: uuid.UUID
    fabric_json: dict


class QualityCheckResponse(BaseModel):
    visual_appeal: int        # 1-10
    readability: int          # 1-10
    cultural_accuracy: int    # 1-10
    occasion_fit: int         # 1-10
    improvement_suggestion: Optional[str] = None
