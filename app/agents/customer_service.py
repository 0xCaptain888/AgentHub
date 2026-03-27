"""
Agent 1: Multi-Platform Customer Service Agent
Handles customer inquiries across TikTok Shop and Amazon.
- Intent classification (pre-sale / after-sale / logistics / complaint)
- Knowledge base RAG retrieval
- Order & logistics lookup via API
- Multi-language auto-detection and response
- Escalation rules for sensitive cases
"""
import time, re, random
from datetime import datetime, timedelta
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# ============================================================
# Knowledge Base for customer service
# ============================================================
KB_ENTRIES = [
    {"q": "shipping time delivery how long", "a": "Standard shipping takes 7-15 business days. Express shipping takes 3-7 business days. You can track your order using the tracking number in your order confirmation email.", "category": "logistics"},
    {"q": "return refund policy exchange", "a": "We offer a 30-day return policy. Items must be unused and in original packaging. To initiate a return, go to your order page and click 'Request Return'. Refunds are processed within 5-7 business days after we receive the item.", "category": "after_sale"},
    {"q": "order status where track package", "a": "You can track your order by: 1) Logging into your account → My Orders → Track Package, 2) Using the tracking number sent to your email, 3) Contacting us with your order number.", "category": "logistics"},
    {"q": "size chart measurement guide fit", "a": "Please refer to the size chart on each product page. We recommend measuring your body and comparing with our chart. If you're between sizes, we suggest sizing up. Each product page has detailed measurements in both cm and inches.", "category": "pre_sale"},
    {"q": "payment method credit card paypal", "a": "We accept: Credit/Debit Cards (Visa, MasterCard, AmEx), PayPal, Apple Pay, Google Pay. All payments are processed securely with SSL encryption.", "category": "pre_sale"},
    {"q": "discount coupon code promotion sale", "a": "Check our store page for current promotions. You can apply coupon codes at checkout. Subscribe to our newsletter for exclusive discount codes. Follow us on TikTok for flash sale announcements.", "category": "pre_sale"},
    {"q": "damaged broken defective quality", "a": "We're sorry about the damaged item. Please send us photos of the damage and your order number. We'll arrange a free replacement or full refund within 24 hours. No need to return the damaged item.", "category": "complaint"},
    {"q": "cancel order change modify", "a": "Orders can be cancelled within 2 hours of placement. After that, the order enters processing. To cancel, go to My Orders → Cancel Order. If already shipped, you'll need to wait for delivery and initiate a return.", "category": "after_sale"},
    {"q": "customs tax duty import", "a": "Import duties and taxes may apply depending on your country's regulations. These charges are the buyer's responsibility. We declare actual product value on customs forms. Most orders under $800 USD are duty-free in the US.", "category": "logistics"},
    {"q": "bulk wholesale order business", "a": "We offer wholesale pricing for bulk orders (50+ units). Contact our business team at wholesale@store.com with: product names, quantities needed, and shipping destination. We typically respond within 24 hours.", "category": "pre_sale"},
    {"q": "warranty guarantee repair", "a": "All products come with a 1-year manufacturer warranty covering defects in materials and workmanship. For warranty claims, email support@store.com with your order number and description of the issue.", "category": "after_sale"},
    {"q": "not received missing lost package", "a": "If your package hasn't arrived within the estimated delivery window: 1) Check tracking status, 2) Check with neighbors/front desk, 3) Contact the carrier. If confirmed lost, we'll send a replacement or full refund at no cost.", "category": "complaint"},
]

INTENT_KEYWORDS = {
    "pre_sale": ["price", "size", "color", "available", "stock", "discount", "coupon", "how much", "difference", "recommend", "material", "什么", "多少", "颜色", "尺码", "有货"],
    "after_sale": ["return", "refund", "exchange", "cancel", "warranty", "repair", "退货", "退款", "换货", "取消"],
    "logistics": ["shipping", "delivery", "track", "where", "when arrive", "customs", "物流", "发货", "到了", "快递"],
    "complaint": ["damaged", "broken", "wrong", "bad", "terrible", "never", "scam", "fake", "差", "坏了", "投诉", "骗"],
}

ESCALATION_KEYWORDS = ["lawyer", "legal", "sue", "report", "bbb", "fraud", "scam", "fda", "government", "律师", "投诉", "举报", "消协"]

# Build TF-IDF index for KB
_kb_texts = [e["q"] + " " + e["a"] for e in KB_ENTRIES]
_kb_vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english')
_kb_matrix = _kb_vectorizer.fit_transform(_kb_texts)

# ============================================================
# Demo order database
# ============================================================
DEMO_ORDERS = {
    "ORD-20250301-001": {"status": "delivered", "items": ["Wireless Earbuds Pro"], "tracking": "UPS1Z999AA10123456784", "shipped_date": "2025-03-03", "delivered_date": "2025-03-10", "platform": "amazon"},
    "ORD-20250305-002": {"status": "in_transit", "items": ["Phone Case Ultra Slim", "Screen Protector 2-Pack"], "tracking": "USPS9400111899223100001", "shipped_date": "2025-03-07", "estimated_delivery": "2025-03-18", "platform": "tiktok"},
    "ORD-20250310-003": {"status": "processing", "items": ["LED Desk Lamp Smart"], "tracking": None, "estimated_ship": "2025-03-12", "platform": "amazon"},
    "ORD-20250312-004": {"status": "returned", "items": ["Yoga Mat Premium"], "tracking": "UPS1Z999AA10123456799", "return_reason": "Wrong size", "refund_status": "processed", "platform": "tiktok"},
}

# ============================================================
# Core functions
# ============================================================

def detect_language(text):
    chinese_chars = len(re.findall(r'[\u4e00-\u9fff]', text))
    return "zh" if chinese_chars > len(text) * 0.15 else "en"

def classify_intent(text):
    text_lower = text.lower()
    scores = {}
    for intent, keywords in INTENT_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in text_lower)
        if score > 0:
            scores[intent] = score
    if not scores:
        return "general"
    return max(scores, key=scores.get)

def check_escalation(text):
    text_lower = text.lower()
    for kw in ESCALATION_KEYWORDS:
        if kw in text_lower:
            return True
    return False

def search_kb(query, top_k=3):
    query_vec = _kb_vectorizer.transform([query])
    scores = cosine_similarity(query_vec, _kb_matrix).flatten()
    top_idx = np.argsort(scores)[::-1][:top_k]
    results = []
    for idx in top_idx:
        if scores[idx] > 0.05:
            results.append({
                "answer": KB_ENTRIES[idx]["a"],
                "category": KB_ENTRIES[idx]["category"],
                "score": round(float(scores[idx]), 4)
            })
    return results

def lookup_order(order_id):
    """Look up order — uses demo DB, replace with real API call."""
    # TODO: Replace with real Amazon SP-API / TikTok Shop API call
    # Amazon: GET /orders/v0/orders/{orderId}
    # TikTok: GET /api/orders/detail/query
    if order_id in DEMO_ORDERS:
        return {"found": True, **DEMO_ORDERS[order_id]}
    return {"found": False, "message": f"Order {order_id} not found"}

def extract_order_id(text):
    match = re.search(r'ORD-\d{8}-\d{3}', text.upper())
    if match:
        return match.group()
    match = re.search(r'#?(\d{6,})', text)
    if match:
        return f"ORD-{match.group(1)}"
    return None

async def handle_customer_message(message: str, conversation_history: list = None, platform: str = "tiktok"):
    """Main entry point for customer service agent."""
    t0 = time.time()
    lang = detect_language(message)
    intent = classify_intent(message)
    needs_escalation = check_escalation(message)

    steps = [
        {"type": "detect", "detail": f"Language: {lang}, Intent: {intent}, Escalation: {needs_escalation}"}
    ]

    # Check for order lookup
    order_id = extract_order_id(message)
    order_info = None
    if order_id:
        order_info = lookup_order(order_id)
        steps.append({"type": "tool_call", "tool": "lookup_order", "input": order_id, "output": order_info})

    # KB retrieval
    kb_results = search_kb(message)
    steps.append({"type": "kb_search", "results_count": len(kb_results), "top_score": kb_results[0]["score"] if kb_results else 0})

    # Generate response
    if needs_escalation:
        response = _escalation_response(lang)
        steps.append({"type": "escalation", "detail": "Routed to human agent"})
    elif order_info and order_info.get("found"):
        response = _order_response(order_info, intent, lang)
    elif kb_results:
        response = kb_results[0]["answer"]
        if lang == "zh":
            response = _translate_hint(response, "zh")
    else:
        response = _fallback_response(intent, lang)

    elapsed = round((time.time() - t0) * 1000, 2)

    return {
        "response": response,
        "intent": intent,
        "language": lang,
        "escalated": needs_escalation,
        "order_info": order_info,
        "kb_results": kb_results[:2],
        "steps": steps,
        "elapsed_ms": elapsed,
        "platform": platform
    }

def _escalation_response(lang):
    if lang == "zh":
        return "您的问题已升级至人工客服。我们的专员将在30分钟内与您联系。请您保持在线，感谢您的耐心等待。工单编号：#ESC-" + str(random.randint(10000, 99999))
    return "Your case has been escalated to a senior support specialist. They will contact you within 30 minutes. Your case reference: #ESC-" + str(random.randint(10000, 99999))

def _order_response(order, intent, lang):
    status_map = {
        "processing": "Your order is being prepared and will ship within 1-2 business days.",
        "in_transit": f"Your order is on the way! Tracking: {order.get('tracking', 'N/A')}. Estimated delivery: {order.get('estimated_delivery', 'N/A')}.",
        "delivered": f"Your order was delivered on {order.get('delivered_date', 'N/A')}.",
        "returned": f"Your return has been processed. Refund status: {order.get('refund_status', 'pending')}.",
    }
    return status_map.get(order["status"], f"Order status: {order['status']}")

def _translate_hint(text, target):
    return f"{text}\n\n[Auto-translate to {target} when LLM is connected]"

def _fallback_response(intent, lang):
    fallbacks = {
        "pre_sale": "Thank you for your interest! Could you tell me which product you're looking at? I'd be happy to help with product details, sizing, or availability.",
        "after_sale": "I'd be happy to help with your after-sale request. Could you provide your order number so I can look into this for you?",
        "logistics": "I can help track your order. Please share your order number or tracking number, and I'll check the latest status for you.",
        "complaint": "I'm sorry to hear about your experience. Please share your order number and details about the issue, and I'll work to resolve this as quickly as possible.",
        "general": "Thank you for reaching out! How can I help you today? I can assist with product questions, order tracking, returns, or any other concerns."
    }
    return fallbacks.get(intent, fallbacks["general"])

def get_service_stats():
    """Return demo customer service statistics."""
    return {
        "today": {"total": 47, "auto_resolved": 38, "escalated": 3, "avg_response_ms": 230},
        "week": {"total": 312, "auto_resolved": 264, "escalated": 18, "satisfaction": 4.6},
        "top_intents": [
            {"intent": "logistics", "count": 128, "pct": 41},
            {"intent": "pre_sale", "count": 84, "pct": 27},
            {"intent": "after_sale", "count": 62, "pct": 20},
            {"intent": "complaint", "count": 38, "pct": 12},
        ],
        "platforms": {"tiktok": 185, "amazon": 127}
    }
