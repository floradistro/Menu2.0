'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCategoryData } from '../../lib/hooks/useMenuData'

// Flipboard/Vestaboard Effects Component
const FlipboardEffects = ({ messages, type }: { messages: string[], type: string }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [displayedMessage, setDisplayedMessage] = useState('')
  const [flipStates, setFlipStates] = useState<boolean[]>([])
  const [randomLetters, setRandomLetters] = useState<string[]>([])

  const maxLength = Math.max(...messages.map(msg => msg.length))
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  const generateRandomLetters = () => {
    return Array(maxLength).fill(0).map(() => 
      letters[Math.floor(Math.random() * letters.length)]
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const nextMessage = messages[(currentMessageIndex + 1) % messages.length]
      
      // Start random flipping for each position with staggered timing
      Array(maxLength).fill(0).forEach((_, index) => {
        const delay = Math.random() * 500 // Random delay up to 500ms
        const flipDuration = 800 + Math.random() * 400 // 800-1200ms of flipping
        
        setTimeout(() => {
          // Start flipping this position
          setFlipStates(prev => {
            const newStates = [...prev]
            newStates[index] = true
            return newStates
          })
          
          // Generate random letters for this position during flip
          const letterInterval = setInterval(() => {
            setRandomLetters(prev => {
              const newLetters = [...prev]
              newLetters[index] = letters[Math.floor(Math.random() * letters.length)]
              return newLetters
            })
          }, 60 + Math.random() * 40) // Random speed 60-100ms
          
          // Stop flipping and set final letter
          setTimeout(() => {
            clearInterval(letterInterval)
            setFlipStates(prev => {
              const newStates = [...prev]
              newStates[index] = false
              return newStates
            })
            
            // Check if all positions are done flipping
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

    // Initialize first message and states
    if (displayedMessage === '') {
      setDisplayedMessage(messages[0].padEnd(maxLength, ' '))
      setFlipStates(Array(maxLength).fill(false))
    }

    return () => clearInterval(interval)
  }, [messages, currentMessageIndex, maxLength, displayedMessage])

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cookies': return 'text-amber-400'
      case 'gummies': return 'text-pink-400'
      case 'moonwater': return 'text-cyan-400'
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
    <div className="absolute top-4 left-4 z-[9999]">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white hover:bg-white/10 transition-all duration-200 flex items-center justify-center"
      >
        <div className="flex flex-col space-y-1">
          <div className={`w-4 h-0.5 bg-white transition-all duration-200 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
          <div className={`w-4 h-0.5 bg-white transition-all duration-200 ${isOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-4 h-0.5 bg-white transition-all duration-200 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
        </div>
      </button>

      {/* Navigation Menu */}
      <div className={`absolute top-16 left-0 bg-black/60 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <Link 
          href="/"
          className="block px-6 py-4 text-white hover:bg-white/10 transition-all duration-200 font-apple-medium border-b border-white/10"
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
          className="block px-6 py-4 text-white hover:bg-white/10 transition-all duration-200 font-apple-medium text-pink-400 border-b border-white/10"
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

export default function EdiblesPage() {
  const [fontSize, setFontSize] = useState(170)
  const [settings, setSettings] = useState<any>({})
  const { products, loading, error, refetch } = useCategoryData('edibles')

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/menu-settings')
        const data = await response.json()
        setSettings(data.settings || {})
        
        // Apply global font scale
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
    setFontSize(prev => Math.max(prev - 10, 80))
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

  // Group products based on settings
  const getProductsByType = (type: string) => {
    const filtered = products.filter(p => {
      const matchesType = p.type.toLowerCase() === type.toLowerCase()
      const inStock = settings.menu_show_out_of_stock ? true : p.in_stock
      return matchesType && inStock
    })
    
    // Sort based on group_by setting
    if (settings.edibles_group_by === 'dosage') {
      return filtered.sort((a, b) => {
        const aDosage = parseInt(a.dosage?.replace(/[^0-9]/g, '') || '0')
        const bDosage = parseInt(b.dosage?.replace(/[^0-9]/g, '') || '0')
        return aDosage - bDosage
      })
    }
    return filtered
  }

  const cookieProducts = getProductsByType('cookie')
  const gummyProducts = getProductsByType('gummy')
  const moonwaterProducts = getProductsByType('moonwater')

  // Combined effects for each type - multi-word messages
  const allCookieEffects = [
    "SWEET COMFORT VIBES",
    "RELAXING TREAT TIME", 
    "CLASSIC COOKIE HIGH",
    "GENTLE BODY BUZZ",
    "COZY EVENING MOOD"
  ]
  const allGummyEffects = [
    "FRUITY FLAVOR BURST",
    "SMOOTH ONSET WAVES", 
    "COLORFUL HAPPY FEELS",
    "LONG LASTING EFFECTS",
    "TASTY EDIBLE JOURNEY"
  ]
  const allMoonwaterEffects = [
    "LIQUID REFRESHMENT",
    "HYDRATING ELEVATION",
    "SPARKLING GOOD TIMES", 
    "LIGHT SOCIAL BUZZ",
    "CRISP CLEAN EFFECTS"
  ]

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col bg-neutral-600 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl text-white">{settings.message_loading || 'Loading edibles menu...'}</div>
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

  // Get column configuration
  const columns = settings.layout_columns_edibles || 2
  const gridCols = columns === 1 ? 'grid-cols-1' : columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-3' : 'grid-cols-4'

  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-600 relative overflow-hidden">
      
      {/* Background based on settings */}
      {settings.global_background_style === 'grid' && (
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}
        ></div>
      )}
      
      {/* Navigation - conditionally shown based on settings */}
      {settings.feature_navigation_menu !== false && <Navigation />}
      
      {/* Font Size Toggle - conditionally shown based on settings */}
      {settings.feature_font_size_control !== false && (
        <div className="absolute top-4 right-4 z-[9999] flex items-center space-x-3 bg-black/40 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 pointer-events-auto">
          <button
            onClick={decreaseFontSize}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-apple-bold text-sm transition-all duration-200 flex items-center justify-center cursor-pointer"
            type="button"
          >
            A-
          </button>
          <span className="text-white/80 font-apple-medium text-sm min-w-[3rem] text-center">
            {Math.round((fontSize / 170) * 100)}%
          </span>
          <button
            onClick={increaseFontSize}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-apple-bold text-sm transition-all duration-200 flex items-center justify-center cursor-pointer"
            type="button"
          >
            A+
          </button>
        </div>
      )}

      {/* Luxury Background Effects - kept minimal to not interfere with matrix */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Premium mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 relative z-20">
        {/* Luxury Title */}
        <div className="text-center -mb-6 p-8">
          <h1 className="font-don-graffiti text-white tracking-[0.3em] mb-2 drop-shadow-2xl" style={{ fontSize: '96px', textShadow: '0 8px 32px rgba(0, 0, 0, 0.8)' }}>EDIBLES</h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
        </div>
        
        <div className="space-y-2">
          {/* Render sections based on settings */}
          {settings.edibles_group_by === 'alphabetical' ? (
            // Alphabetical grouping - show all products in one section
            products.filter(p => settings.menu_show_out_of_stock ? true : p.in_stock).length > 0 && (
              <div className="p-4 bg-white/5 backdrop-blur-md">
                {settings.edibles_show_type_headers !== false && (
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-6">
                      <h2 className="text-3xl font-apple-bold text-white tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>ALL EDIBLES</h2>
                    </div>
                    <div className="w-16 h-px bg-gradient-to-r from-white to-gray-400"></div>
                  </div>
                )}
                <div className="space-y-0">
                  {/* Dynamic headers based on settings */}
                  <div className={`grid ${settings.edibles_show_dosage !== false ? 'grid-cols-2' : 'grid-cols-1'} gap-2 items-center py-1 bg-white/5`}>
                    <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">FLAVOR</h3>
                    {settings.edibles_show_dosage !== false && (
                      <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">DOSAGE</h3>
                    )}
                  </div>
                  {products.filter(p => settings.menu_show_out_of_stock ? true : p.in_stock)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((product, index) => (
                    <div key={product.id} className={`grid ${settings.edibles_show_dosage !== false ? 'grid-cols-2' : 'grid-cols-1'} gap-2 items-center py-1 ${index % 2 === 1 ? 'bg-white/5' : ''}`}>
                      <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>{product.name}</h3>
                      {settings.edibles_show_dosage !== false && (
                        <span className="text-lg font-apple-bold text-gray-400 tracking-tight text-right">
                          {product.dosage ? `${product.dosage}${settings.edibles_dosage_unit === 'g' ? '' : ''}` : 'N/A'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : settings.edibles_group_by === 'dosage' ? (
            // Dosage grouping - show products sorted by dosage
            products.filter(p => settings.menu_show_out_of_stock ? true : p.in_stock).length > 0 && (
              <div className="p-4 bg-white/5 backdrop-blur-md">
                {settings.edibles_show_type_headers !== false && (
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-6">
                      <h2 className="text-3xl font-apple-bold text-white tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>BY DOSAGE</h2>
                    </div>
                    <div className="w-16 h-px bg-gradient-to-r from-white to-gray-400"></div>
                  </div>
                )}
                <div className="space-y-0">
                  <div className={`grid ${settings.edibles_show_dosage !== false ? 'grid-cols-2' : 'grid-cols-1'} gap-2 items-center py-1 bg-white/5`}>
                    <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">FLAVOR</h3>
                    {settings.edibles_show_dosage !== false && (
                      <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">DOSAGE</h3>
                    )}
                  </div>
                  {products.filter(p => settings.menu_show_out_of_stock ? true : p.in_stock)
                    .sort((a, b) => {
                      const aDosage = parseInt(a.dosage?.replace(/[^0-9]/g, '') || '0')
                      const bDosage = parseInt(b.dosage?.replace(/[^0-9]/g, '') || '0')
                      return aDosage - bDosage
                    })
                    .map((product, index) => (
                    <div key={product.id} className={`grid ${settings.edibles_show_dosage !== false ? 'grid-cols-2' : 'grid-cols-1'} gap-2 items-center py-1 ${index % 2 === 1 ? 'bg-white/5' : ''}`}>
                      <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>{product.name}</h3>
                      {settings.edibles_show_dosage !== false && (
                        <span className="text-lg font-apple-bold text-gray-400 tracking-tight text-right">
                          {product.dosage ? `${product.dosage}${settings.edibles_dosage_unit === 'g' ? '' : ''}` : 'N/A'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            // Type-based grouping (default)
            <>
              {/* Cookies Section */}
              {cookieProducts.length > 0 && (
                <div className="p-4 bg-white/5 backdrop-blur-md">
                  {settings.edibles_show_type_headers !== false && (
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-6">
                        <h2 className="text-3xl font-apple-bold text-amber-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>COOKIES</h2>
                        {settings.edibles_show_effects !== false && (
                          <FlipboardEffects messages={allCookieEffects} type="cookies" />
                        )}
                      </div>
                      <div className="w-16 h-px bg-gradient-to-r from-amber-400 to-orange-400"></div>
                    </div>
                  )}
                  <div className="space-y-0">
                    <div className={`grid ${settings.edibles_show_dosage !== false ? 'grid-cols-2' : 'grid-cols-1'} gap-2 items-center py-1 bg-white/5`}>
                      <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">FLAVOR</h3>
                      {settings.edibles_show_dosage !== false && (
                        <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">DOSAGE</h3>
                      )}
                    </div>
                    {cookieProducts.map((product, index) => (
                      <div key={product.id} className={`grid ${settings.edibles_show_dosage !== false ? 'grid-cols-2' : 'grid-cols-1'} gap-2 items-center py-1 ${index % 2 === 1 ? 'bg-white/5' : ''}`}>
                        <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>{product.name}</h3>
                        {settings.edibles_show_dosage !== false && (
                          <span className="text-lg font-apple-bold text-amber-400 tracking-tight text-right">
                            {product.dosage ? `${product.dosage}${settings.edibles_dosage_unit === 'g' ? '' : ''}` : 'N/A'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gummies Section */}
              {gummyProducts.length > 0 && (
                <div className={`p-4 bg-white/5 backdrop-blur-md ${(cookieProducts.length > 0) ? 'border-t border-white/10' : ''}`}>
                  {settings.edibles_show_type_headers !== false && (
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-6">
                        <h2 className="text-3xl font-apple-bold text-pink-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>GUMMIES</h2>
                        {settings.edibles_show_effects !== false && (
                          <FlipboardEffects messages={allGummyEffects} type="gummies" />
                        )}
                      </div>
                      <div className="w-16 h-px bg-gradient-to-r from-pink-400 to-purple-400"></div>
                    </div>
                  )}
                  <div className="space-y-0">
                    <div className="grid grid-cols-2 gap-2 items-center py-1 bg-white/5">
                      <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">FLAVOR</h3>
                      <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">DOSAGE</h3>
                    </div>
                    {gummyProducts.map((product, index) => (
                      <div key={product.id} className={`grid ${settings.edibles_show_dosage !== false ? 'grid-cols-2' : 'grid-cols-1'} gap-2 items-center py-1 ${index % 2 === 1 ? 'bg-white/5' : ''}`}>
                        <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>{product.name}</h3>
                        {settings.edibles_show_dosage !== false && (
                          <span className="text-lg font-apple-bold text-pink-400 tracking-tight text-right">{product.dosage || 'N/A'}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Moonwater Section */}
              {moonwaterProducts.length > 0 && (
                <div className={`p-4 bg-white/5 backdrop-blur-md ${(cookieProducts.length > 0 || gummyProducts.length > 0) ? 'border-t border-white/10' : ''}`}>
                  {settings.edibles_show_type_headers !== false && (
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-6">
                        <h2 className="text-3xl font-apple-bold text-cyan-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>MOONWATER</h2>
                        {settings.edibles_show_effects !== false && (
                          <FlipboardEffects messages={allMoonwaterEffects} type="moonwater" />
                        )}
                      </div>
                      <div className="w-16 h-px bg-gradient-to-r from-cyan-400 to-blue-400"></div>
                    </div>
                  )}
                  <div className="space-y-0">
                    <div className="grid grid-cols-2 gap-2 items-center py-1 bg-white/5">
                      <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">FLAVOR</h3>
                      <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">DOSAGE</h3>
                    </div>
                    {moonwaterProducts.map((product, index) => (
                      <div key={product.id} className={`grid ${settings.edibles_show_dosage !== false ? 'grid-cols-2' : 'grid-cols-1'} gap-2 items-center py-1 ${index % 2 === 1 ? 'bg-white/5' : ''}`}>
                        <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>{product.name}</h3>
                        {settings.edibles_show_dosage !== false && (
                          <span className="text-lg font-apple-bold text-cyan-400 tracking-tight text-right">{product.dosage || 'N/A'}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* No Products Message */}
          {products.length === 0 && (
            <div className="p-4 bg-white/5 backdrop-blur-md">
              <div className="text-center text-white/60">
                <h3 className="text-2xl font-apple-bold mb-2">No Edibles Available</h3>
                <p className="text-lg">{settings.message_no_products || 'Check back soon for updates!'}</p>
              </div>
            </div>
          )}
        </div>
      </main>

    </div>
  )
} 