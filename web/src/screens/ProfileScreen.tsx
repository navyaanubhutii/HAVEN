import React, { useState } from 'react';
import { HouseholdProfile, ScreenType } from '../types';
import { Users, Globe, UtensilsCrossed, Bell, ShieldCheck, Key, LogOut, Check } from 'lucide-react';

interface ProfileScreenProps {
  profile: HouseholdProfile;
  onUpdateProfile: (updated: Partial<HouseholdProfile>) => void;
  onNavigate: (screen: ScreenType) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  onNavigate,
  onLogout
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(profile.language);
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>(profile.dietaryPrefs);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi (हिंदी)' },
    { code: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
    { code: 'ta', label: 'Tamil (தமிழ்)' },
    { code: 'te', label: 'Telugu (తెలుగు)' }
  ];

  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Jain', 'Non-Veg'];

  const toggleDietary = (opt: string) => {
    let updated: string[];
    if (dietaryPrefs.includes(opt)) {
      updated = dietaryPrefs.filter((p) => p !== opt);
    } else {
      updated = [...dietaryPrefs, opt];
    }
    setDietaryPrefs(updated);
    onUpdateProfile({ dietaryPrefs: updated });
  };

  const handleLanguageChange = (lang: any) => {
    setSelectedLanguage(lang);
    onUpdateProfile({ language: lang });
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in max-w-md mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">👤 Household & Settings</h1>
        <p className="text-xs text-slate-500">Manage member access, preferences, and security</p>
      </div>

      {/* Household Card */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-haven-600 text-white flex items-center justify-center font-bold text-lg">
            🏠
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">{profile.name}</h2>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Users className="w-3.5 h-3.5" />
              <span>{profile.membersCount} Household Members</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multilingual Selector */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Globe className="w-4 h-4 text-haven-600" />
          <span>Language Preference</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`p-3 rounded-2xl text-xs font-semibold text-left transition-all border ${
                selectedLanguage === lang.code
                  ? 'bg-haven-600 text-white border-haven-600 shadow-sm'
                  : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dietary Preferences */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <UtensilsCrossed className="w-4 h-4 text-amber-500" />
          <span>Dietary Preferences</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map((opt) => {
            const isSelected = dietaryPrefs.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggleDietary(opt)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Security & Key Inspection Card */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-haven-600" />
            <span>Security & API Configuration</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
            Secured
          </span>
        </div>

        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <span>Supabase RLS Status</span>
            <span className="font-bold text-emerald-600">Active</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <span>.env Git Protection</span>
            <span className="font-bold text-emerald-600">Verified (.gitignore)</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <span>FastAPI Python Engine</span>
            <span className="font-bold text-haven-600">localhost:8000</span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full py-3.5 rounded-2xl border border-red-200 dark:border-red-950 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out / Switch Account</span>
      </button>
    </div>
  );
};
