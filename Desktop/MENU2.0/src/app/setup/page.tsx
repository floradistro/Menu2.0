'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const setupProducts = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/setup-products', {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || data.message || 'Setup failed')
      } else {
        setResult(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const testDatabase = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/debug-tables')
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Database Setup</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Setup Options</h2>
          
          <div className="space-y-4">
            <Link
              href="/setup/store-setup"
              className="block w-full bg-blue-600 text-white rounded-md p-4 hover:bg-blue-700 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2">1. Store Table Setup</h3>
              <p className="text-sm opacity-90">Create and configure the store table (required for store management)</p>
            </Link>

            <button
              onClick={setupProducts}
              disabled={loading}
              className="w-full bg-green-600 text-white rounded-md p-4 hover:bg-green-700 disabled:opacity-50 text-left"
            >
              <h3 className="text-lg font-semibold mb-2">2. Products Table Setup</h3>
              <p className="text-sm opacity-90">
                {loading ? 'Setting up...' : 'Add sample products to the products table'}
              </p>
            </button>

            <button
              onClick={testDatabase}
              disabled={loading}
              className="w-full bg-purple-600 text-white rounded-md p-4 hover:bg-purple-700 disabled:opacity-50 text-left"
            >
              <h3 className="text-lg font-semibold mb-2">3. Test Database Connection</h3>
              <p className="text-sm opacity-90">
                {loading ? 'Testing...' : 'Check what tables are accessible'}
              </p>
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded mb-6">
          <h3 className="text-lg font-semibold mb-2">Required Supabase Setup:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Create the products table (you mentioned this is already done)</li>
            <li>Set up RLS policies to allow public access:</li>
          </ol>
          <pre className="bg-gray-900 p-4 rounded mt-4 text-sm overflow-x-auto">
{`-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on products" 
ON products FOR SELECT 
TO public 
USING (true);

-- Allow public insert access (for admin)
CREATE POLICY "Allow public insert access on products" 
ON products FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow public update access (for admin)
CREATE POLICY "Allow public update access on products" 
ON products FOR UPDATE 
TO public 
USING (true);

-- Allow public delete access (for admin)
CREATE POLICY "Allow public delete access on products" 
ON products FOR DELETE 
TO public 
USING (true);`}
          </pre>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <h3 className="text-red-400 font-semibold mb-2">Error</h3>
            <p className="text-gray-300">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="text-green-400 font-semibold mb-2">Result</h3>
            <pre className="text-sm text-gray-300 overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 