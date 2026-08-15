import React from 'react';
import { InsightsData, ScreenType } from '../types';
import { Leaf, HeartPulse, TrendingDown, ShieldAlert, Award, PackageCheck, Info } from 'lucide-react';

interface InsightsScreenProps {
  insights: InsightsData & { hasData?: boolean; hasExplicitPrice?: boolean };
  onNavigate: (screen: ScreenType) => void;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({ insights, onNavigate }) => {
  const hasLoggedData = (insights.itemsRescuedCount > 0 || insights.itemsWastedCount > 0);

  return (
    <div className="space-y-5 pb-24 animate-fade-in max-w-md mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📊 Household Insights</span>
        </h1>
        <p className="text-xs text-slate-500">Actual consumption & waste reduction analytics</p>
      </div>

      {!hasLoggedData ? (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-haven-100 dark:bg-haven-900 text-haven-600 dark:text-haven-300 flex items-center justify-center mx-auto">
            <PackageCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Insufficient Logged Data</h3>
            <p className="text-xs text-slate-500 mt-1">
              Start marking items as <span className="font-semibold">Used</span> or <span className="font-semibold">Wasted</span> in your Pantry to generate real household consumption insights.
            </p>
          </div>
          <button
            onClick={() => onNavigate('pantry')}
            className="py-2.5 px-4 rounded-xl bg-haven-600 text-white font-bold text-xs shadow-sm"
          >
            Go to Pantry
          </button>
        </div>
      ) : (
        <>
          {/* Main Hero Summary Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-haven-700 to-haven-900 text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between text-haven-200 text-xs font-bold uppercase tracking-wider">
              <span>Household Consumption Impact</span>
              <Award className="w-5 h-5 text-amber-400" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tight">
                {insights.itemsRescuedCount}
              </span>
              <span className="text-sm font-semibold text-haven-200">items Used Before Expiry</span>
            </div>

            {/* Display money ONLY if explicit purchase price exists */}
            {insights.hasExplicitPrice && insights.totalFoodSaved > 0 ? (
              <div className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                <span>Value of used items with recorded price: ₹{insights.totalFoodSaved}</span>
              </div>
            ) : (
              <div className="text-xs text-haven-200 opacity-80">
                (Add purchase prices when creating items to view monetary valuation)
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-haven-600/60 text-xs">
              <div>
                <div className="text-haven-300">Items Used</div>
                <div className="text-lg font-bold text-white mt-0.5">{insights.itemsRescuedCount} items</div>
              </div>
              <div>
                <div className="text-haven-300">Waste Action Ratio</div>
                <div className="text-lg font-bold text-amber-300 mt-0.5 flex items-center gap-1">
                  <TrendingDown className="w-4 h-4" />
                  <span>{insights.wasteReductionPercentage}% Success</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid of Key Analytics Cards */}
          <div className="grid grid-cols-2 gap-3">
            {/* Pantry Health Score */}
            <div className="glass-panel p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <HeartPulse className="w-5 h-5 text-haven-600" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-haven-100 text-haven-700">Health</span>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {insights.pantryHealthScore}%
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Current Pantry Health</div>
              </div>
            </div>

            {/* Most Wasted Item */}
            <div className="glass-panel p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <ShieldAlert className="w-5 h-5 text-amber-500" />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Wasted</span>
              </div>
              <div>
                <div className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {insights.mostFrequentlyWasted || 'None'}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Most Wasted Item</div>
              </div>
            </div>
          </div>

          {/* Environmental Footprint Card */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-haven-600" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Environmental Impact</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="text-slate-500">CO₂e Avoided</div>
                <div className="text-base font-extrabold text-haven-700 dark:text-haven-300 mt-1">
                  ~{insights.co2AvoidedKg} kg
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="text-slate-500">Water Rescued</div>
                <div className="text-base font-extrabold text-haven-700 dark:text-haven-300 mt-1">
                  ~{insights.waterSavedLiters} L
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
