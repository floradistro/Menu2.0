import { NextResponse } from 'next/server'
import { supabase, getSupabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase'

export async function GET() {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not configured',
        details: 'Supabase environment variables are missing'
      }, { status: 503 })
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Test basic connection
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, category')
      .limit(5)

    if (productsError) {
      console.error('Products query error:', productsError)
      return NextResponse.json({
        success: false,
        error: 'Failed to query products',
        details: productsError.message
      }, { status: 500 })
    }

    // Test menu settings
    const { data: settings, error: settingsError } = await supabase
      .from('menu_settings')
      .select('setting_key, setting_value')
      .limit(3)

    if (settingsError) {
      console.error('Settings query error:', settingsError)
      return NextResponse.json({
        success: false,
        error: 'Failed to query menu settings',
        details: settingsError.message
      }, { status: 500 })
    }

    // Test admin connection
    const { data: adminTest, error: adminError } = await supabaseAdmin
      .from('products')
      .select('count')
      .limit(1)

    if (adminError) {
      console.error('Admin connection error:', adminError)
      return NextResponse.json({
        success: false,
        error: 'Admin connection failed',
        details: adminError.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      data: {
        products_count: products?.length || 0,
        sample_products: products?.slice(0, 3) || [],
        settings_count: settings?.length || 0,
        admin_connection: 'OK'
      }
    })

  } catch (error) {
    console.error('Connection test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Connection test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 