-- Complete Products Table Setup for MENU 2.0
-- Run this in Supabase SQL Editor

-- Create the products table with all fields
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  product_category TEXT,
  strain_type TEXT,
  strain_cross TEXT,
  description TEXT,
  terpene TEXT,
  strength TEXT,
  thca_percent DECIMAL(5,2),
  delta9_percent DECIMAL(5,2),
  store_code TEXT NOT NULL,
  is_gummy BOOLEAN DEFAULT FALSE,
  is_cookie BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add helpful comments
COMMENT ON TABLE products IS 'Cannabis products for menu display';
COMMENT ON COLUMN products.product_name IS 'Name of the cannabis product';
COMMENT ON COLUMN products.product_category IS 'Category: Flower, Vape, Edible, Concentrate, Moonwater';
COMMENT ON COLUMN products.strain_type IS 'Indica, Sativa, Hybrid, etc.';
COMMENT ON COLUMN products.strain_cross IS 'Genetic lineage of the strain';
COMMENT ON COLUMN products.description IS 'Product description';
COMMENT ON COLUMN products.terpene IS 'Dominant terpene profile';
COMMENT ON COLUMN products.strength IS 'Product strength (mg, g, etc.)';
COMMENT ON COLUMN products.thca_percent IS 'THCA percentage';
COMMENT ON COLUMN products.delta9_percent IS 'Delta-9 THC percentage';
COMMENT ON COLUMN products.store_code IS 'Store identifier (CLT, TN, BR, etc.)';
COMMENT ON COLUMN products.is_gummy IS 'True if the product is a gummy edible';
COMMENT ON COLUMN products.is_cookie IS 'True if the product is a cookie edible';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_store_code ON products(store_code);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(product_category);
CREATE INDEX IF NOT EXISTS idx_products_strain_type ON products(strain_type);
CREATE INDEX IF NOT EXISTS idx_products_is_gummy ON products(is_gummy) WHERE is_gummy = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_is_cookie ON products(is_cookie) WHERE is_cookie = TRUE;

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON products FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON products FOR DELETE USING (true);

-- Insert some sample data for testing
INSERT INTO products (product_name, product_category, strain_type, strain_cross, description, terpene, strength, thca_percent, delta9_percent, store_code, is_gummy, is_cookie) VALUES
('Blue Dream', 'Flower', 'Hybrid', 'Blueberry x Haze', 'Premium indoor flower', 'Myrcene', '3.5g', 24.8, 0.28, 'CLT', false, false),
('OG Kush Cart', 'Vape', 'Indica', 'OG Kush', 'Premium distillate cartridge', 'Limonene', '1g', 85.2, 0.1, 'CLT', false, false),
('Gummy Bears', 'Edible', null, null, 'Delicious fruit gummies', null, '10mg', null, null, 'CLT', true, false),
('Chocolate Cookies', 'Edible', null, null, 'Premium baked goods', null, '10mg', null, null, 'CLT', false, true),
('Live Resin', 'Concentrate', 'Hybrid', 'Various', 'Premium concentrate', 'Caryophyllene', '1g', 78.5, 0.15, 'CLT', false, false),
('Moonwater Original', 'Moonwater', null, null, 'Cannabis beverage', null, '5mg', null, null, 'CLT', false, false);

-- Success message
SELECT 'Products table created successfully with gummy and cookie tracking!' AS status; 