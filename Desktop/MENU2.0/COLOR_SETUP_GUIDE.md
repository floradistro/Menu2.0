# Color Customization Setup Guide

## Overview
The menu color customization system allows you to fully customize every aspect of your menu's appearance, including backgrounds, text colors, section headers, and special effects.

## Database Setup

### Option 1: Manual SQL Setup (Recommended)
1. Open your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `complete-menu-colors-setup.sql`
4. Execute the script

This will:
- Create the `menu_colors` table
- Set up proper permissions
- Insert 4 default color presets (Apple Dark, Midnight Purple, Forest Green, Pure Black)
- Create helper functions for color management

### Option 2: Automatic Setup
1. Navigate to `/admin` in your application
2. Go to the Color Customizer section
3. Click "Try Automatic Setup"

**Note**: If you encounter permission errors, use Option 1 instead.

## Using the Color Customizer

### Access
1. Navigate to `/admin`
2. Click on "Color Customizer" section

### Features

#### 1. Quick Presets
- **Apple Dark**: Elegant black gradient with subtle variations
- **Midnight Purple**: Rich purple gradient theme
- **Forest Green**: Nature-inspired green gradient
- **Pure Black**: Minimalist solid black theme

#### 2. Customization Sections

**General Colors**:
- Main Background (solid or gradient)
- Primary/Secondary Text
- Table styling (headers, rows, borders)

**Section Headers**:
- Indica, Sativa, Hybrid, and Other sections
- Each with gradient start/end colors
- Individual text colors
- Toggle gradient effects

**Special Elements**:
- THCA/Delta-9 percentage colors
- Product count badges
- Hover effects

#### 3. Background Options
- **Solid**: Single color background
- **Gradient**: Customizable CSS gradient
- Auto-generate gradients from base color

### Saving & Managing Colors

1. **Save Custom Scheme**:
   - Modify colors as desired
   - Enter a preset name
   - Click "Save Colors"

2. **Load Saved Presets**:
   - Click on any saved preset to activate it
   - Active preset shows green ring

3. **Live Preview**:
   - Changes are reflected immediately in the menu
   - No page refresh required

## Troubleshooting

### Permission Denied Error
Run this SQL to grant proper permissions:
```sql
GRANT ALL ON menu_colors TO anon, authenticated;
GRANT ALL ON menu_colors_id_seq TO anon, authenticated;
```

### Colors Not Updating
1. Clear browser cache
2. Check browser console for errors
3. Ensure only one color scheme is active

### Background Gradient Not Working
1. Ensure "Gradient" option is selected
2. Valid gradient CSS syntax: `linear-gradient(135deg, #000000 0%, #1a1a1a 100%)`
3. Click "Generate Gradient" for automatic creation

## Advanced Customization

### Custom Gradient Examples
```css
/* Radial gradient */
radial-gradient(circle at center, #000000 0%, #1a1a1a 100%)

/* Multi-color gradient */
linear-gradient(135deg, #000000 0%, #1a0f2e 33%, #2a1559 66%, #000000 100%)

/* Subtle variation */
linear-gradient(to bottom, #000000 0%, #0a0a0a 50%, #000000 100%)
```

### CSS Variables
The system sets these CSS variables you can use:
- `--theme-background`
- `--theme-text`
- `--theme-text-secondary`
- `--theme-table-header`
- `--theme-table-hover`
- `--theme-indica`
- `--theme-sativa`
- `--theme-hybrid`

## Best Practices

1. **Contrast**: Ensure sufficient contrast between text and backgrounds
2. **Consistency**: Use similar color tones throughout
3. **Testing**: Preview on different screen sizes
4. **Backup**: Save multiple presets for easy switching

## Support
For issues or questions, check:
- Browser console for errors
- Network tab for API responses
- Supabase logs for database errors 