-- FINAL MENU COLOR CUSTOMIZATION MIGRATION
-- This file drops the old themes system and implements full color customization

-- 1. Drop old theme-related objects
DROP FUNCTION IF EXISTS switch_theme(TEXT) CASCADE;
DROP TABLE IF EXISTS themes CASCADE;

-- 2. Run the main color customization setup
-- (Execute menu-color-customization-schema.sql first)

-- 3. Add additional preset color schemes
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
    section_indica_gradient_start,
    section_indica_gradient_end,
    section_indica_text,
    section_sativa_gradient_start,
    section_sativa_gradient_end,
    section_sativa_text,
    section_hybrid_gradient_start,
    section_hybrid_gradient_end,
    section_hybrid_text,
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
(
    'Ocean Blue',
    '#001a33',
    'gradient',
    'linear-gradient(135deg, #001a33 0%, #003366 50%, #001a33 100%)',
    '#e6f2ff',
    '#99ccff',
    '#003366',
    '#001a33',
    '#000d1a',
    '#004080',
    '#0066cc',
    '#003366',
    '#0066cc',
    '#ffffff',
    '#004080',
    '#0080ff',
    '#ffffff',
    '#003d7a',
    '#006bb3',
    '#ffffff',
    '#002e5c',
    '#005299',
    '#ffffff',
    '#00ff88',
    '#00ccff',
    '#001a33',
    '#ffffff',
    true,
    true,
    true,
    false
),
(
    'Sunset Orange',
    '#331a00',
    'gradient',
    'linear-gradient(135deg, #331a00 0%, #663300 50%, #331a00 100%)',
    '#ffe6cc',
    '#ffb380',
    '#663300',
    '#331a00',
    '#1a0d00',
    '#804000',
    '#cc6600',
    '#663300',
    '#cc6600',
    '#ffffff',
    '#804000',
    '#ff8000',
    '#ffffff',
    '#7a3d00',
    '#b36b00',
    '#ffffff',
    '#5c2e00',
    '#995200',
    '#ffffff',
    '#ffcc00',
    '#ff6600',
    '#331a00',
    '#ffffff',
    true,
    true,
    true,
    false
),
(
    'Royal Purple',
    '#1a001a',
    'gradient',
    'linear-gradient(135deg, #1a001a 0%, #330033 50%, #1a001a 100%)',
    '#e6cce6',
    '#cc99cc',
    '#330033',
    '#1a001a',
    '#0d000d',
    '#400040',
    '#660066',
    '#330033',
    '#660066',
    '#ffffff',
    '#400040',
    '#800080',
    '#ffffff',
    '#3d003d',
    '#6b006b',
    '#ffffff',
    '#2e002e',
    '#520052',
    '#ffffff',
    '#cc00ff',
    '#9900ff',
    '#1a001a',
    '#ffffff',
    true,
    true,
    true,
    false
),
(
    'Monochrome Light',
    '#f5f5f5',
    'solid',
    NULL,
    '#1a1a1a',
    '#666666',
    '#e0e0e0',
    '#f5f5f5',
    '#ffffff',
    '#d9d9d9',
    '#cccccc',
    '#e0e0e0',
    '#cccccc',
    '#000000',
    '#d9d9d9',
    '#bfbfbf',
    '#000000',
    '#e6e6e6',
    '#d9d9d9',
    '#000000',
    '#f0f0f0',
    '#e0e0e0',
    '#000000',
    '#008040',
    '#0066cc',
    '#ffffff',
    '#000000',
    false,
    false,
    true,
    false
),
(
    'Neon Cyber',
    '#0a0a0a',
    'gradient',
    'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 25%, #0a1a1a 50%, #1a0a1a 75%, #0a0a0a 100%)',
    '#00ffff',
    '#ff00ff',
    '#1a1a1a',
    '#0a0a0a',
    '#050505',
    '#2a2a2a',
    '#3a3a3a',
    '#ff0080',
    '#ff00ff',
    '#00ffff',
    '#00ff80',
    '#00ffff',
    '#00ffff',
    '#ff00ff',
    '#ffff00',
    '#00ffff',
    '#8000ff',
    '#ff00ff',
    '#00ffff',
    '#00ff00',
    '#ff00ff',
    '#000000',
    '#00ffff',
    true,
    true,
    true,
    false
);

-- 4. Update localStorage key references
-- Note: The application code has been updated to use 'activeMenuColors' instead of 'activeMenuTheme'

-- 5. Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_menu_colors_active ON menu_colors(is_active) WHERE is_active = TRUE;

-- 6. Add comments for documentation
COMMENT ON TABLE menu_colors IS 'Stores comprehensive color customization settings for menu displays';
COMMENT ON COLUMN menu_colors.preset_name IS 'User-friendly name for the color scheme';
COMMENT ON COLUMN menu_colors.main_background_type IS 'Whether to use solid color or gradient for background';
COMMENT ON COLUMN menu_colors.use_gradient_headers IS 'Whether section headers should use gradient backgrounds';
COMMENT ON COLUMN menu_colors.header_blur_effect IS 'Whether to apply backdrop blur to headers';
COMMENT ON COLUMN menu_colors.row_hover_lift IS 'Whether rows should lift on hover';

-- Migration complete!
-- The application now supports full color customization with:
-- - Individual color controls for every UI element
-- - Support for gradients and solid colors
-- - Section-specific color settings
-- - Visual effects toggles
-- - Multiple preset color schemes 