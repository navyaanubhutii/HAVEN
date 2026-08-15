import React, { useState, useEffect } from 'react';
import { ScreenType, InventoryItem, ExtractedScanItem, Recipe, ShoppingItem, InsightsData, HouseholdProfile } from './types';
import { computeDaysAndStatus, computePantryHealthScore } from './services/store';

// Import Screens
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { PantryScreen } from './screens/PantryScreen';
import { AddItemScreen } from './screens/AddItemScreen';
import { ScanScreen } from './screens/ScanScreen';
import { ScanReviewScreen } from './screens/ScanReviewScreen';
import { RecipesScreen } from './screens/RecipesScreen';
import { ShoppingListScreen } from './screens/ShoppingListScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { ProfileScreen } from './screens/ProfileScreen';

// Import Layout Components
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Core State
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('haven_inventory');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'item-1',
        name: 'Fresh Baby Spinach',
        category: 'Vegetables',
        quantity: 1,
        unit: 'pack',
        purchaseDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date().toISOString().split('T')[0], // Expires today!
        storageLocation: 'Fridge',
        status: 'expiring_today',
        daysRemaining: 0,
      },
      {
        id: 'item-2',
        name: 'Amul T-Special Milk',
        category: 'Dairy',
        quantity: 2,
        unit: 'L',
        purchaseDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        storageLocation: 'Fridge',
        status: 'use_soon',
        daysRemaining: 1,
      },
      {
        id: 'item-3',
        name: 'Whole Wheat Bread',
        category: 'Bakery',
        quantity: 1,
        unit: 'pack',
        purchaseDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days
        storageLocation: 'Pantry',
        status: 'use_soon',
        daysRemaining: 3,
      },
      {
        id: 'item-4',
        name: 'Fresh Hybrid Tomatoes',
        category: 'Vegetables',
        quantity: 1,
        unit: 'kg',
        purchaseDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        storageLocation: 'Pantry',
        status: 'fresh',
        daysRemaining: 5,
      },
      {
        id: 'item-5',
        name: 'Garlic Cloves',
        category: 'Vegetables',
        quantity: 200,
        unit: 'g',
        purchaseDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
        storageLocation: 'Pantry',
        status: 'fresh',
        daysRemaining: 14,
      },
      {
        id: 'item-6',
        name: 'Spaghetti Pasta',
        category: 'Grains',
        quantity: 500,
        unit: 'g',
        purchaseDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 86400000 * 120).toISOString().split('T')[0],
        storageLocation: 'Cabinet',
        status: 'fresh',
        daysRemaining: 120,
      }
    ];
  });

  const [pendingScanItems, setPendingScanItems] = useState<ExtractedScanItem[]>([]);

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([
    { id: 'shop-1', name: 'Olive Oil 500ml', category: 'Oils', quantity: 1, unit: 'bottle', isAiSuggested: false, isCompleted: false },
    { id: 'shop-2', name: 'Amul Milk 1L', category: 'Dairy', quantity: 2, unit: 'L', isAiSuggested: true, reason: 'You finish milk every 5 days. Running low soon.', isCompleted: false },
    { id: 'shop-3', name: 'Greek Yogurt', category: 'Dairy', quantity: 2, unit: 'cups', isAiSuggested: true, reason: 'High consumption history', isCompleted: false }
  ]);

  const [profile, setProfile] = useState<HouseholdProfile>({
    name: 'Green Nest Household',
    language: 'en',
    dietaryPrefs: ['Vegetarian'],
    membersCount: 3
  });

  const [insights, setInsights] = useState<InsightsData>({
    currencySymbol: '₹',
    totalFoodSaved: 540,
    itemsRescuedCount: 12,
    itemsWastedCount: 3,
    mostFrequentlyWasted: '🥬 Spinach',
    wasteReductionPercentage: 24,
    pantryHealthScore: 92,
    co2AvoidedKg: 4.8,
    waterSavedLiters: 180
  });

  // Default Recipes
  const defaultRecipes: Recipe[] = [
    {
      id: 'recipe-spinach-pasta',
      title: 'Creamy Garlic Spinach Pasta',
      description: 'A delicious 20-minute comfort meal designed to utilize fresh spinach and milk before they expire.',
      prepTimeMins: 20,
      dietaryType: 'Vegetarian',
      primaryTargetIngredient: 'Spinach',
      usedIngredients: [
        { name: 'Fresh Baby Spinach', quantity: '1 pack', status: 'expiring_today' },
        { name: 'Amul T-Special Milk', quantity: '250 ml', status: 'use_soon' },
        { name: 'Garlic Cloves', quantity: '4 cloves', status: 'fresh' },
        { name: 'Spaghetti Pasta', quantity: '200 g', status: 'fresh' }
      ],
      missingIngredients: [{ name: 'Olive Oil', quantity: '1 tbsp' }],
      instructions: [
        'Boil spaghetti pasta in salted water until al dente (approx 8-10 mins).',
        'Sauté minced garlic in a pan with a splash of olive oil until fragrant.',
        'Add fresh baby spinach and cook until wilted (2 minutes).',
        'Pour in milk, simmer gently, then toss with cooked pasta and cracked black pepper.',
        'Serve warm and enjoy your zero-waste meal!'
      ],
      wasteReductionScore: 98
    },
    {
      id: 'recipe-tomato-soup',
      title: 'Roasted Tomato & Garlic Soup',
      description: 'Rich, comforting soup that rescues ripe tomatoes and garlic before they go soft.',
      prepTimeMins: 25,
      dietaryType: 'Vegan',
      primaryTargetIngredient: 'Tomatoes',
      usedIngredients: [
        { name: 'Fresh Hybrid Tomatoes', quantity: '500 g', status: 'use_soon' },
        { name: 'Garlic Cloves', quantity: '6 cloves', status: 'fresh' },
        { name: 'Whole Wheat Bread', quantity: '2 slices', status: 'use_soon' }
      ],
      missingIngredients: [{ name: 'Vegetable Broth', quantity: '1 cup' }],
      instructions: [
        'Halve tomatoes and roast with garlic cloves at 200°C for 20 mins.',
        'Blend roasted tomatoes and garlic with warm vegetable broth until smooth.',
        'Toast bread slices for dipping.',
        'Garnish with fresh basil and serve immediately.'
      ],
      wasteReductionScore: 92
    }
  ];

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>(defaultRecipes[0]);

  // Persist inventory
  useEffect(() => {
    localStorage.setItem('haven_inventory', JSON.stringify(inventory));
    const health = computePantryHealthScore(inventory);
    setInsights((prev) => ({ ...prev, pantryHealthScore: health }));
  }, [inventory]);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Actions
  const handleAddItem = (newItemData: Omit<InventoryItem, 'id' | 'status' | 'daysRemaining'>) => {
    const { daysRemaining, status } = computeDaysAndStatus(newItemData.expiryDate);
    const newItem: InventoryItem = {
      ...newItemData,
      id: `item-${Date.now()}`,
      daysRemaining,
      status
    };
    setInventory([newItem, ...inventory]);
  };

  const handleRescueItem = (id: string) => {
    const item = inventory.find((i) => i.id === id);
    if (item) {
      setInventory(inventory.filter((i) => i.id !== id));
      setInsights((prev) => ({
        ...prev,
        totalFoodSaved: prev.totalFoodSaved + 45,
        itemsRescuedCount: prev.itemsRescuedCount + 1
      }));
    }
  };

  const handleWasteItem = (id: string) => {
    const item = inventory.find((i) => i.id === id);
    if (item) {
      setInventory(inventory.filter((i) => i.id !== id));
      setInsights((prev) => ({
        ...prev,
        itemsWastedCount: prev.itemsWastedCount + 1,
        mostFrequentlyWasted: `🥬 ${item.name}`
      }));
    }
  };

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter((i) => i.id !== id));
  };

  const handleConfirmScanItems = (scanItems: ExtractedScanItem[]) => {
    const newItems: InventoryItem[] = scanItems.map((sc, idx) => {
      const { daysRemaining, status } = computeDaysAndStatus(sc.expiryDate);
      return {
        id: `item-scan-${Date.now()}-${idx}`,
        name: sc.name,
        category: sc.category,
        quantity: sc.quantity,
        unit: sc.unit,
        purchaseDate: sc.purchaseDate,
        expiryDate: sc.expiryDate,
        storageLocation: sc.storageLocation,
        status,
        daysRemaining
      };
    });
    setInventory([...newItems, ...inventory]);
  };

  const handleCookRecipe = (recipe: Recipe) => {
    // Automatically deduct used ingredients from inventory
    const usedNames = recipe.usedIngredients.map((u) => u.name.toLowerCase());
    const updatedInventory = inventory.filter(
      (item) => !usedNames.some((uName) => item.name.toLowerCase().includes(uName) || uName.includes(item.name.toLowerCase()))
    );
    setInventory(updatedInventory);
    setInsights((prev) => ({
      ...prev,
      totalFoodSaved: prev.totalFoodSaved + 80,
      itemsRescuedCount: prev.itemsRescuedCount + recipe.usedIngredients.length
    }));
  };

  const handleAddShoppingItem = (itemData: Omit<ShoppingItem, 'id' | 'isCompleted'>) => {
    const newItem: ShoppingItem = {
      ...itemData,
      id: `shop-${Date.now()}`,
      isCompleted: false
    };
    setShoppingList([newItem, ...shoppingList]);
  };

  const handleToggleShoppingComplete = (id: string) => {
    setShoppingList(
      shoppingList.map((s) => (s.id === id ? { ...s, isCompleted: !s.isCompleted } : s))
    );
  };

  const handleMoveShoppingToPantry = (item: ShoppingItem) => {
    setShoppingList(shoppingList.filter((s) => s.id !== item.id));
    const calcDate = new Date();
    calcDate.setDate(calcDate.getDate() + 7);
    handleAddItem({
      name: item.name,
      category: (item.category as any) || 'Other',
      quantity: item.quantity,
      unit: item.unit,
      purchaseDate: new Date().toISOString().split('T')[0],
      expiryDate: calcDate.toISOString().split('T')[0],
      storageLocation: 'Pantry'
    });
  };

  // Screen View Dispatcher
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={() => setCurrentScreen('onboarding')} />;
      case 'onboarding':
        return <OnboardingScreen onComplete={() => setCurrentScreen('auth')} />;
      case 'auth':
        return (
          <AuthScreen
            onLogin={(isGuest) => {
              setIsAuthenticated(true);
              setCurrentScreen('home');
            }}
          />
        );
      case 'home':
        return (
          <HomeScreen
            inventory={inventory}
            suggestedRecipe={selectedRecipe}
            onNavigate={setCurrentScreen}
            onSelectRecipe={setSelectedRecipe}
          />
        );
      case 'pantry':
        return (
          <PantryScreen
            inventory={inventory}
            onNavigate={setCurrentScreen}
            onRescueItem={handleRescueItem}
            onWasteItem={handleWasteItem}
            onDeleteItem={handleDeleteItem}
          />
        );
      case 'add-item':
        return <AddItemScreen onNavigate={setCurrentScreen} onAddItem={handleAddItem} />;
      case 'scan':
        return (
          <ScanScreen
            onNavigate={setCurrentScreen}
            onScanComplete={(items) => setPendingScanItems(items)}
          />
        );
      case 'scan-review':
        return (
          <ScanReviewScreen
            pendingItems={pendingScanItems}
            onNavigate={setCurrentScreen}
            onConfirmAddToPantry={handleConfirmScanItems}
          />
        );
      case 'recipes':
        return (
          <RecipesScreen
            inventory={inventory}
            recipes={defaultRecipes}
            onNavigate={setCurrentScreen}
            onCookRecipe={handleCookRecipe}
          />
        );
      case 'shopping':
        return (
          <ShoppingListScreen
            items={shoppingList}
            onNavigate={setCurrentScreen}
            onAddItem={handleAddShoppingItem}
            onToggleComplete={handleToggleShoppingComplete}
            onMoveToPantry={handleMoveShoppingToPantry}
          />
        );
      case 'insights':
        return <InsightsScreen insights={insights} onNavigate={setCurrentScreen} />;
      case 'profile':
        return (
          <ProfileScreen
            profile={profile}
            onUpdateProfile={(upd) => setProfile({ ...profile, ...upd })}
            onNavigate={setCurrentScreen}
            onLogout={() => {
              setIsAuthenticated(false);
              setCurrentScreen('auth');
            }}
          />
        );
      default:
        return (
          <HomeScreen
            inventory={inventory}
            suggestedRecipe={selectedRecipe}
            onNavigate={setCurrentScreen}
            onSelectRecipe={setSelectedRecipe}
          />
        );
    }
  };

  const hideHeaderAndNav = ['splash', 'onboarding', 'auth'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-linen dark:bg-charcoal text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {!hideHeaderAndNav && (
        <Header
          householdName={profile.name}
          onNavigate={setCurrentScreen}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          shoppingCount={shoppingList.filter((s) => !s.isCompleted).length}
        />
      )}

      <main className="flex-1 p-4 max-w-xl mx-auto w-full">
        {renderScreen()}
      </main>

      {!hideHeaderAndNav && (
        <Navbar currentScreen={currentScreen} onNavigate={setCurrentScreen} />
      )}
    </div>
  );
}
