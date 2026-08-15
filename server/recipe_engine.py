from typing import List, Dict, Any
from datetime import date
from expiry_engine import calculate_item_status

DEFAULT_RECIPES = [
    {
        "id": "recipe-spinach-pasta",
        "title": "Creamy Garlic Spinach Pasta",
        "description": "A delicious 20-minute comfort meal designed to utilize fresh spinach and milk before they expire.",
        "prep_time_mins": 20,
        "dietary_type": "Vegetarian",
        "primary_target_ingredient": "Spinach",
        "used_ingredients": [
            {"name": "Spinach", "quantity": "1 pack", "status": "expiring_today"},
            {"name": "Milk", "quantity": "250 ml", "status": "use_soon"},
            {"name": "Garlic", "quantity": "4 cloves", "status": "fresh"},
            {"name": "Pasta / Spaghetti", "quantity": "200 g", "status": "fresh"}
        ],
        "missing_ingredients": [
            {"name": "Olive Oil", "quantity": "1 tbsp"},
            {"name": "Black Pepper", "quantity": "1/2 tsp"}
        ],
        "instructions": [
            "Boil pasta in salted water until al dente (approx 8-10 mins).",
            "Sauté minced garlic in a pan with a splash of olive oil until fragrant.",
            "Add fresh spinach and cook until wilted (2 minutes).",
            "Pour in milk, simmer gently, then toss with cooked pasta and cracked black pepper.",
            "Serve warm and enjoy your zero-waste meal!"
        ],
        "waste_reduction_score": 98
    },
    {
        "id": "recipe-tomato-soup",
        "title": "Roasted Tomato & Garlic Soup",
        "description": "Rich, comforting soup that rescues ripe tomatoes and garlic before they go soft.",
        "prep_time_mins": 25,
        "dietary_type": "Vegan",
        "primary_target_ingredient": "Tomatoes",
        "used_ingredients": [
            {"name": "Tomatoes", "quantity": "500 g", "status": "use_soon"},
            {"name": "Garlic", "quantity": "6 cloves", "status": "fresh"},
            {"name": "Bread", "quantity": "2 slices", "status": "use_soon"}
        ],
        "missing_ingredients": [
            {"name": "Vegetable Broth", "quantity": "1 cup"},
            {"name": "Basil", "quantity": "few leaves"}
        ],
        "instructions": [
            "Halve tomatoes and roast with garlic cloves at 200°C for 20 mins.",
            "Blend roasted tomatoes and garlic with warm vegetable broth until smooth.",
            "Toast bread slices for dipping.",
            "Garnish with fresh basil and serve immediately."
        ],
        "waste_reduction_score": 92
    },
    {
        "id": "recipe-curd-rice",
        "title": "Classic South Indian Curd Rice",
        "description": "Soothing, pro-biotic meal perfect for using up curd and cooked rice.",
        "prep_time_mins": 10,
        "dietary_type": "Vegetarian",
        "primary_target_ingredient": "Curd",
        "used_ingredients": [
            {"name": "Curd / Yogurt", "quantity": "400 g", "status": "use_soon"},
            {"name": "Rice", "quantity": "1 cup (cooked)", "status": "fresh"},
            {"name": "Milk", "quantity": "50 ml", "status": "use_soon"}
        ],
        "missing_ingredients": [
            {"name": "Mustard Seeds", "quantity": "1/2 tsp"},
            {"name": "Curry Leaves", "quantity": "6-8 leaves"}
        ],
        "instructions": [
            "Mash cooked soft rice in a bowl until gentle texture.",
            "Mix in curd, milk, and salt to reach smooth consistency.",
            "Temper mustard seeds and curry leaves in hot oil, then pour over curd rice.",
            "Mix well and serve cool."
        ],
        "waste_reduction_score": 95
    }
]

def generate_recipe_suggestions(inventory_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Intelligently cross-references pantry inventory expiring items with recipe templates.
    """
    if not inventory_items:
        return DEFAULT_RECIPES

    expiring_names = []
    for item in inventory_items:
        st = calculate_item_status(item.get("expiry_date", str(date.today())))
        if st["status"] in ["expiring_today", "use_soon"]:
            expiring_names.append(item.get("name", "").lower())

    suggestions = []
    for rec in DEFAULT_RECIPES:
        target = rec.get("primary_target_ingredient", "").lower()
        match_score = 70
        if any(target in exp_name for exp_name in expiring_names):
            match_score = 98

        recipe_copy = dict(rec)
        recipe_copy["match_score"] = match_score
        suggestions.append(recipe_copy)

    # Sort recipes by match_score descending
    suggestions.sort(key=lambda r: r["match_score"], reverse=True)
    return suggestions
