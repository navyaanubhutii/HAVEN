import React, { useState, useEffect } from 'react';
import { InventoryItem, ScreenType } from '../types';
import { ArrowLeft, Sparkles, Check, Calendar } from 'lucide-react';
import { computeDaysAndStatus } from '../services/store';

interface AddItemScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onAddItem: (item: Omit<InventoryItem, 'id' | 'status' | 'daysRemaining'>) => void;
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

export const AddItemScreen: React.FC<AddItemScreenProps> = ({ onNavigate, onAddItem }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('Vegetables');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>('pcs');
  const [purchaseDate, setPurchaseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [storageLocation, setStorageLocation] = useState<InventoryItem['storageLocation']>('Fridge');

  // Auto calculate estimated expiry when category changes
  useEffect(() => {
    const days = CATEGORY_DEFAULT_DAYS[category] || 7;
    const calcDate = new Date();
    calcDate.setDate(calcDate.getDate() + days);
    setExpiryDate(calcDate.toISOString().split('T')[0]);
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddItem({
      name: name.trim(),
      category,
      quantity,
      unit,
      purchaseDate,
      expiryDate: expiryDate || new Date().toISOString().split('T')[0],
      storageLocation
    });

    onNavigate('pantry');
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('pantry')}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">➕ Add Item to Haven</h1>
          <p className="text-xs text-slate-500">Fast manual inventory addition</p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="glass-panel p-5 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Organic Milk, Avocados, Rice"
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-haven-600 text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Quantity
            </label>
            <input
              type="number"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-haven-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Unit
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-haven-600 text-sm"
            >
              <option value="pcs">pcs</option>
              <option value="pack">pack</option>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="L">L</option>
              <option value="ml">ml</option>
              <option value="box">box</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-haven-600 text-sm"
            >
              <option value="Dairy">Dairy</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Grains">Grains</option>
              <option value="Snacks">Snacks</option>
              <option value="Beverages">Beverages</option>
              <option value="Bakery">Bakery</option>
              <option value="Household">Household</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Storage Location
            </label>
            <select
              value={storageLocation}
              onChange={(e) => setStorageLocation(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-haven-600 text-sm"
            >
              <option value="Fridge">Fridge ❄️</option>
              <option value="Freezer">Freezer 🧊</option>
              <option value="Pantry">Pantry 🧺</option>
              <option value="Cabinet">Cabinet 🚪</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Purchase Date
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-haven-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Expiry Date *
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-haven-600 text-sm"
              required
            />
          </div>
        </div>

        {/* AI Rule Suggestion Banner */}
        <div className="p-3 rounded-xl bg-haven-50 dark:bg-haven-950/40 border border-haven-200 dark:border-haven-800/40 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-haven-600 dark:text-haven-400 mt-0.5" />
          <div className="text-xs text-haven-800 dark:text-haven-200">
            <span className="font-bold">Haven Rule:</span> Standard shelf life for {category} is estimated at ~{CATEGORY_DEFAULT_DAYS[category]} days. Expiry date has been auto-calculated.
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-haven-600 hover:bg-haven-700 text-white font-bold text-sm shadow-lg shadow-haven-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Check className="w-5 h-5" />
          <span>Add to Haven Inventory</span>
        </button>
      </form>
    </div>
  );
};
