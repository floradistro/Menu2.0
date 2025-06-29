import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '../../../lib/supabase'

// GET /api/menu-settings - Get all menu settings
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('menu_settings')
      .select('*')

    if (error) {
      console.error('Error fetching menu settings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Convert to key-value object for easier frontend consumption
    const settings = data.reduce((acc: any, setting) => {
      acc[setting.setting_key] = setting.setting_value
      return acc
    }, {})

    return NextResponse.json({ settings, raw: data })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/menu-settings - Update menu settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { setting_key, setting_value } = body

    if (!setting_key || setting_value === undefined) {
      return NextResponse.json(
        { error: 'setting_key and setting_value are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('menu_settings')
      .upsert([{ setting_key, setting_value }])
      .select()
      .single()

    if (error) {
      console.error('Error updating menu settings:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ setting: data })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 