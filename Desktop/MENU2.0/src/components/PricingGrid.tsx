'use client'

import { useState, useEffect } from 'react'
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

interface PricingGridProps {
  storeCode: string
  adminMode?: boolean
}

interface CategoryPricing {
  category: string
  price: string
  description: string
  icon: string
}

export default function PricingGrid({ storeCode, adminMode = false }: PricingGridProps) {
  const [pricingData, setPricingData] = useState<CategoryPricing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [colors, setColors] = useState<MenuColors>(defaultColors)
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null)

  const fetchPricingData = async () => {
    try {
      setLoading(true)
      
      // Static pricing data - can be moved to database later
      const categoryPricing: CategoryPricing[] = [
        {
          category: 'Flower',
          price: '1g: $15 • 3.5g: $40 • 7g: $70 • 14g: $110 • 28g: $200',
          description: 'Premium indoor flower, lab tested for quality',
          icon: '🌸'
        },
        {
          category: 'Vape',
          price: '$45/cart',
          description: 'High-quality vape cartridges, 1g capacity',
          icon: '💨'
        },
        {
          category: 'Concentrate',
          price: '$60/g',
          description: 'Solventless rosin and premium extracts',
          icon: '💎'
        },
        {
          category: 'Edible',
          price: '$25/pack',
          description: 'Precisely dosed edibles, various flavors',
          icon: '🍬'
        }
      ]

      setPricingData(categoryPricing)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pricing data')
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
    fetchPricingData()
    fetchColors()
    
    // Listen for theme updates
    const handleThemeUpdate = () => {
      fetchColors()
    }
    
    window.addEventListener('themeUpdated', handleThemeUpdate)
    
    return () => {
      window.removeEventListener('themeUpdated', handleThemeUpdate)
    }
  }, [storeCode])

  if (loading) {
    return <LoadingSpinner message="Loading pricing information..." />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  if (pricingData.length === 0) {
    return <LoadingSpinner message="No pricing data available" />
  }

  const renderPricingTable = () => {
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
              Category
            </th>
            <th 
              className="text-right py-3 px-3 text-lg font-medium w-2/5"
              style={{ color: colors.primary_text_color }}
            >
              Price
            </th>
          </tr>
        </thead>
        <tbody className={getTableBorderStyle(colors)} style={{ borderColor: colors.table_border_color }}>
          {pricingData.map((item, index) => (
            <tr 
              key={item.category} 
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
              <td className="py-6 px-4">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{item.icon}</span>
                  <div 
                    className="text-4xl font-medium"
                    style={{ color: colors.primary_text_color }}
                  >
                    {item.category}
                  </div>
                </div>
              </td>
              <td className="py-6 px-3 text-right">
                {item.category === 'Flower' ? (
                  <div className="text-4xl font-bold whitespace-nowrap inline-block">
                    {item.price.split(' • ').map((priceItem, priceIndex) => {
                      const [weight, amount] = priceItem.split(': ')
                      return (
                        <span key={priceIndex} className="inline-block">
                          <span style={{ color: colors.primary_text_color }}>{weight}: </span>
                          <span style={{ color: '#22c55e' }}>{amount}</span>
                          {priceIndex < item.price.split(' • ').length - 1 && <span style={{ color: colors.primary_text_color }}> • </span>}
                        </span>
                      )
                    })}
                  </div>
                ) : (
                  <span 
                    className="text-6xl font-bold"
                    style={{ color: '#22c55e' }}
                  >
                    {item.price}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const renderPricingSection = () => {
    const config = getSectionConfig('Pricing', colors)
    
    return (
      <div className="w-full">
        {/* Pricing Header */}
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
              PRICING
            </h2>
            <div 
              className="text-sm font-medium drop-shadow-lg px-3 py-1 rounded-full"
              style={{ 
                backgroundColor: colors.product_count_bg + '20',
                color: colors.product_count_text,
                backdropFilter: colors.header_blur_effect ? 'blur(8px)' : 'none'
              }}
            >
              {pricingData.length} {pricingData.length === 1 ? 'category' : 'categories'}
            </div>
          </div>
        </div>
        
        {/* Pricing Table */}
        <div className={`w-full overflow-hidden bg-black/95 ${colors.header_blur_effect ? 'backdrop-blur-sm' : ''}`}>
          {renderPricingTable()}
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
      {renderPricingSection()}
    </div>
  )
}