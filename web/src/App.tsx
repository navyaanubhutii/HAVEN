import React, { useState, useEffect } from 'react';
import { ScreenType, InventoryItem, ExtractedScanItem, Recipe, ShoppingItem, InsightsData, HouseholdProfile, WasteHistoryItem } from './types';
import { computeDaysAndStatus, computePantryHealthScore } from './services/store';
import { api } from './services/api';

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
  const [isBackendOnline, setIsBackendOnline] = useState(true);

  // Check backend health on startup
  useEffect(() => {
    api.healthCheck().then((res) => {
      setIsBackendOnline(res.isOnline);
    });
  }, []);

  // Single Source of Truth Normalized State (LocalStorage persisted)
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('haven_inventory_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: 'item-101',
        name: 'Fresh Baby Spinach',
        category: 'Vegetables',
        quantity: 1,
        unit: 'pack',
        purchaseDate: today,
        expiryDate: today, // Expires today!
        storageLocation: 'Fridge',
        price: 40,
        status: 'expiring_today',
        daysRemaining: 0,
        isEstimatedExpiry: false
      },
      {
        id: 'item-102',
        name: 'Amul T-Special Milk',
        category: 'Dairy',
        quantity: 2,
        unit: 'L',
        purchaseDate: today,
        expiryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        storageLocation: 'Fridge',
        price: 66,
        status: 'use_soon',
        daysRemaining: 1,
        isEstimatedExpiry: false
      },
      {
        id: 'item-103',
        name: 'Whole Wheat Bread',
        category: 'Bakery',
        quantity: 1,
        unit: 'pack',
        purchaseDate: today,
        expiryDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        storageLocation: 'Pantry',
        price: 45,
        status: 'use_soon',
        daysRemaining: 3,
        isEstimatedExpiry: true
      },
      {
        id: 'item-104',
        name: 'Fresh Hybrid Tomatoes',
        category: 'Vegetables',
        quantity: 1,
        unit: 'kg',
        purchaseDate: today,
        expiryDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        storageLocation: 'Pantry',
        price: 50,
        status: 'fresh',
        daysRemaining: 5,
        isEstimatedExpiry: true
      },
      {
        id: 'item-105',
        name: 'Garlic Cloves',
        category: 'Vegetables',
        quantity: 200,
        unit: 'g',
        purchaseDate: today,
        expiryDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
        storageLocation: 'Pantry',
        status: 'fresh',
        daysRemaining: 14,
        isEstimatedExpiry: true
      },
      {
        id: 'item-106',
        name: 'Spaghetti Pasta',
        category: 'Grains',
        quantity: 500,
        unit: 'g',
        purchaseDate: today,
        expiryDate: new Date(Date.now() + 86400000 * 120).toISOString().split('T')[0],
        storageLocation: 'Cabinet',
        price: 80,
        status: 'fresh',
        daysRemaining: 120,
        isEstimatedExpiry: true
      }
    ];
  });

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('haven_shopping_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'shop-1', name: 'Olive Oil 500ml', category: 'Oils', quantity: 1, unit: 'bottle', isAiSuggested: false, isCompleted: false },
      { id: 'shop-2', name: 'Amul Milk 1L', category: 'Dairy', quantity: 2, unit: 'L', isAiSuggested: true, reason: 'You finish milk every 5 days. Running low soon.', isCompleted: false }
    ];
  });

  const [wasteHistory, setWasteHistory] = useState<WasteHistoryItem[]>(() => {
    const saved = localStorage.getItem('haven_waste_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [pendingScanItems, setPendingScanItems] = useState<ExtractedScanItem[]>([]);

  const [profile, setProfile] = useState<HouseholdProfile>({
    name: 'Green Nest Household',
    language: 'en',
    dietaryPrefs: ['Vegetarian'],
    membersCount: 3
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
        { name: 'Amul T-Special Milk', quantity: '0.25 L', status: 'use_soon' },
        { name: 'Garlic Cloves', quantity: '20 g', status: 'fresh' },
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
        { name: 'Fresh Hybrid Tomatoes', quantity: '0.5 kg', status: 'use_soon' },
        { name: 'Garlic Cloves', quantity: '30 g', status: 'fresh' },
        { name: 'Whole Wheat Bread', quantity: '1 pack', status: 'use_soon' }
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

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('haven_inventory_v1', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('haven_shopping_v1', JSON.stringify(shoppingList));
  }, [shoppingList]);

  useEffect(() => {
    localStorage.setItem('haven_waste_v1', JSON.stringify(wasteHistory));
  }, [wasteHistory]);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Inventory Action Handlers
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
      const logEntry: WasteHistoryItem = {
        id: `waste-${Date.now()}`,
        itemName: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        actionType: 'used_before_expiry',
        loggedAt: new Date().toISOString()
      };
      setWasteHistory([logEntry, ...wasteHistory]);
    }
  };

  const handleWasteItem = (id: string) => {
    const item = inventory.find((i) => i.id === id);
    if (item) {
      setInventory(inventory.filter((i) => i.id !== id));
      const logEntry: WasteHistoryItem = {
        id: `waste-${Date.now()}`,
        itemName: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        actionType: 'wasted',
        loggedAt: new Date().toISOString()
      };
      setWasteHistory([logEntry, ...wasteHistory]);
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
        daysRemaining,
        isEstimatedExpiry: true
      };
    });
    setInventory([...newItems, ...inventory]);
  };

  /**
   * PRECISE RECIPE "COOK & AUTO-DEDUCT":
   * Deducts ONLY the required quantity from matching items.
   * Items are never deleted unless remaining quantity drops <= 0.
   */
  const handleCookRecipe = (recipe: Recipe) => {
    let updatedInventory = [...inventory];
    const loggedEntries: WasteHistoryItem[] = [];

    recipe.usedIngredients.forEach((reqIng) => {
      const targetName = reqIng.name.toLowerCase();
      // Find matching item in inventory
      const matchIndex = updatedInventory.findIndex(
        (inv) => inv.name.toLowerCase().includes(targetName) || targetName.includes(inv.name.toLowerCase())
      );

      if (matchIndex !== -1) {
        const invItem = updatedInventory[matchIndex];
        // Parse required numeric quantity from string like "0.25 L" or "20 g" or "1 pack"
        const numMatch = reqIng.quantity.match(/([\d\.]+)/);
        const reqQty = numMatch ? parseFloat(numMatch[1]) : 1.0;

        // Perform safe partial deduction
        const newQty = invItem.quantity - reqQty;

        if (newQty <= 0) {
          // Quantity completely consumed -> remove item from inventory
          updatedInventory.splice(matchIndex, 1);
        } else {
          // Update remaining quantity
          updatedInventory[matchIndex] = {
            ...invItem,
            quantity: Math.round(newQty * 100) / 100
          };
        }

        loggedEntries.push({
          id: `waste-cook-${Date.now()}-${Math.random()}`,
          itemName: invItem.name,
          category: invItem.category,
          quantity: reqQty,
          unit: invItem.unit,
          price: invItem.price ? (invItem.price * (reqQty / invItem.quantity)) : undefined,
          actionType: 'used_before_expiry',
          loggedAt: new Date().toISOString()
        });
      }
    });

    setInventory(updatedInventory);
    setWasteHistory([...loggedEntries, ...wasteHistory]);
    alert(`🎉 Recipe ingredients auto-deducted! Your inventory quantities have been updated.`);
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
      storageLocation: 'Pantry',
      isEstimatedExpiry: true
    });
  };

  // Compute insights dynamically from actual wasteHistory
  const computeDynamicInsights = (): InsightsData & { hasData: boolean; hasExplicitPrice: boolean } => {
    const rescued = wasteHistory.filter((w) => w.actionType === 'used_before_expiry');
    const wasted = wasteHistory.filter((w) => w.actionType === 'wasted');

    let totalSaved = 0;
    let hasPrice = false;
    rescued.forEach((r) => {
      if (r.price && r.price > 0) {
        totalSaved += r.price;
        hasPrice = true;
      }
    });

    const wasteCounts: Record<string, number> = {};
    wasted.forEach((w) => {
      wasteCounts[w.itemName] = (wasteCounts[w.itemName] || 0) + 1;
    });

    const topWasted = Object.keys(wasteCounts).length > 0
      ? Object.entries(wasteCounts).sort((a, b) => b[1] - a[1])[0][0]
      : 'None';

    const healthScore = computePantryHealthScore(inventory);
    const totalLogged = rescued.length + wasted.length;
    const reductionPct = totalLogged > 0 ? Math.round((rescued.length / totalLogged) * 100) : 0;

    return {
      currencySymbol: '₹',
      totalFoodSaved: totalSaved,
      itemsRescuedCount: rescued.length,
      itemsWastedCount: wasted.length,
      mostFrequentlyWasted: topWasted,
      wasteReductionPercentage: reductionPct,
      pantryHealthScore: healthScore,
      co2AvoidedKg: Math.round(rescued.length * 0.4 * 10) / 10,
      waterSavedLiters: rescued.length * 15,
      hasData: totalLogged > 0,
      hasExplicitPrice: hasPrice
    };
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
            onLogin={() => {
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
            isBackendOnline={isBackendOnline}
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
        return <InsightsScreen insights={computeDynamicInsights()} onNavigate={setCurrentScreen} />;
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
            isBackendOnline={isBackendOnline}
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
          isBackendOnline={isBackendOnline}
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
