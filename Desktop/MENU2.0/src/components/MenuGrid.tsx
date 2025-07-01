'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { formatCategory } from '@/lib/utils'
import { getTheme, getSectionConfig, ThemeColors, defaultTheme } from '@/lib/themes'

interface MenuGridProps {
  storeCode: string
  category: string
}

// Character reel for Vestaboard-style flip animation
const CHARACTER_REEL = [
  ' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
  'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
  'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
  'X', 'Y', 'Z', '0', '1', '2', '3', '4',
  '5', '6', '7', '8', '9', '!', '@', '#',
  '$', '%', '&', '*', '(', ')', '-', '+',
  '=', '?', '.', ',', ':', ';', '/', '\\'
];

interface FlapTileProps {
  targetChar: string
  delay?: number
}

function FlapTile({ targetChar, delay = 0 }: FlapTileProps) {
  const [currentChar, setCurrentChar] = useState(' ')
  const [isFlipping, setIsFlipping] = useState(false)

  useEffect(() => {
    const upperTarget = targetChar.toUpperCase()
    const targetIndex = CHARACTER_REEL.indexOf(upperTarget)
    const safeTargetIndex = targetIndex === -1 ? 0 : targetIndex
    const finalChar = CHARACTER_REEL[safeTargetIndex]

    if (currentChar === finalChar) return

    const currentIndex = CHARACTER_REEL.indexOf(currentChar)
    const safeCurrentIndex = currentIndex === -1 ? 0 : currentIndex

    const totalSteps = (safeTargetIndex - safeCurrentIndex + CHARACTER_REEL.length) % CHARACTER_REEL.length
    
    if (totalSteps === 0) return

    setIsFlipping(true)
    let step = 0
    let animationIndex = safeCurrentIndex

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        step++
        animationIndex = (animationIndex + 1) % CHARACTER_REEL.length
        
        if (step >= totalSteps) {
          clearInterval(interval)
          setCurrentChar(finalChar)
          setIsFlipping(false)
        } else {
          setCurrentChar(CHARACTER_REEL[animationIndex])
        }
      }, 35)
    }, delay)

    return () => clearTimeout(timer)
  }, [targetChar, delay])

  return (
    <div 
      className="relative inline-block w-[14px] h-6 overflow-hidden bg-gray-900 rounded-sm shadow-inner" 
      style={{ 
        perspective: '100px',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8)'
      }}
    >
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipping ? `rotateX(${CHARACTER_REEL.indexOf(currentChar) * -8}deg)` : 'rotateX(0deg)',
          transformOrigin: 'center center',
          transition: isFlipping ? 'none' : 'transform 100ms ease-out'
        }}
      >
        <span 
          className="font-sf-pro text-base leading-none select-none"
          style={{
            color: '#ffffff',
            textShadow: `0 0 ${isFlipping ? '4px' : '2px'} rgba(255,255,255,0.3)`,
            transition: 'all 50ms ease-out'
          }}
        >
          {currentChar}
        </span>
      </div>
    </div>
  )
}

interface VestaboardDisplayProps {
  text: string
}

function VestaboardDisplay({ text }: VestaboardDisplayProps) {
  const MIN_DISPLAY_LENGTH = 35 // Minimum characters to display
  const [displayLength, setDisplayLength] = useState(MIN_DISPLAY_LENGTH)
  const [currentText, setCurrentText] = useState('')
  
  useEffect(() => {
    // Smoothly transition to new text
    const targetLen = Math.max(text.length, MIN_DISPLAY_LENGTH, displayLength)
    
    // Expand immediately if needed
    if (text.length > displayLength) {
      setDisplayLength(text.length)
    }
    
    // Always pad to consistent length for smooth transitions
    setCurrentText(text.padEnd(targetLen, ' '))
    
    // After animation completes, we can potentially shrink (but maintain minimum)
    const timer = setTimeout(() => {
      const finalLen = Math.max(text.length, MIN_DISPLAY_LENGTH)
      if (finalLen < displayLength) {
        setDisplayLength(finalLen)
        setCurrentText(text.padEnd(finalLen, ' '))
      }
    }, 2000) // Wait for flip animation to complete
    
    return () => clearTimeout(timer)
  }, [text])
  
  return (
    <div 
      className="inline-flex font-mono p-1 rounded transition-all duration-300"
      style={{
        backgroundColor: '#0a0a0a',
        boxShadow: '0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
      }}
    >
      {currentText.split('').map((char, index) => (
        <FlapTile 
          key={`tile-${index}`}
          targetChar={char}
          delay={index * 15} // Slightly faster stagger for smoother wave
        />
      ))}
    </div>
  )
}

export default function MenuGrid({ storeCode, category }: MenuGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [theme, setTheme] = useState<ThemeColors>(defaultTheme)
  const [showLineage, setShowLineage] = useState(true)
  
  // Auto-refresh controls
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(() => {
    return parseInt(process.env.NEXT_PUBLIC_REFRESH_INTERVAL || '60000')
  })
  const [customInterval, setCustomInterval] = useState(refreshInterval / 1000) // Convert to seconds for display
  
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

  const fetchTheme = async () => {
    try {
      const themeData = await getTheme()
      setTheme(themeData)
    } catch (err) {
      console.error('Error fetching theme:', err)
      setTheme(defaultTheme)
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchTheme()
    
    // Listen for theme updates
    const handleThemeUpdate = () => {
      fetchTheme()
    }
    window.addEventListener('themeUpdated', handleThemeUpdate)
    
    // Auto-refresh with configurable interval
    let interval: NodeJS.Timeout | null = null
    if (autoRefreshEnabled) {
      interval = setInterval(() => {
        fetchProducts()
        fetchTheme()
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
    }
  }, [storeCode, category, isFlowerOrVape, autoRefreshEnabled, refreshInterval])

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

  // Get dynamic section configuration based on theme

  const renderProductTable = (products: Product[]) => {
    // Special handling for edibles - only show Product, Description, and Strength
    if (isEdibleCategory) {
      return (
        <table className="w-full">
          <thead 
            className="border-b border-gray-700/50"
            style={{ backgroundColor: theme.table_header_bg }}
          >
            <tr>
              <th 
                className="text-left py-2 px-4 text-lg font-semibold w-2/5"
                style={{ color: theme.text_color }}
              >
                Product
              </th>
              <th 
                className="text-left py-2 px-3 text-lg font-medium w-2/5"
                style={{ color: theme.text_color }}
              >
                Description
              </th>
              <th 
                className="text-left py-2 px-3 text-lg font-medium w-1/5"
                style={{ color: theme.text_color }}
              >
                Strength
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/40">
            {products.map((product, index) => (
              <tr 
                key={product.id} 
                className="transition-all duration-200"
                style={{
                  backgroundColor: index % 2 === 0 ? 'rgba(31, 41, 55, 0.6)' : 'rgba(17, 24, 39, 0.8)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.table_row_hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'rgba(31, 41, 55, 0.6)' : 'rgba(17, 24, 39, 0.8)'
                }}
              >
                <td className="py-1 px-4">
                  <div 
                    className="text-2xl font-medium"
                    style={{ color: theme.text_color }}
                  >
                    {product.product_name}
                  </div>
                </td>
                <td className="py-1 px-3">
                  <span 
                    className="text-base"
                    style={{ color: theme.text_color }}
                  >
                    {product.description || '-'}
                  </span>
                </td>
                <td className="py-1 px-3 text-left">
                  <span 
                    className="text-xl font-semibold"
                    style={{ color: theme.text_color }}
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

    // Original table structure for other categories
    return (
      <table className="w-full">
        <thead 
          className="border-b border-gray-700/50"
          style={{ backgroundColor: theme.table_header_bg }}
        >
          <tr>
            <th 
              className="text-left py-2 px-4 text-lg font-semibold w-3/5"
              style={{ color: theme.text_color }}
            >
              <div className="grid grid-cols-12 items-center">
                <div className="col-span-5">Product</div>
                <div className="col-span-7 text-base font-medium opacity-70">
                  {isFlowerOrVape ? (showLineage ? 'Lineage' : 'Terpene') : 'Lineage'}
                </div>
              </div>
            </th>

            {!isFlowerOrVape && (
              <th 
                className="text-left py-2 px-3 text-lg font-medium w-1/5"
                style={{ color: theme.text_color }}
              >
                Strength
              </th>
            )}
            <th 
              className="text-right py-2 px-3 text-lg font-medium w-1/5"
              style={{ color: theme.text_color }}
            >
              Potency
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/40">
          {products.map((product, index) => (
            <tr 
              key={product.id} 
              className="transition-all duration-200"
              style={{
                backgroundColor: index % 2 === 0 ? 'rgba(31, 41, 55, 0.6)' : 'rgba(17, 24, 39, 0.8)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.table_row_hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'rgba(31, 41, 55, 0.6)' : 'rgba(17, 24, 39, 0.8)'
              }}
            >
              <td className="py-1 px-4">
                <div className="grid grid-cols-12 items-center">
                  <div 
                    className="text-2xl font-medium col-span-5"
                    style={{ color: theme.text_color }}
                  >
                    {product.product_name}
                  </div>
                  <div 
                    className="text-base col-span-7 opacity-70"
                    style={{ color: theme.text_color }}
                  >
                    {isFlowerOrVape ? (
                      <VestaboardDisplay 
                        text={showLineage ? (product.strain_cross || '-') : (product.terpene || '-')}
                      />
                    ) : (
                      product.strain_cross || ''
                    )}
                  </div>
                </div>
                {!isFlowerOrVape && (
                  <div 
                    className="flex items-center text-base opacity-70"
                    style={{ color: theme.text_color }}
                  >
                    {product.terpene && <span>{product.terpene}</span>}
                    {product.description && product.terpene && <span className="mx-1">•</span>}
                    {product.description && <span>{product.description}</span>}
                  </div>
                )}
              </td>

              {!isFlowerOrVape && (
                <td className="py-1 px-3 text-left">
                  <span 
                    className="text-xl font-semibold"
                    style={{ color: theme.text_color }}
                  >
                    {product.strength || '-'}
                  </span>
                </td>
              )}
              <td className="py-1 px-3 text-right">
                <div className="flex flex-col items-end">
                  {isFlowerOrVape ? (
                    // For flower and vape products: only show THCA, not Delta-9
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
  }

  // Handle interval change
  const handleIntervalChange = (seconds: number) => {
    setCustomInterval(seconds)
    setRefreshInterval(seconds * 1000) // Convert to milliseconds
  }

  // Manual refresh function
  const handleManualRefresh = () => {
    fetchProducts()
    fetchTheme()
  }

  return (
    <div 
      className="w-full space-y-0 min-h-screen hide-scrollbar"
      style={{ backgroundColor: theme.background_color }}
    >
      {/* Auto-refresh controls */}
      <div 
        className="px-6 py-3 border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-sm"
        style={{ backgroundColor: theme.table_header_bg }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-6">
            {/* Auto-refresh toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoRefreshEnabled ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoRefreshEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm font-medium" style={{ color: theme.text_color }}>
                Auto-refresh {autoRefreshEnabled ? 'On' : 'Off'}
              </span>
            </div>

            {/* Interval selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium" style={{ color: theme.text_color }}>
                Interval:
              </span>
              <select
                value={customInterval}
                onChange={(e) => handleIntervalChange(Number(e.target.value))}
                disabled={!autoRefreshEnabled}
                className="bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600 disabled:opacity-50"
              >
                <option value={10}>10 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={120}>2 minutes</option>
                <option value={300}>5 minutes</option>
                <option value={600}>10 minutes</option>
              </select>
            </div>

            {/* Custom interval input */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium" style={{ color: theme.text_color }}>
                Custom:
              </span>
              <input
                type="number"
                min="5"
                max="3600"
                value={customInterval}
                onChange={(e) => handleIntervalChange(Number(e.target.value))}
                disabled={!autoRefreshEnabled}
                className="bg-gray-700 text-white text-sm px-2 py-1 rounded border border-gray-600 w-16 disabled:opacity-50"
              />
              <span className="text-sm" style={{ color: theme.text_color }}>
                sec
              </span>
            </div>
          </div>

          {/* Manual refresh button */}
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        {/* Status indicator */}
        <div className="mt-2 text-xs" style={{ color: theme.text_color }}>
          {autoRefreshEnabled ? (
            <span className="text-green-400">
              Auto-refreshing every {customInterval} seconds
            </span>
          ) : (
            <span className="text-gray-400">
              Auto-refresh disabled - Use manual refresh button
            </span>
          )}
        </div>
      </div>

      {Object.entries(groupedProducts).map(([strainType, products]) => {
        const config = getSectionConfig(strainType, theme)
        
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
            {/* Section Header */}
            <div 
              className="px-6 py-4"
              style={{ 
                background: config.color.includes('gradient') ? config.color : config.color,
                backgroundColor: !config.color.includes('gradient') ? config.color : undefined
              }}
            >
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${config.textColor} tracking-wider font-sf-pro-display drop-shadow-lg`}>
                  {strainType.toUpperCase()}
                </h2>
                <div className="text-white/90 text-sm font-medium drop-shadow-md">
                  {products.length} {getProductTerminology()}
                </div>
              </div>
            </div>
            
            {/* Products Table */}
            <div className="w-full overflow-hidden bg-gray-800/90 backdrop-blur-sm">
              {renderProductTable(products)}
            </div>
          </div>
        )
      })}
    </div>
  )
} 