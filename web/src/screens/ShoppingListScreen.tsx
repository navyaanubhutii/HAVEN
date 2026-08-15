import React, { useState } from 'react';
import { ShoppingItem, ScreenType } from '../types';
import { Sparkles, Plus, Check, Download, ShoppingBag, ArrowRight } from 'lucide-react';
import { exportShoppingPDF } from '../services/pdf';

interface ShoppingListScreenProps {
  items: ShoppingItem[];
  onNavigate: (screen: ScreenType) => void;
  onAddItem: (item: Omit<ShoppingItem, 'id' | 'isCompleted'>) => void;
  onToggleComplete: (id: string) => void;
  onMoveToPantry: (item: ShoppingItem) => void;
}

export const ShoppingListScreen: React.FC<ShoppingListScreenProps> = ({
  items,
  onNavigate,
  onAddItem,
  onToggleComplete,
  onMoveToPantry
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('General');

  const manualItems = items.filter((i) => !i.isAiSuggested);
  const aiSuggestedItems = items.filter((i) => i.isAiSuggested);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddItem({
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: 1,
      unit: 'pcs',
      isAiSuggested: false
    });

    setNewItemName('');
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <span>🛒 Shopping List</span>
          </h1>
          <p className="text-xs text-slate-500">Smart restock suggestions & household list</p>
        </div>

        <button
          onClick={() => exportShoppingPDF(items)}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
          title="Export Shopping List PDF"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Add Item Quick Form */}
      <form onSubmit={handleAddSubmit} className="flex gap-2">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Add milk, eggs, olive oil..."
          className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-haven-600 text-sm"
        />
        <button
          type="submit"
          className="px-4 py-3 rounded-2xl bg-haven-600 hover:bg-haven-700 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </form>

      {/* HAVEN AI PREDICTIVE SUGGESTIONS */}
      {aiSuggestedItems.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider px-1">
            <Sparkles className="w-4 h-4" />
            <span>Haven Predictive Restocks</span>
          </div>

          <div className="space-y-2">
            {aiSuggestedItems.map((item) => (
              <div
                key={item.id}
                className="glass-panel p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                      AI Suggested
                    </span>
                  </div>
                  {item.reason && (
                    <p className="text-xs text-slate-500 mt-0.5">{item.reason}</p>
                  )}
                </div>

                <button
                  onClick={() => onMoveToPantry(item)}
                  className="py-1.5 px-3 rounded-xl bg-haven-600 hover:bg-haven-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Bought</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MANUAL ITEMS LIST */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Your Items ({manualItems.length})
        </div>

        {manualItems.length === 0 ? (
          <div className="text-center py-8 glass-panel rounded-3xl text-xs text-slate-500">
            No items in your shopping list. Add one above!
          </div>
        ) : (
          <div className="space-y-2">
            {manualItems.map((item) => (
              <div
                key={item.id}
                className={`glass-panel p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  item.isCompleted
                    ? 'opacity-60 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleComplete(item.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                      item.isCompleted
                        ? 'bg-haven-600 text-white'
                        : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {item.isCompleted && <Check className="w-4 h-4" />}
                  </button>
                  <span className={`text-sm font-semibold ${item.isCompleted ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {item.name} ({item.quantity} {item.unit})
                  </span>
                </div>

                <button
                  onClick={() => onMoveToPantry(item)}
                  className="text-xs font-bold text-haven-600 dark:text-haven-400 hover:underline flex items-center gap-1"
                >
                  <span>Move to Pantry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
