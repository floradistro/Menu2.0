import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const results = {
    connectionTest: null as any,
    liveMenuViewTest: null as any,
    tablesTest: null as any
  }

  // Test 1: Basic connection
  try {
    const { data, error } = await supabase.auth.getSession()
    results.connectionTest = {
      success: true,
      message: 'Supabase client initialized successfully',
      url: 'https://cullazwyqnczfbavfkzk.supabase.co'
    }
  } catch (err) {
    results.connectionTest = {
      success: false,
      error: err instanceof Error ? err.message : 'Connection failed'
    }
  }

  // Test 2: Check for live_menu_view
  try {
    const { data, error } = await supabase
      .from('live_menu_view')
      .select('*')
      .limit(1)

    if (error) {
      results.liveMenuViewTest = {
        success: false,
        error: error.message,
        code: error.code,
        expected: 'This is expected if you haven\'t created the live_menu_view yet'
      }
    } else {
      results.liveMenuViewTest = {
        success: true,
        message: 'live_menu_view exists and accessible',
        recordCount: data?.length || 0
      }
    }
  } catch (err) {
    results.liveMenuViewTest = {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }

  // Test 3: Try to list any available tables
  try {
    const { data, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .limit(5)

    if (error) {
      results.tablesTest = {
        success: false,
        error: error.message,
        note: 'Cannot access system tables - this is normal with RLS enabled'
      }
    } else {
      results.tablesTest = {
        success: true,
        tables: data?.map(t => t.tablename) || []
      }
    }
  } catch (err) {
    results.tablesTest = {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }

  return NextResponse.json({
    overall: {
      supabaseConnection: results.connectionTest?.success || false,
      databaseReady: results.liveMenuViewTest?.success || false,
      recommendation: results.liveMenuViewTest?.success 
        ? 'Your cannabis menu system is ready to use!' 
        : 'You need to create the live_menu_view in your Supabase database'
    },
    details: results,
    nextSteps: results.liveMenuViewTest?.success ? [] : [
      '1. Go to your Supabase SQL Editor',
      '2. Create the live_menu_view with your product data',
      '3. Ensure it has the required columns: store_code, category, product_name, etc.',
      '4. Test the menu routes: /menus/clt/flower'
    ]
  })
} 