'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

// Types
interface PricingRule {
  id: string
  name: string
  category: string
  type: 'percentage_discount' | 'fixed_discount' | 'bundle' | 'special'
  value: number
  conditions: any
  is_active: boolean
  priority: number
  description?: string
  valid_from?: string
  valid_until?: string
}

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
      case 'percentage_discount': return 'text-purple-400'
      case 'fixed_discount': return 'text-emerald-400'
      case 'bundle': return 'text-amber-400'
      case 'special': return 'text-pink-400'
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
          className="block px-6 py-4 text-white hover:bg-white/10 transition-all duration-200 font-apple-medium border-b border-white/10"
        >
          EDIBLES
        </Link>
        <Link 
          href="/specials"
          className="block px-6 py-4 text-white hover:bg-white/10 transition-all duration-200 font-apple-medium text-purple-400 border-b border-white/10"
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

export default function SpecialsPage() {
  const [fontSize, setFontSize] = useState(170)
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 10, 250))
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 10, 80))
  }

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`
  }, [fontSize])

  // Fetch real specials from database
  const fetchSpecials = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/pricing')
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setPricingRules(data.pricing_rules || [])
    } catch (err) {
      console.error('Error fetching specials:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpecials()
  }, [])

  // Auto-refresh every 30 seconds like other pages
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSpecials()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Toggle special active/inactive
  const toggleSpecialStatus = async (specialId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/pricing/${specialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive })
      })

      if (!response.ok) {
        throw new Error('Failed to update special status')
      }

      // Refresh the specials list
      await fetchSpecials()
    } catch (err) {
      console.error('Error toggling special status:', err)
      alert('Error updating special: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  // Get rules by type
  const getDiscountRules = () => pricingRules.filter(rule => 
    (rule.type === 'percentage_discount' || rule.type === 'fixed_discount') && rule.is_active
  )
  
  const getBundleRules = () => pricingRules.filter(rule => rule.type === 'bundle' && rule.is_active)
  
  const getSpecialRules = () => pricingRules.filter(rule => rule.type === 'special' && rule.is_active)

  // Get all rules for management view
  const getAllRules = () => pricingRules.filter(rule => 
    rule.type === 'percentage_discount' || rule.type === 'fixed_discount' || 
    rule.type === 'bundle' || rule.type === 'special'
  )

  // Combined effects for specials using consistent colors
  const allSpecialEffects = [
    "AMAZING DEALS ACTIVE",
    "LIMITED TIME OFFERS",
    "EXCLUSIVE DISCOUNTS", 
    "SPECIAL PRICING NOW",
    "SAVINGS OPPORTUNITIES"
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage_discount': return 'purple-400'
      case 'fixed_discount': return 'emerald-400'
      case 'bundle': return 'amber-400'
      case 'special': return 'pink-400'
      default: return 'white'
    }
  }

  const getTypeGradient = (type: string) => {
    switch (type) {
      case 'percentage_discount': return 'from-purple-400 to-pink-400'
      case 'fixed_discount': return 'from-emerald-400 to-teal-400'
      case 'bundle': return 'from-amber-400 to-orange-400'
      case 'special': return 'from-pink-400 to-purple-400'
      default: return 'from-white to-gray-400'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage_discount': return 'PERCENTAGE DEALS'
      case 'fixed_discount': return 'DOLLAR DISCOUNTS'
      case 'bundle': return 'BUNDLE DEALS'
      case 'special': return 'FLASH SPECIALS'
      default: return 'DEALS'
    }
  }

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col bg-neutral-600 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl text-white">Loading specials...</div>
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
              onClick={fetchSpecials}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-neutral-600 relative overflow-hidden">
      
      {/* Light Grid Background */}
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
      
      {/* Navigation */}
      <Navigation />
      
      {/* Font Size Toggle */}
      <div className="absolute top-4 right-4 z-[9999] flex items-center space-x-3 bg-black/40 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 pointer-events-auto">
        <button
          onClick={decreaseFontSize}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-apple-bold text-sm transition-all duration-200 flex items-center justify-center cursor-pointer"
          type="button"
        >
          A-
        </button>
        <span className="text-white/80 font-apple-medium text-sm min-w-[3rem] text-center">
          {fontSize}%
        </span>
        <button
          onClick={increaseFontSize}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white font-apple-bold text-sm transition-all duration-200 flex items-center justify-center cursor-pointer"
          type="button"
        >
          A+
        </button>
      </div>

      {/* Luxury Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 relative z-20">
        {/* Luxury Title */}
        <div className="text-center -mb-6 p-8">
          <h1 className="font-don-graffiti text-white tracking-[0.3em] mb-2 drop-shadow-2xl" style={{ fontSize: '96px', textShadow: '0 8px 32px rgba(0, 0, 0, 0.8)' }}>SPECIALS</h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
        </div>
        
        <div className="space-y-2">
          {/* Active Specials by Type */}
          {['percentage_discount', 'fixed_discount', 'bundle', 'special'].map(dealType => {
            const typeRules = pricingRules.filter(rule => rule.type === dealType && rule.is_active)
            if (typeRules.length === 0) return null

            return (
              <div key={dealType} className="p-4 bg-white/5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-6">
                    <h2 className={`text-3xl font-apple-bold text-${getTypeColor(dealType)} tracking-tight drop-shadow-lg`} style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>
                      {getTypeLabel(dealType)}
                    </h2>
                    <FlipboardEffects messages={allSpecialEffects} type={dealType} />
                  </div>
                  <div className={`w-16 h-px bg-gradient-to-r ${getTypeGradient(dealType)}`}></div>
                </div>
                <div className="space-y-0">
                  <div className="grid grid-cols-5 gap-2 items-center py-1 bg-white/5">
                    <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">DEAL NAME</h3>
                    <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">CATEGORY</h3>
                    <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">DISCOUNT</h3>
                    <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">VALID UNTIL</h3>
                    <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">STATUS</h3>
                  </div>
                  {typeRules.map((rule, index) => (
                    <div key={rule.id} className={`grid grid-cols-5 gap-2 items-center py-1 ${index % 2 === 1 ? 'bg-white/5' : ''}`}>
                      <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>
                        {rule.name}
                      </h3>
                      <span className="text-lg font-apple-medium text-white/70 capitalize tracking-wide">
                        {rule.category}
                      </span>
                      <span className={`text-lg font-apple-bold text-${getTypeColor(dealType)} tracking-tight`}>
                        {rule.type === 'percentage_discount' ? `${rule.value}% OFF` : 
                         rule.type === 'fixed_discount' ? `$${rule.value} OFF` :
                         rule.type === 'bundle' ? `$${rule.value}` :
                         `$${rule.value}`}
                      </span>
                      <span className="text-lg font-apple-medium text-white/60 tracking-wide">
                        {rule.valid_until ? new Date(rule.valid_until).toLocaleDateString() : 'No expiry'}
                      </span>
                      <div className="text-right">
                        <button
                          onClick={() => toggleSpecialStatus(rule.id, rule.is_active)}
                          className={`px-3 py-1 rounded-full text-sm font-apple-bold transition-all duration-200 ${
                            rule.is_active 
                              ? `bg-${getTypeColor(dealType)}/20 text-${getTypeColor(dealType)} hover:bg-${getTypeColor(dealType)}/30` 
                              : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                          }`}
                        >
                          {rule.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {/* Inactive Specials Management */}
          {pricingRules.filter(rule => !rule.is_active).length > 0 && (
            <div className="p-4 bg-white/5 backdrop-blur-md border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-6">
                  <h2 className="text-3xl font-apple-bold text-gray-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>ARCHIVED DEALS</h2>
                </div>
                <div className="w-16 h-px bg-gradient-to-r from-gray-400 to-gray-600"></div>
              </div>
              <div className="space-y-0">
                <div className="grid grid-cols-5 gap-2 items-center py-1 bg-white/5">
                  <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">DEAL NAME</h3>
                  <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">TYPE</h3>
                  <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">DISCOUNT</h3>
                  <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">CATEGORY</h3>
                  <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">ACTION</h3>
                </div>
                {pricingRules.filter(rule => !rule.is_active).map((rule, index) => (
                  <div key={rule.id} className={`grid grid-cols-5 gap-2 items-center py-1 ${index % 2 === 1 ? 'bg-white/5' : ''}`}>
                    <h3 className="text-lg font-apple-semibold text-gray-400 tracking-wide">
                      {rule.name}
                    </h3>
                    <span className="text-lg font-apple-medium text-gray-500 capitalize tracking-wide">
                      {rule.type.replace('_', ' ')}
                    </span>
                    <span className="text-lg font-apple-bold text-gray-400 tracking-tight">
                      {rule.type === 'percentage_discount' ? `${rule.value}% OFF` : 
                       rule.type === 'fixed_discount' ? `$${rule.value} OFF` :
                       `$${rule.value}`}
                    </span>
                    <span className="text-lg font-apple-medium text-gray-500 capitalize tracking-wide">
                      {rule.category}
                    </span>
                    <div className="text-right">
                      <button
                        onClick={() => toggleSpecialStatus(rule.id, rule.is_active)}
                        className="px-3 py-1 rounded-full text-sm font-apple-bold bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-all duration-200"
                      >
                        ACTIVATE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Specials Message */}
          {pricingRules.length === 0 && (
            <div className="p-4 bg-white/5 backdrop-blur-md">
              <div className="text-center text-white/60">
                <h3 className="text-2xl font-apple-bold mb-2">No Specials Available</h3>
                <p className="text-lg">Create specials in the Admin panel to see them here!</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 