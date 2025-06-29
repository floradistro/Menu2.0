import { useState, useEffect } from 'react'
import { Product, MenuSettings } from '../supabase'

interface MenuData {
  products: Product[]
  grouped: {
    [category: string]: {
      [type: string]: Product[]
    }
  }
  settings: {
    display_config?: {
      font_size: number
      theme: string
      auto_refresh_interval: number
      display_effects: boolean
    }
    flipboard_messages?: {
      [key: string]: string[]
    }
  }
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useMenuData(): MenuData {
  const [products, setProducts] = useState<Product[]>([])
  const [grouped, setGrouped] = useState<MenuData['grouped']>({})
  const [settings, setSettings] = useState<MenuData['settings']>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch products and settings in parallel
      const [productsResponse, settingsResponse] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/menu-settings')
      ])

      if (!productsResponse.ok) {
        throw new Error(`Products API error: ${productsResponse.status}`)
      }

      if (!settingsResponse.ok) {
        throw new Error(`Settings API error: ${settingsResponse.status}`)
      }

      const productsData = await productsResponse.json()
      const settingsData = await settingsResponse.json()

      setProducts(productsData.products || [])
      setGrouped(productsData.grouped || {})
      setSettings(settingsData.settings || {})

    } catch (err) {
      console.error('Error fetching menu data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Set up auto-refresh if configured
    const refreshInterval = settings.display_config?.auto_refresh_interval || 30
    const interval = setInterval(fetchData, refreshInterval * 1000)

    return () => clearInterval(interval)
  }, [settings.display_config?.auto_refresh_interval])

  return {
    products,
    grouped,
    settings,
    loading,
    error,
    refetch: fetchData
  }
}

// Hook for specific category data
export function useCategoryData(category: 'flower' | 'vapes' | 'edibles') {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategoryData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/products?category=${category}&in_stock=true`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setProducts(data.products || [])

    } catch (err) {
      console.error(`Error fetching ${category} data:`, err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryData()
  }, [category])

  return {
    products,
    loading,
    error,
    refetch: fetchCategoryData
  }
} 