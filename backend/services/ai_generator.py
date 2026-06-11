import anthropic
import json
from typing import AsyncIterator
from config import get_settings
from schemas.ai import StyleSuggestion

SYSTEM_PROMPT = (
    "You are an expert invitation card copywriter specializing in Indian cultural occasions. "
    "Always respond with valid JSON only."
)


async def generate_invitation_copy_stream(req) -> AsyncIterator[str]:
    """Stream invitation copy from Claude. Yields text chunks."""
    settings = get_settings()

    if not settings.anthropic_api_key:
        # Stub mode — yield complete JSON at once
        yield json.dumps(
            {
                "headline": f"You're Invited to {req.occasion.title()}!",
                "subheading": f"Join us at {req.venue}",
                "body": (
                    f"Dear Guest,\n"
                    f"We warmly invite you to celebrate {req.occasion} with us.\n"
                    f"Hosted by {req.host_name} on {req.event_date}."
                ),
                "rsvp_line": "Kindly RSVP by replying to this invitation.",
                "tagline": "Together we celebrate!",
            }
        )
        return

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    prompt = (
        f"Generate beautiful invitation text for a {req.occasion} celebration.\n"
        f"Host: {req.host_name}\n"
        f"Date: {req.event_date}\n"
        f"Venue: {req.venue}\n"
        f"Tone: {req.tone}\n"
        f"Language: {req.language}\n"
        f"Additional context: {req.additional_context or 'None'}\n\n"
        "Return ONLY valid JSON with keys: headline, subheading, body, rsvp_line, tagline.\n"
        "Keep text concise and culturally appropriate. "
        "If language is not English, write in that language using proper Unicode."
    )

    async with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=600,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        async for text in stream.text_stream:
            yield text


async def suggest_colour_palettes(occasion: str, mood: str) -> list[StyleSuggestion]:
    """Return 3 colour palette suggestions for the given occasion and mood."""
    settings = get_settings()

    if not settings.anthropic_api_key:
        return [
            StyleSuggestion(
                name="Royal Indigo",
                palette=["#4F46E5", "#7C3AED", "#EEF2FF", "#FFFFFF"],
            ),
            StyleSuggestion(
                name="Golden Warmth",
                palette=["#F59E0B", "#D97706", "#FEF3C7", "#FFFFFF"],
            ),
            StyleSuggestion(
                name="Rose Blossom",
                palette=["#EC4899", "#DB2777", "#FCE7F3", "#FFFFFF"],
            ),
        ]

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    prompt = (
        f"Suggest 3 beautiful colour palettes for a {occasion} invitation card "
        f"with {mood} mood.\n"
        "Return ONLY valid JSON array with 3 objects, each having: "
        "name (string), palette (array of exactly 4 hex colours).\n"
        "Ensure colours are vibrant and culturally appropriate for Indian aesthetic."
    )

    response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )
    data = json.loads(response.content[0].text)
    return [StyleSuggestion(**item) for item in data]


async def translate_text_layers(
    text_layers: list[str], target_language: str
) -> list[str]:
    """Translate invitation text layers to the target language."""
    settings = get_settings()

    if not settings.anthropic_api_key:
        return text_layers  # Return originals in stub mode

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    prompt = (
        f"Translate the following invitation card text layers to {target_language}.\n"
        "Maintain cultural appropriateness and keep the same emotional tone.\n"
        f"Text layers (JSON array): {json.dumps(text_layers)}\n"
        "Return ONLY a JSON array of translated strings in the same order."
    )

    response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )
    return json.loads(response.content[0].text)


async def generate_template_spec(
    occasion: str, style: str, language: str = "en"
) -> dict:
    """Generate a complete design specification for a template via Claude."""
    settings = get_settings()

    OCCASIONS_MAP = {
        "birthday-kids": "Kids Birthday Party",
        "birthday-adult": "Adult Birthday",
        "birthday-milestone": "Milestone Birthday",
        "wedding": "Wedding",
        "engagement": "Engagement",
        "mehendi": "Mehendi Ceremony",
        "sangeet": "Sangeet Night",
        "baby-shower": "Baby Shower",
        "naming-ceremony": "Naming Ceremony",
        "diwali": "Diwali Festival",
        "ganesh-chaturthi": "Ganesh Chaturthi",
        "holi": "Holi Festival",
        "eid": "Eid Celebration",
        "christmas": "Christmas Party",
        "office-party": "Office Party",
        "farewell": "Farewell Party",
        "promotion": "Promotion Celebration",
        "dinner-party": "Dinner Party",
        "lunch-party": "Lunch Party",
        "brunch": "Brunch Party",
        "cocktail-party": "Cocktail Party",
        "graduation": "Graduation Ceremony",
        "anniversary": "Anniversary Celebration",
        "retirement": "Retirement Party",
        "housewarming": "Housewarming",
        "pool-party": "Pool Party",
        "new-year": "New Year Celebration",
        "valentines-day": "Valentine's Day",
    }
    occasion_label = OCCASIONS_MAP.get(occasion, occasion.replace("-", " ").title())

    if not settings.anthropic_api_key:
        return _get_default_template_spec(occasion, style)

    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    prompt = (
        f"Generate a complete design specification for a {occasion_label} invitation "
        f"card in {style} style.\n"
        'Return ONLY valid JSON:\n'
        "{\n"
        '  "title": string,\n'
        '  "layout": "portrait"|"landscape"|"square",\n'
        '  "colour_palette": [4 hex colours],\n'
        '  "fonts": {"heading": string, "body": string},\n'
        '  "layers": [{"type": "background"|"text"|"shape"|"decorative", '
        '"content": string, '
        '"position": {"x": int, "y": int, "w": int, "h": int}, '
        '"style": {}}],\n'
        '  "copy": {"headline": string, "subheading": string, "tagline": string},\n'
        '  "style_tags": [string]\n'
        "}"
    )

    response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )
    return json.loads(response.content[0].text)


def _get_default_template_spec(occasion: str, style: str) -> dict:
    """Return a hard-coded fallback spec when no API key is configured."""
    COLOUR_SCHEMES = {
        "floral": ["#E8A598", "#D4708A", "#F9E4E4", "#FFFFFF"],
        "minimal": ["#4F46E5", "#7C3AED", "#EEF2FF", "#FFFFFF"],
        "bold": ["#F59E0B", "#D97706", "#FEF3C7", "#1F2937"],
        "elegant": ["#7C3AED", "#6D28D9", "#EDE9FE", "#FFFFFF"],
        "festive": ["#E11D48", "#BE185D", "#FCE7F3", "#FFFFFF"],
    }
    palette = COLOUR_SCHEMES.get(style, COLOUR_SCHEMES["minimal"])
    title = occasion.replace("-", " ").title() + " Invitation"
    occasion_label = occasion.replace("-", " ").title()

    return {
        "title": title,
        "layout": "portrait",
        "colour_palette": palette,
        "fonts": {"heading": "Playfair Display", "body": "Inter"},
        "layers": [
            {
                "type": "background",
                "content": "",
                "position": {"x": 0, "y": 0, "w": 800, "h": 1200},
                "style": {"fill": palette[0]},
            },
            {
                "type": "text",
                "content": "You Are Invited",
                "position": {"x": 100, "y": 200, "w": 600, "h": 100},
                "style": {
                    "fontSize": 48,
                    "fill": palette[3],
                    "fontFamily": "Playfair Display",
                },
            },
            {
                "type": "text",
                "content": f"{occasion_label} Celebration",
                "position": {"x": 100, "y": 320, "w": 600, "h": 60},
                "style": {
                    "fontSize": 28,
                    "fill": palette[3],
                    "fontFamily": "Inter",
                },
            },
            {
                "type": "text",
                "content": "Date: [DATE] | Time: [TIME]\nVenue: [VENUE]",
                "position": {"x": 100, "y": 700, "w": 600, "h": 120},
                "style": {
                    "fontSize": 22,
                    "fill": palette[3],
                    "fontFamily": "Inter",
                },
            },
            {
                "type": "text",
                "content": "RSVP: [CONTACT]",
                "position": {"x": 100, "y": 1050, "w": 600, "h": 60},
                "style": {
                    "fontSize": 20,
                    "fill": palette[3],
                    "fontFamily": "Inter",
                },
            },
        ],
        "copy": {
            "headline": "You Are Invited",
            "subheading": title,
            "tagline": "Join us for this special celebration",
        },
        "style_tags": [style, "indian", "elegant"],
    }
