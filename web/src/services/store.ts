import { InventoryItem, ExtractedScanItem, Recipe, ShoppingItem, InsightsData, HouseholdProfile, ScreenType, ExpiryStatus } from '../types';

const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'item-1',
    name: 'Fresh Baby Spinach',
    category: 'Vegetables',
    quantity: 1,
    unit: 'pack',
    purchaseDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date().toISOString().split('T')[0], // Expires today!
    storageLocation: 'Fridge',
    status: 'expiring_today',
    daysRemaining: 0,
  },
  {
    id: 'item-2',
    name: 'Amul T-Special Milk',
    category: 'Dairy',
    quantity: 2,
    unit: 'L',
    purchaseDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    storageLocation: 'Fridge',
    status: 'use_soon',
    daysRemaining: 1,
  },
  {
    id: 'item-3',
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    quantity: 1,
    unit: 'pack',
    purchaseDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days
    storageLocation: 'Pantry',
    status: 'use_soon',
    daysRemaining: 3,
  },
  {
    id: 'item-4',
    name: 'Fresh Hybrid Tomatoes',
    category: 'Vegetables',
    quantity: 1,
    unit: 'kg',
    purchaseDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    storageLocation: 'Pantry',
    status: 'fresh',
    daysRemaining: 5,
  },
  {
    id: 'item-5',
    name: 'Garlic Cloves',
    category: 'Vegetables',
    quantity: 200,
    unit: 'g',
    purchaseDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    storageLocation: 'Pantry',
    status: 'fresh',
    daysRemaining: 14,
  },
  {
    id: 'item-6',
    name: 'Spaghetti Pasta',
    category: 'Grains',
    quantity: 500,
    unit: 'g',
    purchaseDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 86400000 * 120).toISOString().split('T')[0],
    storageLocation: 'Cabinet',
    status: 'fresh',
    daysRemaining: 120,
  }
];

const INITIAL_SHOPPING: ShoppingItem[] = [
  { id: 'shop-1', name: 'Olive Oil 500ml', category: 'Oils', quantity: 1, unit: 'bottle', isAiSuggested: false, isCompleted: false },
  { id: 'shop-2', name: 'Amul Milk 1L', category: 'Dairy', quantity: 2, unit: 'L', isAiSuggested: true, reason: 'You finish milk every 5 days. Running low soon.', isCompleted: false },
  { id: 'shop-3', name: 'Greek Yogurt', category: 'Dairy', quantity: 2, unit: 'cups', isAiSuggested: true, reason: 'High consumption history', isCompleted: false }
];

export function computeDaysAndStatus(expiryDateStr: string): { daysRemaining: number; status: ExpiryStatus } {
  const exp = new Date(expiryDateStr);
  const now = new Date();
  exp.setHours(0,0,0,0);
  now.setHours(0,0,0,0);
  const diffTime = exp.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let status: ExpiryStatus = 'fresh';
  if (daysRemaining < 0) status = 'expired';
  else if (daysRemaining === 0) status = 'expiring_today';
  else if (daysRemaining <= 3) status = 'use_soon';

  return { daysRemaining, status };
}

export function computePantryHealthScore(items: InventoryItem[]): number {
  if (items.length === 0) return 100;
  let penalty = 0;
  items.forEach(item => {
    if (item.status === 'expired') penalty += 25;
    else if (item.status === 'expiring_today') penalty += 15;
    else if (item.status === 'use_soon') penalty += 5;
  });
  const rawScore = 100 - (penalty / items.length);
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}
