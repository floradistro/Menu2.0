-- Run this entire script in your Supabase SQL Editor
-- This will create the pricing tables and sample data

-- Create base_pricing table
CREATE TABLE IF NOT EXISTS base_pricing (
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
CREATE TABLE IF NOT EXISTS pricing_rules (
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_base_pricing_category ON base_pricing(category);
CREATE INDEX IF NOT EXISTS idx_base_pricing_active ON base_pricing(is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_category ON pricing_rules(category);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_type ON pricing_rules(type);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_active ON pricing_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_priority ON pricing_rules(priority DESC);

-- Insert sample base pricing data
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
('moonwater', '30mg 4-pack', 25.00)
ON CONFLICT (category, weight_or_quantity) DO NOTHING;

-- Insert sample pricing rules
INSERT INTO pricing_rules (name, category, type, value, conditions, priority) VALUES
-- Percentage discounts
('10% Off All Flower', 'flower', 'percentage_discount', 10, '{"min_quantity": 1}', 5),
('15% Off Flower Bulk', 'flower', 'percentage_discount', 15, '{"min_quantity": 3}', 6),
('Happy Hour Vapes', 'vapes', 'percentage_discount', 20, '{"time_restrictions": {"start_time": "16:00", "end_time": "18:00"}}', 10),

-- Bundle deals
('Mix & Match 3 Eighths', 'flower', 'bundle', 120, '{"min_quantity": 3}', 8),
('Premium Ounce Deal', 'flower', 'bundle', 360, '{"min_quantity": 8}', 7),
('Vape + Flower Combo', 'vapes', 'bundle', 85, '{"min_quantity": 2}', 6),

-- Special offers
('Daily Special - Blue Dream', 'flower', 'special', 35, '{"specific_products": ["Blue Dream"]}', 9),
('Flash Sale - OG Kush', 'flower', 'special', 35, '{"specific_products": ["OG Kush"]}', 9),
('First Time Customer', 'flower', 'percentage_discount', 25, '{"max_quantity": 1}', 15);

-- Verify tables were created
SELECT 'base_pricing table created' as status, count(*) as records FROM base_pricing;
SELECT 'pricing_rules table created' as status, count(*) as records FROM pricing_rules; 