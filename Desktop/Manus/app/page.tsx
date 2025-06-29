'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCategoryData } from '../lib/hooks/useMenuData'

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
  const { products, loading, error, refetch } = useCategoryData('flower')

  const increaseFontSize = () => {
    console.log('Increasing font size from', fontSize)
    setFontSize(prev => Math.min(prev + 10, 250))
  }

  const decreaseFontSize = () => {
    console.log('Decreasing font size from', fontSize)
    setFontSize(prev => Math.max(prev - 10, 120))
  }

  useEffect(() => {
    // Apply font size to document root
    document.documentElement.style.fontSize = `${fontSize}%`
    console.log('Applied font size:', fontSize + '%')
  }, [fontSize])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 30000)

    return () => clearInterval(interval)
  }, [refetch])

  // Group products by type
  const getProductsByType = (type: string) => {
    return products.filter(p => p.type.toLowerCase() === type.toLowerCase() && p.in_stock)
  }

  const indicaProducts = getProductsByType('indica')
  const hybridProducts = getProductsByType('hybrid')
  const sativaProducts = getProductsByType('sativa')

  // Combined effects for each type - multi-word messages
  const allIndicaEffects = [
    "DEEP BODY RELAXATION",
    "PEACEFUL SLEEP AID", 
    "STRESS RELIEF MODE",
    "COUCH LOCK VIBES",
    "MUNCHIES ACTIVATED"
  ]
  const allSativaEffects = [
    "CREATIVE ENERGY BOOST",
    "FOCUSED PRODUCTIVITY", 
    "SOCIAL CONFIDENCE UP",
    "MORNING WAKE AND BAKE",
    "ADVENTURE READY MODE"
  ]
  const allHybridEffects = [
    "PERFECT BALANCE FOUND",
    "VERSATILE DAILY USE",
    "MOOD ENHANCEMENT ON", 
    "SOCIAL OR SOLO READY",
    "BEST OF BOTH WORLDS"
  ]

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col bg-neutral-600 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-2xl text-white">Loading flower menu...</div>
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

      {/* Luxury Background Effects - kept minimal to not interfere with matrix */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Premium mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 relative z-20">
        {/* Luxury Title */}
        <div className="text-center -mb-6 p-8">
          <h1 className="font-don-graffiti text-white tracking-[0.3em] mb-2 drop-shadow-2xl" style={{ fontSize: '96px', textShadow: '0 8px 32px rgba(0, 0, 0, 0.8)' }}>FLOWER</h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
        </div>
        
        <div className="space-y-2">
          {/* Indica Section */}
          {indicaProducts.length > 0 && (
            <div className="p-4 bg-white/5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-6">
                  <h2 className="text-3xl font-apple-bold text-purple-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>INDICA</h2>
                  <FlipboardEffects messages={allIndicaEffects} type="indica" />
                </div>
                <div className="w-16 h-px bg-gradient-to-r from-purple-400 to-pink-400"></div>
              </div>
              <div className="space-y-0">
                <div className="grid grid-cols-3 gap-2 items-center py-1 bg-white/5">
                  <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">STRAIN</h3>
                  <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">TERPENES</h3>
                  <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">THCA</h3>
                </div>
                {indicaProducts.map((product, index) => (
                  <div key={product.id} className={`grid grid-cols-3 gap-2 items-center py-1 ${index % 2 === 1 ? 'bg-white/5' : ''}`}>
                    <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>{product.name}</h3>
                    <span className="text-lg font-apple-semibold text-purple-400 italic tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>
                      {product.terpenes && product.terpenes.length > 0 ? product.terpenes[0] : 'N/A'}
                    </span>
                    <span className="text-lg font-apple-bold text-purple-400 tracking-tight text-right drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>{product.thca || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hybrid Section */}
          {hybridProducts.length > 0 && (
            <div className={`p-4 bg-white/5 backdrop-blur-md ${(indicaProducts.length > 0) ? 'border-t border-white/10' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-6">
                  <h2 className="text-3xl font-apple-bold text-emerald-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>HYBRID</h2>
                  <FlipboardEffects messages={allHybridEffects} type="hybrid" />
                </div>
                <div className="w-16 h-px bg-gradient-to-r from-emerald-400 to-teal-400"></div>
              </div>
              <div className="space-y-0">
                <div className="grid grid-cols-3 gap-2 items-center py-1 bg-white/5">
                  <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">STRAIN</h3>
                  <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">TERPENES</h3>
                  <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">THCA</h3>
                </div>
                {hybridProducts.map((product, index) => (
                  <div key={product.id} className={`grid grid-cols-3 gap-2 items-center py-1 ${index % 2 === 1 ? 'bg-white/5' : ''}`}>
                    <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>{product.name}</h3>
                    <span className="text-lg font-apple-semibold text-emerald-400 italic tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>
                      {product.terpenes && product.terpenes.length > 0 ? product.terpenes[0] : 'N/A'}
                    </span>
                    <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>{product.thca || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sativa Section */}
          {sativaProducts.length > 0 && (
            <div className={`p-4 bg-white/5 backdrop-blur-md ${(indicaProducts.length > 0 || hybridProducts.length > 0) ? 'border-t border-white/10' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-6">
                  <h2 className="text-3xl font-apple-bold text-orange-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>SATIVA</h2>
                  <FlipboardEffects messages={allSativaEffects} type="sativa" />
                </div>
                <div className="w-16 h-px bg-gradient-to-r from-orange-400 to-red-400"></div>
              </div>
              <div className="space-y-0">
                <div className="grid grid-cols-3 gap-2 items-center py-1 bg-white/5">
                  <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">STRAIN</h3>
                  <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">TERPENES</h3>
                  <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">THCA</h3>
                </div>
                {sativaProducts.map((product, index) => (
                  <div key={product.id} className={`grid grid-cols-3 gap-2 items-center py-1 ${index % 2 === 1 ? 'bg-white/5' : ''}`}>
                    <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>{product.name}</h3>
                    <span className="text-lg font-apple-semibold text-orange-400 italic tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>
                      {product.terpenes && product.terpenes.length > 0 ? product.terpenes[0] : 'N/A'}
                    </span>
                    <span className="text-lg font-apple-bold text-orange-400 tracking-tight text-right drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>{product.thca || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Products Message */}
          {products.length === 0 && (
            <div className="p-4 bg-white/5 backdrop-blur-md">
              <div className="text-center text-white/60">
                <h3 className="text-2xl font-apple-bold mb-2">No Products Available</h3>
                <p className="text-lg">Check back soon for updates!</p>
              </div>
            </div>
          )}

          {/* Pre-roll Disclaimer Section */}
          <div className={`p-4 bg-white/5 backdrop-blur-md ${(indicaProducts.length > 0 || hybridProducts.length > 0 || sativaProducts.length > 0) ? 'border-t border-white/10' : ''}`}>
            <p className="text-lg font-apple-medium text-red-400 text-center leading-relaxed drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>
              Pre Rolls are made to order using fresh flower of any strain!
            </p>
          </div>
        </div>
      </main>

    </div>
  )
}