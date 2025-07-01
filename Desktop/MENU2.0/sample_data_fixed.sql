-- Sample data for cannabis menu system testing
-- Run this AFTER you've created the schema and view

-- Insert categories
INSERT INTO public.category (name) VALUES 
('Flower'), ('Vape'), ('Edible'), ('Concentrate'), ('Moonwater');

-- Insert stores
INSERT INTO public.store (code, name, address) VALUES 
('CLT', 'Charlotte', '123 Main St, Charlotte, NC'),
('SAL', 'Salem', '456 Oak Ave, Salem, OR'),
('TN', 'Tennessee', '789 Pine Rd, Nashville, TN'),
('BR', 'Baton Rouge', '321 Elm St, Baton Rouge, LA');

-- Insert strains
INSERT INTO public.strain (name, strain_type, description) VALUES 
('Candyland', 'Sativa', 'Uplifting and energetic'),
('Sunset Sherbet', 'Hybrid', 'Relaxing with euphoric effects'),
('Granddaddy Purple', 'Indica', 'Deep relaxation and sleep aid'),
('Blue Dream', 'Hybrid', 'Balanced and creative'),
('OG Kush', 'Indica', 'Classic strain with earthy flavors');

-- Insert flavors for edibles
INSERT INTO public.flavor (name, category_id) VALUES 
('Clementine Orange', (SELECT id FROM public.category WHERE name = 'Edible')),
('Mixed Berry', (SELECT id FROM public.category WHERE name = 'Edible')),
('Watermelon', (SELECT id FROM public.category WHERE name = 'Moonwater')),
('Lemon Lime', (SELECT id FROM public.category WHERE name = 'Moonwater'));

-- Insert products
INSERT INTO public.product (product_name, category_id, strain_id, base_description) VALUES 
-- Flower
('Candyland', (SELECT id FROM public.category WHERE name = 'Flower'), (SELECT id FROM public.strain WHERE name = 'Candyland'), 'Premium indoor flower'),
('Sunset Sherbet', (SELECT id FROM public.category WHERE name = 'Flower'), (SELECT id FROM public.strain WHERE name = 'Sunset Sherbet'), 'Top shelf quality'),
('Blue Dream', (SELECT id FROM public.category WHERE name = 'Flower'), (SELECT id FROM public.strain WHERE name = 'Blue Dream'), 'Classic favorite'),

-- Vapes
('OG Kush Cart', (SELECT id FROM public.category WHERE name = 'Vape'), (SELECT id FROM public.strain WHERE name = 'OG Kush'), 'Premium distillate cartridge'),
('Blue Dream Pod', (SELECT id FROM public.category WHERE name = 'Vape'), (SELECT id FROM public.strain WHERE name = 'Blue Dream'), 'Live resin pod'),

-- Edibles
('Gummy Bears', (SELECT id FROM public.category WHERE name = 'Edible'), NULL, 'Delicious fruit gummies'),
('Chocolate Bar', (SELECT id FROM public.category WHERE name = 'Edible'), NULL, 'Premium dark chocolate'),

-- Concentrates
('Candyland Shatter', (SELECT id FROM public.category WHERE name = 'Concentrate'), (SELECT id FROM public.strain WHERE name = 'Candyland'), 'High quality shatter'),
('OG Kush Rosin', (SELECT id FROM public.category WHERE name = 'Concentrate'), (SELECT id FROM public.strain WHERE name = 'OG Kush'), 'Solventless rosin'),

-- Moonwater
('Moonwater Drink', (SELECT id FROM public.category WHERE name = 'Moonwater'), NULL, 'Cannabis-infused beverage');

-- Insert variants
INSERT INTO public.variant (product_id, flavor_id, variant_label, strength_mg, thca_pct, delta9_pct, sku) VALUES 
-- Flower variants
((SELECT id FROM public.product WHERE product_name = 'Candyland'), NULL, '3.5g', NULL, 26.4, 0.003, 'CL-35'),
((SELECT id FROM public.product WHERE product_name = 'Candyland'), NULL, '7g', NULL, 26.4, 0.003, 'CL-7'),
((SELECT id FROM public.product WHERE product_name = 'Sunset Sherbet'), NULL, '3.5g', NULL, 22.1, 0.005, 'SS-35'),
((SELECT id FROM public.product WHERE product_name = 'Blue Dream'), NULL, '3.5g', NULL, 24.8, 0.004, 'BD-35'),

-- Vape variants
((SELECT id FROM public.product WHERE product_name = 'OG Kush Cart'), NULL, '1g', NULL, 85.2, 0.1, 'OGC-1G'),
((SELECT id FROM public.product WHERE product_name = 'Blue Dream Pod'), NULL, '0.5g', NULL, 78.5, 0.08, 'BDP-05'),

-- Edible variants
((SELECT id FROM public.product WHERE product_name = 'Gummy Bears'), (SELECT id FROM public.flavor WHERE name = 'Mixed Berry'), '10mg', 10, NULL, NULL, 'GB-10'),
((SELECT id FROM public.product WHERE product_name = 'Gummy Bears'), (SELECT id FROM public.flavor WHERE name = 'Clementine Orange'), '5mg', 5, NULL, NULL, 'GB-5'),
((SELECT id FROM public.product WHERE product_name = 'Chocolate Bar'), NULL, '100mg', 100, NULL, NULL, 'CB-100'),

-- Concentrate variants
((SELECT id FROM public.product WHERE product_name = 'Candyland Shatter'), NULL, '1g', NULL, 82.3, 0.2, 'CLS-1G'),
((SELECT id FROM public.product WHERE product_name = 'OG Kush Rosin'), NULL, '1g', NULL, 75.8, 0.15, 'OGR-1G'),

-- Moonwater variants
((SELECT id FROM public.product WHERE product_name = 'Moonwater Drink'), (SELECT id FROM public.flavor WHERE name = 'Watermelon'), '10mg', 10, NULL, NULL, 'MW-10'),
((SELECT id FROM public.product WHERE product_name = 'Moonwater Drink'), (SELECT id FROM public.flavor WHERE name = 'Lemon Lime'), '5mg', 5, NULL, NULL, 'MW-5');

-- Insert inventory for all stores and variants
INSERT INTO public.inventory (store_id, variant_id, qty_on_hand, low_stock_threshold) 
SELECT 
  s.id as store_id,
  v.id as variant_id,
  FLOOR(RANDOM() * 50 + 10) as qty_on_hand,  -- Random quantity between 10-60
  5 as low_stock_threshold
FROM public.store s
CROSS JOIN public.variant v;

-- Insert pricing for all variants and stores
INSERT INTO public.variant_price (variant_id, store_id, price_type, price_cents) 
SELECT 
  v.id as variant_id,
  s.id as store_id,
  'regular' as price_type,
  CASE 
    WHEN v.variant_label LIKE '%3.5g%' THEN FLOOR(RANDOM() * 2000 + 2500)  -- $25-45
    WHEN v.variant_label LIKE '%7g%' THEN FLOOR(RANDOM() * 3000 + 4500)    -- $45-75
    WHEN v.variant_label LIKE '%1g%' AND p.category_id = (SELECT id FROM public.category WHERE name = 'Vape') THEN FLOOR(RANDOM() * 1500 + 3500)  -- $35-50 for vapes
    WHEN v.variant_label LIKE '%0.5g%' THEN FLOOR(RANDOM() * 1000 + 2500)  -- $25-35 for 0.5g vapes
    WHEN v.variant_label LIKE '%1g%' AND p.category_id = (SELECT id FROM public.category WHERE name = 'Concentrate') THEN FLOOR(RANDOM() * 2000 + 4000)  -- $40-60 for concentrates
    WHEN v.variant_label LIKE '%100mg%' THEN FLOOR(RANDOM() * 1000 + 2000) -- $20-30 for 100mg edibles
    WHEN v.variant_label LIKE '%10mg%' THEN FLOOR(RANDOM() * 500 + 1000)   -- $10-15 for 10mg
    WHEN v.variant_label LIKE '%5mg%' THEN FLOOR(RANDOM() * 300 + 700)     -- $7-10 for 5mg
    ELSE FLOOR(RANDOM() * 1000 + 1500)                                     -- Default $15-25
  END as price_cents
FROM public.variant v
JOIN public.product p ON v.product_id = p.id
CROSS JOIN public.store s;

-- Add some special pricing
INSERT INTO public.variant_price (variant_id, store_id, price_type, price_cents, starts_at, ends_at) 
SELECT 
  v.id as variant_id,
  s.id as store_id,
  'special' as price_type,
  FLOOR(vp.price_cents * 0.8) as price_cents,  -- 20% off
  NOW() as starts_at,
  NOW() + INTERVAL '7 days' as ends_at
FROM public.variant v
JOIN public.product p ON v.product_id = p.id
CROSS JOIN public.store s
JOIN public.variant_price vp ON vp.variant_id = v.id AND vp.store_id = s.id AND vp.price_type = 'regular'
WHERE RANDOM() < 0.2;  -- 20% of products on special 