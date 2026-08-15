import React, { useState } from 'react';
import { PackageCheck, Leaf, BrainCircuit, ArrowRight, CheckCircle2 } from 'lucide-react';
import { HavenLogo } from '../components/Logo';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: PackageCheck,
      title: "Know what you have",
      subtitle: "One central source of truth",
      description: "Haven automatically transforms receipt photos and barcodes into a continuous, real-time household inventory.",
      badge: "Stage 1 of 3"
    },
    {
      icon: Leaf,
      title: "Use things before they waste",
      subtitle: "Proactive expiry engine",
      description: "Get smart recommendations and zero-waste recipes tailored to ingredients nearing their expiration dates.",
      badge: "Stage 2 of 3"
    },
    {
      icon: BrainCircuit,
      title: "Let Haven do the remembering",
      subtitle: "Home Intelligence Companion",
      description: "Haven predicts consumption patterns, suggests restocks, and simplifies everyday meal and grocery decisions.",
      badge: "Stage 3 of 3"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <div className="min-h-screen bg-linen dark:bg-charcoal flex flex-col justify-between p-6 max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-4">
        <HavenLogo size={36} showText />
        <button
          onClick={onComplete}
          className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Card */}
      <div className="my-auto py-8">
        <div className="inline-block px-3 py-1 rounded-full bg-haven-100 dark:bg-haven-900/60 text-haven-700 dark:text-haven-300 text-xs font-semibold mb-6">
          {slides[currentSlide].badge}
        </div>

        <div className="w-20 h-20 rounded-3xl bg-haven-600/10 dark:bg-haven-400/10 text-haven-600 dark:text-haven-400 flex items-center justify-center mb-6">
          <CurrentIcon className="w-10 h-10" />
        </div>

        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          {slides[currentSlide].title}
        </h2>
        <p className="text-sm font-semibold text-amber-500 mb-4">
          {slides[currentSlide].subtitle}
        </p>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {slides[currentSlide].description}
        </p>

        {/* Slide Indicators */}
        <div className="flex items-center gap-2 mt-8">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-haven-600 dark:bg-haven-400' : 'w-2 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="pb-6">
        <button
          onClick={handleNext}
          className="w-full py-4 px-6 rounded-2xl bg-haven-600 hover:bg-haven-700 text-white font-semibold text-base shadow-lg shadow-haven-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
