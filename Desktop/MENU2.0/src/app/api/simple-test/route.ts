import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test 1: Try to access any table to test basic connection
    console.log('Testing basic Supabase connection...')
    
    const { data: versionData, error: versionError } = await supabase.rpc('version')
    
    if (versionError) {
      console.log('Version RPC error:', versionError)
    } else {
      console.log('Version RPC success:', versionData)
    }

    // Test 2: Try to list tables using information_schema
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5)

    console.log('Tables query result:', { tablesData, tablesError })

    // Test 3: Try the products table specifically
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1)

    console.log('Products query result:', { productsData, productsError })

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      tests: {
        version: {
          success: !versionError,
          error: versionError?.message,
          data: versionData
        },
        tables: {
          success: !tablesError,
          error: tablesError?.message,
          data: tablesData
        },
        products: {
          success: !productsError,
          error: productsError?.message,
          errorCode: productsError?.code,
          data: productsData
        }
      }
    })

  } catch (error) {
    console.error('Simple test error:', error)
    return NextResponse.json({
      error: 'Network error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 