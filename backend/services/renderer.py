from PIL import Image, ImageDraw, ImageFont
import io
import asyncio
from reportlab.pdfgen import canvas as pdf_canvas
from reportlab.lib.pagesizes import A4, landscape as rl_landscape
from reportlab.lib.utils import ImageReader


class RendererService:
    """Pillow-based invitation card renderer supporting Fabric.js canvas JSON."""

    async def render_preview(
        self, fabric_json: dict, orientation: str = "portrait"
    ) -> bytes:
        """Render watermarked 1080px PNG from Fabric.js JSON."""
        img = await self._render_canvas(fabric_json, orientation, scale=1.0)
        img = self._add_watermark(img)
        return self._to_png_bytes(img)

    async def render_hd_png(
        self, fabric_json: dict, orientation: str = "portrait"
    ) -> bytes:
        """Render HD 3x resolution PNG (no watermark)."""
        img = await self._render_canvas(fabric_json, orientation, scale=3.0)
        return self._to_png_bytes(img)

    def render_pdf(self, png_bytes: bytes, orientation: str = "portrait") -> bytes:
        """Wrap PNG in A4 PDF using ReportLab."""
        buf = io.BytesIO()
        pagesize = rl_landscape(A4) if orientation == "landscape" else A4
        c = pdf_canvas.Canvas(buf, pagesize=pagesize)
        img_reader = ImageReader(io.BytesIO(png_bytes))
        c.drawImage(
            img_reader, 0, 0, *pagesize, preserveAspectRatio=True, anchor="c"
        )
        c.save()
        return buf.getvalue()

    async def _render_canvas(
        self, fabric_json: dict, orientation: str, scale: float
    ) -> Image.Image:
        """Parse Fabric.js JSON and composite layers using Pillow."""
        base_w = 800 if orientation == "portrait" else 1200
        base_h = 1200 if orientation == "portrait" else 628
        w, h = int(base_w * scale), int(base_h * scale)

        bg_color = fabric_json.get("background", "#FFFFFF")
        bg_color = bg_color if bg_color else "#FFFFFF"
        img = Image.new("RGBA", (w, h), self._hex_to_rgba(bg_color))

        objects = fabric_json.get("objects", [])
        for obj in objects:
            await self._render_object(img, obj, scale)

        return img.convert("RGB")

    async def _render_object(
        self, img: Image.Image, obj: dict, scale: float
    ) -> None:
        """Render a single Fabric.js object onto the canvas."""
        obj_type = obj.get("type", "")
        left = int(obj.get("left", 0) * scale)
        top = int(obj.get("top", 0) * scale)

        if obj_type == "rect":
            w = int(obj.get("width", 100) * scale)
            h = int(obj.get("height", 100) * scale)
            fill = obj.get("fill", "#CCCCCC") or "#CCCCCC"
            rx = int(obj.get("rx", 0) * scale)
            overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
            draw = ImageDraw.Draw(overlay)
            rgba = self._hex_to_rgba(fill)
            if rx > 0:
                draw.rounded_rectangle(
                    [left, top, left + w, top + h], radius=rx, fill=rgba
                )
            else:
                draw.rectangle([left, top, left + w, top + h], fill=rgba)
            img.paste(
                Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGBA"),
                (0, 0),
            )

        elif obj_type in ("text", "textbox", "i-text"):
            text = obj.get("text", "")
            fill = obj.get("fill", "#000000") or "#000000"
            font_size = max(8, int(obj.get("fontSize", 24) * scale))
            text_align = obj.get("textAlign", "left")
            text_width = int(obj.get("width", 600) * scale)

            draw = ImageDraw.Draw(img)
            font = self._load_font(font_size)
            text_color = self._hex_to_rgba(fill)

            # Handle multiline text
            lines = text.split("\n")
            line_y = top
            for line in lines:
                if text_align == "center":
                    try:
                        bbox = draw.textbbox((0, 0), line, font=font)
                        line_w = bbox[2] - bbox[0]
                    except Exception:
                        line_w = len(line) * font_size // 2
                    x = left + max(0, (text_width - line_w) // 2)
                else:
                    x = left
                draw.text((x, line_y), line, fill=text_color, font=font)
                line_y += font_size + int(4 * scale)

        elif obj_type == "circle":
            radius = int(obj.get("radius", 50) * scale)
            fill = obj.get("fill", "#CCCCCC") or "#CCCCCC"
            overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
            draw = ImageDraw.Draw(overlay)
            draw.ellipse(
                [left - radius, top - radius, left + radius, top + radius],
                fill=self._hex_to_rgba(fill),
            )
            img.paste(
                Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGBA"),
                (0, 0),
            )

        elif obj_type == "image":
            src = obj.get("src", "")
            if src and src.startswith("http"):
                try:
                    import httpx

                    async with httpx.AsyncClient(timeout=10) as client:
                        resp = await client.get(src)
                    if resp.status_code == 200:
                        src_img = Image.open(io.BytesIO(resp.content)).convert("RGBA")
                        scale_x = obj.get("scaleX", 1.0)
                        scale_y = obj.get("scaleY", 1.0)
                        new_w = int(src_img.width * scale_x * scale)
                        new_h = int(src_img.height * scale_y * scale)
                        if new_w > 0 and new_h > 0:
                            src_img = src_img.resize((new_w, new_h), Image.LANCZOS)
                        img_canvas = img.convert("RGBA")
                        img_canvas.paste(src_img, (left, top), src_img)
                        img.paste(img_canvas.convert("RGBA"), (0, 0))
                except Exception:
                    pass  # skip failed image loads gracefully

    def _add_watermark(self, img: Image.Image) -> Image.Image:
        """Add diagonal watermark text to the image."""
        watermark = Image.new("RGBA", img.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(watermark)
        text = "InviteAI • inviteai.in"
        font = self._load_font(36)

        x1, y1 = img.size[0] // 6, img.size[1] // 3
        x2, y2 = img.size[0] // 6, img.size[1] * 2 // 3
        draw.text((x1, y1), text, fill=(255, 255, 255, 80), font=font)
        draw.text((x2, y2), text, fill=(255, 255, 255, 80), font=font)

        combined = Image.alpha_composite(img.convert("RGBA"), watermark)
        return combined.convert("RGB")

    def _to_png_bytes(self, img: Image.Image) -> bytes:
        buf = io.BytesIO()
        img.save(buf, format="PNG", optimize=True)
        return buf.getvalue()

    @staticmethod
    def _hex_to_rgba(hex_color: str, alpha: int = 255):
        """Convert #RRGGBB or #RGB hex string to (R, G, B, A) tuple."""
        hex_color = hex_color.strip().lstrip("#")
        if len(hex_color) == 3:
            hex_color = "".join(c * 2 for c in hex_color)
        if len(hex_color) == 6:
            r = int(hex_color[0:2], 16)
            g = int(hex_color[2:4], 16)
            b = int(hex_color[4:6], 16)
            return (r, g, b, alpha)
        return (200, 200, 200, alpha)  # fallback grey

    @staticmethod
    def _load_font(size: int) -> ImageFont.FreeTypeFont:
        """Try to load DejaVu font, fall back to default."""
        font_paths = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/dejavu/DejaVuSans.ttf",
        ]
        for path in font_paths:
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
        return ImageFont.load_default()
