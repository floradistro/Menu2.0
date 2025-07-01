'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import SetupButton from './SetupButton'

interface ThemeColors {
  id?: string
  background_color: string
  header_indica_color: string
  header_sativa_color: string
  header_hybrid_color: string
  text_color: string
  table_header_bg: string
  table_row_hover: string
  created_at?: string
  updated_at?: string
}

const defaultTheme: ThemeColors = {
  background_color: '#1f2937',
  header_indica_color: '#9333ea',
  header_sativa_color: '#f97316',
  header_hybrid_color: '#3b82f6',
  text_color: '#f3f4f6',
  table_header_bg: '#111827',
  table_row_hover: '#374151'
}

export default function ThemeManager() {
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchTheme()
  }, [])

  const fetchTheme = async () => {
    try {
      setLoading(true)
      
      // Try to fetch from localStorage first as a fallback
      const localTheme = localStorage.getItem('menuTheme')
      if (localTheme) {
        setTheme(JSON.parse(localTheme))
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Database error:', error)
        // Use default theme if database fails
        setTheme(defaultTheme)
        localStorage.setItem('menuTheme', JSON.stringify(defaultTheme))
      } else if (data) {
        setTheme(data)
        localStorage.setItem('menuTheme', JSON.stringify(data))
      }
    } catch (err) {
      console.error('Error fetching theme:', err)
      // Don't show error, just use default theme
      setTheme(defaultTheme)
      localStorage.setItem('menuTheme', JSON.stringify(defaultTheme))
    } finally {
      setLoading(false)
    }
  }

  const saveTheme = async () => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)

      const themeData = {
        ...theme,
        background_color: theme.background_color,
        header_indica_color: theme.header_indica_color,
        header_sativa_color: theme.header_sativa_color,
        header_hybrid_color: theme.header_hybrid_color,
        text_color: theme.text_color,
        table_header_bg: theme.table_header_bg,
        table_row_hover: theme.table_row_hover,
        updated_at: new Date().toISOString()
      }

      // Save to localStorage immediately
      localStorage.setItem('menuTheme', JSON.stringify(themeData))

      // Try to save to database
      try {
        let result
        if (theme.id) {
          result = await supabase
            .from('themes')
            .update(themeData)
            .eq('id', theme.id)
        } else {
          result = await supabase
            .from('themes')
            .insert([{ ...themeData, created_at: new Date().toISOString() }])
        }

        if (result.error) {
          console.error('Database save error:', result.error)
          // Don't throw, we already saved to localStorage
        }
      } catch (dbError) {
        console.error('Database connection error:', dbError)
        // Continue, we have localStorage backup
      }

      setSuccess('Theme saved successfully!')
      setTimeout(() => setSuccess(null), 3000)
      
      // Force reload all pages to apply theme
      window.dispatchEvent(new Event('themeUpdated'))
    } catch (err) {
      console.error('Error saving theme:', err)
      setError(err instanceof Error ? err.message : 'Failed to save theme')
    } finally {
      setSaving(false)
    }
  }

  const resetTheme = () => {
    setTheme(defaultTheme)
  }

  const updateColor = (key: keyof ThemeColors, value: string) => {
    setTheme(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const ColorPicker = ({ label, value, onChange, description }: {
    label: string
    value: string
    onChange: (value: string) => void
    description?: string
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-400">{description}</p>
      )}
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="#000000"
        />
      </div>
    </div>
  )

  if (loading) {
    return <LoadingSpinner message="Loading theme settings..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-100">Theme Customization</h2>
        <div className="flex space-x-3">
          <SetupButton />
          <button
            onClick={resetTheme}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            Reset to Default
          </button>
          <button
            onClick={saveTheme}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            <span>{saving ? 'Saving...' : 'Save Theme'}</span>
          </button>
        </div>
      </div>

      {error && <ErrorMessage error={error} />}
      
      {success && (
        <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
          <p className="text-green-300">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Color Settings */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-200 border-b border-gray-700 pb-2">
            Color Settings
          </h3>
          
          <div className="space-y-4">
            <ColorPicker
              label="Background Color"
              value={theme.background_color}
              onChange={(value) => updateColor('background_color', value)}
              description="Main background color for menu pages"
            />
            
            <ColorPicker
              label="General Text Color"
              value={theme.text_color}
              onChange={(value) => updateColor('text_color', value)}
              description="Primary text color for menu content"
            />
            
            <ColorPicker
              label="Table Header Background"
              value={theme.table_header_bg}
              onChange={(value) => updateColor('table_header_bg', value)}
              description="Background color for table headers"
            />
            
            <ColorPicker
              label="Table Row Hover"
              value={theme.table_row_hover}
              onChange={(value) => updateColor('table_row_hover', value)}
              description="Background color when hovering over table rows"
            />
          </div>
        </div>

        {/* Strain Type Header Colors */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-200 border-b border-gray-700 pb-2">
            Strain Type Header Colors
          </h3>
          
          <div className="space-y-4">
            <ColorPicker
              label="Indica Header Color"
              value={theme.header_indica_color}
              onChange={(value) => updateColor('header_indica_color', value)}
              description="Header background color for Indica strains"
            />
            
            <ColorPicker
              label="Sativa Header Color"
              value={theme.header_sativa_color}
              onChange={(value) => updateColor('header_sativa_color', value)}
              description="Header background color for Sativa strains"
            />
            
            <ColorPicker
              label="Hybrid Header Color"
              value={theme.header_hybrid_color}
              onChange={(value) => updateColor('header_hybrid_color', value)}
              description="Header background color for Hybrid strains"
            />
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-200 border-b border-gray-700 pb-2">
          Preview
        </h3>
        
        <div 
          className="p-6 rounded-lg border border-gray-600"
          style={{ backgroundColor: theme.background_color }}
        >
          {/* Indica Preview */}
          <div className="mb-4 bg-gray-800/90 rounded-lg overflow-hidden">
            <div 
              className="px-4 py-3"
              style={{ backgroundColor: theme.header_indica_color }}
            >
              <h4 className="text-white font-bold">INDICA</h4>
            </div>
            <div 
              className="px-4 py-2"
              style={{ backgroundColor: theme.table_header_bg }}
            >
              <div className="text-sm" style={{ color: theme.text_color }}>
                Product Name • Lineage • Potency
              </div>
            </div>
          </div>

          {/* Sativa Preview */}
          <div className="mb-4 bg-gray-800/90 rounded-lg overflow-hidden">
            <div 
              className="px-4 py-3"
              style={{ backgroundColor: theme.header_sativa_color }}
            >
              <h4 className="text-white font-bold">SATIVA</h4>
            </div>
            <div 
              className="px-4 py-2"
              style={{ backgroundColor: theme.table_header_bg }}
            >
              <div className="text-sm" style={{ color: theme.text_color }}>
                Product Name • Lineage • Potency
              </div>
            </div>
          </div>

          {/* Hybrid Preview */}
          <div className="bg-gray-800/90 rounded-lg overflow-hidden">
            <div 
              className="px-4 py-3"
              style={{ backgroundColor: theme.header_hybrid_color }}
            >
              <h4 className="text-white font-bold">HYBRID</h4>
            </div>
            <div 
              className="px-4 py-2"
              style={{ backgroundColor: theme.table_header_bg }}
            >
              <div className="text-sm" style={{ color: theme.text_color }}>
                Product Name • Lineage • Potency
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 