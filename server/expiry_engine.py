from datetime import datetime, date, timedelta
from typing import List, Dict, Any

# Category default shelf-life estimates (in days)
SHELF_LIFE_ESTIMATES: Dict[str, int] = {
    "Dairy": 5,
    "Vegetables": 4,
    "Fruits": 6,
    "Grains": 90,
    "Snacks": 45,
    "Beverages": 14,
    "Household": 180,
    "Meat & Seafood": 3,
    "Bakery": 4,
    "Other": 10
}

# Specific product overrides (in days)
PRODUCT_SHELF_LIFE: Dict[str, int] = {
    "spinach": 2,
    "milk": 4,
    "bread": 4,
    "tomatoes": 5,
    "curd": 5,
    "yogurt": 7,
    "paneer": 4,
    "bananas": 4,
    "apples": 14,
    "rice": 180,
    "pasta": 180,
    "eggs": 14,
    "cheese": 14,
    "garlic": 30,
    "onions": 20,
    "potatoes": 25,
    "butter": 30
}

def estimate_expiry_days(product_name: str, category: str = "Other") -> int:
    name_lower = product_name.lower()
    for key, days in PRODUCT_SHELF_LIFE.items():
        if key in name_lower:
            return days
    return SHELF_LIFE_ESTIMATES.get(category, 7)

def calculate_item_status(expiry_date_str: str) -> Dict[str, Any]:
    """
    Deterministically computes days remaining and risk status.
    No LLM call needed!
    """
    try:
        if isinstance(expiry_date_str, date):
            exp_date = expiry_date_str
        else:
            exp_date = datetime.strptime(str(expiry_date_str), "%Y-%m-%d").date()
    except Exception:
        exp_date = date.today() + timedelta(days=7)

    today = date.today()
    days_remaining = (exp_date - today).days

    if days_remaining < 0:
        status = "expired"
        label = "Expired"
        color = "red"
    elif days_remaining == 0:
        status = "expiring_today"
        label = "Expires today"
        color = "red"
    elif days_remaining <= 3:
        status = "use_soon"
        label = f"Expires in {days_remaining} day{'s' if days_remaining > 1 else ''}"
        color = "amber"
    else:
        status = "fresh"
        label = f"Fresh ({days_remaining} days left)"
        color = "green"

    return {
        "days_remaining": days_remaining,
        "status": status,
        "label": label,
        "color": color
    }

def compute_pantry_health(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calculates composite Pantry Health Score (0 - 100%).
    Formula:
      Score = 100 - ( (Expired * 25 + ExpiringToday * 15 + UseSoon * 5) / TotalItems )
    """
    if not items:
        return {"health_score": 100, "fresh_count": 0, "use_soon_count": 0, "expiring_today_count": 0, "expired_count": 0}

    total = len(items)
    fresh_cnt = 0
    use_soon_cnt = 0
    expiring_today_cnt = 0
    expired_cnt = 0

    for item in items:
        status_info = calculate_item_status(item.get("expiry_date", str(date.today())))
        st = status_info["status"]
        if st == "fresh":
            fresh_cnt += 1
        elif st == "use_soon":
            use_soon_cnt += 1
        elif st == "expiring_today":
            expiring_today_cnt += 1
        elif st == "expired":
            expired_cnt += 1

    penalty = (expired_cnt * 25.0 + expiring_today_cnt * 15.0 + use_soon_cnt * 5.0) / float(total)
    health_score = max(0, min(100, int(round(100.0 - penalty))))

    return {
        "health_score": health_score,
        "total_items": total,
        "fresh_count": fresh_cnt,
        "use_soon_count": use_soon_cnt,
        "expiring_today_count": expiring_today_cnt,
        "expired_count": expired_cnt
    }
