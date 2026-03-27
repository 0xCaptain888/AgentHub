"""
Agent 2: Product Listing Agent (Content Factory)
Auto-generates optimized product listings for Amazon and TikTok Shop.
- Analyzes competitor listings for keyword optimization
- Generates platform-specific content (Amazon formal vs TikTok casual)
- Multi-language output
- SEO keyword extraction
"""
import time, re, random
from app.llm import llm_chat

# ============================================================
# Product templates & keyword database
# ============================================================

DEMO_PRODUCTS = {
    "earbuds": {
        "name": "ProSound X1 Wireless Earbuds",
        "category": "Electronics > Audio > Earbuds",
        "features": ["Active Noise Cancellation", "40h battery life", "IPX5 waterproof", "Bluetooth 5.3", "Touch controls", "Fast charging (10min = 2h)"],
        "price": 39.99,
        "images": 8,
        "variants": ["Black", "White", "Navy Blue"],
    },
    "yoga_mat": {
        "name": "ZenFlex Premium Yoga Mat",
        "category": "Sports > Yoga > Mats",
        "features": ["6mm thick TPE material", "Non-slip dual texture", "72x24 inch", "Eco-friendly", "Carrying strap included", "Alignment lines"],
        "price": 29.99,
        "images": 6,
        "variants": ["Purple", "Teal", "Grey", "Pink"],
    },
    "desk_lamp": {
        "name": "LumiPro Smart Desk Lamp",
        "category": "Home > Lighting > Desk Lamps",
        "features": ["5 color temperatures", "10 brightness levels", "USB-C charging port", "Memory function", "Eye-care LED", "Touch control", "Timer 30/60min"],
        "price": 34.99,
        "images": 7,
        "variants": ["White", "Black", "Silver"],
    },
}

CATEGORY_KEYWORDS = {
    "Electronics > Audio > Earbuds": {
        "primary": ["wireless earbuds", "bluetooth earbuds", "noise cancelling earbuds", "earbuds with microphone"],
        "secondary": ["workout earbuds", "waterproof earbuds", "long battery earbuds", "earbuds for iphone", "earbuds for android"],
        "backend": ["wireless headphones", "TWS earphones", "in-ear headphones", "sport earbuds", "gym earbuds"]
    },
    "Sports > Yoga > Mats": {
        "primary": ["yoga mat", "exercise mat", "non slip yoga mat", "thick yoga mat"],
        "secondary": ["yoga mat for women", "pilates mat", "workout mat", "gym mat", "eco friendly yoga mat"],
        "backend": ["fitness mat", "stretching mat", "floor exercise mat", "TPE yoga mat"]
    },
    "Home > Lighting > Desk Lamps": {
        "primary": ["desk lamp", "LED desk lamp", "desk lamp for office", "study lamp"],
        "secondary": ["desk lamp with USB port", "eye care desk lamp", "touch desk lamp", "dimmable desk lamp"],
        "backend": ["table lamp", "reading lamp", "task lamp", "computer desk lamp"]
    },
}

# ============================================================
# Listing generation
# ============================================================

async def generate_listing(product_key: str, platform: str = "amazon", language: str = "en"):
    """Generate optimized product listing for specified platform."""
    t0 = time.time()
    product = DEMO_PRODUCTS.get(product_key)
    if not product:
        return {"error": f"Product '{product_key}' not found. Available: {list(DEMO_PRODUCTS.keys())}"}

    keywords = CATEGORY_KEYWORDS.get(product["category"], {"primary": [], "secondary": [], "backend": []})

    steps = [{"type": "analyze", "detail": f"Product: {product['name']}, Platform: {platform}, Language: {language}"}]

    # Try LLM generation, fall back to template
    listing = await _generate_with_llm(product, keywords, platform, language)
    if listing.get("from_llm"):
        steps.append({"type": "llm_generate", "detail": "Generated via LLM API"})
    else:
        listing = _template_listing(product, keywords, platform, language)
        steps.append({"type": "template_generate", "detail": "Generated via templates (connect LLM for better results)"})

    # Competitor analysis (mock — replace with real scraping)
    competitors = _mock_competitor_analysis(product["category"])
    steps.append({"type": "competitor_analysis", "detail": f"Analyzed {len(competitors)} competitor listings"})

    # SEO score
    seo = _calculate_seo_score(listing, keywords)
    steps.append({"type": "seo_check", "detail": f"SEO Score: {seo['score']}/100"})

    elapsed = round((time.time() - t0) * 1000, 2)

    return {
        "product": product,
        "platform": platform,
        "language": language,
        "listing": listing,
        "keywords": keywords,
        "competitors": competitors,
        "seo": seo,
        "steps": steps,
        "elapsed_ms": elapsed,
    }

async def _generate_with_llm(product, keywords, platform, language):
    """Attempt LLM-powered listing generation."""
    lang_instruction = "Write in English." if language == "en" else f"Write in {language}."
    platform_style = "professional, keyword-rich, following Amazon A9 algorithm best practices" if platform == "amazon" else "casual, engaging, emoji-friendly, TikTok-native voice"

    prompt = f"""Generate an optimized {platform} product listing for:
Product: {product['name']}
Category: {product['category']}
Features: {', '.join(product['features'])}
Price: ${product['price']}
Variants: {', '.join(product['variants'])}
Target Keywords: {', '.join(keywords['primary'][:5])}

Style: {platform_style}
{lang_instruction}

Return in this exact format:
TITLE: [product title, max 200 chars, include top keywords]
BULLET1: [feature + benefit]
BULLET2: [feature + benefit]
BULLET3: [feature + benefit]
BULLET4: [feature + benefit]
BULLET5: [feature + benefit]
DESCRIPTION: [compelling product description, 150-300 words]
BACKEND_KEYWORDS: [comma-separated search terms not in title/bullets]"""

    result = await llm_chat([
        {"role": "system", "content": f"You are an expert {platform} listing copywriter specializing in cross-border e-commerce."},
        {"role": "user", "content": prompt}
    ])

    if "[Demo Mode" in result or "[LLM Error" in result:
        return {"from_llm": False}

    # Parse LLM output
    listing = {"from_llm": True}
    for field in ["TITLE", "BULLET1", "BULLET2", "BULLET3", "BULLET4", "BULLET5", "DESCRIPTION", "BACKEND_KEYWORDS"]:
        match = re.search(rf'{field}:\s*(.+?)(?=\n[A-Z_]+:|$)', result, re.DOTALL)
        listing[field.lower()] = match.group(1).strip() if match else ""
    return listing

def _template_listing(product, keywords, platform, language):
    """Template-based listing generation (no LLM needed)."""
    name = product["name"]
    features = product["features"]
    primary_kw = keywords["primary"]

    if platform == "amazon":
        title = f"{name} — {features[0]}, {features[1]}, {primary_kw[0].title()} for {primary_kw[-1].split()[-1].title()}"
        bullets = [f"【{f.split()[0].upper()}】{f} — Designed for maximum performance and user comfort." for f in features[:5]]
        desc = f"{name} combines cutting-edge technology with premium build quality. Featuring {features[0].lower()} and {features[1].lower()}, this product delivers exceptional value. Perfect for everyday use, travel, and work. Package includes: 1x {name}, 1x User Manual, 1x Charging Cable, 1x Carrying Case."
        backend = ", ".join(keywords["backend"])
    else:  # tiktok
        title = f"✨ {name} | {features[0]} | Must-Have!"
        bullets = [f"✅ {f}" for f in features[:5]]
        hashtag_str = ' | '.join('#' + kw.replace(' ', '') for kw in primary_kw[:5])
        desc = f"Meet the {name}! {features[0]} + {features[1]} = your new favorite. We tested it for 30 days and honestly can't go back. Drop a comment if you want the link!\n\n{hashtag_str}"
        backend = ", ".join(keywords["backend"])

    return {
        "from_llm": False,
        "title": title,
        "bullet1": bullets[0] if len(bullets) > 0 else "",
        "bullet2": bullets[1] if len(bullets) > 1 else "",
        "bullet3": bullets[2] if len(bullets) > 2 else "",
        "bullet4": bullets[3] if len(bullets) > 3 else "",
        "bullet5": bullets[4] if len(bullets) > 4 else "",
        "description": desc,
        "backend_keywords": backend,
    }

def _mock_competitor_analysis(category):
    """Mock competitor data — replace with real scraping."""
    # TODO: Replace with Amazon SP-API catalog search or web scraping
    competitors = [
        {"rank": 1, "title": f"Best Seller in {category.split('>')[-1].strip()}", "price": round(random.uniform(20, 60), 2), "rating": round(random.uniform(4.0, 4.8), 1), "reviews": random.randint(500, 15000), "bsr": random.randint(100, 5000)},
        {"rank": 2, "title": f"Top Rated {category.split('>')[-1].strip()}", "price": round(random.uniform(20, 60), 2), "rating": round(random.uniform(4.0, 4.8), 1), "reviews": random.randint(500, 15000), "bsr": random.randint(100, 5000)},
        {"rank": 3, "title": f"Popular Choice {category.split('>')[-1].strip()}", "price": round(random.uniform(20, 60), 2), "rating": round(random.uniform(3.8, 4.6), 1), "reviews": random.randint(200, 8000), "bsr": random.randint(100, 5000)},
    ]
    return competitors

def _calculate_seo_score(listing, keywords):
    """Calculate listing SEO optimization score."""
    score = 0
    issues = []
    title = listing.get("title", "")
    desc = listing.get("description", "")
    all_text = f"{title} {listing.get('bullet1','')} {listing.get('bullet2','')} {listing.get('bullet3','')} {listing.get('bullet4','')} {listing.get('bullet5','')} {desc}".lower()

    # Title length
    if 80 <= len(title) <= 200:
        score += 20
    else:
        issues.append(f"Title length ({len(title)} chars) — ideal is 80-200")

    # Primary keywords in title
    kw_in_title = sum(1 for kw in keywords["primary"] if kw.lower() in title.lower())
    score += min(kw_in_title * 10, 20)
    if kw_in_title == 0:
        issues.append("No primary keywords found in title")

    # All 5 bullets present
    bullets_filled = sum(1 for i in range(1, 6) if listing.get(f"bullet{i}"))
    score += bullets_filled * 4
    if bullets_filled < 5:
        issues.append(f"Only {bullets_filled}/5 bullet points filled")

    # Description length
    if len(desc) >= 150:
        score += 15
    else:
        issues.append("Description too short (aim for 150+ words)")

    # Backend keywords
    if listing.get("backend_keywords"):
        score += 15
    else:
        issues.append("No backend keywords specified")

    # Keyword coverage
    all_kws = keywords["primary"] + keywords["secondary"]
    covered = sum(1 for kw in all_kws if kw.lower() in all_text)
    coverage_pct = round(covered / max(len(all_kws), 1) * 100)
    score += min(coverage_pct // 10, 10)

    return {"score": min(score, 100), "issues": issues, "keyword_coverage": coverage_pct}

def get_product_list():
    return [{"key": k, **{f: v for f, v in p.items() if f != "features"}, "feature_count": len(p["features"])} for k, p in DEMO_PRODUCTS.items()]
