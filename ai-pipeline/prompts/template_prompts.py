"""
Prompt constants for DALL-E 3 and Claude (claude-sonnet-4-6) template generation.

These prompts are used by:
- services/ai_generator.py  → Claude invitation copy & design specs
- services/image_generator.py → DALL-E 3 background images
- workers/tasks.py → Batch template generation
"""

# ── Claude system prompt ──────────────────────────────────────────────────────

CLAUDE_SYSTEM_PROMPT = (
    "You are an expert invitation card designer and copywriter specializing in "
    "Indian cultural occasions. You have deep knowledge of Indian festivals, "
    "ceremonies, traditions, and aesthetics. Always respond with valid JSON only. "
    "Never include markdown code fences or explanations outside the JSON."
)

# ── Claude design spec prompt ─────────────────────────────────────────────────

TEMPLATE_SPEC_PROMPT = """Generate a complete design specification for a {occasion_label} invitation card in {style} style.

The design should be visually appealing, culturally appropriate, and print-ready.

Return ONLY valid JSON in this exact schema:
{{
  "title": "<short descriptive title>",
  "layout": "portrait" | "landscape" | "square",
  "colour_palette": ["<hex1>", "<hex2>", "<hex3>", "<hex4>"],
  "fonts": {{
    "heading": "<Google Font name>",
    "body": "<Google Font name>"
  }},
  "layers": [
    {{
      "type": "background" | "text" | "shape" | "decorative" | "image",
      "content": "<text content or empty string>",
      "position": {{"x": <int>, "y": <int>, "w": <int>, "h": <int>}},
      "style": {{
        "fill": "<hex colour>",
        "fontSize": <int>,
        "fontFamily": "<font name>",
        "fontWeight": "normal" | "bold",
        "textAlign": "left" | "center" | "right",
        "opacity": <0.0-1.0>
      }}
    }}
  ],
  "copy": {{
    "headline": "<main headline text>",
    "subheading": "<subheading text>",
    "tagline": "<short tagline>"
  }},
  "style_tags": ["<tag1>", "<tag2>", ...]
}}

Guidelines:
- Use portrait (800×1200) for most invitations
- Use landscape (1200×628) for parties and casual events
- Layer positions assume portrait: x 0-800, y 0-1200
- Include at minimum: background, headline text, event details text, RSVP text
- Colour palette: first colour = primary/background, fourth = text on primary
- Fonts: use Google Fonts (Playfair Display, Cinzel, Dancing Script, Inter, Poppins, etc.)
- style_tags: 3-5 descriptive tags (e.g. "floral", "minimal", "indian", "traditional")
"""

# ── Claude invitation copy prompt ─────────────────────────────────────────────

INVITATION_COPY_PROMPT = """Generate beautiful invitation text for a {occasion} celebration.

Host: {host_name}
Date: {event_date}
Venue: {venue}
Tone: {tone}
Language: {language}
Additional context: {additional_context}

Return ONLY valid JSON with exactly these keys:
{{
  "headline": "<compelling headline — max 60 chars>",
  "subheading": "<subheading — max 80 chars>",
  "body": "<body copy — 2-3 sentences, warm and inviting>",
  "rsvp_line": "<RSVP instructions — max 60 chars>",
  "tagline": "<short tagline — max 40 chars>"
}}

Guidelines:
- Keep text concise — invitations are scanned, not read
- If language is not English, write the copy in that language using proper Unicode
- Maintain cultural sensitivity and regional idioms
- Tone variants: warm = heartfelt, formal = professional, fun = energetic, elegant = sophisticated
- For Indian occasions: use appropriate honorifics and cultural references
"""

# ── Claude colour palette prompt ──────────────────────────────────────────────

COLOUR_PALETTE_PROMPT = """Suggest 3 beautiful colour palettes for a {occasion} invitation card with a {mood} mood.

Return ONLY a valid JSON array with exactly 3 palette objects:
[
  {{
    "name": "<palette name — evocative, 2-3 words>",
    "palette": ["<hex1>", "<hex2>", "<hex3>", "<hex4>"]
  }},
  ...
]

Palette rules:
- Each palette has exactly 4 hex colours
- Colour order: [primary/background, secondary/accent, light/tint, text/contrast]
- Ensure sufficient contrast between primary and text colours (WCAG AA)
- Use vibrant, culturally appropriate Indian aesthetic when relevant
- Named palettes: e.g. "Royal Marigold", "Midnight Rose", "Ocean Breeze"
"""

# ── Claude translation prompt ─────────────────────────────────────────────────

TRANSLATION_PROMPT = """Translate the following invitation card text layers to {target_language}.

Maintain:
- Cultural appropriateness for the target language/region
- The same emotional tone and formality level
- Reasonable text length (avoid very long translations that won't fit the card)
- Proper Unicode encoding

Text layers (JSON array): {text_layers}

Return ONLY a JSON array of translated strings in the same order as the input.
Each translated string should correspond to the input string at the same index.
"""

# ── DALL-E 3 background image prompts ────────────────────────────────────────

DALLE_BACKGROUND_PROMPT = (
    "A beautiful {style} digital invitation card background for a {occasion_label} event. "
    "Indian aesthetic with {colour_desc}. "
    "No text, no borders, no frames — pure decorative background illustration. "
    "High quality, elegant, artistic. "
    "Style: {art_style}. "
    "Aspect ratio: square (1:1). Ultra detailed."
)

# Per-occasion art style hints for DALL-E prompts
OCCASION_ART_STYLES = {
    "birthday-kids":       "watercolor illustration, pastel tones, cartoon elements, balloons",
    "birthday-adult":      "art deco, geometric patterns, metallic accents",
    "birthday-milestone":  "elegant watercolor florals, gold leaf accents",
    "wedding":             "romantic watercolor florals, mandala patterns, soft bokeh",
    "engagement":          "delicate floral watercolor, rose petals, gold accents",
    "mehendi":             "intricate henna mehndi patterns, terracotta and gold",
    "sangeet":             "vibrant folk art, musical motifs, jewel tones",
    "baby-shower":         "soft pastel watercolors, cute animals, gentle florals",
    "naming-ceremony":     "traditional rangoli patterns, marigold garlands",
    "diwali":              "glowing diyas, geometric rangoli, warm amber tones",
    "ganesh-chaturthi":    "traditional modak motifs, orange marigolds, mandala art",
    "holi":                "colorful powder explosions, watercolor splashes",
    "eid":                 "crescent moon, lanterns, geometric Islamic patterns",
    "christmas":           "pine branches, fairy lights, snowflakes, red and green",
    "office-party":        "modern geometric abstract, corporate blues and greys",
    "farewell":            "soft watercolor sunset, abstract departing motifs",
    "promotion":           "upward arrow motifs, confetti, celebratory abstract",
    "dinner-party":        "elegant table setting illustration, candlelit ambience",
    "lunch-party":         "bright citrus tones, fresh floral centerpiece",
    "brunch":              "soft morning light, botanical leaves, pastel abstract",
    "cocktail-party":      "art deco geometric, metallic shimmer, dark luxury tones",
    "graduation":          "academic motifs, mortarboard, laurel wreath, navy and gold",
    "anniversary":         "romantic roses, silver/gold wedding rings, soft bokeh",
    "retirement":          "peaceful sunset landscape, golden tones, subtle confetti",
    "housewarming":        "traditional kolam/rangoli floor art, marigold garlands",
    "pool-party":          "tropical leaves, waves, bright turquoise and coral",
    "new-year":            "fireworks bokeh, gold confetti, midnight blue sky",
    "valentines-day":      "romantic roses, hearts, deep red and pink watercolor",
}

# ── Claude quality-check prompt ───────────────────────────────────────────────

QUALITY_CHECK_PROMPT = """You are reviewing an invitation card design for quality.

Template ID: {template_id}
Canvas JSON summary: {fabric_json_summary}

Rate the design on a scale of 1-10 for each dimension and provide a JSON response:
{{
  "visual_appeal": <1-10>,
  "readability": <1-10>,
  "cultural_accuracy": <1-10>,
  "occasion_fit": <1-10>,
  "improvement_suggestion": "<one specific actionable suggestion or null>"
}}

Scoring criteria:
- visual_appeal: overall aesthetic, colour harmony, layout balance
- readability: text contrast, font size, spacing
- cultural_accuracy: appropriate use of cultural symbols, colours, language
- occasion_fit: design matches the occasion type and formality
- improvement_suggestion: most impactful single change to improve the design
"""
