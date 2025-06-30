import { NextRequest, NextResponse } from 'next/server'
import { supabase, getSupabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase'

// Default layout configurations for each page type
const defaultLayouts = {
  flower: {
    sections: [
      {
        id: 'indica',
        title: 'INDICA',
        enabled: true,
        color: 'purple',
        columns: [
          { id: 'name', label: 'STRAIN', enabled: true, width: 'auto' },
          { id: 'terpenes', label: 'TERPENES', enabled: true, width: 'auto' },
          { id: 'thca', label: 'THCA', enabled: true, width: 'auto', align: 'right' }
        ]
      },
      {
        id: 'hybrid',
        title: 'HYBRID',
        enabled: true,
        color: 'emerald',
        columns: [
          { id: 'name', label: 'STRAIN', enabled: true, width: 'auto' },
          { id: 'terpenes', label: 'TERPENES', enabled: true, width: 'auto' },
          { id: 'thca', label: 'THCA', enabled: true, width: 'auto', align: 'right' }
        ]
      },
      {
        id: 'sativa',
        title: 'SATIVA',
        enabled: true,
        color: 'orange',
        columns: [
          { id: 'name', label: 'STRAIN', enabled: true, width: 'auto' },
          { id: 'terpenes', label: 'TERPENES', enabled: true, width: 'auto' },
          { id: 'thca', label: 'THCA', enabled: true, width: 'auto', align: 'right' }
        ]
      }
    ],
    availableFields: [
      { id: 'name', label: 'Strain Name', type: 'text' },
      { id: 'terpenes', label: 'Terpenes', type: 'array' },
      { id: 'thca', label: 'THCA %', type: 'text' },
      { id: 'effects', label: 'Effects', type: 'array' },
      { id: 'price', label: 'Price', type: 'text' },
      { id: 'description', label: 'Description', type: 'text' },
      { id: 'in_stock', label: 'Stock Status', type: 'boolean' }
    ]
  },
  vapes: {
    sections: [
      {
        id: 'indica',
        title: 'INDICA',
        enabled: true,
        color: 'purple',
        columns: [
          { id: 'name', label: 'STRAIN', enabled: true, width: 'auto' },
          { id: 'brand', label: 'BRAND', enabled: true, width: 'auto' },
          { id: 'thca', label: 'THCA', enabled: true, width: 'auto', align: 'right' }
        ]
      },
      {
        id: 'hybrid',
        title: 'HYBRID',
        enabled: true,
        color: 'emerald',
        columns: [
          { id: 'name', label: 'STRAIN', enabled: true, width: 'auto' },
          { id: 'brand', label: 'BRAND', enabled: true, width: 'auto' },
          { id: 'thca', label: 'THCA', enabled: true, width: 'auto', align: 'right' }
        ]
      },
      {
        id: 'sativa',
        title: 'SATIVA',
        enabled: true,
        color: 'orange',
        columns: [
          { id: 'name', label: 'STRAIN', enabled: true, width: 'auto' },
          { id: 'brand', label: 'BRAND', enabled: true, width: 'auto' },
          { id: 'thca', label: 'THCA', enabled: true, width: 'auto', align: 'right' }
        ]
      }
    ],
    availableFields: [
      { id: 'name', label: 'Strain Name', type: 'text' },
      { id: 'brand', label: 'Brand', type: 'text' },
      { id: 'thca', label: 'THCA %', type: 'text' },
      { id: 'terpenes', label: 'Terpenes', type: 'array' },
      { id: 'battery', label: 'Battery Life', type: 'text' },
      { id: 'capacity', label: 'Capacity', type: 'text' },
      { id: 'price', label: 'Price', type: 'text' },
      { id: 'in_stock', label: 'Stock Status', type: 'boolean' }
    ]
  },
  edibles: {
    sections: [
      {
        id: 'cookies',
        title: 'COOKIES',
        enabled: true,
        color: 'amber',
        columns: [
          { id: 'name', label: 'FLAVOR', enabled: true, width: 'auto' },
          { id: 'dosage', label: 'DOSAGE', enabled: true, width: 'auto', align: 'right' }
        ]
      },
      {
        id: 'gummies',
        title: 'GUMMIES',
        enabled: true,
        color: 'pink',
        columns: [
          { id: 'name', label: 'FLAVOR', enabled: true, width: 'auto' },
          { id: 'dosage', label: 'DOSAGE', enabled: true, width: 'auto', align: 'right' }
        ]
      },
      {
        id: 'beverages',
        title: 'BEVERAGES',
        enabled: true,
        color: 'cyan',
        columns: [
          { id: 'name', label: 'FLAVOR', enabled: true, width: 'auto' },
          { id: 'dosage', label: 'DOSAGE', enabled: true, width: 'auto', align: 'right' }
        ]
      }
    ],
    availableFields: [
      { id: 'name', label: 'Product Name', type: 'text' },
      { id: 'dosage', label: 'Dosage', type: 'text' },
      { id: 'ingredients', label: 'Ingredients', type: 'array' },
      { id: 'onset_time', label: 'Onset Time', type: 'text' },
      { id: 'duration', label: 'Duration', type: 'text' },
      { id: 'price', label: 'Price', type: 'text' },
      { id: 'description', label: 'Description', type: 'text' },
      { id: 'in_stock', label: 'Stock Status', type: 'boolean' }
    ]
  }
}

// Default settings with actual functional controls
const defaultSettings = {
  // Global Display Settings
  global_font_scale: 100, // 50-150%
  global_theme: 'dark', // dark, light, midnight
  global_accent_color: '#10b981', // emerald-500
  global_background_style: 'grid', // grid, gradient, solid, stars
  
  // Layout Settings
  layout_columns_flower: 3, // 1-4 columns
  layout_columns_vapes: 3,
  layout_columns_edibles: 2,
  layout_section_style: 'cards', // cards, list, compact
  layout_header_style: 'modern', // modern, classic, minimal
  layout_spacing: 'normal', // tight, normal, relaxed
  
  // Page Layouts
  page_layout_flower: defaultLayouts.flower,
  page_layout_vapes: defaultLayouts.vapes,
  page_layout_edibles: defaultLayouts.edibles,
  
  // Page-Specific Settings - Flower
  flower_show_thca: true,
  flower_show_terpenes: true,
  flower_show_effects: true,
  flower_effects_style: 'flipboard', // flipboard, static, scroll
  flower_group_by: 'type', // type, effects, alphabetical
  flower_show_type_headers: true,
  flower_type_colors: true,
  
  // Page-Specific Settings - Vapes
  vapes_show_brand: true,
  vapes_show_battery: true,
  vapes_show_capacity: true,
  vapes_show_strain: true,
  vapes_layout_style: 'grid', // grid, list, cards
  
  // Page-Specific Settings - Edibles
  edibles_show_dosage: true,
  edibles_show_ingredients: false,
  edibles_show_onset_time: false,
  edibles_dosage_unit: 'mg', // mg, g
  edibles_group_by: 'type', // type, dosage, brand
  
  // Animation & Effects
  effects_flipboard_enabled: true,
  effects_flipboard_speed: 4000, // ms between flips
  effects_page_transitions: true,
  effects_hover_animations: true,
  effects_background_animation: false,
  
  // Menu Behavior
  menu_auto_refresh: true,
  menu_refresh_interval: 30, // seconds
  menu_show_out_of_stock: false,
  menu_highlight_new: true,
  menu_new_product_days: 7,
  
  // Special Features
  feature_font_size_control: true,
  feature_navigation_menu: true,
  feature_search: false,
  feature_filters: false,
  
  // Custom Messages
  message_no_products: 'Check back soon for updates!',
  message_loading: 'Loading menu...',
  message_error: 'Unable to load menu'
}

// GET /api/menu-settings - Get all menu settings or specific page layout
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Database connection not configured' },
        { status: 503 }
      )
    }
    
    // Handle page-specific layout requests
    if (page && ['flower', 'vapes', 'edibles'].includes(page)) {
      const { data, error } = await supabase
        .from('menu_settings')
        .select('*')
        .eq('setting_key', `page_layout_${page}`)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching page layout:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      let layout = defaultLayouts[page as keyof typeof defaultLayouts]
      
      if (data?.setting_value) {
        try {
          // Handle JSONB data type - it might already be parsed
          layout = typeof data.setting_value === 'string' 
            ? JSON.parse(data.setting_value) 
            : data.setting_value
        } catch (e) {
          console.error('Error parsing layout JSON:', e)
          layout = defaultLayouts[page as keyof typeof defaultLayouts]
        }
      }

      return NextResponse.json({ layout, page })
    }

    // Default behavior - return all settings
    const { data, error } = await supabase
      .from('menu_settings')
      .select('*')

    if (error) {
      console.error('Error fetching menu settings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Convert to key-value object for easier frontend consumption
    const settings = data?.reduce((acc: any, setting) => {
      // Handle JSONB data type properly
      let value = setting.setting_value
      if (typeof value === 'string') {
        try {
          // Try to parse as JSON first
          value = JSON.parse(value)
        } catch {
          // If it fails, check if it's a number
          if (!isNaN(Number(value))) {
            value = Number(value)
          } else if (value === 'true') {
            value = true
          } else if (value === 'false') {
            value = false
          }
          // Otherwise keep as string
        }
      }
      acc[setting.setting_key] = value
      return acc
    }, {}) || {}

    // Merge with defaults to ensure all settings exist
    const mergedSettings = { ...defaultSettings, ...settings }

    return NextResponse.json({ settings: mergedSettings, raw: data })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/menu-settings - Reset all settings to defaults
export async function PUT(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Database connection not configured' },
        { status: 503 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()
    
    // First, delete ALL existing settings
    const { error: deleteError } = await supabaseAdmin
      .from('menu_settings')
      .delete()
      .gte('id', 0) // This will delete all records
    
    if (deleteError) {
      console.error('Error deleting existing settings:', deleteError)
    }
    
    // Insert default settings one by one to avoid conflicts
    const insertedSettings = []
    for (const [key, value] of Object.entries(defaultSettings)) {
      const { data, error } = await supabaseAdmin
        .from('menu_settings')
        .insert([{
          setting_key: key,
          setting_value: value // Let Supabase handle JSONB conversion
        }])
        .select()
        .single()
      
      if (error) {
        console.error(`Error inserting ${key}:`, error)
      } else if (data) {
        insertedSettings.push(data)
      }
    }

    return NextResponse.json({ 
      message: 'Settings reset successfully', 
      settings: insertedSettings,
      count: insertedSettings.length 
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/menu-settings - Update menu settings
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Database connection not configured' },
        { status: 503 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()
    const body = await request.json()
    const { setting_key, setting_value, page, layout } = body

    // Handle page layout updates
    if (page && layout && ['flower', 'vapes', 'edibles'].includes(page)) {
      const layoutKey = `page_layout_${page}`
      
      // Check if the setting exists
      const { data: existingData, error: checkError } = await supabaseAdmin
        .from('menu_settings')
        .select('id')
        .eq('setting_key', layoutKey)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing layout:', checkError)
      }

      let result
      let error

      if (existingData) {
        // Update existing layout - let Supabase handle JSONB conversion
        const { data, error: updateError } = await supabaseAdmin
          .from('menu_settings')
          .update({ 
            setting_value: layout // Pass object directly for JSONB
          })
          .eq('id', existingData.id)
          .select()
          .single()
        
        result = data
        error = updateError
      } else {
        // Insert new layout - let Supabase handle JSONB conversion
        const { data, error: insertError } = await supabaseAdmin
          .from('menu_settings')
          .insert([{ 
            setting_key: layoutKey, 
            setting_value: layout // Pass object directly for JSONB
          }])
          .select()
          .single()
        
        result = data
        error = insertError
      }

      if (error) {
        console.error('Error saving page layout:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Return the layout object directly
      const returnLayout = typeof result.setting_value === 'string' 
        ? JSON.parse(result.setting_value) 
        : result.setting_value

      return NextResponse.json({ layout: returnLayout, page })
    }

    // Handle regular setting updates
    if (!setting_key || setting_value === undefined) {
      return NextResponse.json(
        { error: 'setting_key and setting_value are required' },
        { status: 400 }
      )
    }

    // For JSONB, let Supabase handle the conversion
    let processedValue = setting_value
    
    // First, check if the setting exists
    const { data: existingData, error: checkError } = await supabaseAdmin
      .from('menu_settings')
      .select('id')
      .eq('setting_key', setting_key)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing setting:', checkError)
    }

    let result
    let error

    if (existingData) {
      // Update existing setting
      const { data, error: updateError } = await supabaseAdmin
        .from('menu_settings')
        .update({ 
          setting_value: processedValue // Let Supabase handle JSONB
        })
        .eq('id', existingData.id)
        .select()
        .single()
      
      result = data
      error = updateError
    } else {
      // Insert new setting
      const { data, error: insertError } = await supabaseAdmin
        .from('menu_settings')
        .insert([{ 
          setting_key, 
          setting_value: processedValue // Let Supabase handle JSONB
        }])
        .select()
        .single()
      
      result = data
      error = insertError
    }

    if (error) {
      console.error('Error saving menu setting:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ setting: result })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 