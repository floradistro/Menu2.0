import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, isSupabaseConfigured } from '../../../../lib/supabase'

// POST /api/menu-settings/init - Initialize menu settings table
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Database connection not configured' },
        { status: 503 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()
    
    // Check if table exists by trying to query it
    const { error: tableCheckError } = await supabaseAdmin
      .from('menu_settings')
      .select('id')
      .limit(1)

    if (tableCheckError && tableCheckError.code === '42P01') {
      // Table doesn't exist, create it
      const { error: createError } = await supabaseAdmin.rpc('create_menu_settings_table')
      
      if (createError) {
        return NextResponse.json({ 
          error: 'Failed to create table', 
          details: createError 
        }, { status: 500 })
      }
    }

    // Clear existing settings
    const { error: deleteError } = await supabaseAdmin
      .from('menu_settings')
      .delete()
      .gte('id', 0)

    if (deleteError) {
      console.error('Error clearing settings:', deleteError)
    }

    // Insert default settings
    const defaultSettings = [
      { setting_key: 'auto_refresh_interval', setting_value: '30' },
      { setting_key: 'font_size', setting_value: '170' },
      { setting_key: 'theme', setting_value: 'dark' },
      { setting_key: 'display_effects', setting_value: 'true' },
      { setting_key: 'show_thca', setting_value: 'true' },
      { setting_key: 'show_terpenes', setting_value: 'true' },
      { setting_key: 'show_effects', setting_value: 'true' },
      { setting_key: 'compact_mode', setting_value: 'false' },
      { setting_key: 'auto_scroll', setting_value: 'false' },
      { setting_key: 'scroll_speed', setting_value: '50' },
      { setting_key: 'show_out_of_stock', setting_value: 'true' },
      { setting_key: 'highlight_new_products', setting_value: 'true' },
      { setting_key: 'show_pricing_tiers', setting_value: 'true' },
      { setting_key: 'enable_sound_alerts', setting_value: 'false' },
      { setting_key: 'notification_volume', setting_value: '50' },
      { setting_key: 'enable_animations', setting_value: 'true' },
      { setting_key: 'animation_speed', setting_value: 'normal' },
      { setting_key: 'max_products_per_category', setting_value: '50' },
      { setting_key: 'enable_debug_mode', setting_value: 'false' }
    ]

    const results = []
    for (const setting of defaultSettings) {
      const { data, error } = await supabaseAdmin
        .from('menu_settings')
        .insert([setting])
        .select()
        .single()

      if (error) {
        console.error(`Failed to insert ${setting.setting_key}:`, error)
      } else {
        results.push(data)
      }
    }

    return NextResponse.json({
      message: 'Settings initialized successfully',
      settings: results,
      count: results.length
    })
  } catch (error) {
    console.error('Init API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 