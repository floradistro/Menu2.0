'use client'

import { useEffect, useState } from 'react'

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [connectionTest, setConnectionTest] = useState<any>(null)

  useEffect(() => {
    // Fetch debug info
    fetch('/api/debug-env')
      .then(res => res.json())
      .then(data => {
        setDebugInfo(data)
        setLoading(false)
      })
      .catch(err => {
        setDebugInfo({ error: err.message })
        setLoading(false)
      })

    // Test connection
    fetch('/api/test-connection')
      .then(res => res.json())
      .then(data => setConnectionTest(data))
      .catch(err => setConnectionTest({ error: err.message }))
  }, [])

  if (loading) {
    return <div className="p-8 text-white">Loading debug info...</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Environment Debug</h1>
      
      {/* Environment Variables Status */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className={debugInfo?.envVars?.hasSupabaseUrl ? 'text-green-400' : 'text-red-400'}>
              {debugInfo?.envVars?.hasSupabaseUrl ? '✓' : '✗'}
            </span>
            <span>NEXT_PUBLIC_SUPABASE_URL</span>
            {debugInfo?.envVars?.supabaseUrlStart && (
              <span className="text-gray-400 text-sm">({debugInfo.envVars.supabaseUrlStart}...)</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className={debugInfo?.envVars?.hasAnonKey ? 'text-green-400' : 'text-red-400'}>
              {debugInfo?.envVars?.hasAnonKey ? '✓' : '✗'}
            </span>
            <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
            {debugInfo?.envVars?.anonKeyLength > 0 && (
              <span className="text-gray-400 text-sm">(length: {debugInfo.envVars.anonKeyLength})</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className={debugInfo?.envVars?.hasServiceKey ? 'text-green-400' : 'text-red-400'}>
              {debugInfo?.envVars?.hasServiceKey ? '✓' : '✗'}
            </span>
            <span>SUPABASE_SERVICE_ROLE_KEY</span>
            {debugInfo?.envVars?.serviceKeyLength > 0 && (
              <span className="text-gray-400 text-sm">(length: {debugInfo.envVars.serviceKeyLength})</span>
            )}
          </div>
        </div>
      </div>

      {/* Connection Test */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
        {connectionTest ? (
          <div>
            <div className={`mb-2 ${connectionTest.success ? 'text-green-400' : 'text-red-400'}`}>
              Status: {connectionTest.success ? 'Connected' : 'Failed'}
            </div>
            {connectionTest.error && (
              <div className="text-red-400">Error: {connectionTest.error}</div>
            )}
            {connectionTest.details && (
              <div className="text-gray-400 text-sm">Details: {connectionTest.details}</div>
            )}
            {connectionTest.debug && (
              <pre className="mt-4 p-4 bg-gray-900 rounded text-xs overflow-auto">
                {JSON.stringify(connectionTest.debug, null, 2)}
              </pre>
            )}
          </div>
        ) : (
          <div>Testing connection...</div>
        )}
      </div>

      {/* Vercel Environment */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Deployment Info</h2>
        <div className="space-y-1">
          <div>Node Env: {debugInfo?.envVars?.nodeEnv || 'unknown'}</div>
          <div>Vercel Env: {debugInfo?.envVars?.vercelEnv || 'not on Vercel'}</div>
          <div>Is Configured: {debugInfo?.envVars?.isConfigured ? 'Yes' : 'No'}</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-6 bg-blue-900/30 border border-blue-500 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">How to fix missing environment variables on Vercel:</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Go to your Vercel project dashboard</li>
          <li>Navigate to Settings → Environment Variables</li>
          <li>Add these three variables:
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>NEXT_PUBLIC_SUPABASE_URL (your Supabase project URL)</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY (your Supabase anon/public key)</li>
              <li>SUPABASE_SERVICE_ROLE_KEY (your Supabase service role key)</li>
            </ul>
          </li>
          <li>Make sure to add them for Production, Preview, and Development environments</li>
          <li>Redeploy your project after adding the variables</li>
        </ol>
      </div>
    </div>
  )
} 