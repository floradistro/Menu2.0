'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  getActiveMenuColors, 
  defaultColors, 
  getSectionConfig, 
  MenuColors, 
  getBackgroundStyle, 
  getSectionHeaderStyle
} from '@/lib/menu-colors'
import { LoadingSpinner } from './ui/LoadingSpinner'
import { ErrorMessage } from './ui/ErrorMessage'

interface WelcomeBoardProps {
  storeCode: string
  adminMode?: boolean
}

interface Message {
  id: string
  title: string
  content: string
  priority: 'high' | 'medium' | 'low'
  created_at: string
  expires_at?: string
  store_code: string
}

export default function WelcomeBoard({ storeCode, adminMode = false }: WelcomeBoardProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [colors, setColors] = useState<MenuColors>(defaultColors)

  const fetchMessages = async () => {
    try {
      setLoading(true)
      
      // For now, we'll create some default messages since the table might not exist
      // In a real implementation, you'd fetch from a messages table
      const defaultMessages: Message[] = [
        {
          id: '1',
          title: 'Welcome to Our Store!',
          content: 'Thank you for visiting our cannabis dispensary. We offer premium quality products with exceptional service.',
          priority: 'high',
          created_at: new Date().toISOString(),
          store_code: storeCode
        },
        {
          id: '2', 
          title: 'Daily Specials',
          content: 'Check out our rotating daily specials! Ask your budtender about today\'s featured products and discounts.',
          priority: 'medium',
          created_at: new Date().toISOString(),
          store_code: storeCode
        },
        {
          id: '3',
          title: 'New Products',
          content: 'We regularly update our inventory with the latest and greatest cannabis products. Stay tuned for new arrivals!',
          priority: 'medium',
          created_at: new Date().toISOString(),
          store_code: storeCode
        },
        {
          id: '4',
          title: 'Lab Tested Quality',
          content: 'All our products are rigorously lab tested for potency, pesticides, and purity. Your safety is our priority.',
          priority: 'low',
          created_at: new Date().toISOString(),
          store_code: storeCode
        }
      ]
      
      setMessages(defaultMessages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages')
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
    fetchMessages()
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
    return <LoadingSpinner message="Loading welcome board..." />
  }

  if (error) {
    return <ErrorMessage error={error} />
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444' // red
      case 'medium':
        return '#f59e0b' // amber
      case 'low':
        return '#10b981' // emerald
      default:
        return colors.primary_text_color
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return '🔥'
      case 'medium':
        return '⭐'
      case 'low':
        return '💡'
      default:
        return '📢'
    }
  }

  const renderMessage = (message: Message, index: number) => {
    const config = getSectionConfig('Welcome', colors)
    
    return (
      <div 
        key={message.id}
        className={`w-full rounded-xl border ${colors.header_blur_effect ? 'backdrop-blur-sm' : ''} mb-6`}
        style={{
          backgroundColor: colors.table_header_bg + '40',
          borderColor: colors.table_border_color + '60'
        }}
      >
        {/* Message Header */}
        <div 
          className={`px-6 py-4 border-b rounded-t-xl ${colors.header_blur_effect ? 'backdrop-blur-sm' : ''}`}
          style={{
            ...getSectionHeaderStyle(config.color, colors.header_blur_effect),
            borderColor: colors.table_border_color + '30'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getPriorityIcon(message.priority)}</span>
              <h3 
                className="text-2xl font-bold tracking-wide font-sf-pro-display"
                style={{ color: config.textColor }}
              >
                {message.title}
              </h3>
            </div>
            <div 
              className="text-xs font-medium px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: getPriorityColor(message.priority) + '20',
                color: getPriorityColor(message.priority)
              }}
            >
              {message.priority.toUpperCase()}
            </div>
          </div>
        </div>
        
        {/* Message Content */}
        <div className="px-6 py-6">
          <p 
            className="text-lg leading-relaxed font-sf-pro-display"
            style={{ color: colors.primary_text_color + 'E0' }}
          >
            {message.content}
          </p>
          
          {/* Message Footer */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.table_border_color + '30' }}>
            <div className="flex justify-between items-center">
              <span 
                className="text-sm"
                style={{ color: colors.secondary_text_color }}
              >
                Posted: {new Date(message.created_at).toLocaleDateString()}
              </span>
              {message.expires_at && (
                <span 
                  className="text-sm"
                  style={{ color: colors.secondary_text_color }}
                >
                  Expires: {new Date(message.expires_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
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
      className="w-full min-h-screen hide-scrollbar px-6 py-8"
      style={backgroundStyle}
    >
      {/* Welcome Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div 
          className={`px-8 py-6 rounded-xl border ${colors.header_blur_effect ? 'backdrop-blur-sm' : ''}`}
          style={{
            ...getSectionHeaderStyle(getSectionConfig('Welcome', colors).color, colors.header_blur_effect),
            borderColor: colors.table_border_color + '50'
          }}
        >
          <div className="text-center">
            <h1 
              className="text-4xl font-bold tracking-wider font-sf-pro-display drop-shadow-2xl mb-2"
              style={{ color: getSectionConfig('Welcome', colors).textColor }}
            >
              WELCOME BOARD
            </h1>
            <p 
              className="text-lg opacity-90"
              style={{ color: getSectionConfig('Welcome', colors).textColor }}
            >
              Important updates and information
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <span 
              className="text-xl"
              style={{ color: colors.secondary_text_color }}
            >
              No messages at this time
            </span>
          </div>
        ) : (
          messages.map((message, index) => renderMessage(message, index))
        )}
      </div>
    </div>
  )
}