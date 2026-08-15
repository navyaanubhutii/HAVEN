import React from 'react';
import { Home, Package, Camera, Utensils, User, ShoppingBag } from 'lucide-react';
import { ScreenType } from '../types';

interface NavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: 'home' as ScreenType, label: 'Home', icon: Home },
    { id: 'pantry' as ScreenType, label: 'Pantry', icon: Package },
    { id: 'scan' as ScreenType, label: 'Scan', icon: Camera, isPrimary: true },
    { id: 'recipes' as ScreenType, label: 'Recipes', icon: Utensils },
    { id: 'profile' as ScreenType, label: 'Me', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-charcoal/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-4 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="relative -top-5 flex flex-col items-center group focus:outline-none"
              >
                <div className="w-14 h-14 rounded-full bg-haven-600 dark:bg-haven-500 text-white flex items-center justify-center shadow-lg shadow-haven-600/30 group-hover:scale-105 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-semibold mt-1 text-haven-700 dark:text-haven-300">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-haven-600 dark:text-haven-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[11px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
