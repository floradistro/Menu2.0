-- COMPLETE MENU COLOR CUSTOMIZATION SETUP
-- This script sets up everything needed for the color customization system

-- 1. Drop any existing objects to ensure clean setup
DROP TABLE IF EXISTS menu_colors CASCADE;
DROP FUNCTION IF EXISTS ensure_single_active_colors() CASCADE;
DROP FUNCTION IF EXISTS get_active_menu_colors() CASCADE;
DROP FUNCTION IF EXISTS update_menu_colors(JSONB) CASCADE;
DROP VIEW IF EXISTS active_menu_colors CASCADE;

-- 2. Create the menu_colors table with all necessary fields
CREATE TABLE menu_colors (
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
    thca_percent_color TEXT DEFAULT '#4ade80',
    delta9_percent_color TEXT DEFAULT '#60a5fa',
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

-- 3. Enable RLS but with open policies for now
ALTER TABLE menu_colors ENABLE ROW LEVEL SECURITY;

-- 4. Create open policies that allow all operations
CREATE POLICY "Allow all operations on menu_colors" ON menu_colors
    FOR ALL USING (true) WITH CHECK (true);

-- 5. Create indexes for performance
CREATE INDEX idx_menu_colors_active ON menu_colors(is_active) WHERE is_active = true;

-- 6. Create function to ensure only one active color scheme
CREATE OR REPLACE FUNCTION ensure_single_active_colors()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_active = TRUE THEN
        UPDATE menu_colors SET is_active = FALSE WHERE id != NEW.id;
    END IF;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for single active scheme
CREATE TRIGGER ensure_single_active_colors_trigger
BEFORE INSERT OR UPDATE ON menu_colors
FOR EACH ROW
EXECUTE FUNCTION ensure_single_active_colors();

-- 8. Insert default color presets
INSERT INTO menu_colors (
    preset_name,
    main_background_color,
    main_background_type,
    main_background_gradient,
    primary_text_color,
    secondary_text_color,
    table_header_bg,
    table_row_even_bg,
    table_row_odd_bg,
    table_row_hover_bg,
    table_border_color,
    section_indica_bg,
    section_indica_gradient_start,
    section_indica_gradient_end,
    section_indica_text,
    section_sativa_bg,
    section_sativa_gradient_start,
    section_sativa_gradient_end,
    section_sativa_text,
    section_hybrid_bg,
    section_hybrid_gradient_start,
    section_hybrid_gradient_end,
    section_hybrid_text,
    section_other_bg,
    section_other_gradient_start,
    section_other_gradient_end,
    section_other_text,
    thca_percent_color,
    delta9_percent_color,
    product_count_bg,
    product_count_text,
    use_gradient_headers,
    header_blur_effect,
    row_hover_lift,
    is_active
) VALUES 
-- Apple Dark (Default Active)
(
    'Apple Dark',
    '#000000',
    'gradient',
    'linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #1a1a1a 50%, #0a0a0a 75%, #000000 100%)',
    '#f2f2f7',
    '#8e8e93',
    '#1c1c1e',
    '#0a0a0a',
    '#000000',
    '#2c2c2e',
    '#38383a',
    '#1c1c1e',
    '#1c1c1e',
    '#3a3a3c',
    '#ffffff',
    '#2c2c2e',
    '#2c2c2e',
    '#48484a',
    '#ffffff',
    '#1a1a1c',
    '#1a1a1c',
    '#3a3a3c',
    '#ffffff',
    '#1f1f1f',
    '#1f1f1f',
    '#3a3a3a',
    '#ffffff',
    '#4ade80',
    '#60a5fa',
    '#000000',
    '#ffffff',
    true,
    true,
    true,
    true
),
-- Midnight Purple
(
    'Midnight Purple',
    '#0a0014',
    'gradient',
    'linear-gradient(135deg, #0a0014 0%, #1a0f2e 25%, #2a1559 50%, #1a0f2e 75%, #0a0014 100%)',
    '#e0d5ff',
    '#9d88cc',
    '#1a0f2e',
    '#0f0820',
    '#0a0014',
    '#2a1559',
    '#3d2870',
    '#1a0f2e',
    '#2d1b69',
    '#4a2d8f',
    '#ffffff',
    '#2a1559',
    '#3d2579',
    '#5a3d9f',
    '#ffffff',
    '#221147',
    '#2a1859',
    '#4a2d8f',
    '#ffffff',
    '#1f0f3a',
    '#1f0f3a',
    '#3a1f6a',
    '#ffffff',
    '#7c3aed',
    '#a78bfa',
    '#0a0014',
    '#e0d5ff',
    true,
    true,
    true,
    false
),
-- Forest Green
(
    'Forest Green',
    '#0a1a0a',
    'gradient',
    'linear-gradient(135deg, #0a1a0a 0%, #1a2e1a 25%, #2a4a2a 50%, #1a2e1a 75%, #0a1a0a 100%)',
    '#d5ffd5',
    '#88cc88',
    '#1a2e1a',
    '#0f200f',
    '#0a1a0a',
    '#2a4a2a',
    '#3a5a3a',
    '#1a2e1a',
    '#1b4d1b',
    '#2d7a2d',
    '#ffffff',
    '#2a4a2a',
    '#2b5d2b',
    '#3d8a3d',
    '#ffffff',
    '#1f3f1f',
    '#1a3d1a',
    '#2d7a2d',
    '#ffffff',
    '#1a3a1a',
    '#1a3a1a',
    '#2a5a2a',
    '#ffffff',
    '#4ade80',
    '#86efac',
    '#0a1a0a',
    '#d5ffd5',
    true,
    true,
    true,
    false
),
-- Pure Black
(
    'Pure Black',
    '#000000',
    'solid',
    NULL,
    '#ffffff',
    '#999999',
    '#1a1a1a',
    '#0a0a0a',
    '#000000',
    '#2a2a2a',
    '#333333',
    '#1a1a1a',
    '#1a1a1a',
    '#333333',
    '#ffffff',
    '#2a2a2a',
    '#2a2a2a',
    '#444444',
    '#ffffff',
    '#1f1f1f',
    '#1f1f1f',
    '#3a3a3a',
    '#ffffff',
    '#252525',
    '#252525',
    '#404040',
    '#ffffff',
    '#10b981',
    '#3b82f6',
    '#000000',
    '#ffffff',
    false,
    false,
    true,
    false
);

-- 9. Create function to get active colors with fallback
CREATE OR REPLACE FUNCTION get_active_menu_colors()
RETURNS menu_colors AS $$
DECLARE
    result menu_colors;
BEGIN
    SELECT * INTO result FROM menu_colors WHERE is_active = TRUE LIMIT 1;
    
    -- If no active colors exist, activate the first one (Apple Dark)
    IF result IS NULL THEN
        UPDATE menu_colors SET is_active = TRUE 
        WHERE preset_name = 'Apple Dark' 
        RETURNING * INTO result;
        
        -- If still null, activate any available preset
        IF result IS NULL THEN
            UPDATE menu_colors SET is_active = TRUE 
            WHERE id = (SELECT id FROM menu_colors LIMIT 1)
            RETURNING * INTO result;
        END IF;
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 10. Create helper function to save custom colors
CREATE OR REPLACE FUNCTION save_custom_colors(
    p_preset_name TEXT DEFAULT 'Custom',
    p_colors JSONB DEFAULT '{}'::JSONB
)
RETURNS menu_colors AS $$
DECLARE
    v_result menu_colors;
BEGIN
    -- Deactivate all current schemes
    UPDATE menu_colors SET is_active = FALSE;
    
    -- Insert new custom scheme
    INSERT INTO menu_colors (
        preset_name,
        main_background_color,
        main_background_type,
        main_background_gradient,
        primary_text_color,
        secondary_text_color,
        table_header_bg,
        table_row_even_bg,
        table_row_odd_bg,
        table_row_hover_bg,
        table_border_color,
        section_indica_bg,
        section_indica_gradient_start,
        section_indica_gradient_end,
        section_indica_text,
        section_sativa_bg,
        section_sativa_gradient_start,
        section_sativa_gradient_end,
        section_sativa_text,
        section_hybrid_bg,
        section_hybrid_gradient_start,
        section_hybrid_gradient_end,
        section_hybrid_text,
        section_other_bg,
        section_other_gradient_start,
        section_other_gradient_end,
        section_other_text,
        thca_percent_color,
        delta9_percent_color,
        product_count_bg,
        product_count_text,
        use_gradient_headers,
        header_blur_effect,
        row_hover_lift,
        is_active
    ) VALUES (
        p_preset_name,
        COALESCE(p_colors->>'main_background_color', '#000000'),
        COALESCE(p_colors->>'main_background_type', 'solid'),
        p_colors->>'main_background_gradient',
        COALESCE(p_colors->>'primary_text_color', '#f2f2f7'),
        COALESCE(p_colors->>'secondary_text_color', '#8e8e93'),
        COALESCE(p_colors->>'table_header_bg', '#1c1c1e'),
        COALESCE(p_colors->>'table_row_even_bg', '#0a0a0a'),
        COALESCE(p_colors->>'table_row_odd_bg', '#000000'),
        COALESCE(p_colors->>'table_row_hover_bg', '#2c2c2e'),
        COALESCE(p_colors->>'table_border_color', '#38383a'),
        COALESCE(p_colors->>'section_indica_bg', '#1c1c1e'),
        COALESCE(p_colors->>'section_indica_gradient_start', '#1c1c1e'),
        COALESCE(p_colors->>'section_indica_gradient_end', '#3a3a3c'),
        COALESCE(p_colors->>'section_indica_text', '#ffffff'),
        COALESCE(p_colors->>'section_sativa_bg', '#2c2c2e'),
        COALESCE(p_colors->>'section_sativa_gradient_start', '#2c2c2e'),
        COALESCE(p_colors->>'section_sativa_gradient_end', '#48484a'),
        COALESCE(p_colors->>'section_sativa_text', '#ffffff'),
        COALESCE(p_colors->>'section_hybrid_bg', '#1a1a1c'),
        COALESCE(p_colors->>'section_hybrid_gradient_start', '#1a1a1c'),
        COALESCE(p_colors->>'section_hybrid_gradient_end', '#3a3a3c'),
        COALESCE(p_colors->>'section_hybrid_text', '#ffffff'),
        COALESCE(p_colors->>'section_other_bg', '#1f1f1f'),
        COALESCE(p_colors->>'section_other_gradient_start', '#1f1f1f'),
        COALESCE(p_colors->>'section_other_gradient_end', '#3a3a3a'),
        COALESCE(p_colors->>'section_other_text', '#ffffff'),
        COALESCE(p_colors->>'thca_percent_color', '#4ade80'),
        COALESCE(p_colors->>'delta9_percent_color', '#60a5fa'),
        COALESCE(p_colors->>'product_count_bg', '#000000'),
        COALESCE(p_colors->>'product_count_text', '#ffffff'),
        COALESCE((p_colors->>'use_gradient_headers')::BOOLEAN, true),
        COALESCE((p_colors->>'header_blur_effect')::BOOLEAN, true),
        COALESCE((p_colors->>'row_hover_lift')::BOOLEAN, true),
        true
    ) RETURNING * INTO v_result;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- 11. Grant all necessary permissions
GRANT ALL ON menu_colors TO anon, authenticated;
GRANT ALL ON menu_colors_id_seq TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_active_menu_colors() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION save_custom_colors(TEXT, JSONB) TO anon, authenticated;

-- 12. Create a simple view for easy access
CREATE OR REPLACE VIEW active_menu_colors AS
SELECT * FROM menu_colors WHERE is_active = true LIMIT 1;

GRANT SELECT ON active_menu_colors TO anon, authenticated;

-- 13. Verify setup
DO $$
BEGIN
    RAISE NOTICE 'Menu color customization setup completed successfully!';
    RAISE NOTICE 'Active theme: %', (SELECT preset_name FROM menu_colors WHERE is_active = true);
END $$; 