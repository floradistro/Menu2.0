import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: {}
  }

  // Test 1: Try to SELECT from store table
  try {
    const { data, error } = await supabase
      .from('store')
      .select('*')
      .limit(1)
    
    results.tests.select = {
      success: !error,
      data: data,
      error: error ? {
        message: error.message,
        code: error.code,
        details: error.details
      } : null
    }
  } catch (e) {
    results.tests.select = {
      success: false,
      error: e instanceof Error ? e.message : 'Unknown error'
    }
  }

  // Test 2: Check if we can see the table structure
  try {
    const { data, error } = await supabase
      .from('store')
      .select('*')
      .limit(0) // Just get structure, no data
    
    results.tests.tableStructure = {
      success: !error,
      error: error ? error.message : null
    }
  } catch (e) {
    results.tests.tableStructure = {
      success: false,
      error: e instanceof Error ? e.message : 'Unknown error'
    }
  }

  // Test 3: Try to count rows
  try {
    const { count, error } = await supabase
      .from('store')
      .select('*', { count: 'exact', head: true })
    
    results.tests.count = {
      success: !error,
      count: count,
      error: error ? error.message : null
    }
  } catch (e) {
    results.tests.count = {
      success: false,
      error: e instanceof Error ? e.message : 'Unknown error'
    }
  }

  // Diagnosis
  if (results.tests.select?.error?.message?.includes('permission denied')) {
    results.diagnosis = 'RLS is enabled but policies are not allowing access. Run the permissions SQL.'
    results.sqlToRun = `-- Run this in Supabase SQL Editor:

-- Option 1: Disable RLS temporarily (for testing)
ALTER TABLE public.store DISABLE ROW LEVEL SECURITY;

-- Option 2: Keep RLS and add proper policies
CREATE POLICY "Enable read access for all users" ON public.store
    FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.store
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.store
    FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete access for all users" ON public.store
    FOR DELETE USING (true);

-- Grant permissions
GRANT ALL ON public.store TO anon;
GRANT ALL ON public.store TO authenticated;`
  } else if (results.tests.select?.error?.code === '42P01') {
    results.diagnosis = 'Store table does not exist'
  } else if (results.tests.select?.success) {
    results.diagnosis = 'Store table exists and is accessible!'
  } else {
    results.diagnosis = 'Unknown issue'
  }

  return NextResponse.json(results, { 
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
} 