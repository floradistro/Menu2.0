'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { formatCategory } from '@/lib/utils'
import { 
  getActiveMenuColors, 
  defaultColors, 
  getSectionConfig, 
  MenuColors, 
  getBackgroundStyle, 
  getSectionHeaderStyle,
  getAlternatingRowStyle,
  getHoverRowStyle,
  getRowBorderStyle,
  getTableBorderStyle
} from '@/lib/menu-colors'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { ErrorMessage } from './ui/ErrorMessage'

interface MenuGridProps {
  storeCode: string
  category: string
  adminMode?: boolean
}

// Apple-style smooth text display component
interface SmoothTextDisplayProps {
  text: string
}

function SmoothTextDisplay({ text }: SmoothTextDisplayProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (text === displayText) return
    
    setIsTransitioning(true)
    
    // Fade out, change text, then fade in
    const timer = setTimeout(() => {
      setDisplayText(text)
      setIsTransitioning(false)
    }, 200) // Half of the transition duration

    return () => clearTimeout(timer)
  }, [text, displayText])

  return (
    <div className="relative min-h-[24px] flex items-center justify-center">
      <span 
        className={`
          transition-all duration-400 ease-out
          ${isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}
        `}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.4, 0.0, 0.2, 1)', // Apple's ease-out timing
        }}
      >
        {displayText || text}
      </span>
    </div>
  )
}

export default function MenuGrid({ storeCode, category, adminMode = false }: MenuGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [colors, setColors] = useState<MenuColors>(defaultColors)
  const [showLineage, setShowLineage] = useState(true)
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null)
  
  const isFlowerCategory = formatCategory(category) === 'Flower'
  const isVapeCategory = formatCategory(category) === 'Vape'
  const isEdibleCategory = formatCategory(category) === 'Edible'
  const isFlowerOrVape = isFlowerCategory || isVapeCategory

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

  const fetchColors = async () => {
    try {
      const colorData = await getActiveMenuColors()
      setColors(colorData)
    } catch (err) {
      console.error('Error fetching colors:', err)
      setColors(defaultColors)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchColors()
    
    // Listen for theme updates
    const handleThemeUpdate = () => {
      fetchColors()
    }
    
    // Listen for forced theme refresh
    const handleForceRefresh = () => {
      // Clear localStorage and fetch fresh colors
      if (typeof window !== 'undefined') {
        localStorage.removeItem('activeMenuColors')
      }
      fetchColors()
    }
    
    window.addEventListener('themeUpdated', handleThemeUpdate)
    window.addEventListener('forceThemeRefresh', handleForceRefresh)
    
    // Only auto-refresh in admin mode
    let interval: NodeJS.Timeout | null = null
    if (adminMode) {
      const refreshInterval = parseInt(process.env.NEXT_PUBLIC_REFRESH_INTERVAL || '60000')
      interval = setInterval(() => {
        fetchProducts()
        fetchColors()
      }, refreshInterval)
    }
    
    // Flip board effect for flower and vape categories - alternate between lineage and terpenes every 5 seconds
    const flipInterval = isFlowerOrVape ? setInterval(() => {
      setShowLineage(prev => !prev)
    }, 5000) : null
    
    return () => {
      if (interval) clearInterval(interval)
      if (flipInterval) clearInterval(flipInterval)
      window.removeEventListener('themeUpdated', handleThemeUpdate)
      window.removeEventListener('forceThemeRefresh', handleForceRefresh)
    }
  }, [storeCode, category, isFlowerOrVape, adminMode])

  if (loading) {
    return <LoadingSpinner message="Loading menu..." />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  if (products.length === 0) {
    return <LoadingSpinner message="No products available" />
  }

  // Group products by strain type
  const groupedProducts = products.reduce((acc, product) => {
    const strainType = product.strain_type || 'Other'
    if (!acc[strainType]) {
      acc[strainType] = []
    }
    acc[strainType].push(product)
    return acc
  }, {} as Record<string, Product[]>)

  const renderProductTable = (products: Product[]) => {
    // Special handling for edibles - only show Product, Description, and Strength
    if (isEdibleCategory) {
      return (
        <table className="w-full">
          <thead 
            className="border-b"
            style={{ 
              backgroundColor: colors.table_header_bg,
              borderColor: colors.table_border_color 
            }}
          >
            <tr>
              <th 
                className="text-left py-3 px-4 text-lg font-semibold w-2/5"
                style={{ color: colors.primary_text_color }}
              >
                Product
              </th>
              <th 
                className="text-left py-3 px-3 text-lg font-medium w-2/5"
                style={{ color: colors.primary_text_color }}
              >
                Description
              </th>
              <th 
                className="text-left py-3 px-3 text-lg font-medium w-1/5"
                style={{ color: colors.primary_text_color }}
              >
                Strength
              </th>
            </tr>
          </thead>
          <tbody className={getTableBorderStyle(colors)} style={{ borderColor: colors.table_border_color }}>
            {products.map((product, index) => (
              <tr 
                key={product.id} 
                className="transition-all duration-200"
                style={{
                  ...(hoveredRowIndex === index 
                    ? getHoverRowStyle(colors)
                    : getAlternatingRowStyle(index, colors)),
                  ...getRowBorderStyle(colors)
                }}
                onMouseEnter={() => setHoveredRowIndex(index)}
                onMouseLeave={() => setHoveredRowIndex(null)}
              >
                <td className="py-2 px-4">
                  <div 
                    className="text-3xl font-medium"
                    style={{ color: colors.primary_text_color }}
                  >
                    {product.product_name}
                  </div>
                </td>
                <td className="py-2 px-3">
                  <span 
                    className="text-lg"
                    style={{ color: colors.primary_text_color }}
                  >
                    {product.description || '-'}
                  </span>
                </td>
                <td className="py-2 px-3 text-left">
                  <span 
                    className="text-2xl font-semibold"
                    style={{ color: colors.primary_text_color }}
                  >
                    {product.strength || '-'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    // Original table structure for other categories with enhanced readability
    return (
      <table className="w-full">
        <thead 
          className="border-b"
          style={{ 
            backgroundColor: colors.table_header_bg,
            borderColor: colors.table_border_color 
          }}
        >
          <tr>
            <th 
              className="text-left py-3 px-4 text-lg font-semibold w-3/5"
              style={{ color: colors.primary_text_color }}
            >
              <div className="grid grid-cols-12 items-center">
                <div className="col-span-5">Product</div>
                <div className="col-span-7 text-base font-medium opacity-80 text-center">
                  {isFlowerOrVape ? (showLineage ? 'Lineage' : 'Terpene') : 'Lineage'}
                </div>
              </div>
            </th>

            {!isFlowerOrVape && (
              <th 
                className="text-left py-3 px-3 text-lg font-medium w-1/5"
                style={{ color: colors.primary_text_color }}
              >
                Strength
              </th>
            )}
            <th 
              className="text-right py-3 px-3 text-lg font-medium w-1/5"
              style={{ color: colors.primary_text_color }}
            >
              THCA %
            </th>
          </tr>
        </thead>
        <tbody className={getTableBorderStyle(colors)} style={{ borderColor: colors.table_border_color }}>
          {products.map((product, index) => (
            <tr 
              key={product.id} 
              className="transition-all duration-200"
              style={{
                ...(hoveredRowIndex === index 
                  ? getHoverRowStyle(colors)
                  : getAlternatingRowStyle(index, colors)),
                ...getRowBorderStyle(colors)
              }}
              onMouseEnter={() => setHoveredRowIndex(index)}
              onMouseLeave={() => setHoveredRowIndex(null)}
            >
              <td className="py-2 px-4">
                <div className="grid grid-cols-12 items-center">
                  <div 
                    className="text-3xl font-medium col-span-5"
                    style={{ color: colors.primary_text_color }}
                  >
                    {product.product_name}
                  </div>
                  <div 
                    className="text-lg col-span-7 opacity-80 text-center"
                    style={{ color: colors.primary_text_color }}
                  >
                    {isFlowerOrVape ? (
                      <SmoothTextDisplay 
                        text={showLineage ? (product.strain_cross || '-') : (product.terpene || '-')}
                      />
                    ) : (
                      product.strain_cross || ''
                    )}
                  </div>
                </div>
                {!isFlowerOrVape && (
                  <div 
                    className="flex items-center text-lg opacity-80"
                    style={{ color: colors.primary_text_color }}
                  >
                    {product.terpene && <span>{product.terpene}</span>}
                    {product.description && product.terpene && <span className="mx-1">•</span>}
                    {product.description && <span>{product.description}</span>}
                  </div>
                )}
              </td>

              {!isFlowerOrVape && (
                <td className="py-2 px-3 text-left">
                  <span 
                    className="text-2xl font-semibold"
                    style={{ color: colors.primary_text_color }}
                  >
                    {product.strength || '-'}
                  </span>
                </td>
              )}
              <td className="py-2 px-3 text-right">
                <div className="flex flex-col items-end">
                  {isFlowerOrVape ? (
                    // For flower and vape products: only show THCA, not Delta-9
                    <>
                      {product.thca_percent && (
                        <span 
                          className="text-xl font-bold"
                          style={{ color: colors.thca_percent_color }}
                        >
                          {product.thca_percent}%
                        </span>
                      )}
                      {!product.thca_percent && (
                        <span style={{ color: colors.secondary_text_color }}>-</span>
                      )}
                    </>
                  ) : (
                    // For other products: show both THCA and Delta-9 as before
                    <>
                      {product.thca_percent && (
                        <span 
                          className="text-xl font-bold"
                          style={{ color: colors.thca_percent_color }}
                        >
                          {product.thca_percent}%
                        </span>
                      )}
                      {product.delta9_percent && (
                        <span 
                          className="text-xl font-bold"
                          style={{ color: colors.delta9_percent_color }}
                        >
                          Δ9 {product.delta9_percent}%
                        </span>
                      )}
                      {!product.thca_percent && !product.delta9_percent && (
                        <span style={{ color: colors.secondary_text_color }}>-</span>
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
  }

  // Build background style
  const backgroundStyle = colors.main_background_type === 'gradient' && colors.main_background_gradient
    ? getBackgroundStyle(colors.main_background_gradient)
    : getBackgroundStyle(colors.main_background_color)

  return (
    <div 
      className="w-full space-y-0 min-h-screen hide-scrollbar"
      style={backgroundStyle}
    >
      {Object.entries(groupedProducts).map(([strainType, products]) => {
        const config = getSectionConfig(strainType, colors)
        
        // Get appropriate terminology for product count based on category
        const getProductTerminology = () => {
          if (isEdibleCategory) {
            return products.length === 1 ? 'product' : 'products'
          } else if (isFlowerCategory || isVapeCategory) {
            return products.length === 1 ? 'strain' : 'strains'
          } else {
            return products.length === 1 ? 'product' : 'products'
          }
        }
        
        return (
          <div key={strainType} className="w-full">
            {/* Section Header with enhanced Apple styling */}
            <div 
              className={`px-6 py-5 border-b ${colors.header_blur_effect ? 'backdrop-blur-sm' : ''}`}
              style={{
                ...getSectionHeaderStyle(config.color, colors.header_blur_effect),
                borderColor: colors.table_border_color + '50'
              }}
            >
              <div className="flex items-center justify-between">
                <h2 
                  className="text-3xl font-bold tracking-wider font-sf-pro-display drop-shadow-2xl"
                  style={{ color: config.textColor }}
                >
                  {strainType.toUpperCase()}
                </h2>
                <div 
                  className="text-sm font-medium drop-shadow-lg px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: colors.product_count_bg + '20',
                    color: colors.product_count_text,
                    backdropFilter: colors.header_blur_effect ? 'blur(8px)' : 'none'
                  }}
                >
                  {products.length} {getProductTerminology()}
                </div>
              </div>
            </div>
            
            {/* Products Table with enhanced readability */}
            <div className={`w-full overflow-hidden bg-black/95 ${colors.header_blur_effect ? 'backdrop-blur-sm' : ''}`}>
              {renderProductTable(products)}
            </div>
          </div>
        )
      })}
    </div>
  )
} 