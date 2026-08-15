import React from 'react';
import { InventoryItem, Recipe, ScreenType } from '../types';
import { Camera, PlusCircle, Package, ShoppingBag, AlertTriangle, Sparkles, CheckCircle, ArrowRight, HeartPulse, Wifi, WifiOff } from 'lucide-react';
import { computePantryHealthScore } from '../services/store';

interface HomeScreenProps {
  inventory: InventoryItem[];
  suggestedRecipe?: Recipe;
  isBackendOnline?: boolean;
  onNavigate: (screen: ScreenType) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  inventory,
  suggestedRecipe,
  isBackendOnline = true,
  onNavigate,
  onSelectRecipe
}) => {
  const pantryHealth = computePantryHealthScore(inventory);

  // Extract actual priorities
  const expiringToday = inventory.filter((i) => i.status === 'expiring_today');
  const useSoon = inventory.filter((i) => i.status === 'use_soon');
  const expired = inventory.filter((i) => i.status === 'expired');

  const priorities = [...expiringToday, ...useSoon, ...expired];

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-md mx-auto">
      {/* Top Greeting & Pantry Health */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{getTimeGreeting()}</span>
              <span className="text-xl">🌿</span>
            </h1>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Here is what needs your attention in your home today.
          </p>
        </div>

        {/* Pantry Health Badge */}
        <div
          onClick={() => onNavigate('insights')}
          className="cursor-pointer glass-panel px-3.5 py-2 rounded-2xl flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <div className="relative w-8 h-8 rounded-full bg-haven-100 dark:bg-haven-900 flex items-center justify-center text-haven-600 dark:text-haven-300 font-extrabold text-xs">
            <HeartPulse className="w-4 h-4 text-haven-600 dark:text-haven-400" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pantry Health</div>
            <div className="text-sm font-extrabold text-haven-700 dark:text-haven-300">{pantryHealth}%</div>
          </div>
        </div>
      </div>

      {/* Backend Status Notification */}
      {!isBackendOnline && (
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-600" />
            <span>FastAPI Server Offline — Running on Local Storage fallback mode</span>
          </div>
        </div>
      )}

      {/* TODAY'S PRIORITIES SECTION */}
      <div className="glass-panel p-5 rounded-3xl space-y-3.5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Today's priorities</h2>
          </div>
          <button
            onClick={() => onNavigate('pantry')}
            className="text-xs font-semibold text-haven-600 dark:text-haven-400 flex items-center gap-1 hover:underline"
          >
            <span>View all ({inventory.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {priorities.length === 0 ? (
          <div className="py-5 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40">
            🟢 All items in your pantry are fresh! No urgent expiries.
          </div>
        ) : (
          <div className="space-y-2">
            {priorities.slice(0, 3).map((item) => {
              const isToday = item.status === 'expiring_today';
              const isExpired = item.status === 'expired';

              return (
                <div
                  key={item.id}
                  onClick={() => onNavigate('pantry')}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-haven-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm">
                      {isExpired ? '🔴' : isToday ? '🔴' : '🟡'}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {item.storageLocation} • {item.quantity} {item.unit}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      isExpired
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        : isToday
                        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {isExpired
                      ? 'Expired'
                      : isToday
                      ? 'Expires today'
                      : `Expires in ${item.daysRemaining} days`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* HAVEN SUGGESTS RECIPE SECTION */}
      {suggestedRecipe && (
        <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-haven-700 to-haven-900 text-white shadow-md">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-32 h-32 text-white" />
          </div>

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Haven Recipe Suggestion</span>
            </div>

            <div>
              <h3 className="text-xl font-extrabold tracking-tight">
                🍝 {suggestedRecipe.title}
              </h3>
              <p className="text-xs text-haven-100 mt-1 line-clamp-2">
                {suggestedRecipe.description}
              </p>
            </div>

            <div className="pt-2 border-t border-haven-600/60">
              <div className="text-[11px] font-semibold text-haven-200 mb-1.5">You have matching items:</div>
              <div className="flex flex-wrap gap-2">
                {suggestedRecipe.usedIngredients.slice(0, 4).map((ing, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-haven-600/60 text-xs font-medium text-white backdrop-blur-sm"
                  >
                    <CheckCircle className="w-3 h-3 text-amber-300" />
                    <span>{ing.name}</span>
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onSelectRecipe(suggestedRecipe);
                onNavigate('recipes');
              }}
              className="w-full mt-3 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>Cook This Recipe</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* QUICK ACTIONS SECTION */}
      <div>
        <h3 className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-3 px-1">
          Quick actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('scan')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 hover:border-haven-500 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-haven-100 dark:bg-haven-900 text-haven-600 dark:text-haven-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Scan Receipt</div>
              <div className="text-[11px] text-slate-500">Auto-extract items</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('add-item')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 hover:border-haven-500 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Add Item</div>
              <div className="text-[11px] text-slate-500">Manual entry</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('pantry')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 hover:border-haven-500 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Pantry</div>
              <div className="text-[11px] text-slate-500">{inventory.length} items logged</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('shopping')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 hover:border-haven-500 transition-colors text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Shopping</div>
              <div className="text-[11px] text-slate-500">List & predictions</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
