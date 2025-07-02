# Menu Color Customization System

## Overview
The Apple Themes system has been replaced with a comprehensive color customization system that allows full control over every visual aspect of the menu display.

## Migration Instructions

### 1. Database Migration
Execute the following SQL files in order in your Supabase dashboard:

1. **`menu-color-customization-schema.sql`** - Creates the new color system tables and functions
2. **`menu-color-migration-final.sql`** - Drops the old themes table and adds preset color schemes

### 2. Features

#### Color Customization Options
- **Main Background**: Solid color or gradient support
- **Text Colors**: Primary and secondary text colors
- **Table Styling**: Headers, rows, borders, hover effects
- **Section Headers**: Individual colors for Indica, Sativa, Hybrid, and Other sections
- **Special Elements**: THCA/Delta-9 percentages, product count badges
- **Visual Effects**: Gradient headers, blur effects, hover animations

#### Preset Color Schemes
- **Apple Dark** - Classic dark mode with deep blacks and subtle grays
- **Midnight Purple** - Deep purple theme with violet accents
- **Forest Green** - Natural green theme perfect for cannabis menus
- **Ocean Blue** - Cool blue tones with aqua highlights
- **Sunset Orange** - Warm orange and amber tones
- **Royal Purple** - Rich purple with magenta accents
- **Monochrome Light** - Clean light theme with minimal colors
- **Neon Cyber** - Vibrant cyberpunk-inspired colors

### 3. Admin Interface

The new Color Customization tab in the admin dashboard provides:

- **Quick Presets**: One-click application of preset color schemes
- **Section Tabs**: Organized controls for General, Section Headers, and Special Elements
- **Color Pickers**: Visual color wheels with hex input for precise control
- **Live Preview**: Changes apply instantly to menu displays
- **Visual Options**: Toggle gradients, blur effects, and hover animations

### 4. Key Improvements

1. **Full Customization**: Control every color individually
2. **Gradient Support**: Create beautiful gradient backgrounds and headers
3. **Section-Specific**: Different colors for different strain types
4. **User-Friendly**: Intuitive interface with color pickers and presets
5. **Performance**: Cached in localStorage for fast loading
6. **Backward Compatible**: Maintains support for existing menu functionality

### 5. Technical Details

#### Database Schema
- Table: `menu_colors`
- Function: `get_active_menu_colors()` - Returns active color scheme
- Function: `update_menu_colors(JSONB)` - Updates color settings
- View: `active_menu_colors` - Easy access to current colors

#### Frontend Updates
- New component: `ColorCustomizer.tsx` - Replaces ThemeSelector
- New library: `menu-colors.ts` - Handles color management
- Updated: `MenuGrid.tsx` - Uses new color system
- Updated: Admin dashboard - New Color Customization tab

### 6. Usage

1. Go to Admin Dashboard
2. Click on "Color Customization" tab
3. Choose a preset or customize individual colors
4. Use the section tabs to access different color groups
5. Click "Save Colors" to apply changes
6. View changes instantly in the Menu Preview tab

### 7. Tips

- Start with a preset and customize from there
- Use the gradient toggle for modern, dynamic backgrounds
- Enable blur effects for a premium glass-morphism look
- Test your color combinations in the Menu Preview
- Consider accessibility - ensure good contrast between text and backgrounds

## Support

For any issues or questions about the new color customization system, please refer to the admin interface tooltips or contact support. 