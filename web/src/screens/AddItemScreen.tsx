import React, { useState, useEffect } from 'react';
import { InventoryItem, ScreenType } from '../types';
import { ArrowLeft, Sparkles, Check, Info } from 'lucide-react';
import { api } from '../services/api';

interface AddItemScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onAddItem: (item: Omit<InventoryItem, 'id' | 'status' | 'daysRemaining'>) => void;
}

export const AddItemScreen: React.FC<AddItemScreenProps> = ({ onNavigate, onAddItem }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryItem['category']>('Vegetables');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>('pcs');
  const [price, setPrice] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [storageLocation, setStorageLocation] = useState<InventoryItem['storageLocation']>('Fridge');
  const [isEstimated, setIsEstimated] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Call API for estimated shelf life when category or name changes
  useEffect(() => {
    let isSubscribed = true;
    api.estimateExpiryDays(name, category).then((days) => {
      if (isSubscribed && isEstimated) {
        const calcDate = new Date();
        calcDate.setDate(calcDate.getDate() + days);
        setExpiryDate(calcDate.toISOString().split('T')[0]);
      }
    });
    return () => { isSubscribed = false; };
  }, [category, name, isEstimated]);

  const handleExpiryChange = (val: string) => {
    setExpiryDate(val);
    setIsEstimated(false); // User explicitly selected this date!
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Product name is required.');
      return;
    }

    if (quantity <= 0) {
      setErrorMsg('Quantity must be greater than zero.');
      return;
    }

    if (!expiryDate) {
      setErrorMsg('Expiry date is required.');
      return;
    }

    onAddItem({
      name: name.trim(),
      category,
      quantity,
      unit,
      price: price ? parseFloat(price) : undefined,
      purchaseDate,
      expiryDate,
      storageLocation,
      isEstimatedExpiry: isEstimated
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
          <p className="text-xs text-slate-500">Manual inventory addition</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-2xl bg-red-100 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-700 dark:text-red-300">
          ⚠️ {errorMsg}
        </div>
      )}

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
              Quantity *
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-haven-600 text-sm"
              required
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

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Purchase Price (Optional ₹)
          </label>
          <input
            type="number"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 60 (Leave empty if unpriced)"
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-haven-600 text-sm"
          />
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
              onChange={(e) => handleExpiryChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-haven-600 text-sm"
              required
            />
          </div>
        </div>

        {/* AI Rule Suggestion Banner */}
        <div className="p-3.5 rounded-2xl bg-haven-50 dark:bg-haven-950/40 border border-haven-200 dark:border-haven-800/40 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-haven-600 dark:text-haven-400 mt-0.5 shrink-0" />
          <div className="text-xs text-haven-800 dark:text-haven-200">
            {isEstimated ? (
              <span><span className="font-bold">Haven Shelf-Life Estimate:</span> Expiry date auto-estimated based on standard {category} shelf life. You can edit the date to set an explicit expiration.</span>
            ) : (
              <span><span className="font-bold">User-Specified Expiry Date:</span> Saved as explicit date provided by user.</span>
            )}
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
