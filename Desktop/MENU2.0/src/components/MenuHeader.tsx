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
            <h1 
              className="text-7xl font-normal tracking-wide lowercase" 
              style={{ 
                fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
                color: colors.primary_text_color
              }}
            >
              {category} menu
            </h1>
          </div>
          <div className="text-right">
            <div 
              className="text-sm"
              style={{ color: colors.secondary_text_color }}
            >
              Store Code: {storeCode}
            </div>
            <Link
              href={`/stores/${storeCode.toLowerCase()}/admin`}
              className="inline-flex items-center px-3 py-1 backdrop-blur-sm border text-xs font-medium rounded-md transition-all duration-200 mt-2 hover:opacity-80"
              style={{
                backgroundColor: colors.table_header_bg + '60',
                borderColor: colors.table_border_color + '60',
                color: colors.secondary_text_color
              }}
            >
              <span className="mr-1">⚙️</span>
              Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 