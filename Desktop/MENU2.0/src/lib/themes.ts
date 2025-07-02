import { supabase } from './supabase'

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

export interface AvailableTheme {
  theme_name: string
  description: string
  is_active: boolean
  updated_at: string
}

export const defaultTheme: ThemeColors = {
  theme_name: 'Apple Dark',
  description: 'Classic macOS dark mode with deep blacks and subtle grays',
  background_color: 'linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #1a1a1a 50%, #0a0a0a 75%, #000000 100%)',
  header_indica_color: 'linear-gradient(135deg, #1c1c1e 0%, #2c2c2e 50%, #3a3a3c 100%)',
  header_sativa_color: 'linear-gradient(135deg, #2c2c2e 0%, #3a3a3c 50%, #48484a 100%)',
  header_hybrid_color: 'linear-gradient(135deg, #1a1a1c 0%, #2c2c2e 50%, #3a3a3c 100%)',
  text_color: '#f2f2f7',
  table_header_bg: '#1c1c1e',
  table_row_hover: '#2c2c2e',
  is_active: true
}

export async function getActiveTheme(): Promise<ThemeColors> {
  try {
    // Check localStorage first for performance
    if (typeof window !== 'undefined') {
      const localTheme = localStorage.getItem('activeMenuTheme')
      if (localTheme) {
        try {
          const parsed = JSON.parse(localTheme)
          // Validate that it has the required properties
          if (parsed.background_color && parsed.text_color) {
            return parsed
          }
        } catch (e) {
          console.warn('Invalid theme in localStorage, removing:', e)
          localStorage.removeItem('activeMenuTheme')
        }
      }
    }

    // Try to get active theme from database
    const { data, error } = await supabase
      .from('themes')
      .select('*')
      .eq('is_active', true)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching active theme:', error)
      // Try to get any theme as fallback
      const { data: fallbackData } = await supabase
        .from('themes')
        .select('*')
        .limit(1)
        .single()
      
      const theme = fallbackData || defaultTheme
      if (typeof window !== 'undefined') {
        localStorage.setItem('activeMenuTheme', JSON.stringify(theme))
      }
      return theme
    }

    const theme = data || defaultTheme
    
    // Cache the theme in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeMenuTheme', JSON.stringify(theme))
    }

    return theme
  } catch (err) {
    console.error('Error fetching theme:', err)
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeMenuTheme', JSON.stringify(defaultTheme))
    }
    return defaultTheme
  }
}

export async function getAllThemes(): Promise<AvailableTheme[]> {
  try {
    const { data, error } = await supabase
      .from('themes')
      .select('theme_name, description, is_active, updated_at')
      .order('is_active', { ascending: false })
      .order('theme_name', { ascending: true })

    if (error) {
      console.error('Error fetching themes:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error fetching all themes:', err)
    return []
  }
}

export async function switchToTheme(themeName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('switch_theme', {
      theme_name_param: themeName
    })

    if (error) {
      console.error('Error switching theme:', error)
      return false
    }

    // Clear localStorage cache
    if (typeof window !== 'undefined') {
      localStorage.removeItem('activeMenuTheme')
      
      // Force a complete page reload to ensure all components get the new theme
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }

    return data || false
  } catch (err) {
    console.error('Error switching theme:', err)
    return false
  }
}

// Legacy function for backward compatibility
export async function getTheme(): Promise<ThemeColors> {
  return getActiveTheme()
}

export function getSectionConfig(strainType: string, theme: ThemeColors) {
  const baseConfig = {
    textColor: 'text-white',
    bgColor: 'bg-black/90'
  }

  switch (strainType) {
    case 'Indica':
      return {
        ...baseConfig,
        color: theme.header_indica_color,
      }
    case 'Sativa':
      return {
        ...baseConfig,
        color: theme.header_sativa_color,
      }
    case 'Hybrid':
      return {
        ...baseConfig,
        color: theme.header_hybrid_color,
      }
    case 'Sativa-dominant Hybrid':
      return {
        ...baseConfig,
        color: `linear-gradient(to right, ${theme.header_sativa_color}, ${theme.header_hybrid_color})`,
      }
    case 'Indica-dominant Hybrid':
      return {
        ...baseConfig,
        color: `linear-gradient(to right, ${theme.header_indica_color}, ${theme.header_hybrid_color})`,
      }
    default:
      // Default section gets a neutral dark gradient
      return {
        ...baseConfig,
        color: 'linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 50%, #3a3a3a 100%)',
      }
  }
}

export function applyThemeToDocument(theme: ThemeColors) {
  if (typeof document !== 'undefined') {
    // Handle gradients for CSS custom properties
    const isGradient = theme.background_color.includes('gradient')
    if (isGradient) {
      document.documentElement.style.setProperty('--theme-background', theme.background_color)
    } else {
      document.documentElement.style.setProperty('--theme-background', theme.background_color)
    }
    
    document.documentElement.style.setProperty('--theme-text', theme.text_color)
    document.documentElement.style.setProperty('--theme-table-header', theme.table_header_bg)
    document.documentElement.style.setProperty('--theme-table-hover', theme.table_row_hover)
    document.documentElement.style.setProperty('--theme-indica', theme.header_indica_color)
    document.documentElement.style.setProperty('--theme-sativa', theme.header_sativa_color)
    document.documentElement.style.setProperty('--theme-hybrid', theme.header_hybrid_color)
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
export function getSectionHeaderStyle(color: string): React.CSSProperties {
  if (isGradientColor(color)) {
    return {
      background: color,
      backgroundAttachment: 'fixed'
    }
  } else {
    return {
      backgroundColor: color
    }
  }
}

// Enhanced function to get alternating row styles for improved readability
export function getAlternatingRowStyle(index: number, theme: ThemeColors): React.CSSProperties {
  // Create subtle variations for better readability
  const baseOpacity = index % 2 === 0 ? 0.8 : 0.9
  const additionalOpacity = Math.sin(index * 0.5) * 0.05 // Very subtle wave pattern
  
  return {
    backgroundColor: index % 2 === 0 
      ? `rgba(10, 10, 10, ${baseOpacity + additionalOpacity})` 
      : `rgba(0, 0, 0, ${baseOpacity + additionalOpacity})`,
    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)' // Apple's signature easing
  }
}

// Apple-inspired hover effect
export function getHoverRowStyle(theme: ThemeColors): React.CSSProperties {
  return {
    backgroundColor: theme.table_row_hover,
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)'
  }
} 