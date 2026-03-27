"""
Cross-Border E-Commerce AI Agent Platform — Configuration
API keys and external service configuration.
Users only need to fill in this file to connect real services.
"""
import os

# ============================================================
# LLM Provider — Choose one or configure fallback chain
# ============================================================
LLM_PROVIDER = os.environ.get("LLM_PROVIDER", "openai")  # openai | anthropic | deepseek
LLM_API_KEY = os.environ.get("LLM_API_KEY", "")
LLM_BASE_URL = os.environ.get("LLM_BASE_URL", "https://api.openai.com/v1")
LLM_MODEL = os.environ.get("LLM_MODEL", "gpt-4o-mini")

# ============================================================
# Amazon SP-API
# Docs: https://developer-docs.amazon.com/sp-api/
# ============================================================
AMAZON_SELLER_ID = os.environ.get("AMAZON_SELLER_ID", "")
AMAZON_ACCESS_KEY = os.environ.get("AMAZON_ACCESS_KEY", "")
AMAZON_SECRET_KEY = os.environ.get("AMAZON_SECRET_KEY", "")
AMAZON_REFRESH_TOKEN = os.environ.get("AMAZON_REFRESH_TOKEN", "")
AMAZON_MARKETPLACE = os.environ.get("AMAZON_MARKETPLACE", "ATVPDKIKX0DER")  # US

# ============================================================
# TikTok Shop Open API
# Docs: https://partner.tiktokshop.com/docv2
# ============================================================
TIKTOK_APP_KEY = os.environ.get("TIKTOK_APP_KEY", "")
TIKTOK_APP_SECRET = os.environ.get("TIKTOK_APP_SECRET", "")
TIKTOK_ACCESS_TOKEN = os.environ.get("TIKTOK_ACCESS_TOKEN", "")
TIKTOK_SHOP_ID = os.environ.get("TIKTOK_SHOP_ID", "")

# ============================================================
# Web Search (for competitor monitoring)
# ============================================================
SERPER_API_KEY = os.environ.get("SERPER_API_KEY", "")

# ============================================================
# ERP / Inventory System
# ============================================================
ERP_API_URL = os.environ.get("ERP_API_URL", "")
ERP_API_KEY = os.environ.get("ERP_API_KEY", "")

# ============================================================
# Notification (Webhook for alerts)
# ============================================================
WEBHOOK_URL = os.environ.get("WEBHOOK_URL", "")  # Slack / DingTalk / Feishu

# ============================================================
# Helper: Check which services are connected
# ============================================================
def get_connection_status():
    return {
        "llm": bool(LLM_API_KEY),
        "amazon": bool(AMAZON_ACCESS_KEY and AMAZON_SECRET_KEY),
        "tiktok": bool(TIKTOK_APP_KEY and TIKTOK_ACCESS_TOKEN),
        "serper": bool(SERPER_API_KEY),
        "erp": bool(ERP_API_URL and ERP_API_KEY),
        "webhook": bool(WEBHOOK_URL),
    }
