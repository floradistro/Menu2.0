import { NextResponse } from 'next/server'
import { supabase, getSupabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase'

export async function GET() {
  try {
    // Comprehensive debug: Log all environment variable states
    const envDebug = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
      serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      supabaseUrlStart: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) || 'undefined',
      isConfigured: isSupabaseConfigured(),
      nodeEnv: process.env.NODE_ENV,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('SUPABASE')),
      vercelEnv: process.env.VERCEL_ENV || 'not-set'
    }

    console.log('Comprehensive environment debug:', envDebug)

    // Test direct Supabase connection with hardcoded values if env vars are missing
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not configured',
        details: 'Supabase environment variables are missing',
        debug: envDebug,
        timestamp: new Date().toISOString()
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