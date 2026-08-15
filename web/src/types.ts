export type ExpiryStatus = 'fresh' | 'use_soon' | 'expiring_today' | 'expired';

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Dairy' | 'Vegetables' | 'Fruits' | 'Grains' | 'Snacks' | 'Beverages' | 'Household' | 'Bakery' | 'Other';
  quantity: number;
  unit: string;
  purchaseDate: string;
  expiryDate: string;
  storageLocation: 'Fridge' | 'Freezer' | 'Pantry' | 'Cabinet';
  price?: number; // Optional explicit purchase price
  status: ExpiryStatus;
  daysRemaining: number;
  isEstimatedExpiry?: boolean; // True if Haven estimated date; False if user provided
}

export interface WasteHistoryItem {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  price?: number;
  actionType: 'used_before_expiry' | 'wasted';
  loggedAt: string;
}

export interface ExtractedScanItem {
  id?: string;
  name: string;
  category: InventoryItem['category'];
  quantity: number;
  unit: string;
  purchaseDate: string;
  expiryDate: string;
  confidence: number;
  storageLocation: InventoryItem['storageLocation'];
}

export interface RecipeIngredient {
  name: string;
  quantity: string;
  status?: ExpiryStatus;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTimeMins: number;
  dietaryType: string;
  primaryTargetIngredient: string;
  usedIngredients: RecipeIngredient[];
  missingIngredients: RecipeIngredient[];
  instructions: string[];
  wasteReductionScore: number;
  matchScore?: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  isAiSuggested: boolean;
  reason?: string;
  isCompleted: boolean;
}

export interface InsightsData {
  currencySymbol: string;
  totalFoodSaved: number;
  itemsRescuedCount: number;
  itemsWastedCount: number;
  mostFrequentlyWasted: string;
  wasteReductionPercentage: number;
  pantryHealthScore: number;
  co2AvoidedKg: number;
  waterSavedLiters: number;
}

export interface HouseholdProfile {
  name: string;
  language: 'en' | 'hi' | 'kn' | 'ta' | 'te';
  dietaryPrefs: string[];
  membersCount: number;
}

export type ScreenType =
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'home'
  | 'pantry'
  | 'add-item'
  | 'scan'
  | 'scan-review'
  | 'recipes'
  | 'shopping'
  | 'insights'
  | 'profile';
