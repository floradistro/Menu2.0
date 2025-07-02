'use client'

import { useState, useEffect } from 'react'
import MenuGrid from '@/components/MenuGrid'
import MenuHeader from '@/components/MenuHeader'
import { supabase } from '@/lib/supabase'
import { getActiveMenuColors, MenuColors, defaultColors, getBackgroundStyle } from '@/lib/menu-colors'

interface AdminMenuGridProps {
  storeCode: string
  category: string
}

export default function AdminMenuGrid({ storeCode, category }: AdminMenuGridProps) {
  const [colors, setColors] = useState<MenuColors>(defaultColors)
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(() => {
    return parseInt(process.env.NEXT_PUBLIC_REFRESH_INTERVAL || '60000')
  })
  const [customInterval, setCustomInterval] = useState(refreshInterval / 1000)
  const [refreshKey, setRefreshKey] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchColors = async () => {
    try {
      const colorData = await getActiveMenuColors()
      setColors(colorData)
    } catch (err) {
      console.error('Error fetching colors:', err)
      setColors(defaultColors)
    }
  }

  useEffect(() => {
    fetchColors()
    
    // Listen for theme updates
    const handleThemeUpdate = () => {
      fetchColors()
    }
    
    const handleForceRefresh = () => {
      // Clear localStorage and fetch fresh colors
      if (typeof window !== 'undefined') {
        localStorage.removeItem('activeMenuColors')
      }
      fetchColors()
    }
    
    window.addEventListener('themeUpdated', handleThemeUpdate)
    window.addEventListener('forceThemeRefresh', handleForceRefresh)
    
    // Auto-refresh with configurable interval
    let interval: NodeJS.Timeout | null = null
    if (autoRefreshEnabled) {
      interval = setInterval(() => {
        setRefreshKey(prev => prev + 1)
        fetchColors()
      }, refreshInterval)
    }
    
    return () => {
      if (interval) clearInterval(interval)
      window.removeEventListener('themeUpdated', handleThemeUpdate)
      window.removeEventListener('forceThemeRefresh', handleForceRefresh)
    }
  }, [autoRefreshEnabled, refreshInterval])

  // Handle interval change
  const handleIntervalChange = (seconds: number) => {
    setCustomInterval(seconds)
    setRefreshInterval(seconds * 1000)
  }

  // Manual refresh function
  const handleManualRefresh = async () => {
    setLoading(true)
    setRefreshKey(prev => prev + 1)
    await fetchColors()
    setLoading(false)
  }

  // Build background style
  const backgroundStyle = colors.main_background_type === 'gradient' && colors.main_background_gradient
    ? getBackgroundStyle(colors.main_background_gradient)
    : getBackgroundStyle(colors.main_background_color)

  return (
    <div 
      className="w-full space-y-0 min-h-screen"
      style={backgroundStyle}
    >
      {/* Menu Header */}
      <MenuHeader 
        storeCode={storeCode} 
        category={category}
      />
      
      {/* Auto-refresh controls */}
      <div 
        className="px-6 py-3 border-b backdrop-blur-sm"
        style={{ 
          backgroundColor: colors.table_header_bg,
          borderColor: colors.table_border_color + '50'
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-6">
            {/* Auto-refresh toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoRefreshEnabled ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoRefreshEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span 
                className="text-sm font-medium" 
                style={{ color: colors.primary_text_color }}
              >
                Auto-refresh {autoRefreshEnabled ? 'On' : 'Off'}
              </span>
            </div>

            {/* Interval selector */}
            <div className="flex items-center space-x-2">
              <span 
                className="text-sm font-medium" 
                style={{ color: colors.primary_text_color }}
              >
                Interval:
              </span>
              <select
                value={customInterval}
                onChange={(e) => handleIntervalChange(Number(e.target.value))}
                disabled={!autoRefreshEnabled}
                className="text-sm px-2 py-1 rounded border disabled:opacity-50"
                style={{
                  backgroundColor: colors.table_row_even_bg,
                  color: colors.primary_text_color,
                  borderColor: colors.table_border_color
                }}
              >
                <option value={10}>10 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={120}>2 minutes</option>
                <option value={300}>5 minutes</option>
                <option value={600}>10 minutes</option>
              </select>
            </div>

            {/* Custom interval input */}
            <div className="flex items-center space-x-2">
              <span 
                className="text-sm font-medium" 
                style={{ color: colors.primary_text_color }}
              >
                Custom:
              </span>
              <input
                type="number"
                min="5"
                max="3600"
                value={customInterval}
                onChange={(e) => handleIntervalChange(Number(e.target.value))}
                disabled={!autoRefreshEnabled}
                className="text-sm px-2 py-1 rounded border w-16 disabled:opacity-50"
                style={{
                  backgroundColor: colors.table_row_even_bg,
                  color: colors.primary_text_color,
                  borderColor: colors.table_border_color
                }}
              />
              <span 
                className="text-sm" 
                style={{ color: colors.primary_text_color }}
              >
                sec
              </span>
            </div>
          </div>

          {/* Manual refresh button */}
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-1 text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.table_row_hover_bg,
              color: colors.primary_text_color
            }}
          >
            <svg 
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        {/* Status indicator */}
        <div className="mt-2 text-xs" style={{ color: colors.secondary_text_color }}>
          {autoRefreshEnabled ? (
            <span style={{ color: colors.thca_percent_color }}>
              Auto-refreshing every {customInterval} seconds
            </span>
          ) : (
            <span style={{ color: colors.secondary_text_color }}>
              Auto-refresh disabled - Use manual refresh button
            </span>
          )}
        </div>
      </div>

      {/* MenuGrid component */}
      <MenuGrid 
        key={refreshKey}
        storeCode={storeCode} 
        category={category} 
        adminMode={true}
      />
    </div>
  )
} 