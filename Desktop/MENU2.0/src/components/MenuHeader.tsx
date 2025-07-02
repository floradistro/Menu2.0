'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getActiveMenuColors, defaultColors, MenuColors, getBackgroundStyle } from '@/lib/menu-colors'

interface MenuHeaderProps {
  storeCode: string
  category: string
  storeName?: string
}

export default function MenuHeader({ storeCode, category, storeName }: MenuHeaderProps) {
  const [colors, setColors] = useState<MenuColors>(defaultColors)

  const fetchColors = async () => {
    try {
      const colorData = await getActiveMenuColors()
      setColors(colorData)
    } catch (err) {
      console.error('Error fetching header colors:', err)
      setColors(defaultColors)
    }
  }

  useEffect(() => {
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
    
    return () => {
      window.removeEventListener('themeUpdated', handleThemeUpdate)
      window.removeEventListener('forceThemeRefresh', handleForceRefresh)
    }
  }, [])

  // Build header background style
  const headerBackgroundStyle = colors.main_background_type === 'gradient' && colors.main_background_gradient
    ? {
        background: colors.main_background_gradient,
        backdropFilter: 'blur(8px)',
        borderColor: colors.table_border_color + '60'
      }
    : {
        backgroundColor: colors.main_background_color + 'CC', // Add some transparency
        backdropFilter: 'blur(8px)',
        borderColor: colors.table_border_color + '60'
      }

  return (
    <div 
      className="border-b backdrop-blur-sm"
      style={headerBackgroundStyle}
    >
      <div className="w-full px-3 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Image
              src="/newlogo.png"
              alt="Cannabis Menu Logo"
              width={80}
              height={80}
              className="w-20 h-20 object-contain"
            />
            <div className="flex items-center gap-12">
              <h1 
                className="text-7xl font-normal tracking-normal lowercase" 
                style={{ 
                  fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                  color: colors.primary_text_color
                }}
              >
                {category}
              </h1>
              {category.toLowerCase() === 'flower' && (
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-medium" style={{ color: colors.primary_text_color }}>3.5g</span>
                    <span className="text-4xl font-bold" style={{ color: '#22c55e' }}>$40</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-medium" style={{ color: colors.primary_text_color }}>7g</span>
                    <span className="text-4xl font-bold" style={{ color: '#22c55e' }}>$70</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-medium" style={{ color: colors.primary_text_color }}>14g</span>
                    <span className="text-4xl font-bold" style={{ color: '#22c55e' }}>$110</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-medium" style={{ color: colors.primary_text_color }}>28g</span>
                    <span className="text-4xl font-bold" style={{ color: '#22c55e' }}>$200</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 