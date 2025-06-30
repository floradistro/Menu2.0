"use client"

import React, { useState, useEffect } from 'react'

interface DisplayControlsPanelProps {
  onRefresh?: () => Promise<void>
}

export default function DisplayControlsPanel({ onRefresh }: DisplayControlsPanelProps) {
  const [settings, setSettings] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/menu-settings')
        const data = await response.json()
        setSettings(data.settings || {})
      } catch (err) {
        console.error('Error fetching settings:', err)
      }
    }
    fetchSettings()
  }, [])

  // Update a setting
  const updateSetting = async (key: string, value: any) => {
    try {
      setSaving(true)
      const response = await fetch('/api/menu-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setting_key: key, setting_value: value })
      })

      if (!response.ok) {
        throw new Error('Failed to update setting')
      }

      setSettings(prev => ({ ...prev, [key]: value }))
      setSaveStatus('Settings saved!')
      setTimeout(() => setSaveStatus(null), 2000)
      
      if (onRefresh) {
        await onRefresh()
      }
    } catch (err) {
      setSaveStatus('Error saving settings')
      setTimeout(() => setSaveStatus(null), 3000)
      console.error('Error updating setting:', err)
    } finally {
      setSaving(false)
    }
  }

  // Background pattern options
  const backgroundPatterns = [
    { id: 'grid', label: 'Grid', preview: 'Linear grid pattern' },
    { id: 'gradient', label: 'Gradient', preview: 'Smooth gradient background' },
    { id: 'solid', label: 'Solid', preview: 'Solid color background' },
    { id: 'stars', label: 'Stars', preview: 'Animated star field' },
    { id: 'dots', label: 'Dots', preview: 'Dotted pattern' },
    { id: 'waves', label: 'Waves', preview: 'Flowing wave pattern' }
  ]

  // Color palette for background colors
  const colorPalette = [
    '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899',
    '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6', '#a855f7',
    '#64748b', '#374151', '#1f2937', '#111827', '#0f172a', '#020617'
  ]

  return (
    <div className="w-full max-w-none p-6 bg-gray-900 text-white min-h-screen">
      <div className="w-full flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Display Controls</h2>
        {saveStatus && (
          <span className={`px-3 py-2 rounded text-sm ${
            saveStatus.includes('Error') ? 'bg-red-600' : 'bg-green-600'
          }`}>
            {saveStatus}
          </span>
        )}
      </div>

      <div className="space-y-8">
        {/* Refresh Rate Control */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-emerald-400">Auto Refresh Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-medium">Enable Auto Refresh</label>
              <input
                type="checkbox"
                checked={settings.menu_auto_refresh ?? true}
                onChange={(e) => updateSetting('menu_auto_refresh', e.target.checked)}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-emerald-400 focus:ring-emerald-400"
                disabled={saving}
              />
            </div>
            
            {settings.menu_auto_refresh !== false && (
              <div>
                <label className="block font-medium mb-2">
                  Refresh Interval: {settings.menu_refresh_interval || 30} seconds
                </label>
                <input
                  type="range"
                  min="5"
                  max="300"
                  step="5"
                  value={settings.menu_refresh_interval || 30}
                  onChange={(e) => updateSetting('menu_refresh_interval', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  disabled={saving}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5s</span>
                  <span>5min</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Background Color Wheel */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-emerald-400">Background Color</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2">Custom Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.global_accent_color || '#10b981'}
                  onChange={(e) => updateSetting('global_accent_color', e.target.value)}
                  className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer"
                  disabled={saving}
                />
                <input
                  type="text"
                  value={settings.global_accent_color || '#10b981'}
                  onChange={(e) => updateSetting('global_accent_color', e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="#10b981"
                  disabled={saving}
                />
              </div>
            </div>
            
            <div>
              <label className="block font-medium mb-3">Color Palette</label>
              <div className="grid grid-cols-6 gap-2">
                {colorPalette.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateSetting('global_accent_color', color)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-110 ${
                      settings.global_accent_color === color 
                        ? 'border-white shadow-lg' 
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                    disabled={saving}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Background Pattern Selector */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-emerald-400">Background Pattern</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {backgroundPatterns.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => updateSetting('global_background_style', pattern.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:bg-gray-700 ${
                  settings.global_background_style === pattern.id 
                    ? 'border-emerald-400 bg-emerald-900/20' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                disabled={saving}
              >
                <div className="font-semibold mb-1">{pattern.label}</div>
                <div className="text-sm text-gray-400">{pattern.preview}</div>
                <div className="mt-3 h-8 rounded bg-gray-600 relative overflow-hidden">
                  {pattern.id === 'grid' && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `
                          linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '8px 8px'
                      }}
                    />
                  )}
                  {pattern.id === 'gradient' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500" />
                  )}
                  {pattern.id === 'solid' && (
                    <div className="absolute inset-0 bg-gray-500" />
                  )}
                  {pattern.id === 'stars' && (
                    <div className="absolute inset-0 bg-gray-900">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {pattern.id === 'dots' && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                        backgroundSize: '8px 8px'
                      }}
                    />
                  )}
                  {pattern.id === 'waves' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-60">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent transform skew-y-1" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Display Settings */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-emerald-400">Additional Settings</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-medium">Show Font Size Controls</label>
              <input
                type="checkbox"
                checked={settings.feature_font_size_control ?? true}
                onChange={(e) => updateSetting('feature_font_size_control', e.target.checked)}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-emerald-400 focus:ring-emerald-400"
                disabled={saving}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="font-medium">Show Navigation Menu</label>
              <input
                type="checkbox"
                checked={settings.feature_navigation_menu ?? true}
                onChange={(e) => updateSetting('feature_navigation_menu', e.target.checked)}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-emerald-400 focus:ring-emerald-400"
                disabled={saving}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="font-medium">Show Out of Stock Items</label>
              <input
                type="checkbox"
                checked={settings.menu_show_out_of_stock ?? false}
                onChange={(e) => updateSetting('menu_show_out_of_stock', e.target.checked)}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-emerald-400 focus:ring-emerald-400"
                disabled={saving}
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Global Font Scale: {settings.global_font_scale || 100}%
              </label>
              <input
                type="range"
                min="50"
                max="150"
                step="5"
                value={settings.global_font_scale || 100}
                onChange={(e) => updateSetting('global_font_scale', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                disabled={saving}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>50%</span>
                <span>150%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #065f46;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid #065f46;
        }
      `}</style>
    </div>
  )
} 