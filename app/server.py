"""
Cross-Border E-Commerce AI Agent Platform — Main Server
Integrates all 5 agent modules into a unified FastAPI backend.
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

from app.config import get_connection_status
from app.agents import customer_service, listing_agent, content_agent, competitor_agent, supply_chain

app = FastAPI(title="E-Commerce Agent Platform", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ============================================================
# Request models
# ============================================================
class ChatReq(BaseModel):
    message: str
    platform: str = "tiktok"
    conversation_id: Optional[str] = None

class ListingReq(BaseModel):
    product_key: str
    platform: str = "amazon"
    language: str = "en"

class ScriptReq(BaseModel):
    product_name: str
    features: list[str]
    format_type: str = "unboxing"
    language: str = "en"

class LiveReq(BaseModel):
    product_name: str
    features: list[str]
    price: float
    promo_price: Optional[float] = None

class CompetitorReq(BaseModel):
    product_key: str

class RestockReq(BaseModel):
    product_key: str

class ForecastReq(BaseModel):
    product_key: str
    days: int = 30

class SearchReq(BaseModel):
    query: str

# ============================================================
# Platform status
# ============================================================
@app.get("/api/status")
def status():
    cs_stats = customer_service.get_service_stats()
    sc_stats = supply_chain.get_supply_chain_stats()
    return {
        "connections": get_connection_status(),
        "customer_service": cs_stats["today"],
        "inventory": sc_stats,
        "products": len(supply_chain.INVENTORY),
    }

@app.get("/api/dashboard")
async def dashboard():
    """Get comprehensive dashboard data."""
    cs_stats = customer_service.get_service_stats()
    sc_stats = supply_chain.get_supply_chain_stats()
    inventory = supply_chain.get_inventory_overview()
    briefing = await competitor_agent.generate_daily_briefing()

    return {
        "customer_service": cs_stats,
        "supply_chain": sc_stats,
        "inventory_alerts": inventory["alerts"][:5],
        "competitor_briefing": briefing,
        "connections": get_connection_status(),
    }

# ============================================================
# Agent 1: Customer Service
# ============================================================
@app.post("/api/cs/chat")
async def cs_chat(req: ChatReq):
    result = await customer_service.handle_customer_message(req.message, platform=req.platform)
    return result

@app.get("/api/cs/stats")
def cs_stats():
    return customer_service.get_service_stats()

@app.get("/api/cs/orders/{order_id}")
def cs_order(order_id: str):
    return customer_service.lookup_order(order_id)

# ============================================================
# Agent 2: Listing Generation
# ============================================================
@app.post("/api/listing/generate")
async def listing_generate(req: ListingReq):
    return await listing_agent.generate_listing(req.product_key, req.platform, req.language)

@app.get("/api/listing/products")
def listing_products():
    return listing_agent.get_product_list()

# ============================================================
# Agent 3: TikTok Content
# ============================================================
@app.post("/api/content/script")
async def content_script(req: ScriptReq):
    return await content_agent.generate_video_script(req.product_name, req.features, req.format_type, req.language)

@app.post("/api/content/live")
async def content_live(req: LiveReq):
    return await content_agent.generate_live_script(req.product_name, req.features, req.price, req.promo_price)

@app.get("/api/content/calendar")
async def content_calendar():
    products = [{"name": "ProSound X1 Earbuds", "features": ["ANC", "40h battery"]},
                {"name": "ZenFlex Yoga Mat", "features": ["Non-slip", "6mm thick"]},
                {"name": "LumiPro Desk Lamp", "features": ["5 color temps", "USB-C"]}]
    return await content_agent.generate_content_calendar(products, 7)

@app.get("/api/content/formats")
def content_formats():
    return content_agent.get_format_list()

# ============================================================
# Agent 4: Competitor Monitoring
# ============================================================
@app.post("/api/competitor/overview")
async def competitor_overview(req: CompetitorReq):
    return await competitor_agent.get_market_overview(req.product_key)

@app.get("/api/competitor/briefing")
async def competitor_briefing():
    return await competitor_agent.generate_daily_briefing()

@app.post("/api/competitor/search")
async def competitor_search(req: SearchReq):
    return await competitor_agent.search_competitor_live(req.query)

@app.get("/api/competitor/products")
def competitor_products():
    return competitor_agent.get_tracked_products()

# ============================================================
# Agent 5: Supply Chain
# ============================================================
@app.get("/api/supply/overview")
def supply_overview():
    return supply_chain.get_inventory_overview()

@app.post("/api/supply/restock")
def supply_restock(req: RestockReq):
    return supply_chain.generate_restock_plan(req.product_key)

@app.post("/api/supply/forecast")
def supply_forecast(req: ForecastReq):
    return supply_chain.forecast_demand(req.product_key, req.days)

@app.get("/api/supply/stats")
def supply_stats():
    return supply_chain.get_supply_chain_stats()

# ============================================================
# Static files (frontend)
# ============================================================
app.mount("/", StaticFiles(directory="/workspace/output", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080, log_level="warning")
