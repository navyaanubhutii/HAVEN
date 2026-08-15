import React, { useState } from 'react';
import { ExtractedScanItem, InventoryItem, ScreenType } from '../types';
import { ShieldCheck, Check, Trash2, Edit2, ArrowLeft, Plus } from 'lucide-react';

interface ScanReviewScreenProps {
  pendingItems: ExtractedScanItem[];
  onNavigate: (screen: ScreenType) => void;
  onConfirmAddToPantry: (items: ExtractedScanItem[]) => void;
}

export const ScanReviewScreen: React.FC<ScanReviewScreenProps> = ({
  pendingItems,
  onNavigate,
  onConfirmAddToPantry
}) => {
  const [items, setItems] = useState<ExtractedScanItem[]>(pendingItems);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleUpdateItem = (index: number, field: keyof ExtractedScanItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleApproveAll = () => {
    onConfirmAddToPantry(items);
    onNavigate('pantry');
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('scan')}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🔍 Scan Review</span>
            </h1>
            <p className="text-xs text-slate-500">Verify extracted items before adding to pantry</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-haven-100 dark:bg-haven-900 text-haven-700 dark:text-haven-300 font-bold text-xs">
          {items.length} detected
        </span>
      </div>

      {/* Safety Notice */}
      <div className="p-3 rounded-2xl bg-haven-50 dark:bg-haven-950/50 border border-haven-200 dark:border-haven-800 text-xs text-haven-900 dark:text-haven-100 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-haven-600 shrink-0" />
        <span>Please review the AI OCR extraction results below. You can tweak names, quantities, or dates.</span>
      </div>

      {/* Extracted Items List */}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const isHighConfidence = item.confidence >= 0.90;

          return (
            <div
              key={idx}
              className="glass-panel p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isHighConfidence
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {isHighConfidence ? '✓' : '?'}
                  </span>
                  <div>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                      className="font-bold text-sm text-slate-900 dark:text-white bg-transparent border-b border-transparent focus:border-haven-500 focus:outline-none"
                    />
                    <div className="text-xs text-slate-500 mt-0.5">
                      Category: {item.category} • Shelf confidence: {Math.round(item.confidence * 100)}%
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveItem(idx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold uppercase">Quantity</label>
                  <div className="flex items-center gap-1 mt-0.5">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(idx, 'quantity', parseFloat(e.target.value) || 1)}
                      className="w-14 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
                    />
                    <span className="text-slate-500">{item.unit}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold uppercase">Expiry Date</label>
                  <input
                    type="date"
                    value={item.expiryDate}
                    onChange={(e) => handleUpdateItem(idx, 'expiryDate', e.target.value)}
                    className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold uppercase">Storage</label>
                  <select
                    value={item.storageLocation}
                    onChange={(e) => handleUpdateItem(idx, 'storageLocation', e.target.value)}
                    className="w-full px-1.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <option value="Fridge">Fridge</option>
                    <option value="Freezer">Freezer</option>
                    <option value="Pantry">Pantry</option>
                    <option value="Cabinet">Cabinet</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className="pt-3">
        <button
          onClick={handleApproveAll}
          disabled={items.length === 0}
          className="w-full py-4 rounded-2xl bg-haven-600 hover:bg-haven-700 disabled:opacity-50 text-white font-bold text-base shadow-lg shadow-haven-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Check className="w-5 h-5" />
          <span>Add {items.length} Items to Pantry</span>
        </button>
      </div>
    </div>
  );
};
