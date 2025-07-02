-- MIGRATION: Add border controls to menu_colors table
-- Run this script in your Supabase SQL Editor to add border control options

-- Add new columns for border controls
ALTER TABLE menu_colors 
ADD COLUMN IF NOT EXISTS show_row_borders BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS row_border_style TEXT DEFAULT 'solid' CHECK (row_border_style IN ('solid', 'dashed', 'dotted')),
ADD COLUMN IF NOT EXISTS row_border_width INTEGER DEFAULT 1 CHECK (row_border_width >= 1 AND row_border_width <= 5);

-- Update existing records to have the new default values
UPDATE menu_colors 
SET 
  show_row_borders = true,
  row_border_style = 'solid',
  row_border_width = 1
WHERE show_row_borders IS NULL;

-- Update the update_menu_colors function to handle the new fields
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
    show_row_borders = COALESCE((color_data->>'show_row_borders')::BOOLEAN, show_row_borders),
    row_border_style = COALESCE(color_data->>'row_border_style', row_border_style),
    row_border_width = COALESCE((color_data->>'row_border_width')::INTEGER, row_border_width),
    updated_at = NOW()
  WHERE id = active_id
  RETURNING * INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql; 