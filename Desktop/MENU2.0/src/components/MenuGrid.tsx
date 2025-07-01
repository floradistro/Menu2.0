'use client'

import { useEffect, useState } from 'react'
import { supabase, Product } from '@/lib/supabase'

interface MenuGridProps {
  storeCode: string
  category: string
}

export default function MenuGrid({ storeCode, category }: MenuGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_code', storeCode.toUpperCase())
        .eq('product_category', category.charAt(0).toUpperCase() + category.slice(1))
        .order('product_name')

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchProducts, 60000)
    return () => clearInterval(interval)
  }, [storeCode, category])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400 text-xl">Loading menu...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400 text-xl">No products available</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6 hover:border-gray-600 transition-all duration-200"
          >
            <h3 className="text-xl font-medium text-gray-100 mb-2">
              {product.product_name}
            </h3>
            
            {product.strain_type && (
              <p className="text-sm text-gray-400 mb-2">
                {product.strain_type}
              </p>
            )}
            
            {product.strain_cross && (
              <p className="text-sm text-gray-500 mb-2">
                {product.strain_cross}
              </p>
            )}

            {product.terpene && (
              <p className="text-sm text-gray-500 mb-2">
                Terpene: {product.terpene}
              </p>
            )}

            {product.strength && (
              <p className="text-sm text-gray-400 mb-3">
                {product.strength}
              </p>
            )}
            
            <div className="flex items-center justify-between mb-3">
              {product.thca_percent && (
                <span className="text-sm font-medium text-gray-200">
                  THCA: {product.thca_percent}%
                </span>
              )}
              {product.delta9_percent && (
                <span className="text-sm font-medium text-gray-200">
                  Δ9: {product.delta9_percent}%
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-xs text-gray-400 mt-3">
                {product.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 