"""
Agent 5: Supply Chain & Inventory Coordination Agent
Manages inventory across Amazon FBA and TikTok Shop warehouses.
- Sales velocity tracking and demand forecasting
- Multi-warehouse inventory optimization
- Restock alerts and purchase order suggestions
- FBA inbound capacity planning
"""
import time, math, random
from datetime import datetime, timedelta

# ============================================================
# Inventory database (demo — replace with ERP/API integration)
# ============================================================

INVENTORY = {
    "earbuds": {
        "sku": "PS-X1-BLK",
        "name": "ProSound X1 Wireless Earbuds",
        "variants": {
            "Black": {"amazon_fba": 450, "amazon_fbm": 0, "tiktok_warehouse": 180, "in_transit": 500, "supplier_stock": 5000},
            "White": {"amazon_fba": 280, "amazon_fbm": 0, "tiktok_warehouse": 120, "in_transit": 300, "supplier_stock": 5000},
            "Navy": {"amazon_fba": 180, "amazon_fbm": 0, "tiktok_warehouse": 60, "in_transit": 0, "supplier_stock": 5000},
        },
        "unit_cost": 12.50,
        "moq": 500,
        "lead_time_days": 21,
        "shipping_time_sea": 25,
        "shipping_time_air": 7,
    },
    "yoga_mat": {
        "sku": "ZF-PM-PRP",
        "name": "ZenFlex Premium Yoga Mat",
        "variants": {
            "Purple": {"amazon_fba": 320, "amazon_fbm": 50, "tiktok_warehouse": 150, "in_transit": 200, "supplier_stock": 3000},
            "Teal": {"amazon_fba": 180, "amazon_fbm": 30, "tiktok_warehouse": 80, "in_transit": 0, "supplier_stock": 3000},
            "Grey": {"amazon_fba": 95, "amazon_fbm": 20, "tiktok_warehouse": 40, "in_transit": 0, "supplier_stock": 3000},
            "Pink": {"amazon_fba": 210, "amazon_fbm": 0, "tiktok_warehouse": 110, "in_transit": 150, "supplier_stock": 3000},
        },
        "unit_cost": 8.20,
        "moq": 300,
        "lead_time_days": 18,
        "shipping_time_sea": 25,
        "shipping_time_air": 7,
    },
    "desk_lamp": {
        "sku": "LP-SM-WHT",
        "name": "LumiPro Smart Desk Lamp",
        "variants": {
            "White": {"amazon_fba": 150, "amazon_fbm": 0, "tiktok_warehouse": 80, "in_transit": 0, "supplier_stock": 2000},
            "Black": {"amazon_fba": 120, "amazon_fbm": 0, "tiktok_warehouse": 60, "in_transit": 0, "supplier_stock": 2000},
            "Silver": {"amazon_fba": 45, "amazon_fbm": 0, "tiktok_warehouse": 25, "in_transit": 0, "supplier_stock": 2000},
        },
        "unit_cost": 11.80,
        "moq": 200,
        "lead_time_days": 25,
        "shipping_time_sea": 28,
        "shipping_time_air": 8,
    }
}

# Sales velocity (units/day) — demo data
SALES_VELOCITY = {
    "earbuds": {"Black": {"amazon": 18, "tiktok": 12}, "White": {"amazon": 12, "tiktok": 8}, "Navy": {"amazon": 6, "tiktok": 3}},
    "yoga_mat": {"Purple": {"amazon": 8, "tiktok": 6}, "Teal": {"amazon": 5, "tiktok": 3}, "Grey": {"amazon": 3, "tiktok": 2}, "Pink": {"amazon": 7, "tiktok": 5}},
    "desk_lamp": {"White": {"amazon": 5, "tiktok": 3}, "Black": {"amazon": 4, "tiktok": 2}, "Silver": {"amazon": 2, "tiktok": 1}},
}

# ============================================================
# Core functions
# ============================================================

def get_inventory_overview():
    """Get full inventory status across all warehouses."""
    overview = []
    total_value = 0
    alerts = []

    for product_key, product in INVENTORY.items():
        velocity = SALES_VELOCITY.get(product_key, {})
        product_data = {
            "key": product_key,
            "sku": product["sku"],
            "name": product["name"],
            "unit_cost": product["unit_cost"],
            "variants": [],
            "totals": {"amazon_fba": 0, "tiktok_warehouse": 0, "in_transit": 0, "total": 0},
        }

        for variant, stock in product["variants"].items():
            v_velocity = velocity.get(variant, {"amazon": 0, "tiktok": 0})
            total_daily = v_velocity["amazon"] + v_velocity["tiktok"]
            total_stock = stock["amazon_fba"] + stock["tiktok_warehouse"]
            days_of_stock = round(total_stock / max(total_daily, 0.1))
            amazon_days = round(stock["amazon_fba"] / max(v_velocity["amazon"], 0.1))
            tiktok_days = round(stock["tiktok_warehouse"] / max(v_velocity["tiktok"], 0.1))

            variant_data = {
                "variant": variant,
                **stock,
                "daily_velocity": total_daily,
                "amazon_velocity": v_velocity["amazon"],
                "tiktok_velocity": v_velocity["tiktok"],
                "days_of_stock": days_of_stock,
                "amazon_days": amazon_days,
                "tiktok_days": tiktok_days,
                "status": "critical" if days_of_stock < 14 else "warning" if days_of_stock < 30 else "healthy",
            }
            product_data["variants"].append(variant_data)

            for key in ["amazon_fba", "tiktok_warehouse", "in_transit"]:
                product_data["totals"][key] += stock[key]
            product_data["totals"]["total"] += total_stock + stock["in_transit"]
            total_value += (total_stock + stock["in_transit"]) * product["unit_cost"]

            # Generate alerts
            if days_of_stock < 14:
                alerts.append({
                    "severity": "critical",
                    "product": product["name"],
                    "variant": variant,
                    "message": f"Only {days_of_stock} days of stock remaining ({total_stock} units). Immediate restock needed!",
                })
            elif days_of_stock < 30:
                alerts.append({
                    "severity": "warning",
                    "product": product["name"],
                    "variant": variant,
                    "message": f"{days_of_stock} days of stock remaining. Plan restock within {days_of_stock - 14} days.",
                })
            if amazon_days < 10 and stock["in_transit"] == 0:
                alerts.append({
                    "severity": "critical",
                    "product": product["name"],
                    "variant": variant,
                    "message": f"Amazon FBA stock critically low ({stock['amazon_fba']} units, {amazon_days} days). No inbound shipment found.",
                })

        overview.append(product_data)

    return {"products": overview, "total_inventory_value": round(total_value, 2), "alerts": sorted(alerts, key=lambda a: 0 if a["severity"]=="critical" else 1)}

def generate_restock_plan(product_key: str):
    """Generate detailed restocking plan for a product."""
    product = INVENTORY.get(product_key)
    if not product:
        return {"error": f"Product '{product_key}' not found"}

    velocity = SALES_VELOCITY.get(product_key, {})
    plan = {
        "product": product["name"],
        "sku": product["sku"],
        "unit_cost": product["unit_cost"],
        "moq": product["moq"],
        "lead_time_days": product["lead_time_days"],
        "orders": [],
        "total_units": 0,
        "total_cost": 0,
    }

    target_days = 60  # Target 60 days of stock

    for variant, stock in product["variants"].items():
        v_velocity = velocity.get(variant, {"amazon": 0, "tiktok": 0})
        total_daily = v_velocity["amazon"] + v_velocity["tiktok"]
        current_stock = stock["amazon_fba"] + stock["tiktok_warehouse"] + stock["in_transit"]
        target_stock = math.ceil(total_daily * target_days)
        gap = max(0, target_stock - current_stock)

        if gap > 0:
            # Round up to MOQ
            order_qty = max(gap, product["moq"])
            order_qty = math.ceil(order_qty / 50) * 50  # Round to nearest 50

            # Allocation between warehouses
            amazon_share = v_velocity["amazon"] / max(total_daily, 0.1)
            amazon_qty = round(order_qty * amazon_share)
            tiktok_qty = order_qty - amazon_qty

            order = {
                "variant": variant,
                "current_stock": current_stock,
                "in_transit": stock["in_transit"],
                "target_stock": target_stock,
                "gap": gap,
                "order_quantity": order_qty,
                "allocation": {"amazon_fba": amazon_qty, "tiktok_warehouse": tiktok_qty},
                "cost": round(order_qty * product["unit_cost"], 2),
                "urgency": "urgent" if (current_stock / max(total_daily, 0.1)) < 14 else "normal",
                "ship_method": "air" if (current_stock / max(total_daily, 0.1)) < 20 else "sea",
                "estimated_arrival": (datetime.now() + timedelta(days=product["lead_time_days"] + (product["shipping_time_air"] if (current_stock / max(total_daily, 0.1)) < 20 else product["shipping_time_sea"]))).strftime("%Y-%m-%d"),
            }
            plan["orders"].append(order)
            plan["total_units"] += order_qty
            plan["total_cost"] += order["cost"]

    plan["total_cost"] = round(plan["total_cost"], 2)
    return plan

def forecast_demand(product_key: str, days: int = 30):
    """Simple demand forecasting based on velocity + trends."""
    velocity = SALES_VELOCITY.get(product_key, {})
    product = INVENTORY.get(product_key, {})
    if not velocity:
        return {"error": f"No velocity data for '{product_key}'"}

    forecast = []
    base_date = datetime.now()

    for variant, v_vel in velocity.items():
        stock = product["variants"].get(variant, {})
        daily_total = v_vel["amazon"] + v_vel["tiktok"]
        current_total = stock.get("amazon_fba", 0) + stock.get("tiktok_warehouse", 0)

        # Simple projection with slight randomness to simulate real forecasting
        daily_forecast = []
        running_stock = current_total
        stockout_date = None

        for d in range(days):
            # Add some weekly seasonality
            day_of_week = (base_date + timedelta(days=d)).weekday()
            multiplier = 1.2 if day_of_week in [5, 6] else 0.9 if day_of_week == 1 else 1.0
            projected_sales = round(daily_total * multiplier * random.uniform(0.85, 1.15))
            running_stock = max(0, running_stock - projected_sales)

            if running_stock == 0 and stockout_date is None:
                stockout_date = (base_date + timedelta(days=d)).strftime("%Y-%m-%d")

            daily_forecast.append({
                "date": (base_date + timedelta(days=d)).strftime("%Y-%m-%d"),
                "projected_sales": projected_sales,
                "projected_stock": running_stock,
            })

        forecast.append({
            "variant": variant,
            "avg_daily_velocity": daily_total,
            "current_stock": current_total,
            "projected_30d_sales": sum(f["projected_sales"] for f in daily_forecast),
            "stockout_date": stockout_date,
            "daily_forecast": daily_forecast,
        })

    return {"product": product.get("name", product_key), "forecast_days": days, "variants": forecast}

def get_supply_chain_stats():
    """Get aggregate supply chain statistics."""
    overview = get_inventory_overview()
    total_units = sum(p["totals"]["total"] for p in overview["products"])
    critical = len([a for a in overview["alerts"] if a["severity"] == "critical"])
    warning = len([a for a in overview["alerts"] if a["severity"] == "warning"])

    return {
        "total_skus": sum(len(p["variants"]) for p in overview["products"]),
        "total_units": total_units,
        "total_value": overview["total_inventory_value"],
        "critical_alerts": critical,
        "warning_alerts": warning,
        "warehouses": {
            "amazon_fba": sum(p["totals"]["amazon_fba"] for p in overview["products"]),
            "tiktok": sum(p["totals"]["tiktok_warehouse"] for p in overview["products"]),
            "in_transit": sum(p["totals"]["in_transit"] for p in overview["products"]),
        }
    }
