'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface Strain {
  name: string
  thc: string
  cbd: string
  price: string
  effects: string[]
  description: string
  inStock: boolean
}

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

const strainData = {
  sativa: [
    {
      name: "Green Crack",
      thc: "22%",
      cbd: "0.1%",
      price: "$45/eighth",
      effects: ["Energetic", "Creative", "Focused"],
      description: "A potent sativa that delivers invigorating mental energy",
      inStock: true
    },
    {
      name: "Jack Herer",
      thc: "20%",
      cbd: "0.5%",
      price: "$50/eighth",
      effects: ["Uplifting", "Creative", "Happy"],
      description: "Named after the cannabis activist, perfect for daytime use",
      inStock: true
    },
    {
      name: "Durban Poison",
      thc: "24%",
      cbd: "0.2%",
      price: "$48/eighth",
      effects: ["Energetic", "Euphoric", "Clear-headed"],
      description: "Pure sativa from South Africa with sweet anise flavor",
      inStock: false
    },
    {
      name: "Sour Diesel",
      thc: "21%",
      cbd: "0.3%",
      price: "$46/eighth",
      effects: ["Energetic", "Uplifting", "Creative"],
      description: "Fast-acting strain that delivers energizing effects",
      inStock: true
    }
  ],
  indica: [
    {
      name: "Purple Kush",
      thc: "19%",
      cbd: "0.4%",
      price: "$42/eighth",
      effects: ["Relaxing", "Sleepy", "Happy"],
      description: "Pure indica from the Oakland area of California",
      inStock: true
    },
    {
      name: "Granddaddy Purple",
      thc: "23%",
      cbd: "0.2%",
      price: "$52/eighth",
      effects: ["Relaxing", "Euphoric", "Sleepy"],
      description: "Complex grape and berry aroma inherited from Purple Urkle",
      inStock: true
    },
    {
      name: "Northern Lights",
      thc: "18%",
      cbd: "0.6%",
      price: "$40/eighth",
      effects: ["Relaxing", "Happy", "Sleepy"],
      description: "One of the most famous indica strains of all time",
      inStock: true
    },
    {
      name: "Bubba Kush",
      thc: "20%",
      cbd: "0.3%",
      price: "$44/eighth",
      effects: ["Relaxing", "Sleepy", "Happy"],
      description: "Heavy tranquilizing effects that promote sleep",
      inStock: false
    }
  ],
  hybrid: [
    {
      name: "Blue Dream",
      thc: "21%",
      cbd: "0.2%",
      price: "$48/eighth",
      effects: ["Balanced", "Creative", "Relaxed"],
      description: "Perfect balance of full-body relaxation with gentle euphoria",
      inStock: true
    },
    {
      name: "Girl Scout Cookies",
      thc: "25%",
      cbd: "0.1%",
      price: "$55/eighth",
      effects: ["Euphoric", "Relaxed", "Happy"],
      description: "Sweet and earthy aroma with strong euphoric effects",
      inStock: true
    },
    {
      name: "Wedding Cake",
      thc: "24%",
      cbd: "0.3%",
      price: "$54/eighth",
      effects: ["Relaxed", "Happy", "Euphoric"],
      description: "Rich and tangy with sweet undertones",
      inStock: true
    },
    {
      name: "Gelato",
      thc: "22%",
      cbd: "0.2%",
      price: "$50/eighth",
      effects: ["Balanced", "Creative", "Uplifting"],
      description: "Sweet dessert-like aroma with balanced effects",
      inStock: false
    }
  ]
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
          className="block px-6 py-4 text-white hover:bg-white/10 transition-all duration-200 font-apple-medium"
        >
          EDIBLES
        </Link>
        <Link 
          href="/pricing"
          className="block px-6 py-4 text-white hover:bg-white/10 transition-all duration-200 font-apple-medium"
        >
          PRICING
        </Link>
      </div>
    </div>
  )
}

const StrainItem = ({ strain }: { strain: Strain }) => (
  <div className="flex justify-between items-center py-3 border-b border-white/10 last:border-b-0">
          <h3 className="text-lg font-apple-semibold text-white drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>{strain.name}</h3>
    <span className="text-xl font-apple-bold text-accent-green">THCA: {strain.thc}</span>
  </div>
)

export default function MenuPage() {
  const [fontSize, setFontSize] = useState(170)

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
        
        <div className="space-y-4 px-8">
          {/* Indica Section */}
          <div className="rounded-2xl p-4 bg-white/5 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-6">
                <h2 className="text-3xl font-apple-bold text-purple-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>INDICA</h2>
                <FlipboardEffects messages={allIndicaEffects} type="indica" />
              </div>
              <div className="w-16 h-px bg-gradient-to-r from-purple-400 to-pink-400"></div>
            </div>
            <div className="space-y-0">
              <div className="grid grid-cols-4 gap-2 items-center py-0.5 border-b border-white/10">
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">STRAIN</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">TERPENES</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">EFFECTS</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">THCA</h3>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Purple Kush</h3>
                <span className="text-lg font-thin text-purple-400 italic tracking-wide">Myrcene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Sleepy</span>
                <span className="text-lg font-apple-bold text-purple-400 tracking-tight text-right">19%</span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Granddaddy Purple</h3>
                <span className="text-lg font-thin text-purple-400 italic tracking-wide">Myrcene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-purple-400 tracking-tight text-right">23%</span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Northern Lights</h3>
                <span className="text-lg font-thin text-purple-400 italic tracking-wide">Myrcene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Happy</span>
                <span className="text-lg font-apple-bold text-purple-400 tracking-tight text-right">18%</span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center py-0.5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Bubba Kush</h3>
                <span className="text-lg font-thin text-green-400 italic tracking-wide">Caryophyllene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Sleepy</span>
                <span className="text-lg font-apple-bold text-purple-400 tracking-tight text-right">20%</span>
              </div>
            </div>
          </div>

          {/* Hybrid Section */}
          <div className="rounded-2xl p-4 bg-white/5 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-6">
                <h2 className="text-3xl font-apple-bold text-emerald-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>HYBRID</h2>
                <FlipboardEffects messages={allHybridEffects} type="hybrid" />
              </div>
              <div className="w-16 h-px bg-gradient-to-r from-emerald-400 to-teal-400"></div>
            </div>
            <div className="space-y-0">
              <div className="grid grid-cols-4 gap-2 items-center py-0.5 border-b border-white/10">
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">STRAIN</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">TERPENES</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">EFFECTS</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">THCA</h3>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Crusher Candy</h3>
                <span className="text-lg font-thin text-green-400 italic tracking-wide">Caryophyllene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">24%</span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Cheetah Piss</h3>
                <span className="text-lg font-thin text-orange-400 italic tracking-wide">Limonene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">22%</span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Gelato Runtz</h3>
                <span className="text-lg font-thin text-green-400 italic tracking-wide">Caryophyllene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">25%</span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Mint Cake</h3>
                <span className="text-lg font-thin text-purple-400 italic tracking-wide">Myrcene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">23%</span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Fire Cookie</h3>
                <span className="text-lg font-thin text-orange-400 italic tracking-wide">Limonene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">26%</span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Sherb Pie</h3>
                <span className="text-lg font-thin text-blue-400 italic tracking-wide">Linalool</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">21%</span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Wild Runtz</h3>
                <span className="text-lg font-thin text-orange-400 italic tracking-wide">Limonene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">24%</span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center py-0.5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Whale Candy</h3>
                <span className="text-lg font-thin text-green-400 italic tracking-wide">Caryophyllene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">23%</span>
              </div>
            </div>
          </div>

          {/* Sativa Section */}
          <div className="rounded-2xl p-4 bg-white/5 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-6">
                <h2 className="text-3xl font-apple-bold text-orange-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>SATIVA</h2>
                <FlipboardEffects messages={allSativaEffects} type="sativa" />
              </div>
              <div className="w-16 h-px bg-gradient-to-r from-orange-400 to-red-400"></div>
            </div>
            <div className="space-y-0">
              <div className="grid grid-cols-4 gap-2 items-center py-0.5 border-b border-white/10">
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">STRAIN</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">TERPENES</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">EFFECTS</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">THCA</h3>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Green Crack</h3>
                <span className="text-lg font-thin text-purple-400 italic tracking-wide">Myrcene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Energetic, Creative</span>
                <span className="text-lg font-apple-bold text-orange-400 tracking-tight text-right">22%</span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Jack Herer</h3>
                <span className="text-lg font-thin text-yellow-400 italic tracking-wide">Terpinolene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Uplifting, Creative</span>
                <span className="text-lg font-apple-bold text-orange-400 tracking-tight text-right">20%</span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Durban Poison</h3>
                <span className="text-lg font-thin text-yellow-400 italic tracking-wide">Terpinolene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Energetic, Euphoric</span>
                <span className="text-lg font-apple-bold text-orange-400 tracking-tight text-right">24%</span>
              </div>
              <div className="grid grid-cols-4 gap-2 items-center py-0.5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Sour Diesel</h3>
                <span className="text-lg font-thin text-green-400 italic tracking-wide">Caryophyllene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Energetic, Uplifting</span>
                <span className="text-lg font-apple-bold text-orange-400 tracking-tight text-right">21%</span>
              </div>
            </div>
          </div>

          {/* Pre-roll Disclaimer Section */}
          <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-md border border-white/10" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
            <p className="text-lg font-apple-medium text-red-400 text-center leading-relaxed drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>
              Pre Rolls are made to order using fresh flower of any strain!
            </p>
          </div>
        </div>
      </main>

    </div>
  )
}