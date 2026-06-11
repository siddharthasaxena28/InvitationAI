import asyncio
import httpx
import uuid
import io
import logging
from config import get_settings
from services.storage import StorageService

logger = logging.getLogger(__name__)
storage = StorageService()


async def generate_template_background(
    occasion: str, style_tags: list[str], colour_palette: list[str]
) -> str:
    """
    Generate background image using DALL-E 3, upload to S3/MinIO, return URL.
    Falls back to a solid-colour placeholder when openai_api_key is not set.
    """
    settings = get_settings()

    if not settings.openai_api_key:
        return await _generate_placeholder_background(colour_palette)

    try:
        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=settings.openai_api_key)
        style_desc = ", ".join(style_tags) if style_tags else "elegant"
        colour_desc = (
            "with colours " + ", ".join(colour_palette[:2])
            if colour_palette
            else ""
        )
        prompt = (
            f"A beautiful {style_desc} digital invitation card background for "
            f"{occasion}. "
            f"Indian aesthetic, {colour_desc}. "
            "No text, no borders, pure background illustration. "
            "Elegant and artistic."
        )
        response = await client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        image_url = response.data[0].url
        async with httpx.AsyncClient(timeout=30) as http_client:
            img_response = await http_client.get(image_url)
            img_bytes = img_response.content

        key = f"templates/backgrounds/{uuid.uuid4()}.png"
        url = await storage.upload_bytes(img_bytes, key, "image/png")
        return url

    except Exception as e:
        logger.error(f"DALL-E generation failed: {e}, falling back to placeholder")
        return await _generate_placeholder_background(colour_palette)


async def _generate_placeholder_background(colour_palette: list[str]) -> str:
    """Create a solid-colour placeholder PNG and upload it."""
    from PIL import Image

    color_hex = colour_palette[0] if colour_palette else "#4F46E5"
    try:
        r = int(color_hex[1:3], 16)
        g = int(color_hex[3:5], 16)
        b = int(color_hex[5:7], 16)
    except (ValueError, IndexError):
        r, g, b = 79, 70, 229  # default indigo

    img = Image.new("RGB", (1024, 1024), (r, g, b))
    buf = io.BytesIO()
    img.save(buf, "PNG")
    key = f"templates/backgrounds/{uuid.uuid4()}.png"
    url = await storage.upload_bytes(buf.getvalue(), key, "image/png")
    return url
