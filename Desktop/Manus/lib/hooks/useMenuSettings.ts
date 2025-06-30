import { useState, useEffect } from 'react'

interface MenuSettings {
  // Global Display Settings
  global_font_scale?: number
  global_theme?: string
  global_accent_color?: string
  global_background_style?: string
  
  // Layout Settings
  layout_columns_flower?: number
  layout_columns_vapes?: number
  layout_columns_edibles?: number
  layout_section_style?: string
  layout_header_style?: string
  layout_spacing?: string
  
  // Page-Specific Settings - Flower
  flower_show_thca?: boolean
  flower_show_terpenes?: boolean
  flower_show_effects?: boolean
  flower_effects_style?: string
  flower_group_by?: string
  flower_show_type_headers?: boolean
  flower_type_colors?: boolean
  
  // Page-Specific Settings - Vapes
  vapes_show_brand?: boolean
  vapes_show_battery?: boolean
  vapes_show_capacity?: boolean
  vapes_show_strain?: boolean
  vapes_layout_style?: string
  
  // Page-Specific Settings - Edibles
  edibles_show_dosage?: boolean
  edibles_show_ingredients?: boolean
  edibles_show_onset_time?: boolean
  edibles_dosage_unit?: string
  edibles_group_by?: string
  
  // Animation & Effects
  effects_flipboard_enabled?: boolean
  effects_flipboard_speed?: number
  effects_page_transitions?: boolean
  effects_hover_animations?: boolean
  effects_background_animation?: boolean
  
  // Menu Behavior
  menu_auto_refresh?: boolean
  menu_refresh_interval?: number
  menu_show_out_of_stock?: boolean
  menu_highlight_new?: boolean
  menu_new_product_days?: number
  
  // Special Features
  feature_font_size_control?: boolean
  feature_navigation_menu?: boolean
  feature_search?: boolean
  feature_filters?: boolean
  
  // Custom Messages
  message_no_products?: string
  message_loading?: string
  message_error?: string
}

export function useMenuSettings() {
  const [settings, setSettings] = useState<MenuSettings>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/menu-settings')
        
        if (!response.ok) {
          throw new Error('Failed to fetch settings')
        }
        
        const data = await response.json()
        setSettings(data.settings || {})
      } catch (err) {
        console.error('Error fetching menu settings:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading, error }
} 