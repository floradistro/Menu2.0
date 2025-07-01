import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const results = {
    timestamp: new Date().toISOString(),
    tests: [] as any[]
  }

  // Test 1: Basic connection
  try {
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1)

    results.tests.push({
      test: 'Basic products table access',
      success: !error,
      error: error?.message || null,
      errorCode: error?.code || null,
      data: data
    })
  } catch (err) {
    results.tests.push({
      test: 'Basic products table access',
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      errorCode: 'NETWORK_ERROR'
    })
  }

  // Test 2: Select with specific columns
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, product_name')
      .limit(1)

    results.tests.push({
      test: 'Select specific columns',
      success: !error,
      error: error?.message || null,
      errorCode: error?.code || null,
      data: data
    })
  } catch (err) {
    results.tests.push({
      test: 'Select specific columns',
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      errorCode: 'NETWORK_ERROR'
    })
  }

  // Test 3: Try to insert a test record
  try {
    const testProduct = {
      product_name: 'Test Product',
      product_category: 'Test',
      store_code: 'TEST'
    }

    const { data, error } = await supabase
      .from('products')
      .insert([testProduct])
      .select()

    results.tests.push({
      test: 'Insert test record',
      success: !error,
      error: error?.message || null,
      errorCode: error?.code || null,
      data: data
    })

    // Clean up test record if successful
    if (!error && data && data.length > 0) {
      await supabase
        .from('products')
        .delete()
        .eq('id', data[0].id)
    }
  } catch (err) {
    results.tests.push({
      test: 'Insert test record',
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      errorCode: 'NETWORK_ERROR'
    })
  }

  // Test 4: Check if table exists by trying different approaches
  try {
    const { data, error } = await supabase.rpc('version')
    
    results.tests.push({
      test: 'Database connection (RPC)',
      success: !error,
      error: error?.message || null,
      errorCode: error?.code || null,
      data: data ? 'Connected' : null
    })
  } catch (err) {
    results.tests.push({
      test: 'Database connection (RPC)',
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      errorCode: 'NETWORK_ERROR'
    })
  }

  const overallSuccess = results.tests.every(test => test.success)

  return NextResponse.json({
    success: overallSuccess,
    message: overallSuccess ? 'All tests passed' : 'Some tests failed',
    results
  }, { 
    status: overallSuccess ? 200 : 500 
  })
} 