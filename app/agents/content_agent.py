"""
Agent 3: TikTok Content Generation Agent
Generates short video scripts, live stream talking points, and content calendars.
- Trending topic analysis
- Video script generation (hook/body/CTA structure)
- Live stream script generation
- Hashtag optimization
- Comment auto-reply templates
"""
import time, random
from datetime import datetime, timedelta
from app.llm import llm_chat

# ============================================================
# Trending topics & hashtags database
# ============================================================

TRENDING_TOPICS = [
    {"topic": "Unboxing Haul", "views": "2.3B", "growth": "+15%", "relevance": "high", "format": "unboxing"},
    {"topic": "TikTok Made Me Buy It", "views": "48B", "growth": "+8%", "relevance": "high", "format": "review"},
    {"topic": "Amazon Finds", "views": "12B", "growth": "+22%", "relevance": "high", "format": "haul"},
    {"topic": "Side-by-Side Comparison", "views": "890M", "growth": "+35%", "relevance": "medium", "format": "comparison"},
    {"topic": "Day in My Life + Product", "views": "5.6B", "growth": "+5%", "relevance": "medium", "format": "lifestyle"},
    {"topic": "POV: When your order arrives", "views": "1.2B", "growth": "+42%", "relevance": "high", "format": "skit"},
    {"topic": "Honest Review After 30 Days", "views": "670M", "growth": "+28%", "relevance": "high", "format": "review"},
    {"topic": "3 Things I Wish I Knew Before Buying", "views": "430M", "growth": "+18%", "relevance": "medium", "format": "educational"},
]

HASHTAG_DB = {
    "general": ["#fyp", "#foryou", "#foryoupage", "#viral", "#trending"],
    "shopping": ["#TikTokMadeMeBuyIt", "#TikTokShop", "#TikTokFinds", "#OnlineShopping", "#ShopWithMe"],
    "electronics": ["#TechTok", "#GadgetReview", "#TechFinds", "#WirelessEarbuds", "#SmartHome"],
    "fitness": ["#FitTok", "#WorkoutEssentials", "#YogaLife", "#HomeGym", "#FitnessFinds"],
    "home": ["#HomeTok", "#HomeDecor", "#DeskSetup", "#RoomMakeover", "#AestheticRoom"],
}

# ============================================================
# Script templates
# ============================================================

VIDEO_TEMPLATES = {
    "unboxing": {
        "name": "Unboxing / First Impressions",
        "duration": "30-60s",
        "structure": [
            {"section": "Hook (0-3s)", "content": "📦 Show package arriving / \"Let me show you what I just got...\""},
            {"section": "Unboxing (3-15s)", "content": "Open package, show contents, reaction shots"},
            {"section": "First Look (15-35s)", "content": "Highlight key features, close-up shots of quality details"},
            {"section": "Quick Test (35-50s)", "content": "Actually use the product, show it working"},
            {"section": "CTA (50-60s)", "content": "\"Link in bio\" / \"Comment LINK for the deal\" / TikTok Shop button"},
        ]
    },
    "review": {
        "name": "Honest Review",
        "duration": "45-90s",
        "structure": [
            {"section": "Hook (0-3s)", "content": "\"I've been using this for [X] weeks, here's the truth...\""},
            {"section": "Context (3-10s)", "content": "Why you bought it, what you expected"},
            {"section": "Pros (10-30s)", "content": "Top 3 things you love, show each in action"},
            {"section": "Cons (30-40s)", "content": "1-2 honest downsides (builds trust)"},
            {"section": "Verdict (40-55s)", "content": "Overall rating, who it's perfect for"},
            {"section": "CTA (55-60s)", "content": "\"Save this for later\" / \"Follow for more honest reviews\""},
        ]
    },
    "comparison": {
        "name": "Side-by-Side Comparison",
        "duration": "45-60s",
        "structure": [
            {"section": "Hook (0-3s)", "content": "\"[Cheap] vs [Expensive] — is it worth the upgrade?\""},
            {"section": "Visual Compare (3-20s)", "content": "Split-screen or back-to-back of both products"},
            {"section": "Feature Battle (20-40s)", "content": "Test 3-4 features head to head"},
            {"section": "Winner (40-50s)", "content": "Clear verdict with reasoning"},
            {"section": "CTA (50-60s)", "content": "\"Which would YOU pick? Comment below!\""},
        ]
    },
    "lifestyle": {
        "name": "Lifestyle Integration",
        "duration": "30-45s",
        "structure": [
            {"section": "Scene Set (0-5s)", "content": "Show your daily routine / aesthetic setup"},
            {"section": "Problem (5-12s)", "content": "Relatable problem or need"},
            {"section": "Product Reveal (12-25s)", "content": "Naturally introduce product as part of routine"},
            {"section": "Result (25-38s)", "content": "Show the improvement / satisfaction"},
            {"section": "CTA (38-45s)", "content": "\"Transform your [morning/workspace/workout] — link below\""},
        ]
    },
}

LIVE_TEMPLATE = {
    "opening": [
        "Hey everyone! Welcome to our live! If you're new here, hit that follow button! 👋",
        "We've got some AMAZING deals today — stay until the end for a surprise discount! 🎉",
        "Drop a ❤️ in the chat if you can hear me! Let's get this started!"
    ],
    "product_intro": [
        "Alright, let me show you our #1 bestseller right now...",
        "This is what EVERYONE has been asking about — let me demo it for you",
        "Before I reveal the price, let me show you why this is worth every penny"
    ],
    "engagement": [
        "Type YES if you want me to add this to your cart!",
        "Who else needs this? Tag a friend who'd love this!",
        "Comment your size/color and I'll pin the link!",
        "Flash deal for the next 60 seconds — don't miss it! ⏰"
    ],
    "closing": [
        "Thank you so much for watching! Follow us for tomorrow's live at [time]!",
        "Don't forget to check your cart — your discount expires in 30 minutes!",
        "See you next time! Share this stream if you found a great deal! 💕"
    ]
}

# ============================================================
# Core functions
# ============================================================

async def generate_video_script(product_name: str, product_features: list, format_type: str = "unboxing", language: str = "en"):
    """Generate a short video script for TikTok."""
    t0 = time.time()
    template = VIDEO_TEMPLATES.get(format_type, VIDEO_TEMPLATES["unboxing"])

    steps = [{"type": "analyze", "detail": f"Format: {template['name']}, Duration: {template['duration']}"}]

    # Try LLM generation
    script = await _llm_script(product_name, product_features, template, language)
    if "[Demo Mode" in script or "[LLM Error" in script:
        script = _template_script(product_name, product_features, template)
        steps.append({"type": "template", "detail": "Generated from template"})
    else:
        steps.append({"type": "llm", "detail": "Generated via LLM"})

    # Select hashtags
    hashtags = _select_hashtags(product_name, product_features)
    steps.append({"type": "hashtags", "detail": f"Selected {len(hashtags)} optimized hashtags"})

    # Trending relevance
    relevant_trends = [t for t in TRENDING_TOPICS if t["format"] == format_type or t["relevance"] == "high"][:4]

    elapsed = round((time.time() - t0) * 1000, 2)

    return {
        "script": script,
        "template": template,
        "hashtags": hashtags,
        "trending": relevant_trends,
        "format": format_type,
        "steps": steps,
        "elapsed_ms": elapsed,
    }

async def generate_live_script(product_name: str, product_features: list, price: float, promo_price: float = None):
    """Generate live stream talking points."""
    t0 = time.time()

    sections = {
        "opening": random.choice(LIVE_TEMPLATE["opening"]),
        "product_intro": [
            random.choice(LIVE_TEMPLATE["product_intro"]),
            f"This is the {product_name}. Let me tell you why I'm obsessed...",
            f"Features: {', '.join(product_features[:3])}",
            f"Normally ${price}, but TODAY..." + (f" only ${promo_price}! That's {round((1-promo_price/price)*100)}% OFF!" if promo_price else f" we've got a special deal for you!"),
        ],
        "engagement_hooks": LIVE_TEMPLATE["engagement"],
        "closing": random.choice(LIVE_TEMPLATE["closing"]),
        "key_numbers": {
            "original_price": price,
            "promo_price": promo_price,
            "discount_pct": round((1 - promo_price / price) * 100) if promo_price else 0,
            "suggested_duration": "45-60 min",
            "products_to_show": 5,
        }
    }

    elapsed = round((time.time() - t0) * 1000, 2)
    return {"sections": sections, "elapsed_ms": elapsed}

async def generate_content_calendar(products: list, days: int = 7):
    """Generate a content posting calendar."""
    calendar = []
    formats = list(VIDEO_TEMPLATES.keys())
    base_date = datetime.now()

    for i in range(days):
        date = base_date + timedelta(days=i)
        product = products[i % len(products)] if products else {"name": "Featured Product"}
        fmt = formats[i % len(formats)]
        template = VIDEO_TEMPLATES[fmt]

        calendar.append({
            "date": date.strftime("%Y-%m-%d"),
            "day": date.strftime("%A"),
            "product": product.get("name", "TBD"),
            "format": fmt,
            "format_name": template["name"],
            "duration": template["duration"],
            "post_time": random.choice(["10:00 AM EST", "2:00 PM EST", "6:00 PM EST", "8:00 PM EST"]),
            "hashtag_set": _select_hashtags(product.get("name", ""), product.get("features", []))[:5],
            "notes": f"Focus on {random.choice(['hook optimization', 'engagement CTA', 'product close-ups', 'lifestyle angle', 'trending sound'])}"
        })

    return {"calendar": calendar, "total_days": days, "formats_used": list(set(e["format"] for e in calendar))}

async def _llm_script(product_name, features, template, language):
    """Try to generate script with LLM."""
    sections = "\n".join([f"- {s['section']}: {s['content']}" for s in template["structure"]])
    prompt = f"""Write a TikTok video script for: {product_name}
Key features: {', '.join(features[:4])}
Format: {template['name']} ({template['duration']})
Language: {language}

Follow this structure:
{sections}

Write the actual spoken script with visual directions in [brackets].
Make it natural, conversational, and optimized for TikTok engagement."""

    return await llm_chat([
        {"role": "system", "content": "You are a viral TikTok content creator specializing in product videos. Write engaging, authentic scripts that drive sales."},
        {"role": "user", "content": prompt}
    ])

def _template_script(product_name, features, template):
    """Fallback template script."""
    lines = []
    for section in template["structure"]:
        lines.append(f"**{section['section']}**")
        if "Hook" in section["section"]:
            lines.append(f'[Camera on package] "Wait until you see what just arrived... the {product_name}!"')
        elif "feature" in section["section"].lower() or "look" in section["section"].lower():
            for f in features[:3]:
                lines.append(f'[Close-up shot] "First up — {f.lower()}. And it actually works."')
        elif "test" in section["section"].lower() or "pro" in section["section"].lower():
            lines.append(f'[Using product] "Let me show you this in action..."')
            lines.append(f'[Demo {features[0]}] "See? {features[0]} — exactly as advertised."')
        elif "CTA" in section["section"]:
            lines.append(f'"If you need a {product_name.lower().split()[0]}, this is IT. Link in my bio or tap the shop button!"')
        else:
            lines.append(f'[{section["content"]}]')
        lines.append("")
    return "\n".join(lines)

def _select_hashtags(product_name, features):
    """Select optimized hashtags based on product."""
    tags = list(HASHTAG_DB["general"][:3]) + list(HASHTAG_DB["shopping"][:3])
    name_lower = (product_name + " " + " ".join(features)).lower()
    for cat, cat_tags in HASHTAG_DB.items():
        if cat in ["general", "shopping"]:
            continue
        if any(kw in name_lower for kw in cat.split()):
            tags.extend(cat_tags[:3])
    # Product-specific
    tags.append(f"#{product_name.replace(' ', '')}")
    return list(dict.fromkeys(tags))[:12]

def get_format_list():
    return [{"key": k, "name": v["name"], "duration": v["duration"], "steps": len(v["structure"])} for k, v in VIDEO_TEMPLATES.items()]
