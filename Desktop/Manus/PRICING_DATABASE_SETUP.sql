-- Pricing Management Database Schema
-- Run this in your Supabase SQL editor to set up the pricing system

-- Base Pricing Table
-- Stores base prices for different product categories and weights/quantities
CREATE TABLE IF NOT EXISTS base_pricing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category VARCHAR(50) NOT NULL CHECK (category IN ('flower', 'vapes', 'edibles', 'concentrates', 'prerolls', 'moonwater')),
    weight_or_quantity VARCHAR(50) NOT NULL, -- e.g., '1g', '3.5g', '1 cart', '4-pack'
    base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category, weight_or_quantity)
);

-- Pricing Rules Table
-- Stores discount rules, bundle deals, and special offers
CREATE TABLE IF NOT EXISTS pricing_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('flower', 'vapes', 'edibles', 'concentrates', 'prerolls', 'moonwater')),
    type VARCHAR(50) NOT NULL CHECK (type IN ('base_price', 'percentage_discount', 'fixed_discount', 'bundle', 'special')),
    value DECIMAL(10,2) NOT NULL CHECK (value >= 0), -- Percentage for percentage_discount, dollar amount for others
    conditions JSONB DEFAULT '{}', -- Flexible conditions storage
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 1, -- Higher priority rules apply first
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_base_pricing_category ON base_pricing(category);
CREATE INDEX IF NOT EXISTS idx_base_pricing_active ON base_pricing(is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_category ON pricing_rules(category);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_type ON pricing_rules(type);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_active ON pricing_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_priority ON pricing_rules(priority DESC);

-- Update triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_base_pricing_updated_at 
    BEFORE UPDATE ON base_pricing 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_rules_updated_at 
    BEFORE UPDATE ON pricing_rules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample base pricing data
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

-- Insert some sample pricing rules
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
('First Time Customer', 'flower', 'percentage_discount', 25, '{"max_quantity": 1}', 15)
ON CONFLICT DO NOTHING;

-- Comments explaining the structure
COMMENT ON TABLE base_pricing IS 'Base pricing for all product categories and quantities';
COMMENT ON TABLE pricing_rules IS 'Flexible pricing rules for discounts, bundles, and specials';

COMMENT ON COLUMN pricing_rules.conditions IS 'JSON conditions: {"min_quantity": 2, "max_quantity": 10, "specific_products": ["product1"], "time_restrictions": {"start_time": "16:00", "end_time": "18:00", "days_of_week": [1,2,3,4,5]}}';

COMMENT ON COLUMN pricing_rules.priority IS 'Higher numbers = higher priority. Rules are applied in priority order.';

-- Enable Row Level Security (RLS) if needed
-- ALTER TABLE base_pricing ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS (uncomment if you want to restrict access)
-- CREATE POLICY "Allow all operations for authenticated users" ON base_pricing FOR ALL TO authenticated USING (true);
-- CREATE POLICY "Allow all operations for authenticated users" ON pricing_rules FOR ALL TO authenticated USING (true); 