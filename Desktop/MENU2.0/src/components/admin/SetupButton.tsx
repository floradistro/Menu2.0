'use client'

import { useState } from 'react'

export default function SetupButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSetup = async () => {
    try {
      setLoading(true)
      setMessage(null)

      const response = await fetch('/api/setup-themes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Setup failed')
      }

      setMessage('Themes table setup completed successfully!')
      setTimeout(() => setMessage(null), 5000)
    } catch (error) {
      console.error('Setup error:', error)
      setMessage(error instanceof Error ? error.message : 'Setup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleSetup}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
        <span>{loading ? 'Setting up...' : 'Setup Themes Table'}</span>
      </button>
      
      {message && (
        <div className={`text-sm ${message.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </div>
      )}
    </div>
  )
} 