-- Clean migration to add gummy and cookie tracking fields
-- Copy and paste this entire block into Supabase SQL Editor

ALTER TABLE products 
ADD COLUMN is_gummy BOOLEAN DEFAULT FALSE,
ADD COLUMN is_cookie BOOLEAN DEFAULT FALSE;

-- Add helpful comments
COMMENT ON COLUMN products.is_gummy IS 'True if the product is a gummy edible';
COMMENT ON COLUMN products.is_cookie IS 'True if the product is a cookie edible';

-- Create indexes for performance
CREATE INDEX idx_products_is_gummy ON products(is_gummy) WHERE is_gummy = TRUE;
CREATE INDEX idx_products_is_cookie ON products(is_cookie) WHERE is_cookie = TRUE; 