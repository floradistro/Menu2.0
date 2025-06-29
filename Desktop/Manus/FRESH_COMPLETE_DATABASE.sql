-- COMPLETE FRESH DATABASE SETUP
-- Delete everything and start completely fresh
-- Run this entire script in Supabase SQL Editor

-- Drop all existing tables to start completely fresh
DROP TABLE IF EXISTS ai_actions CASCADE;
DROP TABLE IF EXISTS menu_settings CASCADE;
DROP TABLE IF EXISTS pricing_rules CASCADE;
DROP TABLE IF EXISTS base_pricing CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Create products table
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('flower', 'vapes', 'edibles')),
    type VARCHAR(50) NOT NULL,
    thca VARCHAR(10),
    cbd VARCHAR(10),
    dosage VARCHAR(50),
    terpenes TEXT[],
    effects TEXT[],
    description TEXT,
    price VARCHAR(20) NOT NULL,
    in_stock BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    ai_managed BOOLEAN DEFAULT false,
    ai_confidence_score DECIMAL(3,2),
    ai_last_updated TIMESTAMP WITH TIME ZONE,
    ai_update_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_settings table
CREATE TABLE menu_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_actions table
CREATE TABLE ai_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('create', 'update', 'delete', 'price_change', 'stock_toggle')),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    old_data JSONB,
    new_data JSONB,
    reasoning TEXT NOT NULL,
    confidence_score DECIMAL(3,2),
    approved BOOLEAN DEFAULT false,
    approved_by VARCHAR(255),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create base_pricing table
CREATE TABLE base_pricing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category VARCHAR(50) NOT NULL CHECK (category IN ('flower', 'vapes', 'edibles', 'concentrates', 'prerolls', 'moonwater')),
    weight_or_quantity VARCHAR(50) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category, weight_or_quantity)
);

-- Create pricing_rules table
CREATE TABLE pricing_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('flower', 'vapes', 'edibles', 'concentrates', 'prerolls', 'moonwater')),
    type VARCHAR(50) NOT NULL CHECK (type IN ('base_price', 'percentage_discount', 'fixed_discount', 'bundle', 'special')),
    value DECIMAL(10,2) NOT NULL CHECK (value >= 0),
    conditions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_products_sort_order ON products(sort_order);
CREATE INDEX idx_ai_actions_approved ON ai_actions(approved);
CREATE INDEX idx_ai_actions_product_id ON ai_actions(product_id);
CREATE INDEX idx_base_pricing_category ON base_pricing(category);
CREATE INDEX idx_base_pricing_active ON base_pricing(is_active);
CREATE INDEX idx_pricing_rules_category ON pricing_rules(category);
CREATE INDEX idx_pricing_rules_type ON pricing_rules(type);
CREATE INDEX idx_pricing_rules_active ON pricing_rules(is_active);
CREATE INDEX idx_pricing_rules_priority ON pricing_rules(priority DESC);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_settings_updated_at 
    BEFORE UPDATE ON menu_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_base_pricing_updated_at 
    BEFORE UPDATE ON base_pricing 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_rules_updated_at 
    BEFORE UPDATE ON pricing_rules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products data
INSERT INTO products (name, category, type, thca, terpenes, effects, description, price, in_stock, sort_order) VALUES
-- Flower products
('Blue Dream', 'flower', 'hybrid', '19%', ARRAY['Myrcene', 'Pinene', 'Caryophyllene'], ARRAY['Relaxing', 'Euphoric', 'Creative'], 'A balanced hybrid with sweet berry aroma and gentle cerebral effects.', '$40', true, 1),
('OG Kush', 'flower', 'indica', '22%', ARRAY['Limonene', 'Myrcene', 'Caryophyllene'], ARRAY['Relaxing', 'Sleepy', 'Happy'], 'Classic indica with earthy pine flavors and strong body effects.', '$45', true, 2),
('Sour Diesel', 'flower', 'sativa', '20%', ARRAY['Limonene', 'Caryophyllene', 'Myrcene'], ARRAY['Energizing', 'Uplifting', 'Creative'], 'Energizing sativa with diesel aroma and cerebral effects.', '$42', true, 3),
('Wedding Cake', 'flower', 'hybrid', '24%', ARRAY['Caryophyllene', 'Limonene', 'Linalool'], ARRAY['Relaxing', 'Happy', 'Euphoric'], 'Sweet and tangy hybrid with relaxing yet uplifting effects.', '$50', true, 4),
('Gelato', 'flower', 'hybrid', '21%', ARRAY['Caryophyllene', 'Linalool', 'Limonene'], ARRAY['Happy', 'Relaxing', 'Euphoric'], 'Dessert-like hybrid with sweet flavors and balanced effects.', '$48', true, 5),

-- Vape products
('Blue Dream Cart', 'vapes', 'hybrid', '89%', ARRAY['Myrcene', 'Pinene'], ARRAY['Relaxing', 'Euphoric', 'Creative'], 'Premium distillate cartridge with natural terpenes.', '$35', true, 1),
('OG Kush Cart', 'vapes', 'indica', '91%', ARRAY['Limonene', 'Myrcene'], ARRAY['Relaxing', 'Sleepy', 'Happy'], 'High-potency indica cartridge for evening use.', '$35', true, 2),
('Sour Diesel Cart', 'vapes', 'sativa', '88%', ARRAY['Limonene', 'Caryophyllene'], ARRAY['Energizing', 'Uplifting', 'Creative'], 'Energizing sativa cartridge perfect for daytime.', '$35', true, 3),

-- Edible products
('Gummy Bears', 'edibles', 'gummy', NULL, NULL, ARRAY['Relaxing', 'Happy'], 'Delicious fruit-flavored gummies with precise dosing.', '$30', true, 1),
('Chocolate Chip Cookies', 'edibles', 'cookie', NULL, NULL, ARRAY['Relaxing', 'Euphoric'], 'Classic chocolate chip cookies infused with premium extract.', '$25', true, 2),
('Moonwater 5mg', 'edibles', 'moonwater', NULL, NULL, ARRAY['Mild', 'Relaxing'], 'Low-dose cannabis-infused water for micro-dosing.', '$5', true, 3),
('Moonwater 10mg', 'edibles', 'moonwater', NULL, NULL, ARRAY['Moderate', 'Relaxing'], 'Medium-dose cannabis-infused water for regular users.', '$8', true, 4);

-- Insert menu settings
INSERT INTO menu_settings (setting_key, setting_value) VALUES
('display_config', '{
    "font_size": 170,
    "theme": "dark",
    "auto_refresh_interval": 30,
    "display_effects": true
}'),
('flipboard_messages', '{
    "deals": [
        "HAPPY HOUR 4-6PM",
        "20% OFF VAPES",
        "BULK DISCOUNTS AVAILABLE",
        "FIRST TIME 25% OFF"
    ],
    "bundles": [
        "MIX AND MATCH DEALS",
        "3 EIGHTHS FOR $120",
        "OUNCE SPECIALS",
        "COMBO PACKS AVAILABLE"
    ],
    "flash": [
        "FLASH SALE TODAY",
        "LIMITED TIME OFFER",
        "WHILE SUPPLIES LAST",
        "DAILY SPECIALS"
    ]
}');

-- Insert base pricing data
INSERT INTO base_pricing (category, weight_or_quantity, base_price) VALUES
-- Flower pricing
('flower', '1g', 15.00),
('flower', '3.5g', 40.00),
('flower', '7g', 70.00),
('flower', '14g', 110.00),
('flower', '28g', 200.00),

-- Concentrates pricing
('concentrates', '1g', 35.00),
('concentrates', '3.5g', 75.00),
('concentrates', '7g', 125.00),
('concentrates', '14g', 200.00),
('concentrates', '28g', 300.00),

-- Vapes pricing
('vapes', '1 cart', 35.00),
('vapes', '2 carts', 60.00),
('vapes', '3 carts', 75.00),

-- Edibles pricing
('edibles', '1 pack', 30.00),
('edibles', '2 packs', 50.00),
('edibles', '3 packs', 70.00),

-- Pre-rolls pricing
('prerolls', '1 roll', 15.00),
('prerolls', '3 rolls', 40.00),
('prerolls', '5 rolls', 60.00),

-- Moonwater pricing
('moonwater', '5mg single', 5.00),
('moonwater', '5mg 4-pack', 12.00),
('moonwater', '10mg single', 8.00),
('moonwater', '10mg 4-pack', 20.00),
('moonwater', '30mg single', 9.00),
('moonwater', '30mg 4-pack', 25.00);

-- Insert pricing rules
INSERT INTO pricing_rules (name, category, type, value, conditions, priority) VALUES
-- Percentage discounts
('10% Off All Flower', 'flower', 'percentage_discount', 10, '{"min_quantity": 1}', 5),
('15% Off Flower Bulk', 'flower', 'percentage_discount', 15, '{"min_quantity": 3}', 6),
('Happy Hour Vapes', 'vapes', 'percentage_discount', 20, '{"time_restrictions": {"start_time": "16:00", "end_time": "18:00"}}', 10),
('First Time Customer', 'flower', 'percentage_discount', 25, '{"max_quantity": 1}', 15),

-- Bundle deals
('Mix & Match 3 Eighths', 'flower', 'bundle', 120, '{"min_quantity": 3}', 8),
('Premium Ounce Deal', 'flower', 'bundle', 360, '{"min_quantity": 8}', 7),
('Vape + Flower Combo', 'vapes', 'bundle', 85, '{"min_quantity": 2}', 6),

-- Special offers
('Daily Special - Blue Dream', 'flower', 'special', 35, '{"specific_products": ["Blue Dream"]}', 9),
('Flash Sale - OG Kush', 'flower', 'special', 35, '{"specific_products": ["OG Kush"]}', 9);

-- Verify everything was created successfully
SELECT 'SUCCESS: products table created with ' || count(*) || ' records' as result FROM products;
SELECT 'SUCCESS: menu_settings table created with ' || count(*) || ' records' as result FROM menu_settings;
SELECT 'SUCCESS: base_pricing table created with ' || count(*) || ' records' as result FROM base_pricing;
SELECT 'SUCCESS: pricing_rules table created with ' || count(*) || ' records' as result FROM pricing_rules;
SELECT 'SUCCESS: ai_actions table created and ready' as result;

-- Show sample data
SELECT '--- SAMPLE PRODUCTS ---' as info;
SELECT name, category, type, price FROM products ORDER BY category, sort_order LIMIT 5;

SELECT '--- SAMPLE PRICING RULES ---' as info;
SELECT name, category, type, value, priority FROM pricing_rules ORDER BY priority DESC LIMIT 5; 