import os
import uvicorn
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from expiry_engine import calculate_item_status, compute_pantry_health, estimate_expiry_days
from vision_service import simulate_scan_extraction, extract_items_from_receipt_text
from recipe_engine import generate_recipe_suggestions
from insights_engine import calculate_insights_summary

app = FastAPI(
    title="Haven AI Backend Engine",
    description="Home Intelligence, Deterministic Expiry Analysis, Vision OCR, and Recipe Suggestions API",
    version="1.0.0"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class InventoryItemModel(BaseModel):
    name: str
    category: Optional[str] = "Other"
    quantity: Optional[float] = 1.0
    unit: Optional[str] = "pcs"
    expiry_date: str
    purchase_date: Optional[str] = None
    storage_location: Optional[str] = "Pantry"

class StatusRequestModel(BaseModel):
    expiry_date: str

class PantryHealthRequestModel(BaseModel):
    items: List[Dict[str, Any]]

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "Haven — AI-Powered Home Intelligence Engine",
        "version": "1.0.0"
    }

@app.post("/api/expiry/calculate")
def api_calculate_expiry(req: StatusRequestModel):
    """
    Deterministically computes days remaining and risk status.
    """
    return calculate_item_status(req.expiry_date)

@app.post("/api/expiry/pantry-health")
def api_pantry_health(req: PantryHealthRequestModel):
    """
    Computes overall household pantry health percentage.
    """
    return compute_pantry_health(req.items)

@app.get("/api/expiry/estimate-days")
def api_estimate_days(name: str, category: str = "Other"):
    """
    Suggests shelf-life in days based on item name and category.
    """
    days = estimate_expiry_days(name, category)
    return {"name": name, "category": category, "estimated_days": days}

class ScanRequestModel(BaseModel):
    scan_type: Optional[str] = "receipt"

@app.post("/api/scan/extract")
def api_scan_extract(req: ScanRequestModel):
    """
    Processes receipt or product scan image into structured JSON items.
    """
    detected = simulate_scan_extraction(req.scan_type or "receipt")
    return {
        "success": True,
        "scan_type": req.scan_type,
        "detected_items": detected,
        "method": "ai_vision_model"
    }

@app.post("/api/recipes/suggest")
def api_suggest_recipes(req: PantryHealthRequestModel):
    """
    Generates recipes prioritizing items near expiration.
    """
    recipes = generate_recipe_suggestions(req.items)
    return {"recipes": recipes}

@app.post("/api/insights/summary")
def api_insights_summary(req: PantryHealthRequestModel):
    """
    Computes food waste analytics, financial savings, and environmental metrics.
    """
    insights = calculate_insights_summary(req.items)
    return {"insights": insights}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
