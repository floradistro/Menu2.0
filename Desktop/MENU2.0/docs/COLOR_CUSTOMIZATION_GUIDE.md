# Color Customization Guide

## Overview

The menu system now supports comprehensive color customization, allowing you to create, save, and manage multiple color schemes that instantly apply to all menu displays.

## Features

### 1. **Create New Color Schemes**
- Click the "+ New Scheme" button in the Saved Color Schemes section
- Enter a name for your color scheme
- Customize all colors and settings
- Save to create a new preset

### 2. **Delete Color Schemes**
- Click the trash icon (🗑️) next to any inactive color scheme
- Note: You cannot delete the currently active scheme

### 3. **Activate Color Schemes**
- Click on any saved color scheme to activate it
- The active scheme is highlighted with a green border
- Changes are applied immediately to all menu displays

### 4. **Customize Colors**
The system provides three main sections:

#### General Colors
- Main background (solid or gradient)
- Text colors (primary and secondary)
- Table styling (headers, rows, borders)

#### Section Headers
- Individual color settings for each strain type:
  - Indica (purple theme)
  - Sativa (green theme)
  - Hybrid (yellow theme)
  - Other (gray theme)
- Each section supports gradient colors

#### Special Elements
- THCA percentage color
- Delta-9 percentage color
- Product count badges
- Hover effects
- Row borders (show/hide, style, width)

## Troubleshooting

### Changes Not Reflecting?

1. **Clear Browser Cache**
   - The system uses localStorage for performance
   - Click the "🔄 Refresh Menus" button in the admin panel
   - Or manually refresh any menu page

2. **Check Active Scheme**
   - Ensure the desired scheme shows "Active" badge
   - Only one scheme can be active at a time

3. **Database Connection**
   - Visit `/api/debug-colors` to check database status
   - Verify Supabase connection is working

### Manual Cache Clear

If automatic refresh isn't working, open browser console and run:
```javascript
localStorage.removeItem('activeMenuColors');
location.reload();
```

## Row Border Controls

The system now includes advanced border controls for product rows:

### Border Options
- **Show/Hide Borders**: Toggle borders between product rows on/off
- **Border Style**: Choose from solid, dashed, or dotted lines
- **Border Width**: Set thickness from 1-5 pixels
- **Border Color**: Uses the table border color setting

### Usage Tips
- **Clean Look**: Disable borders for a seamless, modern appearance
- **Clear Separation**: Enable borders with solid style for maximum clarity
- **Subtle Division**: Use dashed or dotted borders for gentle separation
- **Custom Thickness**: Adjust width based on your screen size and preference

## Best Practices

1. **Test Before Production**
   - Use the Menu Preview tab to test color changes
   - Check different categories (Flower, Vape, etc.)
   - Test border settings with different product counts

2. **Name Schemes Clearly**
   - Use descriptive names like "Dark Theme", "Holiday Colors"
   - Include version numbers if iterating

3. **Save Frequently**
   - Save your work as you customize
   - Create multiple versions before major changes

4. **Border Considerations**
   - Test border visibility with your background colors
   - Consider readability on different screen sizes
   - Match border style to your overall design aesthetic

## Technical Details

- Colors are stored in Supabase `menu_colors` table
- Active scheme is cached in localStorage for performance
- Changes trigger events: `themeUpdated` and `forceThemeRefresh`
- Menu components listen for these events to auto-refresh

## API Endpoints

- `GET /api/debug-colors` - Check color scheme status
- `POST /api/setup-colors` - Initial database setup (if needed) 