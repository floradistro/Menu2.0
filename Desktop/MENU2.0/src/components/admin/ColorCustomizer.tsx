'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

interface MenuColors {
  id?: string
  preset_name?: string
  main_background_color: string
  main_background_type: 'solid' | 'gradient'
  main_background_gradient?: string | null
  primary_text_color: string
  secondary_text_color: string
  table_header_bg: string
  table_row_even_bg: string
  table_row_odd_bg: string
  table_row_hover_bg: string
  table_border_color: string
  section_indica_bg: string
  section_indica_gradient_start: string
  section_indica_gradient_end: string
  section_indica_text: string
  section_sativa_bg: string
  section_sativa_gradient_start: string
  section_sativa_gradient_end: string
  section_sativa_text: string
  section_hybrid_bg: string
  section_hybrid_gradient_start: string
  section_hybrid_gradient_end: string
  section_hybrid_text: string
  section_other_bg: string
  section_other_gradient_start: string
  section_other_gradient_end: string
  section_other_text: string
  thca_percent_color: string
  delta9_percent_color: string
  product_count_bg: string
  product_count_text: string
  use_gradient_headers: boolean
  header_blur_effect: boolean
  row_hover_lift: boolean
  show_row_borders: boolean
  row_border_style: 'solid' | 'dashed' | 'dotted'
  row_border_width: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

interface ColorInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  description?: string
}

function ColorInput({ label, value, onChange, description }: ColorInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">
        {label}
        {description && (
          <span className="block text-xs text-gray-500 mt-0.5">{description}</span>
        )}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-20 rounded cursor-pointer border border-gray-600"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
          placeholder="#000000"
        />
      </div>
    </div>
  )
}

export default function ColorCustomizer() {
  const [colors, setColors] = useState<MenuColors | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [activeSection, setActiveSection] = useState<'general' | 'sections' | 'special'>('general')
  const [savedPresets, setSavedPresets] = useState<MenuColors[]>([])
  const [showCreateNew, setShowCreateNew] = useState(false)
  const [newPresetName, setNewPresetName] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const presets = [
    {
      name: 'Apple Dark',
      colors: {
        preset_name: 'Apple Dark',
        main_background_color: '#000000',
        main_background_type: 'gradient' as const,
        main_background_gradient: 'linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #1a1a1a 50%, #0a0a0a 75%, #000000 100%)',
        primary_text_color: '#f2f2f7',
        secondary_text_color: '#8e8e93',
        table_header_bg: '#1c1c1e',
        table_row_even_bg: '#0a0a0a',
        table_row_odd_bg: '#000000',
        table_row_hover_bg: '#2c2c2e',
        table_border_color: '#38383a',
        section_indica_bg: '#1c1c1e',
        section_indica_gradient_start: '#1c1c1e',
        section_indica_gradient_end: '#3a3a3c',
        section_indica_text: '#ffffff',
        section_sativa_bg: '#2c2c2e',
        section_sativa_gradient_start: '#2c2c2e',
        section_sativa_gradient_end: '#48484a',
        section_sativa_text: '#ffffff',
        section_hybrid_bg: '#1a1a1c',
        section_hybrid_gradient_start: '#1a1a1c',
        section_hybrid_gradient_end: '#3a3a3c',
        section_hybrid_text: '#ffffff',
        section_other_bg: '#1f1f1f',
        section_other_gradient_start: '#1f1f1f',
        section_other_gradient_end: '#3a3a3a',
        section_other_text: '#ffffff',
        thca_percent_color: '#4ade80',
        delta9_percent_color: '#60a5fa',
        product_count_bg: '#000000',
        product_count_text: '#ffffff',
        use_gradient_headers: true,
        header_blur_effect: true,
        row_hover_lift: true,
      }
    },
    {
      name: 'Midnight Purple',
      colors: {
        preset_name: 'Midnight Purple',
        main_background_color: '#0a0014',
        main_background_type: 'gradient' as const,
        main_background_gradient: 'linear-gradient(135deg, #0a0014 0%, #1a0f2e 25%, #2a1559 50%, #1a0f2e 75%, #0a0014 100%)',
        primary_text_color: '#e0d5ff',
        secondary_text_color: '#9d88cc',
        table_header_bg: '#1a0f2e',
        table_row_even_bg: '#0f0820',
        table_row_odd_bg: '#0a0014',
        table_row_hover_bg: '#2a1559',
        table_border_color: '#3d2870',
        section_indica_bg: '#1a0f2e',
        section_indica_gradient_start: '#2d1b69',
        section_indica_gradient_end: '#4a2d8f',
        section_indica_text: '#ffffff',
        section_sativa_bg: '#2a1559',
        section_sativa_gradient_start: '#3d2579',
        section_sativa_gradient_end: '#5a3d9f',
        section_sativa_text: '#ffffff',
        section_hybrid_bg: '#221147',
        section_hybrid_gradient_start: '#2a1859',
        section_hybrid_gradient_end: '#4a2d8f',
        section_hybrid_text: '#ffffff',
        section_other_bg: '#1f0f3a',
        section_other_gradient_start: '#1f0f3a',
        section_other_gradient_end: '#3a1f6a',
        section_other_text: '#ffffff',
        thca_percent_color: '#7c3aed',
        delta9_percent_color: '#a78bfa',
        product_count_bg: '#0a0014',
        product_count_text: '#e0d5ff',
        use_gradient_headers: true,
        header_blur_effect: true,
        row_hover_lift: true,
      }
    },
    {
      name: 'Forest Green',
      colors: {
        preset_name: 'Forest Green',
        main_background_color: '#0a1a0a',
        main_background_type: 'gradient' as const,
        main_background_gradient: 'linear-gradient(135deg, #0a1a0a 0%, #1a2e1a 25%, #2a4a2a 50%, #1a2e1a 75%, #0a1a0a 100%)',
        primary_text_color: '#d5ffd5',
        secondary_text_color: '#88cc88',
        table_header_bg: '#1a2e1a',
        table_row_even_bg: '#0f200f',
        table_row_odd_bg: '#0a1a0a',
        table_row_hover_bg: '#2a4a2a',
        table_border_color: '#3a5a3a',
        section_indica_bg: '#1a2e1a',
        section_indica_gradient_start: '#1b4d1b',
        section_indica_gradient_end: '#2d7a2d',
        section_indica_text: '#ffffff',
        section_sativa_bg: '#2a4a2a',
        section_sativa_gradient_start: '#2b5d2b',
        section_sativa_gradient_end: '#3d8a3d',
        section_sativa_text: '#ffffff',
        section_hybrid_bg: '#1f3f1f',
        section_hybrid_gradient_start: '#1a3d1a',
        section_hybrid_gradient_end: '#2d7a2d',
        section_hybrid_text: '#ffffff',
        section_other_bg: '#1a3a1a',
        section_other_gradient_start: '#1a3a1a',
        section_other_gradient_end: '#2a5a2a',
        section_other_text: '#ffffff',
        thca_percent_color: '#4ade80',
        delta9_percent_color: '#86efac',
        product_count_bg: '#0a1a0a',
        product_count_text: '#d5ffd5',
        use_gradient_headers: true,
        header_blur_effect: true,
        row_hover_lift: true,
      }
    }
  ]

  useEffect(() => {
    fetchColors()
    fetchSavedPresets()
  }, [])

  const fetchColors = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('menu_colors')
        .select('*')
        .eq('is_active', true)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Database error:', error)
        if (error.code === '42501') {
          setError('Database permissions issue. Please contact admin to set up the color customization table.')
        } else {
          setError(`Database error: ${error.message}`)
        }
        setColors(getDefaultColors())
        return
      }

      setColors(data || getDefaultColors())
      setError(null)
    } catch (err) {
      console.error('Error fetching colors:', err)
      setError('Failed to load color settings')
      setColors(getDefaultColors())
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedPresets = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_colors')
        .select('*')
        .order('preset_name')

      if (!error && data) {
        setSavedPresets(data)
      }
    } catch (err) {
      console.error('Error fetching presets:', err)
    }
  }

  const createNewPreset = async () => {
    if (!newPresetName.trim() || !colors) return

    try {
      setSaving(true)
      setError(null)

      const newPreset = {
        ...colors,
        id: undefined,
        preset_name: newPresetName.trim(),
        is_active: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('menu_colors')
        .insert(newPreset)

      if (error) throw error

      setSuccess(true)
      setShowCreateNew(false)
      setNewPresetName('')
      await fetchSavedPresets()
    } catch (err) {
      console.error('Error creating preset:', err)
      setError(`Failed to create preset: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const deletePreset = async (presetId: string) => {
    if (!presetId) return

    try {
      setDeletingId(presetId)
      setError(null)

      const { error } = await supabase
        .from('menu_colors')
        .delete()
        .eq('id', presetId)

      if (error) throw error

      // If we deleted the active preset, fetch and activate another one
      if (colors?.id === presetId) {
        await fetchColors()
      }

      await fetchSavedPresets()
      setSuccess(true)
    } catch (err) {
      console.error('Error deleting preset:', err)
      setError(`Failed to delete preset: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setDeletingId(null)
    }
  }

  const clearCache = () => {
    if (typeof window !== 'undefined') {
      // Clear all cached color data
      localStorage.removeItem('activeMenuColors')
      
      // Dispatch events to trigger refresh
      window.dispatchEvent(new Event('themeUpdated'))
      
      // Add a small delay before force refresh to ensure changes propagate
      setTimeout(() => {
        window.dispatchEvent(new Event('forceThemeRefresh'))
      }, 100)
    }
  }

  const getDefaultColors = (): MenuColors => ({
    preset_name: 'Custom',
    main_background_color: '#000000',
    main_background_type: 'gradient',
    main_background_gradient: 'linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #1a1a1a 50%, #0a0a0a 75%, #000000 100%)',
    primary_text_color: '#f2f2f7',
    secondary_text_color: '#8e8e93',
    table_header_bg: '#1c1c1e',
    table_row_even_bg: '#0a0a0a',
    table_row_odd_bg: '#000000',
    table_row_hover_bg: '#2c2c2e',
    table_border_color: '#38383a',
    section_indica_bg: '#1c1c1e',
    section_indica_gradient_start: '#1c1c1e',
    section_indica_gradient_end: '#3a3a3c',
    section_indica_text: '#ffffff',
    section_sativa_bg: '#2c2c2e',
    section_sativa_gradient_start: '#2c2c2e',
    section_sativa_gradient_end: '#48484a',
    section_sativa_text: '#ffffff',
    section_hybrid_bg: '#1a1a1c',
    section_hybrid_gradient_start: '#1a1a1c',
    section_hybrid_gradient_end: '#3a3a3c',
    section_hybrid_text: '#ffffff',
    section_other_bg: '#1f1f1f',
    section_other_gradient_start: '#1f1f1f',
    section_other_gradient_end: '#3a3a3a',
    section_other_text: '#ffffff',
    thca_percent_color: '#4ade80',
    delta9_percent_color: '#60a5fa',
    product_count_bg: '#000000',
    product_count_text: '#ffffff',
    use_gradient_headers: true,
    header_blur_effect: true,
    row_hover_lift: true,
    show_row_borders: true,
    row_border_style: 'solid',
    row_border_width: 1,
  })

  const handleColorChange = (field: keyof MenuColors, value: any) => {
    if (!colors) return
    setColors({ ...colors, [field]: value })
    setSuccess(false)
  }

  const applyPreset = (preset: typeof presets[0]) => {
    if (!colors) return
    setColors({
      ...colors,
      ...preset.colors,
    })
    setSuccess(false)
  }

  const buildGradient = () => {
    if (!colors) return
    
    // Build gradient from background color with variations
    const baseColor = colors.main_background_color
    const gradient = `linear-gradient(135deg, ${baseColor} 0%, ${lightenColor(baseColor, 10)} 25%, ${lightenColor(baseColor, 20)} 50%, ${lightenColor(baseColor, 10)} 75%, ${baseColor} 100%)`
    
    setColors({
      ...colors,
      main_background_type: 'gradient',
      main_background_gradient: gradient
    })
  }

  // Helper function to lighten a hex color
  const lightenColor = (color: string, percent: number) => {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
  }

  const saveColors = async () => {
    if (!colors) return

    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      // First, deactivate all existing color schemes
      const { error: deactivateError } = await supabase
        .from('menu_colors')
        .update({ is_active: false })
        .neq('id', '00000000-0000-0000-0000-000000000000') // Update all rows

      if (deactivateError) {
        console.error('Error deactivating colors:', deactivateError)
      }

      // Insert new color scheme or update existing one
      const colorData = {
        ...colors,
        is_active: true,
        updated_at: new Date().toISOString()
      }

      let saveResult
      
      if (colors.id) {
        // Update existing
        saveResult = await supabase
          .from('menu_colors')
          .update(colorData)
          .eq('id', colors.id)
          .select()
          .single()
      } else {
        // Create new
        delete colorData.id // Remove undefined id
        saveResult = await supabase
          .from('menu_colors')
          .insert(colorData)
          .select()
          .single()
      }

      if (saveResult.error) throw saveResult.error

      setColors(saveResult.data)
      setSuccess(true)
      await fetchSavedPresets()

      // Clear cache to ensure changes are reflected
      clearCache()
    } catch (err) {
      console.error('Error saving colors:', err)
      setError(`Failed to save color settings: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const loadPreset = async (preset: MenuColors) => {
    try {
      // Deactivate all
      await supabase
        .from('menu_colors')
        .update({ is_active: false })
        .neq('id', '00000000-0000-0000-0000-000000000000')

      // Activate selected preset
      const { error } = await supabase
        .from('menu_colors')
        .update({ is_active: true })
        .eq('id', preset.id)

      if (error) throw error

      setColors(preset)
      setSuccess(true)

      // Clear cache to ensure changes are reflected
      clearCache()
    } catch (err) {
      console.error('Error loading preset:', err)
      setError('Failed to load preset')
    }
  }

  if (loading) {
    return <LoadingSpinner message="Loading color settings..." />
  }

  const setupDatabase = async () => {
    try {
      setSaving(true)
      setError(null)
      
      const response = await fetch('/api/setup-colors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Setup failed')
      }
      
      setSuccess(true)
      await fetchColors()
      await fetchSavedPresets()
    } catch (err) {
      console.error('Setup error:', err)
      setError(`Setup failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  if (!colors) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Menu Color Customization</h2>
          <p className="text-gray-400 mb-4">Database setup required</p>
          
          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-4">
              <p className="text-red-200">{error}</p>
            </div>
          )}
          
          <div className="bg-yellow-900/50 border border-yellow-500 rounded-lg p-4 mb-4">
            <p className="text-yellow-200 mb-2">
              The color customization table needs to be set up in your database.
            </p>
            <p className="text-yellow-200 text-sm mb-2">
              Option 1: Run <code className="bg-black/30 px-1 rounded">complete-menu-colors-setup.sql</code> in your Supabase SQL Editor
            </p>
            <p className="text-yellow-200 text-sm">
              Option 2: Try the automatic setup button below
            </p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={setupDatabase}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded transition-colors"
            >
              {saving ? 'Setting up...' : 'Try Automatic Setup'}
            </button>
            
            <button
              onClick={() => setColors(getDefaultColors())}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
            >
              Use Default Colors (No Save)
            </button>
          </div>
          
          {success && (
            <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 mt-4">
              <p className="text-green-200">Setup completed successfully!</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Menu Color Customization</h2>
            <p className="text-gray-400">Customize every aspect of your menu's appearance</p>
          </div>
          <button
            onClick={() => {
              clearCache()
              window.location.reload()
            }}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors text-sm"
            title="Force refresh all menus"
          >
            🔄 Refresh Menus
          </button>
        </div>
      </div>

      {/* Presets */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Presets</h3>
        <div className="grid grid-cols-3 gap-4">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 text-center"
            >
              <div className="text-white font-medium">{preset.name}</div>
              <div className="flex gap-1 mt-2 justify-center">
                <div
                  className="w-6 h-6 rounded"
                  style={{ 
                    background: preset.colors.main_background_type === 'gradient' && preset.colors.main_background_gradient 
                      ? preset.colors.main_background_gradient 
                      : preset.colors.main_background_color 
                  }}
                />
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: preset.colors.primary_text_color }}
                />
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: preset.colors.table_header_bg }}
                />
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: preset.colors.section_indica_gradient_end }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-gray-700">
        <button
          onClick={() => setActiveSection('general')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === 'general'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          General Colors
        </button>
        <button
          onClick={() => setActiveSection('sections')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === 'sections'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Section Headers
        </button>
        <button
          onClick={() => setActiveSection('special')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === 'special'
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Special Elements
        </button>
      </div>

      {/* Color Settings */}
      <div className="bg-gray-800 rounded-lg p-6">
        {activeSection === 'general' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">General Colors</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <ColorInput
                label="Main Background"
                value={colors.main_background_color}
                onChange={(v) => handleColorChange('main_background_color', v)}
                description="Primary background color for the menu and header"
              />
              
              <ColorInput
                label="Primary Text"
                value={colors.primary_text_color}
                onChange={(v) => handleColorChange('primary_text_color', v)}
                description="Main text color throughout the menu"
              />
              
              <ColorInput
                label="Secondary Text"
                value={colors.secondary_text_color}
                onChange={(v) => handleColorChange('secondary_text_color', v)}
                description="Used for less important text"
              />
              
              <ColorInput
                label="Table Header Background"
                value={colors.table_header_bg}
                onChange={(v) => handleColorChange('table_header_bg', v)}
                description="Background for table headers"
              />
              
              <ColorInput
                label="Even Row Background"
                value={colors.table_row_even_bg}
                onChange={(v) => handleColorChange('table_row_even_bg', v)}
                description="Background for even-numbered rows"
              />
              
              <ColorInput
                label="Odd Row Background"
                value={colors.table_row_odd_bg}
                onChange={(v) => handleColorChange('table_row_odd_bg', v)}
                description="Background for odd-numbered rows"
              />
              
              <ColorInput
                label="Row Hover Background"
                value={colors.table_row_hover_bg}
                onChange={(v) => handleColorChange('table_row_hover_bg', v)}
                description="Background when hovering over rows"
              />
              
              <ColorInput
                label="Table Border"
                value={colors.table_border_color}
                onChange={(v) => handleColorChange('table_border_color', v)}
                description="Color for table borders"
              />
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={colors.main_background_type === 'gradient'}
                  onChange={(e) => {
                    handleColorChange('main_background_type', e.target.checked ? 'gradient' : 'solid')
                    if (e.target.checked) buildGradient()
                  }}
                  className="rounded"
                />
                <span className="text-white">Use gradient background</span>
              </label>
              
              {colors.main_background_type === 'gradient' && (
                <button
                  onClick={buildGradient}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  Generate Gradient
                </button>
              )}
            </div>
          </div>
        )}

        {activeSection === 'sections' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Section Headers</h3>
            
            <div className="space-y-8">
              {/* Indica Section */}
              <div>
                <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  Indica Section
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <ColorInput
                    label="Gradient Start"
                    value={colors.section_indica_gradient_start}
                    onChange={(v) => handleColorChange('section_indica_gradient_start', v)}
                  />
                  <ColorInput
                    label="Gradient End"
                    value={colors.section_indica_gradient_end}
                    onChange={(v) => handleColorChange('section_indica_gradient_end', v)}
                  />
                  <ColorInput
                    label="Text Color"
                    value={colors.section_indica_text}
                    onChange={(v) => handleColorChange('section_indica_text', v)}
                  />
                </div>
              </div>

              {/* Sativa Section */}
              <div>
                <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  Sativa Section
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <ColorInput
                    label="Gradient Start"
                    value={colors.section_sativa_gradient_start}
                    onChange={(v) => handleColorChange('section_sativa_gradient_start', v)}
                  />
                  <ColorInput
                    label="Gradient End"
                    value={colors.section_sativa_gradient_end}
                    onChange={(v) => handleColorChange('section_sativa_gradient_end', v)}
                  />
                  <ColorInput
                    label="Text Color"
                    value={colors.section_sativa_text}
                    onChange={(v) => handleColorChange('section_sativa_text', v)}
                  />
                </div>
              </div>

              {/* Hybrid Section */}
              <div>
                <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  Hybrid Section
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <ColorInput
                    label="Gradient Start"
                    value={colors.section_hybrid_gradient_start}
                    onChange={(v) => handleColorChange('section_hybrid_gradient_start', v)}
                  />
                  <ColorInput
                    label="Gradient End"
                    value={colors.section_hybrid_gradient_end}
                    onChange={(v) => handleColorChange('section_hybrid_gradient_end', v)}
                  />
                  <ColorInput
                    label="Text Color"
                    value={colors.section_hybrid_text}
                    onChange={(v) => handleColorChange('section_hybrid_text', v)}
                  />
                </div>
              </div>

              {/* Other Section */}
              <div>
                <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                  Other Section
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <ColorInput
                    label="Gradient Start"
                    value={colors.section_other_gradient_start}
                    onChange={(v) => handleColorChange('section_other_gradient_start', v)}
                  />
                  <ColorInput
                    label="Gradient End"
                    value={colors.section_other_gradient_end}
                    onChange={(v) => handleColorChange('section_other_gradient_end', v)}
                  />
                  <ColorInput
                    label="Text Color"
                    value={colors.section_other_text}
                    onChange={(v) => handleColorChange('section_other_text', v)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={colors.use_gradient_headers}
                  onChange={(e) => handleColorChange('use_gradient_headers', e.target.checked)}
                  className="rounded"
                />
                <span className="text-white">Use gradient headers</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={colors.header_blur_effect}
                  onChange={(e) => handleColorChange('header_blur_effect', e.target.checked)}
                  className="rounded"
                />
                <span className="text-white">Enable blur effect</span>
              </label>
            </div>
          </div>
        )}

        {activeSection === 'special' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Special Elements</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <ColorInput
                label="THCA Percentage"
                value={colors.thca_percent_color}
                onChange={(v) => handleColorChange('thca_percent_color', v)}
                description="Color for THCA percentage display"
              />
              
              <ColorInput
                label="Delta-9 Percentage"
                value={colors.delta9_percent_color}
                onChange={(v) => handleColorChange('delta9_percent_color', v)}
                description="Color for Delta-9 percentage display"
              />
              
              <ColorInput
                label="Product Count Background"
                value={colors.product_count_bg}
                onChange={(v) => handleColorChange('product_count_bg', v)}
                description="Background for product count badge"
              />
              
              <ColorInput
                label="Product Count Text"
                value={colors.product_count_text}
                onChange={(v) => handleColorChange('product_count_text', v)}
                description="Text color for product count badge"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={colors.row_hover_lift}
                  onChange={(e) => handleColorChange('row_hover_lift', e.target.checked)}
                  className="rounded"
                />
                <span className="text-white">Enable hover lift effect</span>
              </label>
              
              <div className="space-y-4">
                <h4 className="text-white font-medium">Row Borders</h4>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={colors.show_row_borders}
                    onChange={(e) => handleColorChange('show_row_borders', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-white">Show borders between products</span>
                </label>
                
                {colors.show_row_borders && (
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-300">Border Style</label>
                      <select
                        value={colors.row_border_style}
                        onChange={(e) => handleColorChange('row_border_style', e.target.value)}
                        className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                      </select>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-300">Border Width (px)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={colors.row_border_width}
                        onChange={(e) => handleColorChange('row_border_width', parseInt(e.target.value) || 1)}
                        className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Background Type Toggle */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Background Style</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="bgType"
                value="solid"
                checked={colors.main_background_type === 'solid'}
                onChange={() => handleColorChange('main_background_type', 'solid')}
                className="text-blue-600"
              />
              <span className="text-white">Solid Color</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="bgType"
                value="gradient"
                checked={colors.main_background_type === 'gradient'}
                onChange={() => handleColorChange('main_background_type', 'gradient')}
                className="text-blue-600"
              />
              <span className="text-white">Gradient</span>
            </label>
          </div>
          
          {colors.main_background_type === 'gradient' && (
            <div className="space-y-4">
              <button
                onClick={buildGradient}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors text-sm"
              >
                Generate Gradient from Background Color
              </button>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">
                  Custom Gradient CSS
                </label>
                <textarea
                  value={colors.main_background_gradient || ''}
                  onChange={(e) => handleColorChange('main_background_gradient', e.target.value)}
                  className="px-3 py-2 bg-gray-900 border border-gray-600 rounded text-white text-sm font-mono"
                  placeholder="linear-gradient(135deg, #000000 0%, #1a1a1a 100%)"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Save Color Scheme</h3>
            <p className="text-gray-400 text-sm mt-1">
              Save your current color configuration
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={colors.preset_name || 'Custom'}
              onChange={(e) => handleColorChange('preset_name', e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              placeholder="Preset name"
            />
            
            <button
              onClick={saveColors}
              disabled={saving}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded transition-colors font-medium"
            >
              {saving ? 'Saving...' : 'Save Colors'}
            </button>
          </div>
        </div>
        
        {success && (
          <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 mt-4">
            <p className="text-green-200">Colors saved successfully!</p>
            <p className="text-green-200 text-sm mt-1">
              Changes are now active. Open any menu page to see the updates.
            </p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mt-4">
            <p className="text-red-200">{error}</p>
          </div>
        )}
      </div>

      {/* Saved Presets */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Saved Color Schemes</h3>
          <button
            onClick={() => setShowCreateNew(!showCreateNew)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
          >
            + New Scheme
          </button>
        </div>

        {/* Create New Preset Form */}
        {showCreateNew && (
          <div className="mb-4 p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="Enter scheme name..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                onKeyPress={(e) => e.key === 'Enter' && createNewPreset()}
              />
              <button
                onClick={createNewPreset}
                disabled={!newPresetName.trim() || saving}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowCreateNew(false)
                  setNewPresetName('')
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {savedPresets.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {savedPresets.map((preset) => (
              <div
                key={preset.id}
                className={`p-4 bg-gray-700 rounded-lg transition-all duration-200 ${
                  preset.is_active ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 
                    className="text-white font-medium cursor-pointer hover:text-blue-400"
                    onClick={() => loadPreset(preset)}
                  >
                    {preset.preset_name}
                  </h4>
                  <div className="flex items-center gap-2">
                    {preset.is_active && (
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Active</span>
                    )}
                    {!preset.is_active && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deletePreset(preset.id!)
                        }}
                        disabled={deletingId === preset.id}
                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                        title="Delete scheme"
                      >
                        {deletingId === preset.id ? '...' : '🗑️'}
                      </button>
                    )}
                  </div>
                </div>
                <div 
                  className="flex gap-1 cursor-pointer"
                  onClick={() => loadPreset(preset)}
                >
                  <div
                    className="w-8 h-8 rounded"
                    style={{ 
                      background: preset.main_background_type === 'gradient' && preset.main_background_gradient 
                        ? preset.main_background_gradient 
                        : preset.main_background_color 
                    }}
                  />
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: preset.primary_text_color }}
                  />
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: preset.table_header_bg }}
                  />
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: preset.section_indica_gradient_end }}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Click to activate
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No saved color schemes yet.</p>
        )}</div>
    </div>
  )
} 