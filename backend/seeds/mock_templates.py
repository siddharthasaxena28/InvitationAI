"""
Mock template seed data covering 12 occasions × 2-3 styles each = 30 templates.
Each template contains a full Fabric.js 5.x canvas JSON structure.
"""

# ── Colour palettes ───────────────────────────────────────────────────────────
INDIGO  = ["#4F46E5", "#7C3AED", "#EEF2FF", "#FFFFFF"]
ROSE    = ["#E11D48", "#BE185D", "#FCE7F3", "#FFFFFF"]
AMBER   = ["#F59E0B", "#D97706", "#FEF3C7", "#1F2937"]
EMERALD = ["#059669", "#047857", "#ECFDF5", "#FFFFFF"]
VIOLET  = ["#7C3AED", "#6D28D9", "#EDE9FE", "#FFFFFF"]


def _make_fabric(
    bg_color: str,
    headline: str,
    subtitle: str,
    details_text: str,
    rsvp_text: str = "RSVP: [Your Contact]",
    accent_color: str = "#FFFFFF",
    body_color: str = "#F0F0FF",
    orientation: str = "portrait",
) -> dict:
    """Build a Fabric.js 5.x canvas JSON with 5 text layers."""
    w, h = (800, 1200) if orientation == "portrait" else (1200, 628)
    mid_y = h // 2

    objects = [
        # Background rect
        {
            "type": "rect",
            "version": "5.5.2",
            "left": 0, "top": 0,
            "width": w, "height": h,
            "fill": bg_color,
            "selectable": False, "evented": False,
        },
        # Decorative top bar
        {
            "type": "rect",
            "version": "5.5.2",
            "left": 0, "top": 0,
            "width": w, "height": 12,
            "fill": accent_color,
            "opacity": 0.6,
            "selectable": False, "evented": False,
        },
        # Headline
        {
            "type": "textbox",
            "version": "5.5.2",
            "left": 80, "top": int(h * 0.12),
            "width": w - 160, "height": 130,
            "text": headline,
            "fontSize": 52,
            "fontFamily": "Playfair Display",
            "fill": accent_color,
            "textAlign": "center",
            "fontWeight": "bold",
            "editable": True,
        },
        # Subtitle
        {
            "type": "textbox",
            "version": "5.5.2",
            "left": 80, "top": int(h * 0.12) + 145,
            "width": w - 160, "height": 70,
            "text": subtitle,
            "fontSize": 28,
            "fontFamily": "Inter",
            "fill": body_color,
            "textAlign": "center",
            "editable": True,
        },
        # Decorative divider
        {
            "type": "rect",
            "version": "5.5.2",
            "left": w // 4, "top": mid_y - 20,
            "width": w // 2, "height": 2,
            "fill": accent_color,
            "opacity": 0.4,
            "selectable": False, "evented": False,
        },
        # Event details
        {
            "type": "textbox",
            "version": "5.5.2",
            "left": 80, "top": mid_y + 20,
            "width": w - 160, "height": 120,
            "text": details_text,
            "fontSize": 22,
            "fontFamily": "Inter",
            "fill": accent_color,
            "textAlign": "center",
            "editable": True,
        },
        # RSVP line
        {
            "type": "textbox",
            "version": "5.5.2",
            "left": 80, "top": h - 160,
            "width": w - 160, "height": 60,
            "text": rsvp_text,
            "fontSize": 20,
            "fontFamily": "Inter",
            "fill": body_color,
            "textAlign": "center",
            "editable": True,
        },
        # Bottom accent bar
        {
            "type": "rect",
            "version": "5.5.2",
            "left": 0, "top": h - 12,
            "width": w, "height": 12,
            "fill": accent_color,
            "opacity": 0.6,
            "selectable": False, "evented": False,
        },
    ]

    return {
        "version": "5.5.2",
        "objects": objects,
        "background": bg_color,
    }


# ── Templates list ────────────────────────────────────────────────────────────

MOCK_TEMPLATES = [

    # ── Birthday Kids ─────────────────────────────────────────────────────────
    {
        "occasion_slug": "birthday-kids",
        "title": "Magical Birthday Party",
        "style_tags": ["colorful", "playful", "kids"],
        "colour_palette": ROSE,
        "orientation": "portrait",
        "price_inr": 0,
        "ai_prompt": "birthday-kids colorful playful style",
        "fabric_json": _make_fabric(
            bg_color=ROSE[0],
            headline="🎉 Birthday Party! 🎉",
            subtitle="It's Time to Celebrate!",
            details_text="📅 Date: [Enter Date]\n🕐 Time: [Enter Time]\n📍 Venue: [Enter Venue]",
            rsvp_text="RSVP: [Parent's Contact]",
            accent_color=ROSE[3],
            body_color=ROSE[2],
        ),
    },
    {
        "occasion_slug": "birthday-kids",
        "title": "Rainbow Fun Birthday",
        "style_tags": ["rainbow", "fun", "kids", "bold"],
        "colour_palette": AMBER,
        "orientation": "portrait",
        "price_inr": 29,
        "ai_prompt": "birthday-kids rainbow fun bold",
        "fabric_json": _make_fabric(
            bg_color=AMBER[0],
            headline="🌈 Happy Birthday! 🌈",
            subtitle="Join the Fun & Celebration",
            details_text="📅 Date: [Enter Date]\n🕐 Time: [Enter Time]\n📍 Venue: [Enter Venue]",
            rsvp_text="RSVP: [Contact Number]",
            accent_color=AMBER[3],
            body_color="#FFFFFF",
        ),
    },
    {
        "occasion_slug": "birthday-kids",
        "title": "Princess & Prince Birthday",
        "style_tags": ["royal", "princess", "kids", "elegant"],
        "colour_palette": VIOLET,
        "orientation": "portrait",
        "price_inr": 49,
        "ai_prompt": "birthday-kids royal elegant princess",
        "fabric_json": _make_fabric(
            bg_color=VIOLET[0],
            headline="👑 Royal Birthday Bash 👑",
            subtitle="You're Invited to the Castle!",
            details_text="📅 Date: [Enter Date]\n🕐 Time: [Enter Time]\n📍 Venue: [Enter Venue]",
            rsvp_text="RSVP: [Parent Contact]",
            accent_color=VIOLET[3],
            body_color=VIOLET[2],
        ),
    },

    # ── Birthday Adult ────────────────────────────────────────────────────────
    {
        "occasion_slug": "birthday-adult",
        "title": "Sophisticated Birthday Soirée",
        "style_tags": ["elegant", "minimal", "adult"],
        "colour_palette": INDIGO,
        "orientation": "portrait",
        "price_inr": 49,
        "ai_prompt": "birthday-adult elegant minimal",
        "fabric_json": _make_fabric(
            bg_color=INDIGO[0],
            headline="You Are Invited",
            subtitle="Birthday Celebration",
            details_text="📅 Date: [Enter Date]\n🕐 Time: [Enter Time]\n📍 Venue: [Enter Venue]",
            rsvp_text="Kindly RSVP by [Date] · [Contact]",
            accent_color=INDIGO[3],
            body_color=INDIGO[2],
        ),
    },
    {
        "occasion_slug": "birthday-adult",
        "title": "Gatsby Birthday Night",
        "style_tags": ["gatsby", "luxury", "adult", "bold"],
        "colour_palette": AMBER,
        "orientation": "landscape",
        "price_inr": 99,
        "ai_prompt": "birthday-adult gatsby luxury bold",
        "fabric_json": _make_fabric(
            bg_color=AMBER[3],
            headline="✨ The Great Birthday ✨",
            subtitle="An Evening of Elegance & Celebration",
            details_text="📅 Date: [Enter Date]  ·  🕐 Time: [Enter Time]\n📍 Venue: [Enter Venue]",
            rsvp_text="Black Tie Preferred · RSVP: [Contact]",
            accent_color=AMBER[0],
            body_color=AMBER[2],
            orientation="landscape",
        ),
    },

    # ── Wedding ───────────────────────────────────────────────────────────────
    {
        "occasion_slug": "wedding",
        "title": "Classic Wedding Invitation",
        "style_tags": ["classic", "elegant", "floral", "wedding"],
        "colour_palette": ROSE,
        "orientation": "portrait",
        "price_inr": 99,
        "ai_prompt": "wedding classic elegant floral",
        "fabric_json": _make_fabric(
            bg_color=ROSE[2],
            headline="Together Forever",
            subtitle="[Bride's Name] & [Groom's Name]",
            details_text=(
                "Request the pleasure of your company\nat their wedding celebration\n\n"
                "📅 [Date]  ·  🕐 [Time]\n📍 [Venue]"
            ),
            rsvp_text="RSVP by [Date] · [Contact]",
            accent_color=ROSE[1],
            body_color=ROSE[0],
        ),
    },
    {
        "occasion_slug": "wedding",
        "title": "Royal Hindu Wedding",
        "style_tags": ["royal", "traditional", "hindu", "wedding"],
        "colour_palette": AMBER,
        "orientation": "portrait",
        "price_inr": 99,
        "ai_prompt": "wedding royal traditional hindu",
        "fabric_json": _make_fabric(
            bg_color=AMBER[0],
            headline="🪷 Shubh Vivah 🪷",
            subtitle="[Dulhan] weds [Dulha]",
            details_text=(
                "With the blessings of our families,\nwe invite you to our wedding\n\n"
                "📅 [Date]  ·  🕐 [Muhurat Time]\n📍 [Venue & Address]"
            ),
            rsvp_text="RSVP: [Family Contact]",
            accent_color="#FFFFFF",
            body_color=AMBER[2],
        ),
    },
    {
        "occasion_slug": "wedding",
        "title": "Minimalist Modern Wedding",
        "style_tags": ["minimal", "modern", "clean", "wedding"],
        "colour_palette": INDIGO,
        "orientation": "portrait",
        "price_inr": 49,
        "ai_prompt": "wedding minimal modern clean",
        "fabric_json": _make_fabric(
            bg_color="#F8F8FF",
            headline="We're Getting Married",
            subtitle="[Name] & [Name]",
            details_text="Date: [Enter Date]\nTime: [Enter Time]\nVenue: [Enter Venue]",
            rsvp_text="RSVP: [Contact Details]",
            accent_color=INDIGO[0],
            body_color=INDIGO[1],
        ),
    },

    # ── Engagement ────────────────────────────────────────────────────────────
    {
        "occasion_slug": "engagement",
        "title": "Rose Gold Engagement",
        "style_tags": ["rose-gold", "romantic", "engagement"],
        "colour_palette": ROSE,
        "orientation": "portrait",
        "price_inr": 49,
        "ai_prompt": "engagement rose gold romantic",
        "fabric_json": _make_fabric(
            bg_color=ROSE[0],
            headline="💍 We're Engaged! 💍",
            subtitle="[Name] & [Name]",
            details_text=(
                "Join us to celebrate our engagement\n\n"
                "📅 Date: [Enter Date]\n🕐 Time: [Enter Time]\n📍 Venue: [Enter Venue]"
            ),
            rsvp_text="RSVP: [Contact]",
            accent_color="#FFFFFF",
            body_color=ROSE[2],
        ),
    },
    {
        "occasion_slug": "engagement",
        "title": "Royal Engagement Ceremony",
        "style_tags": ["royal", "elegant", "engagement", "indian"],
        "colour_palette": VIOLET,
        "orientation": "portrait",
        "price_inr": 99,
        "ai_prompt": "engagement royal elegant indian",
        "fabric_json": _make_fabric(
            bg_color=VIOLET[0],
            headline="🌸 Sagai Samaroh 🌸",
            subtitle="[Name] & [Name]",
            details_text=(
                "We joyfully announce our engagement\n\n"
                "📅 Date: [Enter Date]\n🕐 Time: [Enter Time]\n📍 Venue: [Enter Venue]"
            ),
            rsvp_text="RSVP: [Contact Number]",
            accent_color="#FFFFFF",
            body_color=VIOLET[2],
        ),
    },

    # ── Diwali ────────────────────────────────────────────────────────────────
    {
        "occasion_slug": "diwali",
        "title": "Diwali Diyas & Lights",
        "style_tags": ["festive", "traditional", "diwali", "indian"],
        "colour_palette": AMBER,
        "orientation": "portrait",
        "price_inr": 0,
        "ai_prompt": "diwali festive traditional",
        "fabric_json": _make_fabric(
            bg_color=AMBER[3],
            headline="🪔 Happy Diwali! 🪔",
            subtitle="Festival of Lights Celebration",
            details_text=(
                "You are cordially invited\nto celebrate Diwali with us\n\n"
                "📅 Date: [Enter Date]\n🕐 Time: [Enter Time]\n📍 Venue: [Enter Venue]"
            ),
            rsvp_text="RSVP: [Contact]",
            accent_color=AMBER[0],
            body_color=AMBER[2],
        ),
    },
    {
        "occasion_slug": "diwali",
        "title": "Diwali Puja & Dinner",
        "style_tags": ["puja", "dinner", "diwali", "elegant"],
        "colour_palette": ROSE,
        "orientation": "landscape",
        "price_inr": 49,
        "ai_prompt": "diwali puja dinner elegant",
        "fabric_json": _make_fabric(
            bg_color=ROSE[0],
            headline="🕯️ Diwali Puja & Dinner 🕯️",
            subtitle="Celebrate the Festival of Lights",
            details_text="📅 [Date]  ·  🕐 [Time]  ·  📍 [Venue]",
            rsvp_text="RSVP: [Contact Number]",
            accent_color="#FFF",
            body_color=ROSE[2],
            orientation="landscape",
        ),
    },

    # ── Holi ──────────────────────────────────────────────────────────────────
    {
        "occasion_slug": "holi",
        "title": "Rang Barse Holi Party",
        "style_tags": ["colorful", "festive", "holi", "fun"],
        "colour_palette": ROSE,
        "orientation": "portrait",
        "price_inr": 0,
        "ai_prompt": "holi colorful festive fun",
        "fabric_json": _make_fabric(
            bg_color="#FF6B35",
            headline="🎨 Happy Holi! 🎨",
            subtitle="Rang Barse — Colours & Joy",
            details_text=(
                "Come get drenched in colours!\n\n"
                "📅 Date: [Enter Date]\n🕐 Time: [Enter Time]\n📍 Venue: [Enter Venue]"
            ),
            rsvp_text="RSVP: [Contact] · Wear white!",
            accent_color="#FFFFFF",
            body_color="#FFF3E0",
        ),
    },
    {
        "occasion_slug": "holi",
        "title": "Holi Brunch & Celebrations",
        "style_tags": ["brunch", "holi", "modern", "colorful"],
        "colour_palette": EMERALD,
        "orientation": "landscape",
        "price_inr": 29,
        "ai_prompt": "holi brunch modern",
        "fabric_json": _make_fabric(
            bg_color=EMERALD[0],
            headline="🌈 Holi Brunch Party 🌈",
            subtitle="Colours, Gulal & Good Food",
            details_text="📅 [Date]  ·  🕐 [Time]  ·  📍 [Venue]",
            rsvp_text="RSVP: [Contact]",
            accent_color="#FFFFFF",
            body_color=EMERALD[2],
            orientation="landscape",
        ),
    },

    # ── Graduation ────────────────────────────────────────────────────────────
    {
        "occasion_slug": "graduation",
        "title": "Graduation Ceremony",
        "style_tags": ["formal", "graduation", "academic"],
        "colour_palette": INDIGO,
        "orientation": "portrait",
        "price_inr": 29,
        "ai_prompt": "graduation formal academic",
        "fabric_json": _make_fabric(
            bg_color=INDIGO[0],
            headline="🎓 Congratulations!",
            subtitle="Graduation Celebration",
            details_text=(
                "[Graduate's Name] has graduated from\n[Institution Name]\n\n"
                "📅 Date: [Enter Date]\n🕐 Time: [Enter Time]\n📍 Venue: [Enter Venue]"
            ),
            rsvp_text="RSVP: [Contact]",
            accent_color="#FFFFFF",
            body_color=INDIGO[2],
        ),
    },
    {
        "occasion_slug": "graduation",
        "title": "Class of 2026 — The Journey Continues",
        "style_tags": ["modern", "graduation", "bold", "minimal"],
        "colour_palette": EMERALD,
        "orientation": "portrait",
        "price_inr": 49,
        "ai_prompt": "graduation modern bold minimal",
        "fabric_json": _make_fabric(
            bg_color=EMERALD[0],
            headline="Class of 2026 🎓",
            subtitle="Graduation Party",
            details_text=(
                "Join us to celebrate this milestone\n\n"
                "📅 Date: [Enter Date]\n🕐 Time: [Enter Time]\n📍 Venue: [Enter Venue]"
            ),
            rsvp_text="RSVP: [Contact]",
            accent_color="#FFFFFF",
            body_color=EMERALD[2],
        ),
    },

    # ── Anniversary ───────────────────────────────────────────────────────────
    {
        "occasion_slug": "anniversary",
        "title": "Silver Anniversary Celebration",
        "style_tags": ["silver", "elegant", "anniversary", "romantic"],
        "colour_palette": INDIGO,
        "orientation": "portrait",
        "price_inr": 49,
        "ai_prompt": "anniversary silver elegant romantic",
        "fabric_json": _make_fabric(
            bg_color=INDIGO[0],
            headline="25 Years of Love ❤️",
            subtitle="Silver Wedding Anniversary",
            details_text=(
                "[Name] & [Name]\ncelebrate 25 beautiful years together\n\n"
                "📅 Date: [Enter Date]\n🕐 Time: [Enter Time]\n📍 Venue: [Enter Venue]"
            ),
            rsvp_text="RSVP: [Contact]",
            accent_color="#C0C0C0",
            body_color=INDIGO[2],
        ),
    },
    {
        "occasion_slug": "anniversary",
        "title": "Golden Anniversary Gala",
        "style_tags": ["golden", "luxury", "anniversary", "elegant"],
        "colour_palette": AMBER,
        "orientation": "portrait",
        "price_inr": 99,
        "ai_prompt": "anniversary golden luxury elegant",
        "fabric_json": _make_fabric(
            bg_color=AMBER[3],
            headline="50 Years — Golden Jubilee 🥂",
            subtitle="Wedding Anniversary Celebration",
            details_text=(
                "Join us as [Name] & [Name]\ncelebrate 50 years of togetherness\n\n"
                "📅 Date: [Enter Date]\n🕐 Time: [Enter Time]\n📍 Venue: [Enter Venue]"
            ),
            rsvp_text="RSVP: [Contact] · Formal Attire",
            accent_color=AMBER[0],
            body_color=AMBER[2],
        ),
    },

    # ── Office Party ──────────────────────────────────────────────────────────
    {
        "occasion_slug": "office-party",
        "title": "Annual Office Celebration",
        "style_tags": ["corporate", "professional", "office", "minimal"],
        "colour_palette": INDIGO,
        "orientation": "landscape",
        "price_inr": 0,
        "ai_prompt": "office-party corporate professional minimal",
        "fabric_json": _make_fabric(
            bg_color=INDIGO[0],
            headline="🎊 Annual Office Party 🎊",
            subtitle="[Company Name] Year-End Celebration",
            details_text="📅 [Date]  ·  🕐 [Time]  ·  📍 [Venue]",
            rsvp_text="RSVP to HR by [Date]",
            accent_color="#FFFFFF",
            body_color=INDIGO[2],
            orientation="landscape",
        ),
    },
    {
        "occasion_slug": "office-party",
        "title": "Team Achievement Party",
        "style_tags": ["team", "achievement", "office", "fun"],
        "colour_palette": EMERALD,
        "orientation": "landscape",
        "price_inr": 29,
        "ai_prompt": "office-party team achievement fun",
        "fabric_json": _make_fabric(
            bg_color=EMERALD[0],
            headline="🏆 Celebrating Our Team! 🏆",
            subtitle="[Team Name] Achievement Party",
            details_text="📅 [Date]  ·  🕐 [Time]  ·  📍 [Venue]",
            rsvp_text="RSVP: [Organiser]",
            accent_color="#FFFFFF",
            body_color=EMERALD[2],
            orientation="landscape",
        ),
    },

    # ── Farewell ──────────────────────────────────────────────────────────────
    {
        "occasion_slug": "farewell",
        "title": "Farewell & Best Wishes",
        "style_tags": ["farewell", "warm", "corporate", "minimal"],
        "colour_palette": VIOLET,
        "orientation": "portrait",
        "price_inr": 0,
        "ai_prompt": "farewell warm minimal",
        "fabric_json": _make_fabric(
            bg_color=VIOLET[0],
            headline="👋 Farewell, [Name]!",
            subtitle="Wishing You the Very Best",
            details_text=(
                "Join us to bid farewell\nand celebrate the journey ahead\n\n"
                "📅 Date: [Enter Date]\n🕐 Time: [Enter Time]\n📍 Venue: [Enter Venue]"
            ),
            rsvp_text="RSVP: [Organiser Contact]",
            accent_color="#FFFFFF",
            body_color=VIOLET[2],
        ),
    },
    {
        "occasion_slug": "farewell",
        "title": "Until We Meet Again",
        "style_tags": ["farewell", "emotional", "elegant"],
        "colour_palette": ROSE,
        "orientation": "portrait",
        "price_inr": 29,
        "ai_prompt": "farewell emotional elegant",
        "fabric_json": _make_fabric(
            bg_color=ROSE[0],
            headline="Until We Meet Again 🌟",
            subtitle="A Farewell Celebration for [Name]",
            details_text=(
                "Let's gather one last time\nto celebrate and reminisce\n\n"
                "📅 Date: [Enter Date]\n🕐 Time: [Enter Time]\n📍 Venue: [Enter Venue]"
            ),
            rsvp_text="RSVP: [Contact]",
            accent_color="#FFFFFF",
            body_color=ROSE[2],
        ),
    },

    # ── Dinner Party ──────────────────────────────────────────────────────────
    {
        "occasion_slug": "dinner-party",
        "title": "Intimate Dinner Soirée",
        "style_tags": ["dinner", "intimate", "elegant", "minimal"],
        "colour_palette": AMBER,
        "orientation": "landscape",
        "price_inr": 49,
        "ai_prompt": "dinner-party intimate elegant minimal",
        "fabric_json": _make_fabric(
            bg_color=AMBER[3],
            headline="🍽️ Dinner Soirée",
            subtitle="An Evening of Fine Dining",
            details_text="📅 [Date]  ·  🕐 [Time]  ·  📍 [Venue]",
            rsvp_text="RSVP by [Date] · Smart Casual",
            accent_color=AMBER[0],
            body_color=AMBER[2],
            orientation="landscape",
        ),
    },
    {
        "occasion_slug": "dinner-party",
        "title": "Garden Dinner Party",
        "style_tags": ["garden", "outdoor", "dinner", "fresh"],
        "colour_palette": EMERALD,
        "orientation": "landscape",
        "price_inr": 29,
        "ai_prompt": "dinner-party garden outdoor fresh",
        "fabric_json": _make_fabric(
            bg_color=EMERALD[0],
            headline="🌿 Garden Dinner Party 🌿",
            subtitle="An Evening Under the Stars",
            details_text="📅 [Date]  ·  🕐 [Time]  ·  📍 [Garden Venue]",
            rsvp_text="RSVP: [Contact] · Casual Attire",
            accent_color="#FFFFFF",
            body_color=EMERALD[2],
            orientation="landscape",
        ),
    },

    # ── New Year ──────────────────────────────────────────────────────────────
    {
        "occasion_slug": "new-year",
        "title": "New Year Eve Bash",
        "style_tags": ["new-year", "party", "festive", "bold"],
        "colour_palette": INDIGO,
        "orientation": "portrait",
        "price_inr": 49,
        "ai_prompt": "new-year party festive bold",
        "fabric_json": _make_fabric(
            bg_color=INDIGO[3],
            headline="🎆 New Year's Eve Party 🎆",
            subtitle="Ring in 2027 with Us!",
            details_text=(
                "Countdown to midnight together\n\n"
                "📅 31 December · 🕐 9:00 PM onwards\n📍 [Venue & Address]"
            ),
            rsvp_text="RSVP: [Contact] · Cocktail Attire",
            accent_color=INDIGO[0],
            body_color=INDIGO[2],
        ),
    },
    {
        "occasion_slug": "new-year",
        "title": "New Year Gala Night",
        "style_tags": ["gala", "luxury", "new-year", "elegant"],
        "colour_palette": AMBER,
        "orientation": "landscape",
        "price_inr": 99,
        "ai_prompt": "new-year gala luxury elegant",
        "fabric_json": _make_fabric(
            bg_color=AMBER[3],
            headline="✨ New Year Gala 2027 ✨",
            subtitle="An Evening of Glamour & Celebration",
            details_text="📅 31st December  ·  🕐 8:00 PM  ·  📍 [Venue]",
            rsvp_text="Black Tie · RSVP: [Contact] by [Date]",
            accent_color=AMBER[0],
            body_color=AMBER[2],
            orientation="landscape",
        ),
    },

    # ── Brunch ────────────────────────────────────────────────────────────────
    {
        "occasion_slug": "brunch",
        "title": "Sunday Brunch Gathering",
        "style_tags": ["brunch", "casual", "fresh", "minimal"],
        "colour_palette": EMERALD,
        "orientation": "landscape",
        "price_inr": 0,
        "ai_prompt": "brunch casual fresh minimal",
        "fabric_json": _make_fabric(
            bg_color=EMERALD[2],
            headline="☀️ Sunday Brunch ☀️",
            subtitle="Good Food, Good Friends",
            details_text="📅 [Date]  ·  🕐 11:00 AM  ·  📍 [Venue]",
            rsvp_text="RSVP: [Contact]",
            accent_color=EMERALD[0],
            body_color=EMERALD[1],
            orientation="landscape",
        ),
    },
    {
        "occasion_slug": "brunch",
        "title": "Birthday Brunch Celebration",
        "style_tags": ["brunch", "birthday", "fun", "rose"],
        "colour_palette": ROSE,
        "orientation": "landscape",
        "price_inr": 29,
        "ai_prompt": "brunch birthday fun rose",
        "fabric_json": _make_fabric(
            bg_color=ROSE[2],
            headline="🥂 Birthday Brunch! 🥂",
            subtitle="Brunch & Bubbly for [Name]",
            details_text="📅 [Date]  ·  🕐 [Time]  ·  📍 [Venue]",
            rsvp_text="RSVP: [Contact]",
            accent_color=ROSE[1],
            body_color=ROSE[0],
            orientation="landscape",
        ),
    },

    # ── Housewarming ──────────────────────────────────────────────────────────
    {
        "occasion_slug": "housewarming",
        "title": "Housewarming Puja & Party",
        "style_tags": ["housewarming", "traditional", "puja", "indian"],
        "colour_palette": AMBER,
        "orientation": "portrait",
        "price_inr": 0,
        "ai_prompt": "housewarming traditional puja indian",
        "fabric_json": _make_fabric(
            bg_color=AMBER[0],
            headline="🏠 Griha Pravesh 🪔",
            subtitle="Housewarming Puja & Celebration",
            details_text=(
                "[Family Name] cordially invites you\nto the housewarming of their new home\n\n"
                "📅 Date: [Enter Date]\n🕐 Muhurat: [Time]\n📍 [New Address]"
            ),
            rsvp_text="RSVP: [Contact]",
            accent_color="#FFFFFF",
            body_color=AMBER[2],
        ),
    },

    # ── Cocktail Party ────────────────────────────────────────────────────────
    {
        "occasion_slug": "cocktail-party",
        "title": "Cocktail Evening",
        "style_tags": ["cocktail", "elegant", "evening", "luxury"],
        "colour_palette": VIOLET,
        "orientation": "landscape",
        "price_inr": 49,
        "ai_prompt": "cocktail-party elegant evening luxury",
        "fabric_json": _make_fabric(
            bg_color=VIOLET[0],
            headline="🍸 Cocktail Evening 🍸",
            subtitle="An Evening of Drinks & Conversation",
            details_text="📅 [Date]  ·  🕐 [Time]  ·  📍 [Venue]",
            rsvp_text="RSVP: [Contact] · Smart Casual",
            accent_color="#FFFFFF",
            body_color=VIOLET[2],
            orientation="landscape",
        ),
    },

    # ── Pool Party ────────────────────────────────────────────────────────────
    {
        "occasion_slug": "pool-party",
        "title": "Summer Pool Party",
        "style_tags": ["pool", "summer", "fun", "outdoor"],
        "colour_palette": EMERALD,
        "orientation": "landscape",
        "price_inr": 29,
        "ai_prompt": "pool-party summer fun outdoor",
        "fabric_json": _make_fabric(
            bg_color=EMERALD[0],
            headline="🏊 Pool Party! 🌊",
            subtitle="Splash, Sun & Summer Fun",
            details_text="📅 [Date]  ·  🕐 [Time]  ·  📍 [Pool / Venue Address]",
            rsvp_text="RSVP: [Contact] · Bring your swimwear!",
            accent_color="#FFFFFF",
            body_color=EMERALD[2],
            orientation="landscape",
        ),
    },
]
