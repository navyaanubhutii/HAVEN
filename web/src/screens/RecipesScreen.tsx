import React, { useState } from 'react';
import { Recipe, InventoryItem, ScreenType } from '../types';
import { Sparkles, Clock, CheckCircle, ChefHat, ArrowRight, Utensils, X, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RecipesScreenProps {
  inventory: InventoryItem[];
  recipes: Recipe[];
  onNavigate: (screen: ScreenType) => void;
  onCookRecipe: (recipe: Recipe) => void;
}

export const RecipesScreen: React.FC<RecipesScreenProps> = ({
  inventory,
  recipes,
  onNavigate,
  onCookRecipe
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filters = ['All', 'Vegetarian', 'Quick', 'Dinner', 'High Protein'];

  const filteredRecipes = recipes.filter((r) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Vegetarian') return r.dietaryType === 'Vegetarian' || r.dietaryType === 'Vegan';
    if (selectedFilter === 'Quick') return r.prepTimeMins <= 20;
    return true;
  });

  const handleCook = (recipe: Recipe) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onCookRecipe(recipe);
    setSelectedRecipe(null);
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in max-w-md mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span>🍳 Haven AI Recipes</span>
        </h1>
        <p className="text-xs text-slate-500">Meal suggestions matching your expiring inventory</p>
      </div>

      {/* Honest Engine Badge */}
      <div className="p-3 rounded-2xl bg-haven-50 dark:bg-haven-950/40 border border-haven-200 dark:border-haven-800 text-xs text-haven-900 dark:text-haven-100 flex items-center gap-2">
        <Info className="w-4 h-4 text-haven-600 shrink-0" />
        <span><span className="font-bold">Rule-Based Recipe Match Engine:</span> Analyzes actual inventory items near expiration without external AI keys.</span>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedFilter === f
                ? 'bg-haven-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Recipe Cards List */}
      <div className="space-y-4">
        {filteredRecipes.map((recipe, index) => {
          const isTopMatch = index === 0;

          return (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className={`glass-panel p-5 rounded-3xl border transition-all cursor-pointer hover:scale-[1.01] ${
                isTopMatch
                  ? 'border-amber-400 dark:border-amber-500 shadow-md ring-1 ring-amber-400/30'
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {isTopMatch && (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Use These Expiring Items First</span>
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {recipe.description}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <span className="px-2 py-1 rounded-lg bg-haven-100 dark:bg-haven-900 text-haven-700 dark:text-haven-300 text-xs font-extrabold">
                    {recipe.wasteReductionScore}% Match
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{recipe.prepTimeMins} mins</span>
                </div>
                <div className="flex items-center gap-1">
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>{recipe.dietaryType}</span>
                </div>
                <div className="flex items-center gap-1 font-semibold text-haven-600 dark:text-haven-400 ml-auto">
                  <span>View Recipe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RECIPE DETAIL MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-charcoal w-full max-w-lg rounded-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-fade-in border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                  Haven Zero-Waste Recipe
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {selectedRecipe.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedRecipe.description}
            </p>

            {/* Ingredients from Pantry */}
            <div className="p-4 rounded-2xl bg-haven-50 dark:bg-haven-950/50 border border-haven-200 dark:border-haven-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-haven-800 dark:text-haven-200 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-haven-600" />
                <span>Pantry Ingredients Used</span>
              </h4>
              <div className="space-y-1">
                {selectedRecipe.usedIngredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-medium text-slate-800 dark:text-slate-200">
                    <span>✓ {ing.name} ({ing.quantity})</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                      Near Expiry
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cooking Instructions
              </h4>
              <ol className="space-y-2 text-xs text-slate-700 dark:text-slate-300 list-decimal pl-4">
                {selectedRecipe.instructions.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <button
              onClick={() => handleCook(selectedRecipe)}
              className="w-full py-4 rounded-2xl bg-haven-600 hover:bg-haven-700 text-white font-bold text-sm shadow-lg shadow-haven-600/25 flex items-center justify-center gap-2 transition-all"
            >
              <Utensils className="w-5 h-5" />
              <span>Cook & Auto-Deduct Required Quantity</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
