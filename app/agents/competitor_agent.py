"""
Agent 4: Competitor Monitoring & Dynamic Pricing Agent
Monitors competitor pricing, reviews, and rankings.
- Real-time price tracking (mock, replace with real API/scraping)
- BSR ranking changes
- Review sentiment analysis
- Dynamic pricing recommendations
- Daily briefing generation
"""
import time, random, math, re
from datetime import datetime, timedelta
import httpx, os

SERPER_KEY = os.environ.get("SERPER_API_KEY", "")

# ============================================================
# Competitor database (demo — replace with real tracking)
# ============================================================

TRACKED_COMPETITORS = {
    "earbuds": [
        {"asin": "B09JNK4YPF", "name": "SoundCore A40 Earbuds", "brand": "Anker", "platform": "amazon",
         "price_history": [39.99, 39.99, 35.99, 35.99, 33.99, 33.99, 36.99],
         "current_price": 36.99, "rating": 4.5, "reviews": 42350, "bsr": 156,
         "bsr_history": [180, 165, 156, 148, 160, 155, 156]},
        {"asin": "B0C8DL3HSR", "name": "JBL Tune Buds", "brand": "JBL", "platform": "amazon",
         "price_history": [49.99, 49.99, 44.99, 44.99, 44.99, 42.99, 44.99],
         "current_price": 44.99, "rating": 4.3, "reviews": 18920, "bsr": 289,
         "bsr_history": [310, 295, 289, 280, 275, 290, 289]},
        {"asin": "B0D123FAKE", "name": "BassKing Pro ANC", "brand": "BassKing", "platform": "tiktok",
         "price_history": [29.99, 29.99, 24.99, 22.99, 22.99, 25.99, 27.99],
         "current_price": 27.99, "rating": 4.1, "reviews": 3250, "bsr": None,
         "tiktok_sales_30d": 8500},
    ],
    "yoga_mat": [
        {"asin": "B01LP0U5X0", "name": "BalanceFrom GoYoga Mat", "brand": "BalanceFrom", "platform": "amazon",
         "price_history": [19.99, 19.99, 18.49, 17.99, 18.49, 19.99, 19.99],
         "current_price": 19.99, "rating": 4.5, "reviews": 98200, "bsr": 42,
         "bsr_history": [45, 43, 42, 40, 38, 42, 42]},
        {"asin": "B074DZ1YQZ", "name": "Manduka PRO Yoga Mat", "brand": "Manduka", "platform": "amazon",
         "price_history": [92.00, 92.00, 88.00, 85.00, 85.00, 88.00, 92.00],
         "current_price": 92.00, "rating": 4.7, "reviews": 12400, "bsr": 180,
         "bsr_history": [190, 185, 180, 175, 180, 185, 180]},
    ],
    "desk_lamp": [
        {"asin": "B08DKQ1ZSP", "name": "BenQ ScreenBar", "brand": "BenQ", "platform": "amazon",
         "price_history": [109.00, 109.00, 99.00, 99.00, 109.00, 109.00, 109.00],
         "current_price": 109.00, "rating": 4.6, "reviews": 15600, "bsr": 320,
         "bsr_history": [340, 330, 320, 315, 325, 330, 320]},
        {"asin": "B08FXJDK6L", "name": "TaoTronics LED Desk Lamp", "brand": "TaoTronics", "platform": "amazon",
         "price_history": [29.99, 27.99, 25.99, 25.99, 27.99, 29.99, 29.99],
         "current_price": 29.99, "rating": 4.4, "reviews": 28900, "bsr": 210,
         "bsr_history": [220, 215, 210, 208, 212, 215, 210]},
    ],
}

OUR_PRODUCTS = {
    "earbuds": {"name": "ProSound X1", "price": 39.99, "cost": 12.50, "min_price": 28.99, "rating": 4.4, "reviews": 1250, "bsr": 420, "monthly_sales": 1800},
    "yoga_mat": {"name": "ZenFlex Premium", "price": 29.99, "cost": 8.20, "min_price": 19.99, "rating": 4.3, "reviews": 680, "bsr": 380, "monthly_sales": 950},
    "desk_lamp": {"name": "LumiPro Smart", "price": 34.99, "cost": 11.80, "min_price": 24.99, "rating": 4.5, "reviews": 420, "bsr": 550, "monthly_sales": 620},
}

# ============================================================
# Core functions
# ============================================================

async def get_market_overview(product_key: str):
    """Get complete market overview for a product category."""
    t0 = time.time()
    competitors = TRACKED_COMPETITORS.get(product_key, [])
    our = OUR_PRODUCTS.get(product_key, {})

    if not competitors:
        return {"error": f"No tracked competitors for '{product_key}'"}

    # Price analysis
    comp_prices = [c["current_price"] for c in competitors]
    price_analysis = {
        "our_price": our["price"],
        "market_avg": round(sum(comp_prices) / len(comp_prices), 2),
        "market_min": min(comp_prices),
        "market_max": max(comp_prices),
        "our_position": "above_avg" if our["price"] > sum(comp_prices)/len(comp_prices) else "below_avg",
        "price_competitiveness": round(100 - (our["price"] - min(comp_prices)) / (max(comp_prices) - min(comp_prices) + 0.01) * 100),
    }

    # Detect price changes
    alerts = []
    for comp in competitors:
        hist = comp["price_history"]
        if len(hist) >= 2 and hist[-1] != hist[-2]:
            change = hist[-1] - hist[-2]
            pct = round(change / hist[-2] * 100, 1)
            direction = "dropped" if change < 0 else "increased"
            alerts.append({
                "type": "price_change",
                "severity": "high" if abs(pct) > 10 else "medium",
                "competitor": comp["name"],
                "detail": f"Price {direction} by ${abs(change):.2f} ({pct:+.1f}%)",
                "old_price": hist[-2],
                "new_price": hist[-1],
            })

    # BSR trends
    for comp in competitors:
        if comp.get("bsr_history") and len(comp["bsr_history"]) >= 3:
            trend = comp["bsr_history"][-1] - comp["bsr_history"][-3]
            if abs(trend) > 20:
                alerts.append({
                    "type": "bsr_change",
                    "severity": "medium",
                    "competitor": comp["name"],
                    "detail": f"BSR {'improved' if trend < 0 else 'declined'} by {abs(trend)} positions (7d)",
                })

    # Pricing recommendation
    recommendation = _pricing_recommendation(our, competitors, price_analysis)

    elapsed = round((time.time() - t0) * 1000, 2)

    return {
        "product": our,
        "competitors": competitors,
        "price_analysis": price_analysis,
        "alerts": alerts,
        "recommendation": recommendation,
        "elapsed_ms": elapsed,
    }

async def search_competitor_live(query: str):
    """Search for competitor info via web search."""
    if not SERPER_KEY:
        return {"results": [], "note": "Configure SERPER_API_KEY for live search"}
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://google.serper.dev/search",
                headers={"X-API-KEY": SERPER_KEY, "Content-Type": "application/json"},
                json={"q": query, "num": 5},
                timeout=10
            )
            data = resp.json()
            results = [{"title": r.get("title",""), "url": r.get("link",""), "snippet": r.get("snippet","")} for r in data.get("organic", [])[:5]]
            return {"results": results}
    except Exception as e:
        return {"results": [], "error": str(e)}

def _pricing_recommendation(our, competitors, analysis):
    """Generate pricing recommendation."""
    margin_at_current = round((our["price"] - our["cost"]) / our["price"] * 100, 1)
    margin_at_min = round((our["min_price"] - our["cost"]) / our["min_price"] * 100, 1)

    # Find the cheapest competitor
    cheapest = min(competitors, key=lambda c: c["current_price"])

    rec = {
        "current_margin": margin_at_current,
        "min_margin": margin_at_min,
        "action": "hold",
        "suggested_price": our["price"],
        "reasoning": "",
    }

    # If our price is significantly higher than cheapest
    if our["price"] > cheapest["current_price"] * 1.3:
        # We're 30%+ more expensive
        suggested = round(cheapest["current_price"] * 1.15, 2)
        if suggested >= our["min_price"]:
            rec["action"] = "reduce"
            rec["suggested_price"] = suggested
            rec["reasoning"] = f"Our price is {round((our['price']/cheapest['current_price']-1)*100)}% above cheapest competitor ({cheapest['name']} at ${cheapest['current_price']}). Recommend reducing to ${suggested} to stay competitive while maintaining {round((suggested-our['cost'])/suggested*100)}% margin."
        else:
            rec["action"] = "differentiate"
            rec["suggested_price"] = our["price"]
            rec["reasoning"] = f"Price gap is large but reducing further would hit minimum margin. Focus on differentiating through listing quality, reviews, and bundling."
    elif our["price"] < cheapest["current_price"] * 0.9:
        # We're cheaper — opportunity to increase
        suggested = round(cheapest["current_price"] * 0.95, 2)
        rec["action"] = "increase"
        rec["suggested_price"] = suggested
        rec["reasoning"] = f"We're priced below market. Opportunity to increase to ${suggested}, still undercutting {cheapest['name']} while improving margin to {round((suggested-our['cost'])/suggested*100)}%."
    else:
        rec["action"] = "hold"
        rec["reasoning"] = f"Current pricing is competitive. Focus on maintaining BSR through PPC optimization and review velocity."

    rec["projected_margin"] = round((rec["suggested_price"] - our["cost"]) / rec["suggested_price"] * 100, 1)

    return rec

async def generate_daily_briefing():
    """Generate a daily competitive intelligence briefing."""
    t0 = time.time()
    briefing = {"date": datetime.now().strftime("%Y-%m-%d"), "sections": []}

    for product_key in OUR_PRODUCTS:
        overview = await get_market_overview(product_key)
        if "error" in overview:
            continue
        section = {
            "product": overview["product"]["name"],
            "our_price": overview["product"]["price"],
            "market_avg": overview["price_analysis"]["market_avg"],
            "alerts": overview["alerts"],
            "recommendation": overview["recommendation"],
            "competitors_count": len(overview["competitors"]),
        }
        briefing["sections"].append(section)

    briefing["elapsed_ms"] = round((time.time() - t0) * 1000, 2)
    briefing["summary"] = f"Monitoring {sum(len(v) for v in TRACKED_COMPETITORS.values())} competitors across {len(OUR_PRODUCTS)} product categories."

    return briefing

def get_tracked_products():
    return [{"key": k, **v} for k, v in OUR_PRODUCTS.items()]
