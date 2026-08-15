-- ==========================================
-- HAVEN HOUSEHOLD INVENTORY DATABASE SCHEMA
-- Supabase Postgres + RLS Policies
-- ==========================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. HOUSEHOLDS TABLE
CREATE TABLE IF NOT EXISTS households (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL DEFAULT 'My Home',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    household_id UUID REFERENCES households(id) ON DELETE SET NULL,
    display_name VARCHAR(255),
    language VARCHAR(10) DEFAULT 'en', -- en, hi, kn, ta, te
    dietary_prefs JSONB DEFAULT '[]'::jsonb, -- e.g. ["Vegetarian", "Gluten-Free"]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. INVENTORY ITEMS TABLE (The Central Source of Truth)
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Other', -- Dairy, Vegetables, Fruits, Grains, Snacks, Beverages, Household
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1.0,
    unit VARCHAR(50) DEFAULT 'units', -- L, kg, g, pcs, packs
    purchase_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE NOT NULL,
    storage_location VARCHAR(100) DEFAULT 'Pantry', -- Fridge, Freezer, Pantry, Cabinet
    status VARCHAR(50) DEFAULT 'fresh', -- fresh, use_soon, expiring_today, expired
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PURCHASES & SCANS LOG TABLE
CREATE TABLE IF NOT EXISTS purchase_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    image_url TEXT,
    raw_ocr_text TEXT,
    detected_items JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_verified BOOLEAN DEFAULT FALSE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. SHOPPING LIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS shopping_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    quantity NUMERIC(10, 2) DEFAULT 1.0,
    unit VARCHAR(50) DEFAULT 'units',
    is_ai_suggested BOOLEAN DEFAULT FALSE,
    reason TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. RECIPES TABLE
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    prep_time_mins INT DEFAULT 20,
    dietary_type VARCHAR(50) DEFAULT 'Vegetarian',
    used_ingredients JSONB DEFAULT '[]'::jsonb,
    missing_ingredients JSONB DEFAULT '[]'::jsonb,
    instructions JSONB DEFAULT '[]'::jsonb,
    waste_reduction_score INT DEFAULT 85,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. WASTE & RESCUE LOG TABLE (For Insights)
CREATE TABLE IF NOT EXISTS waste_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(50) DEFAULT 'units',
    estimated_cost_inr NUMERIC(10, 2) DEFAULT 0.0,
    action_type VARCHAR(50) NOT NULL, -- 'rescued' or 'wasted'
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_history ENABLE ROW LEVEL SECURITY;

-- Household Isolation Policy helper
CREATE OR REPLACE FUNCTION get_user_household_id()
RETURNS UUID AS $$
  SELECT household_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- RLS: Inventory items access only within same household
CREATE POLICY "Inventory household isolation" ON inventory_items
    FOR ALL USING (household_id = get_user_household_id());

-- RLS: Shopping list access only within same household
CREATE POLICY "Shopping household isolation" ON shopping_items
    FOR ALL USING (household_id = get_user_household_id());

-- RLS: Scans access only within same household
CREATE POLICY "Scans household isolation" ON purchase_scans
    FOR ALL USING (household_id = get_user_household_id());

-- RLS: Waste history access only within same household
CREATE POLICY "Waste history household isolation" ON waste_history
    FOR ALL USING (household_id = get_user_household_id());
