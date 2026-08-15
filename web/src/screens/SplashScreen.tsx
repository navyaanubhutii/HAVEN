import React, { useEffect } from 'react';
import { HavenLogo } from '../components/Logo';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-linen dark:bg-charcoal flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-haven-600/10 dark:bg-haven-400/10 rounded-full blur-xl animate-pulse"></div>
        <HavenLogo size={110} />
      </div>

      <h1 className="text-4xl font-extrabold text-haven-900 dark:text-haven-100 tracking-tight mb-2">
        Haven
      </h1>

      <p className="text-lg font-medium text-haven-700 dark:text-haven-300 italic mb-8">
        Your Home, Remembered.
      </p>

      {/* Elegant Spinner */}
      <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="w-full h-full bg-haven-600 dark:bg-haven-400 animate-pulse"></div>
      </div>
    </div>
  );
};
