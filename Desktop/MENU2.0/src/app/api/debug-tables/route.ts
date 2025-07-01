import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const tests = {
    categoryTest: null as any,
    storeTest: null as any,
    productTest: null as any,
    liveMenuTest: null as any,
    rlsInfo: null as any
  }

  // Test 1: Try to access category table
  try {
    const { data, error } = await supabase
      .from('category')
      .select('*')
      .limit(3)

    if (error) {
      tests.categoryTest = {
        success: false,
        error: error.message,
        code: error.code
      }
    } else {
      tests.categoryTest = {
        success: true,
        count: data?.length || 0,
        data: data
      }
    }
  } catch (err) {
    tests.categoryTest = {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }

  // Test 2: Try to access store table
  try {
    const { data, error } = await supabase
      .from('store')
      .select('*')
      .limit(3)

    if (error) {
      tests.storeTest = {
        success: false,
        error: error.message,
        code: error.code
      }
    } else {
      tests.storeTest = {
        success: true,
        count: data?.length || 0,
        data: data
      }
    }
  } catch (err) {
    tests.storeTest = {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }

  // Test 3: Try to access live_menu_view
  try {
    const { data, error } = await supabase
      .from('live_menu_view')
      .select('*')
      .limit(2)

    if (error) {
      tests.liveMenuTest = {
        success: false,
        error: error.message,
        code: error.code
      }
    } else {
      tests.liveMenuTest = {
        success: true,
        count: data?.length || 0,
        data: data
      }
    }
  } catch (err) {
    tests.liveMenuTest = {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }

  // Test 4: Check if we can see any products
  try {
    const { data, error } = await supabase
      .from('product')
      .select('id, product_name')
      .limit(3)

    if (error) {
      tests.productTest = {
        success: false,
        error: error.message,
        code: error.code
      }
    } else {
      tests.productTest = {
        success: true,
        count: data?.length || 0,
        data: data
      }
    }
  } catch (err) {
    tests.productTest = {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }

  // Determine what's happening
  const diagnosis = {
    tablesExist: tests.categoryTest?.success || tests.storeTest?.success || tests.productTest?.success,
    viewExists: tests.liveMenuTest?.success,
    likelyIssue: 'Unknown'
  }

  if (!diagnosis.tablesExist) {
    diagnosis.likelyIssue = 'Tables not created or RLS blocking all access'
  } else if (!diagnosis.viewExists) {
    diagnosis.likelyIssue = 'View not created or RLS policy missing for view'
  } else {
    diagnosis.likelyIssue = 'Everything working!'
  }

  return NextResponse.json({
    diagnosis,
    tests,
    recommendations: [
      diagnosis.tablesExist ? '✅ Tables accessible' : '❌ Check if tables exist and RLS policies allow access',
      diagnosis.viewExists ? '✅ View accessible' : '❌ Create view or add RLS policy: GRANT SELECT ON live_menu_view TO anon',
      'If RLS is enabled, you may need: ALTER TABLE [table] ENABLE ROW LEVEL SECURITY; CREATE POLICY "Allow read access" ON [table] FOR SELECT USING (true);'
    ]
  })
} 