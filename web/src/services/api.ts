import { InventoryItem, ExtractedScanItem, Recipe, InsightsData, ExpiryStatus } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

export interface ApiStatusResponse {
  isOnline: boolean;
  app?: string;
  version?: string;
}

const CATEGORY_DEFAULT_DAYS: Record<string, number> = {
  Dairy: 5,
  Vegetables: 4,
  Fruits: 6,
  Grains: 90,
  Snacks: 45,
  Beverages: 14,
  Bakery: 4,
  Household: 180,
  Other: 7
};

export const api = {
  /**
   * Health check to test if FastAPI server is accessible
   */
  async healthCheck(): Promise<ApiStatusResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout
      const res = await fetch(`${API_BASE_URL}/`, { method: 'GET', signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) return { isOnline: false };
      const data = await res.json();
      return { isOnline: true, app: data.app, version: data.version };
    } catch (err) {
      return { isOnline: false };
    }
  },

  /**
   * Call FastAPI rule engine for shelf-life estimation by product name & category.
   * If server is offline or fails, uses local category dictionary without crashing.
   */
  async estimateExpiryDays(name: string, category: string): Promise<number> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const url = `${API_BASE_URL}/api/expiry/estimate-days?name=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        return data.estimated_days || CATEGORY_DEFAULT_DAYS[category] || 7;
      }
    } catch (e) {
      // Fail-safe offline fallback
    }
    return CATEGORY_DEFAULT_DAYS[category] || 7;
  },

  /**
   * Call FastAPI expiry calculator.
   * If server is offline, computes days remaining deterministically locally.
   */
  async calculateExpiry(expiryDate: string): Promise<{ days_remaining: number; status: ExpiryStatus; label: string; color: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE_URL}/api/expiry/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiry_date: expiryDate }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    // Fallback deterministic local calculation (never throws)
    const exp = new Date(expiryDate);
    const now = new Date();
    exp.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    const days = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    let status: ExpiryStatus = 'fresh';
    if (days < 0) status = 'expired';
    else if (days === 0) status = 'expiring_today';
    else if (days <= 3) status = 'use_soon';

    return {
      days_remaining: days,
      status,
      label: days <= 0 ? (days === 0 ? 'Expires today' : 'Expired') : `Expires in ${days} days`,
      color: status === 'fresh' ? 'green' : status === 'use_soon' ? 'amber' : 'red'
    };
  },

  /**
   * Call FastAPI multipart form endpoint for Scan & OCR item extraction.
   * If backend is offline, returns local dev simulation items for human review.
   */
  async extractScanItems(scanType: string, file?: File): Promise<{ success: boolean; detected_items: ExtractedScanItem[]; method: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout for scans
      const formData = new FormData();
      formData.append('scan_type', scanType);
      if (file) {
        formData.append('file', file);
      }

      const res = await fetch(`${API_BASE_URL}/api/scan/extract`, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    // Fallback simulated extraction for offline dev testing (requires human review)
    const today = new Date().toISOString().split('T')[0];
    return {
      success: true,
      method: 'offline_dev_simulation',
      detected_items: [
        {
          name: 'Amul T-Special Milk',
          category: 'Dairy',
          quantity: 2,
          unit: 'L',
          purchaseDate: today,
          expiryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          confidence: 0.96,
          storageLocation: 'Fridge'
        },
        {
          name: 'Whole Wheat Bread',
          category: 'Bakery',
          quantity: 1,
          unit: 'pack',
          purchaseDate: today,
          expiryDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          confidence: 0.94,
          storageLocation: 'Pantry'
        },
        {
          name: 'Fresh Hybrid Tomatoes',
          category: 'Vegetables',
          quantity: 1,
          unit: 'kg',
          purchaseDate: today,
          expiryDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
          confidence: 0.91,
          storageLocation: 'Pantry'
        }
      ]
    };
  }
};
