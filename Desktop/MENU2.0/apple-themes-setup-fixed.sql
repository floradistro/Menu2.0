-- Apple-Inspired Multi-Theme Setup for Supabase (Robust Version)
-- This handles existing data and potential conflicts

-- Step 1: Add new columns safely
DO $$ 
BEGIN
  -- Add theme_name column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='themes' AND column_name='theme_name') THEN
    ALTER TABLE themes ADD COLUMN theme_name TEXT DEFAULT 'Default Theme';
  END IF;
  
  -- Add is_active column if it doesn't exist  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='themes' AND column_name='is_active') THEN
    ALTER TABLE themes ADD COLUMN is_active BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- Add description column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='themes' AND column_name='description') THEN
    ALTER TABLE themes ADD COLUMN description TEXT DEFAULT '';
  END IF;
END $$;

-- Step 2: Clean up existing data to avoid conflicts
UPDATE themes SET theme_name = 'Legacy Theme ' || id::text WHERE theme_name = 'Default Theme' OR theme_name IS NULL;

-- Step 3: Add unique constraint safely
DO $$
BEGIN
  -- Drop constraint if it exists
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='themes_theme_name_unique') THEN
    ALTER TABLE themes DROP CONSTRAINT themes_theme_name_unique;
  END IF;
  
  -- Add the constraint
  ALTER TABLE themes ADD CONSTRAINT themes_theme_name_unique UNIQUE (theme_name);
EXCEPTION WHEN OTHERS THEN
  -- If constraint fails, continue anyway
  NULL;
END $$;

-- Step 4: Create indexes safely
CREATE INDEX IF NOT EXISTS themes_active_idx ON themes (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS themes_name_idx ON themes (theme_name);

-- Step 5: Clear existing themes and insert Apple themes
TRUNCATE themes RESTART IDENTITY CASCADE;

-- Insert Apple-inspired themes
INSERT INTO themes (
  theme_name,
  description,
  background_color,
  header_indica_color,
  header_sativa_color,
  header_hybrid_color,
  text_color,
  table_header_bg,
  table_row_hover,
  is_active,
  created_at,
  updated_at
) VALUES 
-- Apple Dark (Default Active)
(
  'Apple Dark',
  'Classic macOS dark mode with deep blacks and subtle grays',
  'linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #1a1a1a 50%, #0a0a0a 75%, #000000 100%)',
  'linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 50%, #3a3a3c 100%)',
  'linear-gradient(135deg, #2c2c2e 0%, #3a3a3c 50%, #48484a 100%)',
  'linear-gradient(135deg, #1a1a1c 0%, #2c2c2e 50%, #3a3a3c 100%)',
  '#f2f2f7',
  '#1c1c1e',
  '#2c2c2e',
  TRUE,
  NOW(),
  NOW()
),
-- Apple Midnight
(
  'Apple Midnight',
  'Deep midnight blue with subtle gradients',
  'linear-gradient(135deg, #0a0f1c 0%, #1a1f2e 25%, #2a2f3e 50%, #1a1f2e 75%, #0a0f1c 100%)',
  'linear-gradient(135deg, #1a1f2e 0%, #2a2f3e 50%, #3a3f4e 100%)',
  'linear-gradient(135deg, #2a2f3e 0%, #3a3f4e 50%, #4a4f5e 100%)',
  'linear-gradient(135deg, #1a1f2e 0%, #2a2f3e 50%, #3a3f4e 100%)',
  '#e5e5e7',
  '#1a1f2e',
  '#2a2f3e',
  FALSE,
  NOW(),
  NOW()
),
-- Apple Space Gray
(
  'Apple Space Gray',
  'Refined space gray with warm undertones',
  'linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 25%, #3a3a3c 50%, #2c2c2e 75%, #1c1c1e 100%)',
  'linear-gradient(135deg, #2c2c2e 0%, #3a3a3c 50%, #48484a 100%)',
  'linear-gradient(135deg, #3a3a3c 0%, #48484a 50%, #56565a 100%)',
  'linear-gradient(135deg, #2c2c2e 0%, #3a3a3c 50%, #48484a 100%)',
  '#f2f2f7',
  '#2c2c2e',
  '#3a3a3c',
  FALSE,
  NOW(),
  NOW()
),
-- Apple Graphite
(
  'Apple Graphite',
  'Premium graphite finish with refined accents',
  'linear-gradient(135deg, #1a1a1a 0%, #242424 25%, #2e2e2e 50%, #242424 75%, #1a1a1a 100%)',
  'linear-gradient(135deg, #242424 0%, #2e2e2e 50%, #383838 100%)',
  'linear-gradient(135deg, #2e2e2e 0%, #383838 50%, #424242 100%)',
  'linear-gradient(135deg, #242424 0%, #2e2e2e 50%, #383838 100%)',
  '#f5f5f7',
  '#242424',
  '#2e2e2e',
  FALSE,
  NOW(),
  NOW()
),
-- Apple Pro
(
  'Apple Pro',
  'Ultra-dark professional grade theme',
  'linear-gradient(135deg, #000000 0%, #0f0f0f 25%, #1f1f1f 50%, #0f0f0f 75%, #000000 100%)',
  'linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 50%, #2f2f2f 100%)',
  'linear-gradient(135deg, #1f1f1f 0%, #2f2f2f 50%, #3f3f3f 100%)',
  'linear-gradient(135deg, #0f0f0f 0%, #1f1f1f 50%, #2f2f2f 100%)',
  '#ffffff',
  '#0f0f0f',
  '#1f1f1f',
  FALSE,
  NOW(),
  NOW()
);

-- Step 6: Create theme management functions
CREATE OR REPLACE FUNCTION switch_theme(theme_name_param TEXT)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Deactivate all themes
  UPDATE themes SET is_active = FALSE;
  
  -- Activate the selected theme
  UPDATE themes 
  SET is_active = TRUE 
  WHERE theme_name = theme_name_param;
  
  -- Return true if a theme was activated
  RETURN EXISTS (SELECT 1 FROM themes WHERE theme_name = theme_name_param AND is_active = TRUE);
END;
$$;

-- Function to get active theme
CREATE OR REPLACE FUNCTION get_active_theme()
RETURNS TABLE (
  id UUID,
  theme_name TEXT,
  description TEXT,
  background_color TEXT,
  header_indica_color TEXT,
  header_sativa_color TEXT,
  header_hybrid_color TEXT,
  text_color TEXT,
  table_header_bg TEXT,
  table_row_hover TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.theme_name,
    t.description,
    t.background_color,
    t.header_indica_color,
    t.header_sativa_color,
    t.header_hybrid_color,
    t.text_color,
    t.table_header_bg,
    t.table_row_hover,
    t.created_at,
    t.updated_at
  FROM themes t
  WHERE t.is_active = TRUE
  LIMIT 1;
END;
$$;

-- Step 7: Create view for theme management
CREATE OR REPLACE VIEW available_themes AS
SELECT 
  theme_name,
  description,
  is_active,
  updated_at
FROM themes
ORDER BY 
  is_active DESC,
  theme_name ASC;

-- Step 8: Set up RLS and permissions
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow all operations on themes" ON themes;
DROP POLICY IF EXISTS "Enable read access for all users" ON themes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON themes;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON themes;

-- Create comprehensive policies
CREATE POLICY "Enable read access for all users" ON themes
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON themes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON themes
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT SELECT ON themes TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON themes TO authenticated;
GRANT SELECT ON available_themes TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_active_theme() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION switch_theme(TEXT) TO authenticated;

-- Step 9: Verify setup
DO $$
DECLARE
  theme_count INTEGER;
  active_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO theme_count FROM themes;
  SELECT COUNT(*) INTO active_count FROM themes WHERE is_active = TRUE;
  
  RAISE NOTICE 'Setup complete! Created % themes, % active', theme_count, active_count;
END $$;

-- Display final results
SELECT 
  theme_name,
  description,
  is_active,
  CASE 
    WHEN is_active THEN '✓ ACTIVE'
    ELSE 'Available'
  END as status,
  created_at
FROM themes
ORDER BY is_active DESC, theme_name ASC; 