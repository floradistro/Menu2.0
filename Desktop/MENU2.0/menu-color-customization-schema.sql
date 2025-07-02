-- MENU COLOR CUSTOMIZATION SCHEMA
-- Replaces Apple themes with full color customization

-- 1. Drop the old theme-related functions and constraints
DROP FUNCTION IF EXISTS switch_theme(TEXT);
DROP POLICY IF EXISTS "Anyone can view themes" ON themes;
DROP POLICY IF EXISTS "Authenticated users can update themes" ON themes;

-- 2. Create new menu_colors table for comprehensive customization
CREATE TABLE IF NOT EXISTS menu_colors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    -- General settings
    preset_name TEXT DEFAULT 'Custom',
    
    -- Background colors
    main_background_color TEXT DEFAULT '#000000',
    main_background_type TEXT DEFAULT 'solid' CHECK (main_background_type IN ('solid', 'gradient')),
    main_background_gradient TEXT DEFAULT NULL,
    
    -- Text colors
    primary_text_color TEXT DEFAULT '#f2f2f7',
    secondary_text_color TEXT DEFAULT '#8e8e93',
    
    -- Table styling
    table_header_bg TEXT DEFAULT '#1c1c1e',
    table_row_even_bg TEXT DEFAULT '#0a0a0a',
    table_row_odd_bg TEXT DEFAULT '#000000',
    table_row_hover_bg TEXT DEFAULT '#2c2c2e',
    table_border_color TEXT DEFAULT '#38383a',
    
    -- Section header colors by strain type
    section_indica_bg TEXT DEFAULT '#1c1c1e',
    section_indica_gradient_start TEXT DEFAULT '#1c1c1e',
    section_indica_gradient_end TEXT DEFAULT '#3a3a3c',
    section_indica_text TEXT DEFAULT '#ffffff',
    
    section_sativa_bg TEXT DEFAULT '#2c2c2e',
    section_sativa_gradient_start TEXT DEFAULT '#2c2c2e',
    section_sativa_gradient_end TEXT DEFAULT '#48484a',
    section_sativa_text TEXT DEFAULT '#ffffff',
    
    section_hybrid_bg TEXT DEFAULT '#1a1a1c',
    section_hybrid_gradient_start TEXT DEFAULT '#1a1a1c',
    section_hybrid_gradient_end TEXT DEFAULT '#3a3a3c',
    section_hybrid_text TEXT DEFAULT '#ffffff',
    
    section_other_bg TEXT DEFAULT '#1f1f1f',
    section_other_gradient_start TEXT DEFAULT '#1f1f1f',
    section_other_gradient_end TEXT DEFAULT '#3a3a3a',
    section_other_text TEXT DEFAULT '#ffffff',
    
    -- Special text colors
    thca_percent_color TEXT DEFAULT '#4ade80', -- green-400
    delta9_percent_color TEXT DEFAULT '#60a5fa', -- blue-400
    product_count_bg TEXT DEFAULT '#000000',
    product_count_text TEXT DEFAULT '#ffffff',
    
    -- Additional styling options
    use_gradient_headers BOOLEAN DEFAULT true,
    header_blur_effect BOOLEAN DEFAULT true,
    row_hover_lift BOOLEAN DEFAULT true,
    
    -- Metadata
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create a function to ensure only one active color scheme
CREATE OR REPLACE FUNCTION ensure_single_active_colors()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = TRUE THEN
    UPDATE menu_colors SET is_active = FALSE WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_active_colors_trigger
BEFORE INSERT OR UPDATE ON menu_colors
FOR EACH ROW
EXECUTE FUNCTION ensure_single_active_colors();

-- 4. Create function to get active colors with fallback
CREATE OR REPLACE FUNCTION get_active_menu_colors()
RETURNS menu_colors AS $$
DECLARE
  result menu_colors;
BEGIN
  SELECT * INTO result FROM menu_colors WHERE is_active = TRUE LIMIT 1;
  
  -- If no active colors exist, create and return default
  IF result IS NULL THEN
    INSERT INTO menu_colors (preset_name, is_active) 
    VALUES ('Default Dark', TRUE) 
    RETURNING * INTO result;
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 5. Insert some preset color schemes
INSERT INTO menu_colors (
    preset_name,
    main_background_color,
    main_background_type,
    main_background_gradient,
    primary_text_color,
    table_header_bg,
    section_indica_gradient_start,
    section_indica_gradient_end,
    section_sativa_gradient_start,
    section_sativa_gradient_end,
    section_hybrid_gradient_start,
    section_hybrid_gradient_end,
    is_active
) VALUES 
(
    'Apple Dark',
    '#000000',
    'gradient',
    'linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #1a1a1a 50%, #0a0a0a 75%, #000000 100%)',
    '#f2f2f7',
    '#1c1c1e',
    '#1c1c1e',
    '#3a3a3c',
    '#2c2c2e',
    '#48484a',
    '#1a1a1c',
    '#3a3a3c',
    true
),
(
    'Midnight Purple',
    '#0a0014',
    'gradient',
    'linear-gradient(135deg, #0a0014 0%, #1a0f2e 50%, #0a0014 100%)',
    '#e0d5ff',
    '#1a0f2e',
    '#2d1b69',
    '#4a2d8f',
    '#3d2579',
    '#5a3d9f',
    '#2a1859',
    '#4a2d8f',
    false
),
(
    'Forest Green',
    '#0a1a0a',
    'gradient',
    'linear-gradient(135deg, #0a1a0a 0%, #1a2e1a 50%, #0a1a0a 100%)',
    '#d5ffd5',
    '#1a2e1a',
    '#1b4d1b',
    '#2d7a2d',
    '#2b5d2b',
    '#3d8a3d',
    '#1a3d1a',
    '#2d7a2d',
    false
);

-- 6. Create RLS policies
ALTER TABLE menu_colors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view menu colors" ON menu_colors
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage menu colors" ON menu_colors
    FOR ALL USING (auth.role() = 'authenticated');

-- 7. Create function to update colors
CREATE OR REPLACE FUNCTION update_menu_colors(color_data JSONB)
RETURNS menu_colors AS $$
DECLARE
  active_id UUID;
  result menu_colors;
BEGIN
  -- Get the currently active color scheme
  SELECT id INTO active_id FROM menu_colors WHERE is_active = TRUE LIMIT 1;
  
  -- If no active scheme exists, create one
  IF active_id IS NULL THEN
    INSERT INTO menu_colors (is_active) VALUES (TRUE) RETURNING id INTO active_id;
  END IF;
  
  -- Update the active color scheme with the provided data
  UPDATE menu_colors 
  SET 
    preset_name = COALESCE(color_data->>'preset_name', preset_name),
    main_background_color = COALESCE(color_data->>'main_background_color', main_background_color),
    main_background_type = COALESCE(color_data->>'main_background_type', main_background_type),
    main_background_gradient = COALESCE(color_data->>'main_background_gradient', main_background_gradient),
    primary_text_color = COALESCE(color_data->>'primary_text_color', primary_text_color),
    secondary_text_color = COALESCE(color_data->>'secondary_text_color', secondary_text_color),
    table_header_bg = COALESCE(color_data->>'table_header_bg', table_header_bg),
    table_row_even_bg = COALESCE(color_data->>'table_row_even_bg', table_row_even_bg),
    table_row_odd_bg = COALESCE(color_data->>'table_row_odd_bg', table_row_odd_bg),
    table_row_hover_bg = COALESCE(color_data->>'table_row_hover_bg', table_row_hover_bg),
    table_border_color = COALESCE(color_data->>'table_border_color', table_border_color),
    section_indica_bg = COALESCE(color_data->>'section_indica_bg', section_indica_bg),
    section_indica_gradient_start = COALESCE(color_data->>'section_indica_gradient_start', section_indica_gradient_start),
    section_indica_gradient_end = COALESCE(color_data->>'section_indica_gradient_end', section_indica_gradient_end),
    section_indica_text = COALESCE(color_data->>'section_indica_text', section_indica_text),
    section_sativa_bg = COALESCE(color_data->>'section_sativa_bg', section_sativa_bg),
    section_sativa_gradient_start = COALESCE(color_data->>'section_sativa_gradient_start', section_sativa_gradient_start),
    section_sativa_gradient_end = COALESCE(color_data->>'section_sativa_gradient_end', section_sativa_gradient_end),
    section_sativa_text = COALESCE(color_data->>'section_sativa_text', section_sativa_text),
    section_hybrid_bg = COALESCE(color_data->>'section_hybrid_bg', section_hybrid_bg),
    section_hybrid_gradient_start = COALESCE(color_data->>'section_hybrid_gradient_start', section_hybrid_gradient_start),
    section_hybrid_gradient_end = COALESCE(color_data->>'section_hybrid_gradient_end', section_hybrid_gradient_end),
    section_hybrid_text = COALESCE(color_data->>'section_hybrid_text', section_hybrid_text),
    section_other_bg = COALESCE(color_data->>'section_other_bg', section_other_bg),
    section_other_gradient_start = COALESCE(color_data->>'section_other_gradient_start', section_other_gradient_start),
    section_other_gradient_end = COALESCE(color_data->>'section_other_gradient_end', section_other_gradient_end),
    section_other_text = COALESCE(color_data->>'section_other_text', section_other_text),
    thca_percent_color = COALESCE(color_data->>'thca_percent_color', thca_percent_color),
    delta9_percent_color = COALESCE(color_data->>'delta9_percent_color', delta9_percent_color),
    product_count_bg = COALESCE(color_data->>'product_count_bg', product_count_bg),
    product_count_text = COALESCE(color_data->>'product_count_text', product_count_text),
    use_gradient_headers = COALESCE((color_data->>'use_gradient_headers')::BOOLEAN, use_gradient_headers),
    header_blur_effect = COALESCE((color_data->>'header_blur_effect')::BOOLEAN, header_blur_effect),
    row_hover_lift = COALESCE((color_data->>'row_hover_lift')::BOOLEAN, row_hover_lift),
    updated_at = NOW()
  WHERE id = active_id
  RETURNING * INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 8. Grant permissions
GRANT ALL ON menu_colors TO authenticated;
GRANT EXECUTE ON FUNCTION get_active_menu_colors() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION update_menu_colors(JSONB) TO authenticated;

-- 9. Create view for easier access
CREATE OR REPLACE VIEW active_menu_colors AS
SELECT * FROM get_active_menu_colors();

GRANT SELECT ON active_menu_colors TO authenticated, anon;

-- 10. Drop the old themes table (commented out for safety - run manually after verification)
-- DROP TABLE IF EXISTS themes CASCADE; 