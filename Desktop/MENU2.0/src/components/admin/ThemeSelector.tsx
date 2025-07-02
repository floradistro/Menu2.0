'use client'

import { useState, useEffect } from 'react'
import { getAllThemes, switchToTheme, AvailableTheme } from '@/lib/themes'
import { debugThemes, quickThemeStatus } from '@/lib/debug-themes'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { ErrorMessage } from '../ui/ErrorMessage'

export default function ThemeSelector() {
  const [themes, setThemes] = useState<AvailableTheme[]>([])
  const [loading, setLoading] = useState(true)
  const [switching, setSwitching] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [debugMode, setDebugMode] = useState(false)
  const [debugResult, setDebugResult] = useState<any>(null)

  const fetchThemes = async () => {
    try {
      setLoading(true)
      setError(null)
      const themesData = await getAllThemes()
      setThemes(themesData)
      setLastUpdated(new Date())
      
      if (themesData.length === 0) {
        setError('No themes found. Please run the Apple themes setup SQL in your Supabase dashboard.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch themes')
    } finally {
      setLoading(false)
    }
  }

  const handleThemeSwitch = async (themeName: string) => {
    if (switching) return
    
    setSwitching(themeName)
    setError(null)
    try {
      const success = await switchToTheme(themeName)
      if (success) {
        // Wait for theme to propagate
        await new Promise(resolve => setTimeout(resolve, 200))
        // Refresh the themes list to update active status
        await fetchThemes()
        // Force all components to refresh their theme
        window.dispatchEvent(new CustomEvent('forceThemeRefresh'))
      } else {
        setError(`Failed to switch to ${themeName}. Check console for details.`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch theme')
    } finally {
      setSwitching(null)
    }
  }

  const runDebugCheck = async () => {
    setDebugMode(true)
    try {
      const result = await debugThemes()
      setDebugResult(result)
      
      if (!result.success) {
        setError(result.error || 'Debug check failed')
      } else {
        setError(null)
        // Refresh themes after successful debug
        await fetchThemes()
      }
    } catch (err) {
      setError(`Debug failed: ${err}`)
    }
  }

    useEffect(() => {
    fetchThemes()
    
    // Listen for theme updates from other components
    const handleThemeUpdate = () => {
      fetchThemes()
    }
    
    window.addEventListener('themeUpdated', handleThemeUpdate)
    
    return () => {
      window.removeEventListener('themeUpdated', handleThemeUpdate)
    }
  }, [])

  if (loading) {
    return <LoadingSpinner message="Loading themes..." />
  }

  const activeTheme = themes.find(theme => theme.is_active)

  return (
    <div className="bg-black/90 backdrop-blur-sm rounded-lg p-6 border border-gray-800/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white font-sf-pro-display">
          Apple Theme Selection
        </h2>
        <div className="flex gap-2">
          <button
            onClick={runDebugCheck}
            className="px-3 py-1 bg-purple-600/60 hover:bg-purple-600/80 rounded-md text-sm text-white transition-colors"
            disabled={loading}
          >
            🔍 Debug
          </button>
          <button
            onClick={fetchThemes}
            className="px-3 py-1 bg-gray-800/60 hover:bg-gray-700/60 rounded-md text-sm text-gray-300 transition-colors"
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Debug Results */}
      {debugMode && debugResult && (
        <div className={`mb-4 p-4 rounded-lg border ${
          debugResult.success 
            ? 'bg-green-500/10 border-green-500/30' 
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={debugResult.success ? 'text-green-400' : 'text-red-400'}>
              {debugResult.success ? '✅' : '❌'}
            </span>
            <span className={`font-semibold ${debugResult.success ? 'text-green-400' : 'text-red-400'}`}>
              Debug Results
            </span>
          </div>
          <p className="text-sm text-gray-300">
            {debugResult.success ? debugResult.message : debugResult.error}
          </p>
          {debugResult.success && (
            <p className="text-xs text-gray-400 mt-1">
              Found {debugResult.themeCount} themes, active: {debugResult.activeTheme}
            </p>
          )}
          <button
            onClick={() => setDebugMode(false)}
            className="mt-2 text-xs text-gray-400 hover:text-gray-300"
          >
            Hide Debug Results
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4">
          <ErrorMessage error={error} />
          {error.includes('No themes found') && (
            <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400 text-sm">
                <strong>Setup Required:</strong> Copy and run the SQL from{' '}
                <code className="bg-blue-500/20 px-1 rounded">apple-themes-setup-fixed.sql</code>{' '}
                in your Supabase SQL editor.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Active Theme Display */}
      {activeTheme && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-400 font-semibold">Currently Active</span>
          </div>
          <h3 className="text-lg font-semibold text-white">{activeTheme.theme_name}</h3>
          <p className="text-gray-300 text-sm">{activeTheme.description}</p>
        </div>
      )}

      {/* Available Themes */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white mb-3">Available Themes</h3>
        
        {themes.map((theme) => {
          const isActive = theme.is_active
          const isSwitching = switching === theme.theme_name

          return (
            <div
              key={theme.theme_name}
              className={`
                p-4 rounded-lg border transition-all duration-200
                ${isActive 
                  ? 'bg-blue-500/10 border-blue-500/30 ring-1 ring-blue-500/20' 
                  : 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-700/40 hover:border-gray-600/50'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-white">
                      {theme.theme_name}
                    </h4>
                    {isActive && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full font-medium">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm mb-2">
                    {theme.description}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Last updated: {new Date(theme.updated_at).toLocaleString()}
                  </p>
                </div>
                
                <div className="ml-4">
                  {isActive ? (
                    <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-md text-sm font-medium">
                      In Use
                    </div>
                  ) : (
                    <button
                      onClick={() => handleThemeSwitch(theme.theme_name)}
                      disabled={isSwitching || switching !== null}
                      className={`
                        px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                        ${isSwitching
                          ? 'bg-blue-500/20 text-blue-400 cursor-not-allowed'
                          : 'bg-blue-600/80 hover:bg-blue-600 text-white hover:scale-105'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      {isSwitching ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                          Switching...
                        </div>
                      ) : (
                        'Apply Theme'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* No Themes State */}
      {themes.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <div className="text-4xl mb-2">🍎</div>
            <p className="text-lg">No Apple themes found</p>
            <p className="text-sm">Database setup required</p>
          </div>
          <button
            onClick={runDebugCheck}
            className="px-4 py-2 bg-purple-600/60 hover:bg-purple-600/80 rounded-md text-sm text-white transition-colors"
          >
            Run Diagnostic Check
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-800/50">
        <p className="text-xs text-gray-500">
          Themes are Apple-inspired designs optimized for dark mode viewing. 
          Changes apply immediately across all menu displays.
          <br />
          Last refreshed: {lastUpdated.toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
} 