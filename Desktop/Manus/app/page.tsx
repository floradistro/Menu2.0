'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCategoryData } from '../lib/hooks/useMenuData'
import { useLayoutConfig } from '../lib/hooks/useLayoutConfig'

// Flipboard/Vestaboard Effects Component
const FlipboardEffects = ({ messages, type }: { messages: string[], type: string }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [displayedMessage, setDisplayedMessage] = useState('')
  const [flipStates, setFlipStates] = useState<boolean[]>([])
  const [randomLetters, setRandomLetters] = useState<string[]>([])

  const maxLength = Math.max(...messages.map(msg => msg.length))
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  useEffect(() => {
    const interval = setInterval(() => {
      const nextMessage = messages[(currentMessageIndex + 1) % messages.length]
      
      // Start random flipping for each position with staggered timing
      Array(maxLength).fill(0).forEach((_, index) => {
        const delay = Math.random() * 500
        const flipDuration = 800 + Math.random() * 400
        
        setTimeout(() => {
          setFlipStates(prev => {
            const newStates = [...prev]
            newStates[index] = true
            return newStates
          })
          
          const letterInterval = setInterval(() => {
            setRandomLetters(prev => {
              const newLetters = [...prev]
              newLetters[index] = letters[Math.floor(Math.random() * letters.length)]
              return newLetters
            })
          }, 60 + Math.random() * 40)
          
          setTimeout(() => {
            clearInterval(letterInterval)
            setFlipStates(prev => {
              const newStates = [...prev]
              newStates[index] = false
              return newStates
            })
            
            setTimeout(() => {
              setFlipStates(prev => {
                const allDone = prev.every(state => !state)
                if (allDone) {
                  setDisplayedMessage(nextMessage.padEnd(maxLength, ' '))
                  setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
                  setRandomLetters([])
                }
                return prev
              })
            }, 100)
            
          }, flipDuration)
        }, delay)
      })

    }, 4000)

    if (displayedMessage === '') {
      setDisplayedMessage(messages[0].padEnd(maxLength, ' '))
      setFlipStates(Array(maxLength).fill(false))
    }

    return () => clearInterval(interval)
  }, [messages, currentMessageIndex, maxLength, displayedMessage])

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'indica': return 'text-purple-400'
      case 'sativa': return 'text-orange-400'
      case 'hybrid': return 'text-emerald-400'
      default: return 'text-white'
    }
  }

  const getCurrentChar = (index: number) => {
    if (flipStates[index] && randomLetters[index]) {
      return randomLetters[index]
    }
    const char = displayedMessage[index]
    return char === ' ' ? '\u00A0' : char
  }

  const getTypeBorder = (type: string) => {
    switch (type.toLowerCase()) {
      case 'indica': return 'border-purple-400/30'
      case 'sativa': return 'border-orange-400/30'
      case 'hybrid': return 'border-emerald-400/30'
      default: return 'border-white/30'
    }
  }

  const getTypeBg = (type: string) => {
    switch (type.toLowerCase()) {
      case 'indica': return 'bg-purple-900/20'
      case 'sativa': return 'bg-orange-900/20'
      case 'hybrid': return 'bg-emerald-900/20'
      default: return 'bg-gray-900/20'
    }
  }

  return (
    <div className="relative inline-block">
      <div 
        className="flex"
        style={{
          fontFamily: 'Monaco, "Lucida Console", monospace',
          fontSize: '24px',
          fontWeight: 'bold'
        }}
      >
        {Array(maxLength).fill(0).map((_, index) => (
          <div
            key={index}
            className={`
              relative inline-block ${getTypeColor(type)} 
              ${flipStates[index] ? 'animate-individual-flip' : ''}
            `}
            style={{
              width: '1.2em',
              height: '2em',
              textAlign: 'center',
              lineHeight: '2em',
              perspective: '200px',
              transformStyle: 'preserve-3d'
            }}
          >
            <div
              className={`
                absolute inset-0 flex items-center justify-center
                transition-transform duration-150 ease-in-out
                ${flipStates[index] ? 'transform rotateX(-90deg)' : 'transform rotateX(0deg)'}
              `}
              style={{
                backfaceVisibility: 'hidden',
                transformOrigin: 'center center'
              }}
            >
              {getCurrentChar(index)}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes individual-flip {
          0%, 100% { 
            transform: rotateX(0deg); 
          }
          50% { 
            transform: rotateX(-90deg); 
          }
        }
        
        .animate-individual-flip {
          animation: individual-flip 0.2s ease-in-out infinite;
        }
        
        .animate-individual-flip div {
          animation: individual-flip 0.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// Navigation Component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="absolute top-4 left-4 z-[9999] group">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
      >
        <div className="flex flex-col space-y-1">
          <div className={`w-4 h-0.5 bg-white transition-all duration-200 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
          <div className={`w-4 h-0.5 bg-white transition-all duration-200 ${isOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-4 h-0.5 bg-white transition-all duration-200 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
        </div>
      </button>

      {/* Navigation Menu */}
      <div className={`absolute top-16 left-0 bg-black/60 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'} ${!isOpen ? 'group-hover:opacity-100' : ''}`}>
        <Link 
          href="/"
          className="block px-6 py-4 text-white hover:bg-white/10 transition-all duration-200 font-apple-medium text-emerald-400 border-b border-white/10"
        >
          FLOWER
        </Link>
        <Link 
          href="/vapes"
          className="block px-6 py-4 text-white hover:bg-white/10 transition-all duration-200 font-apple-medium border-b border-white/10"
        >
          VAPES
        </Link>
        <Link 
          href="/edibles"
          className="block px-6 py-4 text-white hover:bg-white/10 transition-all duration-200 font-apple-medium border-b border-white/10"
        >
          EDIBLES
        </Link>
        <Link 
          href="/specials"
          className="block px-6 py-4 text-white hover:bg-white/10 transition-all duration-200 font-apple-medium border-b border-white/10"
        >
          SPECIALS
        </Link>
        <Link 
          href="/pricing"
          className="block px-6 py-4 text-white hover:bg-white/10 transition-all duration-200 font-apple-medium border-b border-white/10"
        >
          PRICING
        </Link>
        <Link 
          href="/admin"
          className="block px-6 py-4 text-white hover:bg-white/10 transition-all duration-200 font-apple-medium"
        >
          ADMIN
        </Link>
      </div>
    </div>
  )
}

export default function MenuPage() {
  const [fontSize, setFontSize] = useState(170)
  const [settings, setSettings] = useState<any>({})
  const { products, loading, error, refetch } = useCategoryData('flower')
  const { layout, loading: layoutLoading } = useLayoutConfig('flower')

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/menu-settings')
        const data = await response.json()
        setSettings(data.settings || {})
        
        if (data.settings?.global_font_scale) {
          setFontSize(170 * (data.settings.global_font_scale / 100))
        }
      } catch (err) {
        console.error('Error fetching settings:', err)
      }
    }
    fetchSettings()
  }, [])

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 10, 250))
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 10, 120))
  }

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`
  }, [fontSize])

  // Auto-refresh based on settings
  useEffect(() => {
    if (settings.menu_auto_refresh && settings.menu_refresh_interval) {
      const interval = setInterval(() => {
        refetch()
      }, settings.menu_refresh_interval * 1000)

      return () => clearInterval(interval)
    }
  }, [refetch, settings.menu_auto_refresh, settings.menu_refresh_interval])

  // Get color class for section
  const getColorClass = (color: string) => {
    switch (color) {
      case 'purple': return 'text-purple-400'
      case 'emerald': return 'text-emerald-400' 
      case 'orange': return 'text-orange-400'
      case 'amber': return 'text-amber-400'
      case 'pink': return 'text-pink-400'
      case 'cyan': return 'text-cyan-400'
      case 'blue': return 'text-blue-400'
      case 'red': return 'text-red-400'
      default: return 'text-white'
    }
  }

  // Get gradient class for section
  const getGradientClass = (color: string) => {
    switch (color) {
      case 'purple': return 'from-purple-400 to-pink-400'
      case 'emerald': return 'from-emerald-400 to-teal-400'
      case 'orange': return 'from-orange-400 to-red-400'
      case 'amber': return 'from-amber-400 to-orange-400'
      case 'pink': return 'from-pink-400 to-purple-400'
      case 'cyan': return 'from-cyan-400 to-blue-400'
      case 'blue': return 'from-blue-400 to-indigo-400'
      case 'red': return 'from-red-400 to-pink-400'
      default: return 'from-white to-gray-400'
    }
  }

  // Get field value from product
  const getFieldValue = (product: any, fieldId: string) => {
    switch (fieldId) {
      case 'name':
        return product.name
      case 'terpenes':
        return product.terpenes && product.terpenes.length > 0 ? product.terpenes[0] : 'N/A'
      case 'thca':
        return product.thca || 'N/A'
      case 'effects':
        return product.effects && product.effects.length > 0 ? product.effects[0] : 'N/A'
      case 'price':
        return product.price || 'N/A'
      case 'description':
        return product.description || 'N/A'
      case 'in_stock':
        return product.in_stock ? 'In Stock' : 'Out of Stock'
      default:
        return 'N/A'
    }
  }

  // Filter products by section type
  const getProductsBySection = (sectionId: string) => {
    const filtered = products.filter(p => {
      const matchesType = p.type.toLowerCase() === sectionId.toLowerCase()
      const inStock = settings.menu_show_out_of_stock ? true : p.in_stock
      return matchesType && inStock
    })
    
    return filtered
  }

  // Loading states
  if (loading || layoutLoading) {
    return (
      <div className="h-screen w-screen flex flex-col bg-neutral-600 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl text-white">{settings.message_loading || 'Loading flower menu...'}</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex flex-col bg-neutral-600 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl text-red-400 mb-4">Error: {error}</div>
            <button 
              onClick={refetch}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!layout) {
    return (
      <div className="h-screen w-screen flex flex-col bg-neutral-600 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl text-white">Loading layout configuration...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-600 relative overflow-hidden">
      
      {/* Dynamic Background based on settings */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {settings.global_background_style === 'grid' && (
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}
          />
        )}
        
        {settings.global_background_style === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-emerald-900/30" />
        )}
        
        {settings.global_background_style === 'stars' && (
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
        
        {settings.global_background_style === 'dots' && (
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px)',
              backgroundSize: '40px 40px'
            }}
          />
        )}
        
        {settings.global_background_style === 'waves' && (
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-blue-900/20 to-purple-900/20">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent transform skew-y-1" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/3 to-transparent transform -skew-y-1 translate-x-4" />
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      {settings.feature_navigation_menu !== false && <Navigation />}
      
      {/* Font Size Toggle */}
      {settings.feature_font_size_control !== false && (
        <div className="absolute top-4 right-4 z-[9999] flex items-center space-x-3 bg-black/40 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 pointer-events-auto opacity-0 hover:opacity-100 transition-all duration-300">
          <button
            onClick={decreaseFontSize}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-apple-bold text-sm transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            A-
          </button>
          <span className="text-white/80 font-apple-medium text-sm min-w-[3rem] text-center">
            {Math.round((fontSize / 170) * 100)}%
          </span>
          <button
            onClick={increaseFontSize}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-apple-bold text-sm transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            A+
          </button>
        </div>
      )}

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 relative z-20">
        {/* Title */}
        <div className="text-center -mb-6 p-8">
          <h1 className="font-don-graffiti text-white tracking-[0.3em] mb-2 drop-shadow-2xl" style={{ fontSize: '96px', textShadow: '0 8px 32px rgba(0, 0, 0, 0.8)' }}>FLOWER</h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
        </div>
        
        <div className="space-y-2">
          {/* Dynamic Sections based on Layout Configuration */}
          {layout.sections
            .filter(section => section.enabled)
            .map(section => {
              const sectionProducts = getProductsBySection(section.id)
              
              if (sectionProducts.length === 0) return null
              
              return (
                <div key={section.id} className={`p-4 bg-white/5 backdrop-blur-md ${settings.layout_spacing === 'tight' ? 'py-2' : settings.layout_spacing === 'relaxed' ? 'py-6' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-6">
                      <h2 className={`text-3xl font-apple-bold tracking-tight drop-shadow-lg ${getColorClass(section.color)}`} style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>
                        {section.title}
                      </h2>
                      {sectionProducts.length > 0 && settings.flower_show_effects !== false && settings.effects_flipboard_enabled !== false && (
                        <FlipboardEffects 
                          messages={[
                            "DEEP BODY RELAXATION",
                            "PEACEFUL SLEEP AID", 
                            "STRESS RELIEF MODE"
                          ]} 
                          type={section.id} 
                        />
                      )}
                    </div>
                    <div className={`w-16 h-px bg-gradient-to-r ${getGradientClass(section.color)}`}></div>
                  </div>
                  
                  <div className="space-y-0">
                    {/* Dynamic Column Headers */}
                    <div className={`grid gap-2 items-center py-1 bg-white/5`} style={{ gridTemplateColumns: `repeat(${section.columns.filter(c => c.enabled).length}, 1fr)` }}>
                      {section.columns
                        .filter(column => column.enabled)
                        .map(column => (
                          <h3 
                            key={column.id}
                            className={`text-sm font-apple-semibold text-white/80 tracking-wide ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}
                          >
                            {column.label}
                          </h3>
                        ))
                      }
                    </div>
                    
                    {/* Dynamic Product Rows */}
                    {sectionProducts.map((product, index) => (
                      <div 
                        key={product.id} 
                        className={`grid gap-2 items-center py-1 ${index % 2 === 1 ? 'bg-white/5' : ''}`}
                        style={{ gridTemplateColumns: `repeat(${section.columns.filter(c => c.enabled).length}, 1fr)` }}
                      >
                        {section.columns
                          .filter(column => column.enabled)
                          .map(column => (
                            <span 
                              key={column.id}
                              className={`text-lg font-apple-semibold tracking-wide drop-shadow-lg ${
                                column.id === 'name' ? 'text-white' : getColorClass(section.color)
                              } ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}
                              style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}
                            >
                              {getFieldValue(product, column.id)}
                            </span>
                          ))
                        }
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
        </div>
      </main>
    </div>
  )
}