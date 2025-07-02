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

interface CombinedMenuGridProps {
  storeCode: string
  adminMode?: boolean
  concentrateOnly?: boolean
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

export default function CombinedMenuGrid({ storeCode, adminMode = false, concentrateOnly = false }: CombinedMenuGridProps) {
  const [vapeProducts, setVapeProducts] = useState<Product[]>([])
  const [concentrateProducts, setConcentrateProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [colors, setColors] = useState<MenuColors>(defaultColors)
  const [showLineage, setShowLineage] = useState(true)
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      if (!concentrateOnly) {
        // Fetch vape products
        const { data: vapeData, error: vapeError } = await supabase
          .from('products')
          .select('*')
          .eq('store_code', storeCode.toUpperCase())
          .eq('product_category', 'Vape')
          .order('product_name')

        if (vapeError) throw vapeError
        setVapeProducts(vapeData || [])
      }

      // Fetch concentrate products
      const { data: concentrateData, error: concentrateError } = await supabase
        .from('products')
        .select('*')
        .eq('store_code', storeCode.toUpperCase())
        .eq('product_category', 'Concentrate')
        .order('product_name')

      if (concentrateError) throw concentrateError
      setConcentrateProducts(concentrateData || [])
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
    
    // Flip board effect - alternate between lineage and terpenes every 5 seconds
    const flipInterval = setInterval(() => {
      setShowLineage(prev => !prev)
    }, 5000)
    
    return () => {
      if (interval) clearInterval(interval)
      if (flipInterval) clearInterval(flipInterval)
      window.removeEventListener('themeUpdated', handleThemeUpdate)
      window.removeEventListener('forceThemeRefresh', handleForceRefresh)
    }
  }, [storeCode, adminMode])

  if (loading) {
    return <LoadingSpinner message={concentrateOnly ? "Loading concentrate menu..." : "Loading vape & concentrate menu..."} />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  if (concentrateOnly && concentrateProducts.length === 0) {
    return <LoadingSpinner message="No concentrate products available" />
  }

  if (!concentrateOnly && vapeProducts.length === 0 && concentrateProducts.length === 0) {
    return <LoadingSpinner message="No vape or concentrate products available" />
  }

  // Group products by strain type for each category
  const groupVapeProducts = (products: Product[]) => {
    return products.reduce((acc, product) => {
      const strainType = product.strain_type || 'Other'
      if (!acc[strainType]) {
        acc[strainType] = []
      }
      acc[strainType].push(product)
      return acc
    }, {} as Record<string, Product[]>)
  }

  const groupConcentrateProducts = (products: Product[]) => {
    return products.reduce((acc, product) => {
      const strainType = product.strain_type || 'Other'
      if (!acc[strainType]) {
        acc[strainType] = []
      }
      acc[strainType].push(product)
      return acc
    }, {} as Record<string, Product[]>)
  }

  const renderVapeTable = (products: Product[]) => {
    return (
      <div className="w-full">
        {/* Vape Header */}
        <div 
          className={`px-6 py-5 border-b ${colors.header_blur_effect ? 'backdrop-blur-sm' : ''}`}
          style={{
            ...getSectionHeaderStyle(getSectionConfig('Vape', colors).color, colors.header_blur_effect),
            borderColor: colors.table_border_color + '50'
          }}
        >
          <div className="flex items-center justify-between">
            <h2 
              className="text-3xl font-bold tracking-wider font-sf-pro-display drop-shadow-2xl"
              style={{ color: getSectionConfig('Vape', colors).textColor }}
            >
              VAPE
            </h2>
            <div 
              className="text-sm font-medium drop-shadow-lg px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: colors.product_count_bg + '20',
                color: colors.product_count_text,
                backdropFilter: colors.header_blur_effect ? 'blur(8px)' : 'none'
              }}
            >
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </div>
          </div>
        </div>
        
        {/* Vape Table */}
        <div className={`w-full overflow-hidden bg-black/95 ${colors.header_blur_effect ? 'backdrop-blur-sm' : ''}`}>
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
                      {showLineage ? 'Lineage' : 'Terpene'}
                    </div>
                  </div>
                </th>

                <th 
                  className="text-left py-3 px-3 text-lg font-medium w-1/5"
                  style={{ color: colors.primary_text_color }}
                >
                  Type
                </th>
                
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
                        <SmoothTextDisplay 
                          text={showLineage ? (product.strain_cross || '-') : (product.terpene || '-')}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-2 px-3 text-left">
                    <span 
                      className="text-2xl font-semibold"
                      style={{ color: colors.primary_text_color }}
                    >
                      {product.strain_type || '-'}
                    </span>
                  </td>
                  
                  <td className="py-2 px-3 text-right">
                    <div className="flex flex-col items-end">
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderConcentrateTable = (products: Product[]) => {
    return (
      <div className="w-full">
        {/* Concentrate Header */}
        <div 
          className={`px-6 py-5 border-b ${colors.header_blur_effect ? 'backdrop-blur-sm' : ''}`}
          style={{
            ...getSectionHeaderStyle(getSectionConfig('Concentrate', colors).color, colors.header_blur_effect),
            borderColor: colors.table_border_color + '50'
          }}
        >
          <div className="flex items-center justify-between">
            <h2 
              className="text-3xl font-bold tracking-wider font-sf-pro-display drop-shadow-2xl"
              style={{ color: getSectionConfig('Concentrate', colors).textColor }}
            >
              CONCENTRATE
            </h2>
            <div 
              className="text-sm font-medium drop-shadow-lg px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: colors.product_count_bg + '20',
                color: colors.product_count_text,
                backdropFilter: colors.header_blur_effect ? 'blur(8px)' : 'none'
              }}
            >
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </div>
          </div>
        </div>
        
        {/* Concentrate Table */}
        <div className={`w-full overflow-hidden bg-black/95 ${colors.header_blur_effect ? 'backdrop-blur-sm' : ''}`}>
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
                      Lineage
                    </div>
                  </div>
                </th>

                <th 
                  className="text-left py-3 px-3 text-lg font-medium w-1/5"
                  style={{ color: colors.primary_text_color }}
                >
                  Type
                </th>
                
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
                        {product.strain_cross || '-'}
                      </div>
                    </div>
                  </td>

                  <td className="py-2 px-3 text-left">
                    <span 
                      className="text-2xl font-semibold"
                      style={{ color: colors.primary_text_color }}
                    >
                      {product.strain_type || '-'}
                    </span>
                  </td>
                  
                  <td className="py-2 px-3 text-right">
                    <div className="flex flex-col items-end">
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderCategorySection = (
    products: Product[], 
    categoryName: string, 
    isVape: boolean = false
  ) => {
    if (products.length === 0) return null
    
    // Get section configuration like flower menus do
    const config = getSectionConfig(categoryName, colors)
    
    return (
      <div className="w-full">
        {/* Section Header with flower menu styling */}
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
              {categoryName.toUpperCase()}
            </h2>
            <div 
              className="text-sm font-medium drop-shadow-lg px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: colors.product_count_bg + '20',
                color: colors.product_count_text,
                backdropFilter: colors.header_blur_effect ? 'blur(8px)' : 'none'
              }}
            >
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </div>
          </div>
        </div>
        
        {/* Products Table */}
        <div className={`w-full overflow-hidden bg-black/95 ${colors.header_blur_effect ? 'backdrop-blur-sm' : ''}`}>
          {isVape ? renderVapeTable(products) : renderConcentrateTable(products)}
        </div>
      </div>
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
      {concentrateOnly ? (
        // Concentrate only page
        concentrateProducts.length > 0 && renderConcentrateTable(concentrateProducts)
      ) : (
        <>
          {/* Vape Table with Header */}
          {vapeProducts.length > 0 && renderVapeTable(vapeProducts)}
          
          {/* Spacing between tables */}
          {vapeProducts.length > 0 && concentrateProducts.length > 0 && (
            <div className="h-8"></div>
          )}
          
          {/* Concentrate Table with Header */}
          {concentrateProducts.length > 0 && renderConcentrateTable(concentrateProducts)}
        </>
      )}
    </div>
  )
} 