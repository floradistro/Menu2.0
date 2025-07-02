import { supabase } from './supabase'

export interface MenuColors {
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

// Backward compatibility - map old theme interface to new colors
export interface ThemeColors {
  id?: string
  theme_name?: string
  description?: string
  background_color: string
  header_indica_color: string
  header_sativa_color: string
  header_hybrid_color: string
  text_color: string
  table_header_bg: string
  table_row_hover: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export const defaultColors: MenuColors = {
  preset_name: 'Apple Dark',
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
  is_active: true
}

// Convert new colors to old theme format for backward compatibility
export function colorsToTheme(colors: MenuColors): ThemeColors {
  const background = colors.main_background_type === 'gradient' && colors.main_background_gradient
    ? colors.main_background_gradient
    : colors.main_background_color

  const headerIndica = colors.use_gradient_headers
    ? `linear-gradient(135deg, ${colors.section_indica_gradient_start} 0%, ${colors.section_indica_gradient_end} 100%)`
    : colors.section_indica_bg

  const headerSativa = colors.use_gradient_headers
    ? `linear-gradient(135deg, ${colors.section_sativa_gradient_start} 0%, ${colors.section_sativa_gradient_end} 100%)`
    : colors.section_sativa_bg

  const headerHybrid = colors.use_gradient_headers
    ? `linear-gradient(135deg, ${colors.section_hybrid_gradient_start} 0%, ${colors.section_hybrid_gradient_end} 100%)`
    : colors.section_hybrid_bg

  return {
    theme_name: colors.preset_name || 'Custom',
    description: 'Custom color scheme',
    background_color: background,
    header_indica_color: headerIndica,
    header_sativa_color: headerSativa,
    header_hybrid_color: headerHybrid,
    text_color: colors.primary_text_color,
    table_header_bg: colors.table_header_bg,
    table_row_hover: colors.table_row_hover_bg,
    is_active: colors.is_active
  }
}

export async function getActiveMenuColors(): Promise<MenuColors> {
  try {
    // Check localStorage first for performance
    if (typeof window !== 'undefined') {
      const localColors = localStorage.getItem('activeMenuColors')
      if (localColors) {
        try {
          const parsed = JSON.parse(localColors)
          // Validate that it has the required properties
          if (parsed.main_background_color && parsed.primary_text_color) {
            return parsed
          }
        } catch (e) {
          console.warn('Invalid colors in localStorage, removing:', e)
          localStorage.removeItem('activeMenuColors')
        }
      }
    }

    // Try to get active colors from database
    const { data, error } = await supabase
      .from('menu_colors')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching active menu colors:', error)
      // Try to get any colors as fallback
      const { data: fallbackData } = await supabase
        .from('menu_colors')
        .select('*')
        .limit(1)
        .single()
      
      const colors = fallbackData || defaultColors
      if (typeof window !== 'undefined') {
        localStorage.setItem('activeMenuColors', JSON.stringify(colors))
      }
      return colors
    }

    const colors = data || defaultColors
    
    // Cache the colors in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeMenuColors', JSON.stringify(colors))
    }

    return colors
  } catch (err) {
    console.error('Error fetching menu colors:', err)
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeMenuColors', JSON.stringify(defaultColors))
    }
    return defaultColors
  }
}

// Backward compatibility function that returns theme format
export async function getActiveTheme(): Promise<ThemeColors> {
  const colors = await getActiveMenuColors()
  return colorsToTheme(colors)
}

// Legacy alias
export const getTheme = getActiveTheme

// Default theme for backward compatibility
export const defaultTheme: ThemeColors = colorsToTheme(defaultColors)

export function getSectionConfig(strainType: string, colors: MenuColors) {
  const baseConfig = {
    textColor: 'text-white',
    bgColor: 'bg-black/90'
  }

  let color: string
  let textColor: string = colors.section_indica_text // Default

  switch (strainType) {
    case 'Indica':
      textColor = colors.section_indica_text
      color = colors.use_gradient_headers
        ? `linear-gradient(135deg, ${colors.section_indica_gradient_start} 0%, ${colors.section_indica_gradient_end} 100%)`
        : colors.section_indica_bg
      break
    case 'Sativa':
      textColor = colors.section_sativa_text
      color = colors.use_gradient_headers
        ? `linear-gradient(135deg, ${colors.section_sativa_gradient_start} 0%, ${colors.section_sativa_gradient_end} 100%)`
        : colors.section_sativa_bg
      break
    case 'Hybrid':
      textColor = colors.section_hybrid_text
      color = colors.use_gradient_headers
        ? `linear-gradient(135deg, ${colors.section_hybrid_gradient_start} 0%, ${colors.section_hybrid_gradient_end} 100%)`
        : colors.section_hybrid_bg
      break
    case 'Sativa-dominant Hybrid':
      textColor = colors.section_hybrid_text
      color = colors.use_gradient_headers
        ? `linear-gradient(to right, linear-gradient(135deg, ${colors.section_sativa_gradient_start} 0%, ${colors.section_sativa_gradient_end} 100%), linear-gradient(135deg, ${colors.section_hybrid_gradient_start} 0%, ${colors.section_hybrid_gradient_end} 100%))`
        : `linear-gradient(to right, ${colors.section_sativa_bg}, ${colors.section_hybrid_bg})`
      break
    case 'Indica-dominant Hybrid':
      textColor = colors.section_hybrid_text
      color = colors.use_gradient_headers
        ? `linear-gradient(to right, linear-gradient(135deg, ${colors.section_indica_gradient_start} 0%, ${colors.section_indica_gradient_end} 100%), linear-gradient(135deg, ${colors.section_hybrid_gradient_start} 0%, ${colors.section_hybrid_gradient_end} 100%))`
        : `linear-gradient(to right, ${colors.section_indica_bg}, ${colors.section_hybrid_bg})`
      break
    default:
      textColor = colors.section_other_text
      color = colors.use_gradient_headers
        ? `linear-gradient(135deg, ${colors.section_other_gradient_start} 0%, ${colors.section_other_gradient_end} 100%)`
        : colors.section_other_bg
      break
  }

  return {
    ...baseConfig,
    color,
    textColor: `#${textColor.replace('#', '')}`, // Ensure hex format
  }
}

export function applyColorsToDocument(colors: MenuColors) {
  if (typeof document !== 'undefined') {
    // Handle background
    const background = colors.main_background_type === 'gradient' && colors.main_background_gradient
      ? colors.main_background_gradient
      : colors.main_background_color
    
    document.documentElement.style.setProperty('--theme-background', background)
    document.documentElement.style.setProperty('--theme-text', colors.primary_text_color)
    document.documentElement.style.setProperty('--theme-text-secondary', colors.secondary_text_color)
    document.documentElement.style.setProperty('--theme-table-header', colors.table_header_bg)
    document.documentElement.style.setProperty('--theme-table-hover', colors.table_row_hover_bg)
    document.documentElement.style.setProperty('--theme-table-border', colors.table_border_color)
    
    // Section colors
    const indicaColor = colors.use_gradient_headers
      ? `linear-gradient(135deg, ${colors.section_indica_gradient_start} 0%, ${colors.section_indica_gradient_end} 100%)`
      : colors.section_indica_bg
    
    const sativaColor = colors.use_gradient_headers
      ? `linear-gradient(135deg, ${colors.section_sativa_gradient_start} 0%, ${colors.section_sativa_gradient_end} 100%)`
      : colors.section_sativa_bg
    
    const hybridColor = colors.use_gradient_headers
      ? `linear-gradient(135deg, ${colors.section_hybrid_gradient_start} 0%, ${colors.section_hybrid_gradient_end} 100%)`
      : colors.section_hybrid_bg
    
    document.documentElement.style.setProperty('--theme-indica', indicaColor)
    document.documentElement.style.setProperty('--theme-sativa', sativaColor)
    document.documentElement.style.setProperty('--theme-hybrid', hybridColor)
    
    // Special colors
    document.documentElement.style.setProperty('--theme-thca', colors.thca_percent_color)
    document.documentElement.style.setProperty('--theme-delta9', colors.delta9_percent_color)
  }
}

// Helper function to determine if a color value is a gradient
export function isGradientColor(color: string): boolean {
  return color.includes('gradient')
}

// Helper function to apply background style properly (handles both solid colors and gradients)
export function getBackgroundStyle(backgroundColor: string): React.CSSProperties {
  if (isGradientColor(backgroundColor)) {
    return {
      background: backgroundColor,
      minHeight: '100vh'
    }
  } else {
    return {
      backgroundColor: backgroundColor,
      minHeight: '100vh'
    }
  }
}

// Helper function to apply section header styles (handles gradients)
export function getSectionHeaderStyle(color: string, blur: boolean = true): React.CSSProperties {
  const style: React.CSSProperties = isGradientColor(color) 
    ? {
        background: color,
        backgroundAttachment: 'fixed'
      }
    : {
        backgroundColor: color
      }
  
  if (blur) {
    style.backdropFilter = 'blur(8px)'
  }
  
  return style
}

// Enhanced function to get alternating row styles for improved readability
export function getAlternatingRowStyle(index: number, colors: MenuColors): React.CSSProperties {
  const backgroundColor = index % 2 === 0 
    ? colors.table_row_even_bg 
    : colors.table_row_odd_bg
  
  return {
    backgroundColor,
    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)' // Apple's signature easing
  }
}

// Apple-inspired hover effect
export function getHoverRowStyle(colors: MenuColors): React.CSSProperties {
  const style: React.CSSProperties = {
    backgroundColor: colors.table_row_hover_bg,
    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)'
  }
  
  if (colors.row_hover_lift) {
    style.transform = 'translateY(-1px)'
    style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)'
  }
  
  return style
}

// Get row border styles
export function getRowBorderStyle(colors: MenuColors): React.CSSProperties {
  if (!colors.show_row_borders) {
    return {}
  }
  
  return {
    borderBottom: `${colors.row_border_width}px ${colors.row_border_style} ${colors.table_border_color}`,
  }
}

// Get table container border styles
export function getTableBorderStyle(colors: MenuColors): string {
  if (!colors.show_row_borders) {
    return ''
  }
  
  return `divide-y`
} 