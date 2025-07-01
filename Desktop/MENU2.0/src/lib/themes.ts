import { supabase } from './supabase'

export interface ThemeColors {
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

export const defaultTheme: ThemeColors = {
  background_color: '#1f2937',
  header_indica_color: '#9333ea',
  header_sativa_color: '#f97316',
  header_hybrid_color: '#3b82f6',
  text_color: '#f3f4f6',
  table_header_bg: '#111827',
  table_row_hover: '#374151'
}

export async function getTheme(): Promise<ThemeColors> {
  try {
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const localTheme = localStorage.getItem('menuTheme')
      if (localTheme) {
        return JSON.parse(localTheme)
      }
    }

    const { data, error } = await supabase
      .from('themes')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching theme from database:', error)
      // Save default theme to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('menuTheme', JSON.stringify(defaultTheme))
      }
      return defaultTheme
    }

    if (data && typeof window !== 'undefined') {
      // Cache the theme in localStorage
      localStorage.setItem('menuTheme', JSON.stringify(data))
    }

    return data || defaultTheme
  } catch (err) {
    console.error('Error fetching theme:', err)
    if (typeof window !== 'undefined') {
      localStorage.setItem('menuTheme', JSON.stringify(defaultTheme))
    }
    return defaultTheme
  }
}

export function getSectionConfig(strainType: string, theme: ThemeColors) {
  const baseConfig = {
    textColor: 'text-white',
    bgColor: 'bg-gray-800/90'
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
      return {
        ...baseConfig,
        color: '#6b7280',
      }
  }
}

export function applyThemeToDocument(theme: ThemeColors) {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--theme-background', theme.background_color)
    document.documentElement.style.setProperty('--theme-text', theme.text_color)
    document.documentElement.style.setProperty('--theme-table-header', theme.table_header_bg)
    document.documentElement.style.setProperty('--theme-table-hover', theme.table_row_hover)
    document.documentElement.style.setProperty('--theme-indica', theme.header_indica_color)
    document.documentElement.style.setProperty('--theme-sativa', theme.header_sativa_color)
    document.documentElement.style.setProperty('--theme-hybrid', theme.header_hybrid_color)
  }
} 