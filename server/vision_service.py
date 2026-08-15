import os
from datetime import date, timedelta
from typing import List, Dict, Any
from expiry_engine import estimate_expiry_days

def extract_items_from_receipt_text(raw_text: str) -> List[Dict[str, Any]]:
    """
    Parses OCR text lines into structured item objects.
    """
    lines = [line.strip() for line in raw_text.split('\n') if line.strip()]
    detected = []
    
    for line in lines:
        # Ignore total, tax, header lines
        line_lower = line.lower()
        if any(keyword in line_lower for keyword in ["total", "subtotal", "tax", "cash", "card", "thank you", "store", "receipt", "date"]):
            continue
            
        parts = line.split()
        if len(parts) == 0:
            continue
            
        # Extract potential quantity or unit
        name = " ".join([p for p in parts if not p.replace('.', '').replace('$', '').replace('₹', '').isdigit()])
        if not name:
            name = line

        category = infer_category(name)
        shelf_days = estimate_expiry_days(name, category)
        exp_date = (date.today() + timedelta(days=shelf_days)).strftime("%Y-%m-%d")

        detected.append({
            "name": name.title(),
            "category": category,
            "quantity": 1.0,
            "unit": infer_unit(name, category),
            "purchase_date": str(date.today()),
            "expiry_date": exp_date,
            "confidence": 0.95,
            "storage_location": infer_location(category)
        })
        
    return detected

def simulate_scan_extraction(scan_type: str = "receipt") -> List[Dict[str, Any]]:
    """
    Returns realistic extracted items for receipts, single products, or multi-item scans.
    """
    today = date.today()
    if scan_type == "product":
        return [
            {
                "name": "Amul Fresh Taaza Milk 1L",
                "category": "Dairy",
                "quantity": 1.0,
                "unit": "L",
                "purchase_date": str(today),
                "expiry_date": str(today + timedelta(days=3)),
                "confidence": 0.98,
                "storage_location": "Fridge"
            }
        ]
    elif scan_type == "barcode":
        return [
            {
                "name": "Organic Spinach Leaves 250g",
                "category": "Vegetables",
                "quantity": 1.0,
                "unit": "pack",
                "purchase_date": str(today),
                "expiry_date": str(today + timedelta(days=2)),
                "confidence": 0.99,
                "storage_location": "Fridge"
            }
        ]
    else:
        # Default receipt scan (matches prompt scenario!)
        return [
            {
                "name": "Amul T-Special Milk",
                "category": "Dairy",
                "quantity": 2.0,
                "unit": "L",
                "purchase_date": str(today),
                "expiry_date": str(today + timedelta(days=2)),
                "confidence": 0.96,
                "storage_location": "Fridge"
            },
            {
                "name": "Whole Wheat Bread",
                "category": "Bakery",
                "quantity": 1.0,
                "unit": "pack",
                "purchase_date": str(today),
                "expiry_date": str(today + timedelta(days=3)),
                "confidence": 0.94,
                "storage_location": "Pantry"
            },
            {
                "name": "Fresh Hybrid Tomatoes",
                "category": "Vegetables",
                "quantity": 1.0,
                "unit": "kg",
                "purchase_date": str(today),
                "expiry_date": str(today + timedelta(days=5)),
                "confidence": 0.91,
                "storage_location": "Pantry"
            },
            {
                "name": "Amul Masti Dahi Curd",
                "category": "Dairy",
                "quantity": 500.0,
                "unit": "g",
                "purchase_date": str(today),
                "expiry_date": str(today + timedelta(days=4)),
                "confidence": 0.93,
                "storage_location": "Fridge"
            },
            {
                "name": "Fresh Baby Spinach",
                "category": "Vegetables",
                "quantity": 1.0,
                "unit": "pack",
                "purchase_date": str(today),
                "expiry_date": str(today + timedelta(days=1)),
                "confidence": 0.88,
                "storage_location": "Fridge"
            }
        ]

def infer_category(name: str) -> str:
    n = name.lower()
    if any(w in n for w in ["milk", "curd", "dahi", "cheese", "paneer", "butter", "yogurt", "cream"]):
        return "Dairy"
    if any(w in n for w in ["spinach", "tomato", "potato", "onion", "garlic", "carrot", "cucumber", "broccoli", "cabbage"]):
        return "Vegetables"
    if any(w in n for w in ["apple", "banana", "orange", "mango", "berry", "grape", "lemon"]):
        return "Fruits"
    if any(w in n for w in ["rice", "wheat", "atta", "pasta", "noodle", "dal", "oats"]):
        return "Grains"
    if any(w in n for w in ["chip", "biscuit", "snack", "chocolate", "nut", "cookie"]):
        return "Snacks"
    if any(w in n for w in ["juice", "soda", "water", "tea", "coffee", "coke"]):
        return "Beverages"
    return "Other"

def infer_unit(name: str, category: str) -> str:
    if category == "Dairy":
        return "L" if "milk" in name.lower() else "g"
    if category == "Vegetables" or category == "Fruits":
        return "kg"
    return "pcs"

def infer_location(category: str) -> str:
    if category in ["Dairy", "Vegetables", "Fruits"]:
        return "Fridge"
    return "Pantry"
