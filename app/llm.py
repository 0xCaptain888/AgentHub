"""
LLM Adapter — Unified interface for calling LLMs.
Supports OpenAI-compatible APIs. When no API key is configured,
falls back to template-based generation for demo mode.
"""
import httpx
from app.config import LLM_API_KEY, LLM_BASE_URL, LLM_MODEL

async def llm_chat(messages: list[dict], temperature=0.7, max_tokens=2000) -> str:
    """Send chat completion request. Falls back to demo mode if no key."""
    if not LLM_API_KEY:
        return _demo_response(messages)
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{LLM_BASE_URL}/chat/completions",
                headers={"Authorization": f"Bearer {LLM_API_KEY}", "Content-Type": "application/json"},
                json={"model": LLM_MODEL, "messages": messages, "temperature": temperature, "max_tokens": max_tokens},
                timeout=30
            )
            data = resp.json()
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        return f"[LLM Error: {str(e)}] — Please check your LLM API configuration."

def _demo_response(messages: list[dict]) -> str:
    """Template-based fallback when no LLM is configured."""
    user_msg = messages[-1]["content"] if messages else ""
    return f"[Demo Mode — Connect LLM API for real generation]\n\nBased on your input: \"{user_msg[:100]}...\"\n\nThis is a placeholder response. Configure LLM_API_KEY in config.py to enable AI-powered generation."
