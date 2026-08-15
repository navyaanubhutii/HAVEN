from typing import List, Dict, Any

ITEM_COST_ESTIMATES = {
    "spinach": 40.0,
    "milk": 66.0,
    "bread": 45.0,
    "tomatoes": 60.0,
    "curd": 40.0,
    "paneer": 120.0,
    "apples": 150.0,
    "cheese": 180.0
}

def calculate_insights_summary(waste_history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Computes household analytics from actual logged waste history events.
    Does NOT fabricate monetary savings if purchase price is missing.
    """
    if not waste_history:
        return {
            "has_data": False,
            "currency_symbol": "₹",
            "total_food_saved": 0.0,
            "items_rescued_count": 0,
            "items_wasted_count": 0,
            "most_frequently_wasted": "None",
            "waste_reduction_percentage": 0.0,
            "pantry_health_score": 100,
            "co2_avoided_kg": 0.0,
            "water_saved_liters": 0
        }

    total_saved = 0.0
    has_explicit_price = False
    rescued_count = 0
    wasted_count = 0
    waste_counts: Dict[str, int] = {}

    for entry in waste_history:
        act = entry.get("action_type", "used_before_expiry")
        item_name = entry.get("item_name", "Unknown Item")
        price = float(entry.get("price", 0.0) or 0.0)

        if act in ["rescued", "used_before_expiry"]:
            rescued_count += 1
            if price > 0:
                total_saved += price
                has_explicit_price = True
        elif act == "wasted":
            wasted_count += 1
            waste_counts[item_name] = waste_counts.get(item_name, 0) + 1

    top_wasted = max(waste_counts.items(), key=lambda x: x[1])[0] if waste_counts else "None"
    total_logged = rescued_count + wasted_count
    reduction_pct = round((rescued_count / float(total_logged)) * 100, 1) if total_logged > 0 else 0.0

    return {
        "has_data": total_logged > 0,
        "currency_symbol": "₹",
        "total_food_saved": total_saved if has_explicit_price else 0.0,
        "has_explicit_price": has_explicit_price,
        "items_rescued_count": rescued_count,
        "items_wasted_count": wasted_count,
        "most_frequently_wasted": top_wasted,
        "waste_reduction_percentage": reduction_pct,
        "pantry_health_score": 100,
        "co2_avoided_kg": round(rescued_count * 0.4, 1),
        "water_saved_liters": rescued_count * 15
    }
