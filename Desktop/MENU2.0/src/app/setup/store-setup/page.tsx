'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function StoreSetupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const createStoreTable = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Test if we can access the store table
      const { data: testData, error: testError } = await supabase
        .from('store')
        .select('*')
        .limit(1)

      if (testError && testError.code === '42P01') {
        // Table doesn't exist
        setError('Store table does not exist. Please run the SQL in Supabase SQL Editor.')
        setResult({
          needsManualSetup: true,
          sql: getStoreTableSQL()
        })
      } else if (testError && testError.code === '42501') {
        // Permission denied
        setError('Permission denied. The table exists but needs proper permissions.')
        setResult({
          needsPermissionFix: true,
          sql: getPermissionFixSQL()
        })
      } else if (testError) {
        setError(testError.message)
      } else {
        // Table exists and is accessible, let's check/insert default stores
        const defaultStores = [
          { code: 'CLT', name: 'Charlotte', address: '123 Main St, Charlotte, NC' },
          { code: 'SAL', name: 'Salem', address: '456 Oak Ave, Salem, OR' },
          { code: 'TN', name: 'Tennessee', address: '789 Pine Rd, Nashville, TN' },
          { code: 'BR', name: 'Baton Rouge', address: '321 Elm St, Baton Rouge, LA' }
        ]

        for (const store of defaultStores) {
          const { error: insertError } = await supabase
            .from('store')
            .upsert([store], { onConflict: 'code' })

          if (insertError) {
            console.error(`Error inserting store ${store.code}:`, insertError)
          }
        }

        const { data: stores, error: fetchError } = await supabase
          .from('store')
          .select('*')
          .order('name')

        if (fetchError) {
          setError(fetchError.message)
        } else {
          setResult({
            success: true,
            stores: stores,
            message: 'Store table is ready!'
          })
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const getStoreTableSQL = () => {
    return `-- Create the store table
CREATE TABLE IF NOT EXISTS public.store (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the code column for faster lookups
CREATE INDEX IF NOT EXISTS idx_store_code ON public.store(code);

-- Enable Row Level Security
ALTER TABLE public.store ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Enable read access for all users" ON public.store
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.store
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.store
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON public.store
    FOR DELETE USING (true);

-- Grant permissions to anon and authenticated roles
GRANT ALL ON public.store TO anon;
GRANT ALL ON public.store TO authenticated;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Insert default stores
INSERT INTO public.store (code, name, address) VALUES 
('CLT', 'Charlotte', '123 Main St, Charlotte, NC'),
('SAL', 'Salem', '456 Oak Ave, Salem, OR'),
('TN', 'Tennessee', '789 Pine Rd, Nashville, TN'),
('BR', 'Baton Rouge', '321 Elm St, Baton Rouge, LA')
ON CONFLICT (code) DO NOTHING;`
  }

  const getPermissionFixSQL = () => {
    return `-- Fix permissions for the store table

-- Option 1: Quick fix - Disable RLS (less secure but simpler)
ALTER TABLE public.store DISABLE ROW LEVEL SECURITY;

-- Option 2: Keep RLS enabled and add proper policies (recommended)
-- First drop any existing policies
DROP POLICY IF EXISTS "Allow public read access on store" ON public.store;
DROP POLICY IF EXISTS "Allow public insert access on store" ON public.store;
DROP POLICY IF EXISTS "Allow public update access on store" ON public.store;
DROP POLICY IF EXISTS "Allow public delete access on store" ON public.store;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON public.store
    FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON public.store
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON public.store
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON public.store
    FOR DELETE USING (true);

-- Grant permissions to anon and authenticated roles
GRANT ALL ON public.store TO anon;
GRANT ALL ON public.store TO authenticated;

-- Grant usage on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;`
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/setup"
          className="inline-flex items-center text-gray-400 hover:text-gray-300 mb-6"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Setup
        </Link>

        <h1 className="text-4xl font-bold mb-8">Store Table Setup</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Check Store Table</h2>
          <p className="text-gray-300 mb-6">
            This will check if the store table exists and has proper permissions.
          </p>
          
          <button
            onClick={createStoreTable}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Store Table'}
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <h3 className="text-red-400 font-semibold mb-2">Error</h3>
            <p className="text-gray-300">{error}</p>
          </div>
        )}

        {result && result.needsManualSetup && (
          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 mb-6">
            <h3 className="text-yellow-400 font-semibold mb-4">Manual Setup Required</h3>
            <p className="text-gray-300 mb-4">
              The store table doesn't exist. Please run this SQL in your Supabase SQL Editor:
            </p>
            <div className="bg-gray-900 rounded p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap">{result.sql}</pre>
            </div>
            <div className="mt-4">
              <a
                href="https://app.supabase.com/project/cullazwyqnczfbavfkzk/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-400 hover:text-blue-300"
              >
                Open Supabase SQL Editor
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        )}

        {result && result.needsPermissionFix && (
          <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 mb-6">
            <h3 className="text-yellow-400 font-semibold mb-4">🔐 Permission Fix Required</h3>
            <p className="text-gray-300 mb-4">
              The store table exists but needs proper permissions. Run this SQL in your Supabase SQL Editor:
            </p>
            <div className="bg-gray-900 rounded p-4 overflow-x-auto">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap">{result.sql}</pre>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-gray-400 text-sm">
                💡 <strong>Tip:</strong> Option 1 is quicker but less secure. Option 2 maintains Row Level Security.
              </p>
              <a
                href="https://app.supabase.com/project/cullazwyqnczfbavfkzk/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-400 hover:text-blue-300"
              >
                Open Supabase SQL Editor
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        )}

        {result && result.success && (
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 mb-6">
            <h3 className="text-green-400 font-semibold mb-2">✅ Success!</h3>
            <p className="text-gray-300 mb-4">{result.message}</p>
            <div className="space-y-2">
              <h4 className="text-gray-300 font-semibold">Current Stores:</h4>
              <ul className="space-y-1">
                {result.stores?.map((store: any) => (
                  <li key={store.id} className="text-gray-400">
                    <span className="font-mono bg-gray-800 px-2 py-1 rounded text-sm">{store.code}</span> - {store.name} 
                    {store.address && <span className="text-gray-500 text-sm"> ({store.address})</span>}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex gap-4">
              <Link
                href="/admin"
                className="inline-flex items-center text-blue-400 hover:text-blue-300"
              >
                Go to Admin Dashboard
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <button
                onClick={createStoreTable}
                className="inline-flex items-center text-gray-400 hover:text-gray-300"
              >
                Refresh
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 