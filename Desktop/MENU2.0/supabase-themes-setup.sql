-- Create themes table for menu customization
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

-- Insert default theme
INSERT INTO themes (
  background_color,
  header_indica_color,
  header_sativa_color,
  header_hybrid_color,
  text_color,
  table_header_bg,
  table_row_hover,
  created_at,
  updated_at
) VALUES (
  '#1f2937',  -- Dark background
  '#9333ea',  -- Purple for Indica
  '#f97316',  -- Orange for Sativa  
  '#3b82f6',  -- Blue for Hybrid
  '#f3f4f6',  -- Light text
  '#111827',  -- Dark table header
  '#374151',  -- Gray hover
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed for your security requirements)
CREATE POLICY "Allow all operations on themes" ON themes
  FOR ALL USING (true)
  WITH CHECK (true);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_themes_updated_at 
    BEFORE UPDATE ON themes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 