-- Add is_gummy and is_cookie fields to products table
-- Run this in Supabase SQL Editor

ALTER TABLE products 
ADD COLUMN is_gummy BOOLEAN DEFAULT FALSE,
ADD COLUMN is_cookie BOOLEAN DEFAULT FALSE;

-- Add comments for documentation
COMMENT ON COLUMN products.is_gummy IS 'True if the product is a gummy edible';
COMMENT ON COLUMN products.is_cookie IS 'True if the product is a cookie edible';

-- Create indexes for better query performance
CREATE INDEX idx_products_is_gummy ON products(is_gummy) WHERE is_gummy = TRUE;
CREATE INDEX idx_products_is_cookie ON products(is_cookie) WHERE is_cookie = TRUE;

-- Optional: Update existing edible products if you want to set some as gummies/cookies
-- Uncomment and modify these examples as needed:

-- Example: Set products with 'gummy' in name as gummies
-- UPDATE products 
-- SET is_gummy = TRUE 
-- WHERE product_category = 'Edible' 
-- AND LOWER(product_name) LIKE '%gummy%';

-- Example: Set products with 'cookie' in name as cookies  
-- UPDATE products 
-- SET is_cookie = TRUE 
-- WHERE product_category = 'Edible' 
-- AND LOWER(product_name) LIKE '%cookie%'; 