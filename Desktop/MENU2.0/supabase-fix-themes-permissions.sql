-- Fix themes table permissions for anonymous access

-- First, check if the table exists
DO $$ 
BEGIN
   IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'themes') THEN
      -- Disable RLS temporarily
      ALTER TABLE themes DISABLE ROW LEVEL SECURITY;
      
      -- Drop all existing policies
      DROP POLICY IF EXISTS "Allow all operations on themes" ON themes;
      DROP POLICY IF EXISTS "Allow read access to themes" ON themes;
      DROP POLICY IF EXISTS "Allow insert access to themes" ON themes;
      DROP POLICY IF EXISTS "Allow update access to themes" ON themes;
      DROP POLICY IF EXISTS "Allow delete access to themes" ON themes;
   END IF;
END $$;

-- Ensure the table exists with correct structure
CREATE TABLE IF NOT EXISTS themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  background_color TEXT NOT NULL DEFAULT '#1f2937',
  header_indica_color TEXT NOT NULL DEFAULT '#9333ea',
  header_sativa_color TEXT NOT NULL DEFAULT '#f97316',
  header_hybrid_color TEXT NOT NULL DEFAULT '#3b82f6',
  text_color TEXT NOT NULL DEFAULT '#f3f4f6',
  table_header_bg TEXT NOT NULL DEFAULT '#111827',
  table_row_hover TEXT NOT NULL DEFAULT '#374151',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grant permissions to authenticated and anonymous users
GRANT ALL ON themes TO authenticated;
GRANT ALL ON themes TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- Insert default theme if none exists
INSERT INTO themes (
  background_color,
  header_indica_color,
  header_sativa_color,
  header_hybrid_color,
  text_color,
  table_header_bg,
  table_row_hover
) 
SELECT 
  '#1f2937',
  '#9333ea',
  '#f97316',
  '#3b82f6',
  '#f3f4f6',
  '#111827',
  '#374151'
WHERE NOT EXISTS (SELECT 1 FROM themes LIMIT 1);

-- Option 1: Keep RLS disabled (simplest)
-- The table will remain accessible to all users

-- Option 2: Enable RLS with very permissive policies (uncomment if needed)
-- ALTER TABLE themes ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable all operations for all users" ON themes
--   FOR ALL 
--   TO PUBLIC 
--   USING (true) 
--   WITH CHECK (true); 