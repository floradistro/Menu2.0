'use client'

import { useState } from 'react'

export default function SetupPage() {
  const [isSetupRunning, setIsSetupRunning] = useState(false)
  const [setupResults, setSetupResults] = useState<any[]>([])

  const runSetup = async () => {
    setIsSetupRunning(true)
    setSetupResults([])

    try {
      // Step 1: Try to run the migration
      console.log('Running migration...')
      const migrationResponse = await fetch('/api/migrate-gummy-cookie', {
        method: 'POST',
      })
      const migrationResult = await migrationResponse.json()
      setSetupResults(prev => [...prev, { step: 'Migration', result: migrationResult }])

      // Step 2: Run products setup
      console.log('Setting up products...')
      const productsResponse = await fetch('/api/setup-products', {
        method: 'POST',
      })
      const productsResult = await productsResponse.json()
      setSetupResults(prev => [...prev, { step: 'Products Setup', result: productsResult }])

      // Step 3: Setup themes
      console.log('Setting up themes...')
      const themesResponse = await fetch('/api/setup-themes', {
        method: 'POST',
      })
      const themesResult = await themesResponse.json()
      setSetupResults(prev => [...prev, { step: 'Themes Setup', result: themesResult }])

    } catch (error) {
      console.error('Setup failed:', error)
      setSetupResults(prev => [...prev, { 
        step: 'Error', 
        result: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        } 
      }])
    } finally {
      setIsSetupRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Setup</h1>
        
        <div className="bg-gray-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Setup Process</h2>
          <p className="text-gray-300 mb-4">
            This will run the complete database setup including:
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-6 space-y-1">
            <li>Add is_gummy and is_cookie columns to products table</li>
            <li>Insert sample products data</li>
            <li>Setup color themes</li>
          </ul>
          
          <button
            onClick={runSetup}
            disabled={isSetupRunning}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {isSetupRunning ? 'Running Setup...' : 'Run Complete Setup'}
          </button>
        </div>

        {setupResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Setup Results</h2>
            {setupResults.map((result, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <span className="mr-2">{result.step}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    result.result.success ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {result.result.success ? 'SUCCESS' : 'FAILED'}
                  </span>
                </h3>
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  {JSON.stringify(result.result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}

        {setupResults.some(r => !r.result.success && r.result.migrationSQL) && (
          <div className="mt-6 bg-yellow-900 border border-yellow-600 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-200 mb-2">Manual Migration Required</h3>
            <p className="text-yellow-100 mb-3">
              The database migration couldn't be applied automatically. Please run this SQL in your Supabase SQL Editor:
            </p>
            <pre className="bg-black text-green-400 p-3 rounded text-sm overflow-x-auto">
              {setupResults.find(r => r.result.migrationSQL)?.result.migrationSQL}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
} 