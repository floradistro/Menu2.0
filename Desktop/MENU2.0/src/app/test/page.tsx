'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking...')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(5)

      if (error) {
        setError(`Supabase Error: ${error.message}`)
        setConnectionStatus('❌ Connection failed')
        return
      }

      setData(data)
      setConnectionStatus('✅ Connected to Supabase')
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setConnectionStatus('❌ Connection failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Connection Status:</h2>
        <p className={`text-lg ${connectionStatus.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
          {connectionStatus}
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-900/20 border border-red-500 rounded">
          <h2 className="text-xl font-semibold mb-2 text-red-400">Error:</h2>
          <pre className="text-red-300">{error}</pre>
        </div>
      )}

      {data && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Sample Data from products table:</h2>
          <pre className="bg-gray-800 p-4 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <button
        onClick={testConnection}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
      >
        Retry Connection
      </button>
    </div>
  )
} 