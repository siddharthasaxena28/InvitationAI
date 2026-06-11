import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from schemas.ai import (
    MagicCopyRequest,
    StyleSuggestRequest,
    StyleSuggestResponse,
    TranslateRequest,
    TranslateResponse,
    QualityCheckRequest,
    QualityCheckResponse,
)
from services.ai_generator import (
    generate_invitation_copy_stream,
    suggest_colour_palettes,
    translate_text_layers,
)

router = APIRouter(tags=["ai"])


@router.post("/generate-copy")
async def generate_copy(req: MagicCopyRequest):
    """
    Stream AI-generated invitation copy as Server-Sent Events.
    Final event is `data: [DONE]`.
    """

    async def event_stream():
        async for chunk in generate_invitation_copy_stream(req):
            yield f"data: {json.dumps({'text': chunk})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "X-Accel-Buffering": "no",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )


@router.post("/suggest-styles", response_model=StyleSuggestResponse)
async def suggest_styles(req: StyleSuggestRequest):
    """Return 3 AI-curated colour palette suggestions for the given occasion and mood."""
    suggestions = await suggest_colour_palettes(req.occasion, req.mood)
    return StyleSuggestResponse(suggestions=suggestions)


@router.post("/translate", response_model=TranslateResponse)
async def translate(req: TranslateRequest):
    """Translate all text layers to the requested language."""
    translated = await translate_text_layers(req.text_layers, req.target_language)
    return TranslateResponse(translated_layers=translated)


@router.post("/quality-check", response_model=QualityCheckResponse)
async def quality_check(req: QualityCheckRequest):
    """
    Run a basic quality check on a Fabric.js canvas JSON.
    Returns heuristic scores and an improvement suggestion.
    """
    fabric_json = req.fabric_json
    objects = fabric_json.get("objects", [])

    # Count object types
    text_count = sum(
        1 for o in objects if o.get("type") in ("text", "textbox", "i-text")
    )
    has_background = any(o.get("type") == "rect" for o in objects)
    has_image = any(o.get("type") == "image" for o in objects)

    # Heuristic scoring
    visual_appeal = 7 if has_image else (5 if has_background else 3)
    readability = min(10, max(1, 10 - max(0, text_count - 5)))
    cultural_accuracy = 7  # default — no deep analysis without API call
    occasion_fit = 8 if text_count >= 2 else 5

    suggestion = None
    if not has_background:
        suggestion = "Add a background colour or image to improve visual appeal."
    elif text_count == 0:
        suggestion = "No text layers found — add headline, date, and venue text."
    elif text_count > 7:
        suggestion = "Too many text layers may reduce readability. Consider consolidating."

    return QualityCheckResponse(
        visual_appeal=visual_appeal,
        readability=readability,
        cultural_accuracy=cultural_accuracy,
        occasion_fit=occasion_fit,
        improvement_suggestion=suggestion,
    )
