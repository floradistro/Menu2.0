'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { formatCategory } from '@/lib/utils'

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
        .eq('product_category', formatCategory(category))
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
    return <LoadingSpinner message="Loading menu..." />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  if (products.length === 0) {
    return <LoadingSpinner message="No products available" />
  }

  const isFlowerCategory = formatCategory(category) === 'Flower'

  // Group products by strain type
  const groupedProducts = products.reduce((acc, product) => {
    const strainType = product.strain_type || 'Other'
    if (!acc[strainType]) {
      acc[strainType] = []
    }
    acc[strainType].push(product)
    return acc
  }, {} as Record<string, Product[]>)

  // Define section order and styling
  const sectionConfig = {
    'Indica': { 
      color: 'from-purple-600 to-purple-800',
      textColor: 'text-purple-300',
      bgColor: 'bg-purple-900/20'
    },
    'Sativa': { 
      color: 'from-orange-600 to-orange-800',
      textColor: 'text-orange-300',
      bgColor: 'bg-orange-900/20'
    },
    'Hybrid': { 
      color: 'from-blue-600 to-blue-800',
      textColor: 'text-blue-300',
      bgColor: 'bg-blue-900/20'
    },
    'Sativa-dominant Hybrid': { 
      color: 'from-orange-500 to-blue-600',
      textColor: 'text-orange-300',
      bgColor: 'bg-gradient-to-r from-orange-900/10 to-blue-900/10'
    },
    'Indica-dominant Hybrid': { 
      color: 'from-purple-500 to-blue-600',
      textColor: 'text-purple-300',
      bgColor: 'bg-gradient-to-r from-purple-900/10 to-blue-900/10'
    }
  }

  const renderProductTable = (products: Product[]) => (
    <table className="w-full">
      <thead className="bg-gray-900/70 border-b border-gray-700/50">
        <tr>
          <th className="text-left py-2 px-4 text-lg font-semibold text-gray-200 w-3/5">
            <div className="grid grid-cols-12 items-center">
              <div className="col-span-5">Product</div>
              <div className="col-span-7 text-base font-medium text-gray-400">Lineage</div>
            </div>
          </th>
          {isFlowerCategory && (
            <th className="text-left py-2 px-3 text-lg font-medium text-gray-300 w-1/5">
              Terpene
            </th>
          )}
          {!isFlowerCategory && (
            <th className="text-left py-2 px-3 text-lg font-medium text-gray-300 w-1/5">
              Strength
            </th>
          )}
          <th className="text-right py-2 px-3 text-lg font-medium text-gray-300 w-1/5">
            Potency
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-700/40">
        {products.map((product) => (
          <tr 
            key={product.id} 
            className="hover:bg-gray-700/20 transition-all duration-200"
          >
            <td className="py-1 px-4">
              <div className="grid grid-cols-12 items-center">
                <div className="text-2xl font-medium text-gray-100 col-span-5">
                  {product.product_name}
                </div>
                <div className="text-base text-gray-400 col-span-7">
                  {product.strain_cross || ''}
                </div>
              </div>
              {!isFlowerCategory && (
                <div className="flex items-center text-base text-gray-400">
                  {product.terpene && <span>{product.terpene}</span>}
                  {product.description && product.terpene && <span className="mx-1">•</span>}
                  {product.description && <span>{product.description}</span>}
                </div>
              )}
            </td>
            {isFlowerCategory && (
              <td className="py-1 px-3 text-left">
                <span className="text-xl font-medium text-gray-200">
                  {product.terpene || '-'}
                </span>
              </td>
            )}
            {!isFlowerCategory && (
              <td className="py-1 px-3 text-left">
                <span className="text-xl font-semibold text-gray-100">
                  {product.strength || '-'}
                </span>
              </td>
            )}
            <td className="py-1 px-3 text-right">
              <div className="flex flex-col items-end">
                {isFlowerCategory ? (
                  // For flower products: only show THCA, not Delta-9
                  <>
                    {product.thca_percent && (
                      <span className="text-lg font-bold text-green-300">
                        THCA {product.thca_percent}%
                      </span>
                    )}
                    {!product.thca_percent && (
                      <span className="text-gray-500">-</span>
                    )}
                  </>
                ) : (
                  // For other products: show both THCA and Delta-9 as before
                  <>
                    {product.thca_percent && (
                      <span className="text-lg font-bold text-green-300">
                        THCA {product.thca_percent}%
                      </span>
                    )}
                    {product.delta9_percent && (
                      <span className="text-lg font-bold text-blue-300">
                        Δ9 {product.delta9_percent}%
                      </span>
                    )}
                    {!product.thca_percent && !product.delta9_percent && (
                      <span className="text-gray-500">-</span>
                    )}
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <div className="w-full space-y-8">
      {Object.entries(groupedProducts).map(([strainType, products]) => {
        const config = sectionConfig[strainType as keyof typeof sectionConfig] || {
          color: 'from-gray-600 to-gray-800',
          textColor: 'text-gray-300',
          bgColor: 'bg-gray-900/20'
        }
        
        return (
          <div key={strainType} className="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-lg overflow-hidden">
            {/* Section Header */}
            <div className={`bg-gradient-to-r ${config.color} px-6 py-4`}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-thin text-white tracking-wider font-sf-pro-display">
                  {strainType.toUpperCase()}
                </h2>
                <div className="text-white/80 text-sm font-medium">
                  {products.length} {products.length === 1 ? 'strain' : 'strains'}
                </div>
              </div>
            </div>
            
            {/* Products Table */}
            <div className="overflow-hidden">
              {renderProductTable(products)}
            </div>
          </div>
        )
      })}
    </div>
  )
} 