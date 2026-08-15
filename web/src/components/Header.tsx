import React from 'react';
import { HavenLogo } from './Logo';
import { ShoppingBag, BarChart2, Moon, Sun } from 'lucide-react';
import { ScreenType } from '../types';

interface HeaderProps {
  householdName: string;
  onNavigate: (screen: ScreenType) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  shoppingCount?: number;
  isBackendOnline?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  householdName,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  shoppingCount = 0,
  isBackendOnline = true
}) => {
  return (
    <header className="sticky top-0 z-30 bg-linen/90 dark:bg-charcoal/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 py-3">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <HavenLogo size={32} />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg leading-none tracking-tight text-haven-900 dark:text-haven-100">Haven</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-haven-100 dark:bg-haven-900/60 text-haven-700 dark:text-haven-300 font-medium">AI</span>
              {!isBackendOnline && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold" title="FastAPI server offline — Running in Local Storage Mode">
                  Local Mode
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{householdName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Insights Button */}
          <button
            onClick={() => onNavigate('insights')}
            title="Insights & Savings"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <BarChart2 className="w-5 h-5" />
          </button>

          {/* Shopping List Button */}
          <button
            onClick={() => onNavigate('shopping')}
            title="Shopping List"
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {shoppingCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {shoppingCount}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
