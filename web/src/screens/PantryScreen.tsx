import React, { useState } from 'react';
import { InventoryItem, ScreenType } from '../types';
import { Search, Filter, Mic, Plus, Download, CheckCircle, Trash2, XCircle } from 'lucide-react';
import { exportPantryPDF } from '../services/pdf';

interface PantryScreenProps {
  inventory: InventoryItem[];
  onNavigate: (screen: ScreenType) => void;
  onRescueItem: (id: string) => void;
  onWasteItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onVoiceAdd?: (spokenText: string) => void;
}

export const PantryScreen: React.FC<PantryScreenProps> = ({
  inventory,
  onNavigate,
  onRescueItem,
  onWasteItem,
  onDeleteItem,
  onVoiceAdd
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isListening, setIsListening] = useState(false);

  const categories = ['All', 'Dairy', 'Vegetables', 'Fruits', 'Grains', 'Snacks', 'Beverages', 'Bakery', 'Household'];

  const filteredItems = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Expiring' && (item.status === 'expiring_today' || item.status === 'expired')) ||
      (statusFilter === 'Use Soon' && item.status === 'use_soon') ||
      (statusFilter === 'Fresh' && item.status === 'fresh');

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Web Speech API is not supported in this browser environment. You can add items manually.');
      return;
    }
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (onVoiceAdd) {
          onVoiceAdd(transcript);
        } else {
          alert(`Spoken Item Detected: "${transcript}". Navigating to Add Item form.`);
          onNavigate('add-item');
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
    } catch (e) {
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">📦 Pantry</h1>
          <p className="text-xs text-slate-500">{inventory.length} total items in household inventory</p>
        </div>

        <div className="flex items-center gap-2">
          {/* PDF Export */}
          <button
            onClick={() => exportPantryPDF(inventory)}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
            title="Export Pantry PDF Report"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Add Item Button */}
          <button
            onClick={() => onNavigate('add-item')}
            className="py-2 px-3 rounded-xl bg-haven-600 hover:bg-haven-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Search & Voice Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search milk, spinach, rice..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-haven-600 text-sm"
          />
        </div>

        {/* Voice Input Button */}
        <button
          onClick={handleVoiceInput}
          className={`p-2.5 rounded-xl border ${
            isListening
              ? 'bg-red-500 text-white animate-bounce border-red-500'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
          title="Voice Command (Web Speech API)"
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-haven-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Item List */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-3xl">
            <p className="text-sm font-semibold text-slate-500">No items match your filter.</p>
            <button
              onClick={() => onNavigate('add-item')}
              className="mt-3 text-xs text-haven-600 font-bold hover:underline"
            >
              + Add a new item
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExpToday = item.status === 'expiring_today';
            const isUseSoon = item.status === 'use_soon';
            const isExpired = item.status === 'expired';

            return (
              <div
                key={item.id}
                className="glass-panel p-4 rounded-2xl flex items-center justify-between border border-slate-200/80 dark:border-slate-800 hover:border-haven-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">
                    {isExpired ? '🔴' : isExpToday ? '🔴' : isUseSoon ? '🟡' : '🟢'}
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h3>
                    <div className="text-xs text-slate-500">
                      {item.quantity} {item.unit} • {item.storageLocation} • {item.category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isExpired
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : isExpToday
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : isUseSoon
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                      }`}
                    >
                      {isExpired
                        ? 'Expired'
                        : isExpToday
                        ? 'Expires today'
                        : isUseSoon
                        ? `${item.daysRemaining} days left`
                        : 'Fresh'}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.expiryDate}</div>
                  </div>

                  {/* Actions dropdown or quick buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onRescueItem(item.id)}
                      title="Mark as Used (Rescued)"
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onWasteItem(item.id)}
                      title="Mark Wasted"
                      className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      title="Delete Item"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
