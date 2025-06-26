'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface Edible {
  name: string
  type: string
  dosage: string
  description: string
  category: string
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

const edibleData: Edible[] = [
  {
    name: "Thin Mints",
    type: "Cookie",
    dosage: "100mg",
    description: "Classic minty chocolate cookie with smooth relaxing effects",
    category: "cookies"
  },
  {
    name: "Snicker Doodle",
    type: "Cookie", 
    dosage: "100mg",
    description: "Cinnamon-sugar perfection with gentle uplifting effects",
    category: "cookies"
  },
  {
    name: "Peanut Butter",
    type: "Cookie",
    dosage: "100mg",
    description: "Rich peanut butter flavor with well-rounded balanced effects",
    category: "cookies"
  },
  {
    name: "Chocolate Chip",
    type: "Cookie",
    dosage: "100mg",
    description: "Classic comfort cookie with cheerful euphoric effects",
    category: "cookies"
  },
  {
    name: "Watermelon",
    type: "Gummy",
    dosage: "100mg",
    description: "Juicy watermelon flavor with light social effects",
    category: "gummies"
  },
  {
    name: "Apple",
    type: "Gummy",
    dosage: "100mg",
    description: "Crisp apple taste with energizing focus enhancement",
    category: "gummies"
  },
  {
    name: "Blueberry",
    type: "Gummy",
    dosage: "100mg",
    description: "Sweet blueberry burst with gentle calming effects",
    category: "gummies"
  },
  {
    name: "Honey",
    type: "Gummy",
    dosage: "100mg",
    description: "Natural honey sweetness with soothing balanced effects",
    category: "gummies"
  },
  {
    name: "Fruit Punch",
    type: "Gummy",
    dosage: "100mg",
    description: "Tropical fruit medley with vibrant energetic effects",
    category: "gummies"
  },
  {
    name: "Grape",
    type: "Gummy",
    dosage: "100mg",
    description: "Bold grape flavor with deeply relaxing effects",
    category: "gummies"
  },
  {
    name: "Green Tea",
    type: "Gummy",
    dosage: "100mg",
    description: "Zen-like green tea with calming focused effects",
    category: "gummies"
  },
  {
    name: "Raspberry",
    type: "Gummy",
    dosage: "100mg",
    description: "Tart raspberry tang with uplifting creative effects",
    category: "gummies"
  },
  {
    name: "Clementine Orange",
    type: "Moonwater",
    dosage: "5mg, 10mg, 30mg",
    description: "Citrus burst with energizing uplifting effects",
    category: "moonwater"
  },
  {
    name: "Lemon Ginger",
    type: "Moonwater",
    dosage: "5mg, 10mg, 30mg",
    description: "Zesty blend with calming focused effects",
    category: "moonwater"
  },
  {
    name: "Fizzy Punch",
    type: "Moonwater",
    dosage: "5mg, 10mg, 30mg",
    description: "Tropical fizz with vibrant energetic effects",
    category: "moonwater"
  },
  {
    name: "Fizzy Lemonade",
    type: "Moonwater",
    dosage: "5mg, 10mg, 30mg",
    description: "Sparkling citrus with balanced social effects",
    category: "moonwater"
  }
]

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
          className="block px-6 py-4 text-white hover:bg-white/10 transition-all duration-200 font-apple-medium text-pink-400"
        >
          EDIBLES
        </Link>
      </div>
    </div>
  )
}

const EdibleCard = ({ edible }: { edible: Edible }) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cookies': return 'text-amber-400'
      case 'gummies': return 'text-pink-400'
      default: return 'text-white'
    }
  }

  const getCategoryGradient = (category: string) => {
    switch (category.toLowerCase()) {
      case 'cookies': return 'from-amber-400 to-orange-400'
      case 'gummies': return 'from-pink-400 to-purple-400'
      default: return 'from-white to-gray-400'
    }
  }

  return (
    <div className="glass-dark rounded-2xl p-4 hover:bg-white/5 transition-all duration-300 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-4xl font-apple-light text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>{edible.name}</h3>
        <span className="text-xl font-apple-light text-red-400 tracking-tight">{edible.dosage}</span>
      </div>

      <div className="border-t border-white/10 pt-3">
        <p className="text-lg font-apple-light text-white/70 italic leading-snug">
          {edible.description}
        </p>
      </div>
    </div>
  )
}

export default function EdiblesPage() {
  const [fontSize, setFontSize] = useState(170)

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 10, 250))
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 10, 80))
  }

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`
  }, [fontSize])

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
          <h1 className="font-don-graffiti text-white tracking-[0.3em] mb-2 drop-shadow-2xl" style={{ fontSize: '96px', textShadow: '0 8px 32px rgba(0, 0, 0, 0.8)' }}>EDIBLES</h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
        </div>
        
        <div className="space-y-4 px-8">
          {/* Cookies Section */}
          <div className="rounded-2xl p-4 bg-white/5 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-6">
                <h2 className="text-3xl font-apple-bold text-amber-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>COOKIES</h2>
                <FlipboardEffects messages={allCookieEffects} type="cookies" />
              </div>
              <div className="w-16 h-px bg-gradient-to-r from-amber-400 to-orange-400"></div>
            </div>
            <div className="space-y-0">
              <div className="grid grid-cols-3 gap-2 items-center py-0.5 border-b border-white/10">
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">FLAVOR</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">EFFECTS</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">DOSAGE</h3>
              </div>
              {edibleData.filter(edible => edible.category === 'cookies').map((edible, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 items-center py-0.5 border-b border-white/5 last:border-b-0">
                  <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>{edible.name}</h3>
                  <span className="text-lg font-thin text-white/70 italic tracking-wide">{edible.description.split(' ').slice(-2).join(' ')}</span>
                  <span className="text-lg font-apple-bold text-amber-400 tracking-tight text-right">{edible.dosage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gummies Section */}
          <div className="rounded-2xl p-4 bg-white/5 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-6">
                <h2 className="text-3xl font-apple-bold text-pink-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>GUMMIES</h2>
                <FlipboardEffects messages={allGummyEffects} type="gummies" />
              </div>
              <div className="w-16 h-px bg-gradient-to-r from-pink-400 to-purple-400"></div>
            </div>
             <div className="space-y-0">
               <div className="grid grid-cols-3 gap-2 items-center py-0.5 border-b border-white/10">
                 <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">FLAVOR</h3>
                 <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">EFFECTS</h3>
                 <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">DOSAGE</h3>
               </div>
               {edibleData.filter(edible => edible.category === 'gummies').map((edible, index) => (
                 <div key={index} className="grid grid-cols-3 gap-2 items-center py-0.5 border-b border-white/5 last:border-b-0">
                   <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>{edible.name}</h3>
                   <span className="text-lg font-thin text-white/70 italic tracking-wide">{edible.description.split(' ').slice(-2).join(' ')}</span>
                   <span className="text-lg font-apple-bold text-pink-400 tracking-tight text-right">{edible.dosage}</span>
                 </div>
               ))}
             </div>
           </div>

          {/* Moonwater Section */}
          <div className="rounded-2xl p-4 bg-white/5 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-6">
                <h2 className="text-3xl font-apple-bold text-cyan-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>MOONWATER</h2>
                <FlipboardEffects messages={allMoonwaterEffects} type="moonwater" />
              </div>
              <div className="w-16 h-px bg-gradient-to-r from-cyan-400 to-blue-400"></div>
            </div>
             <div className="space-y-0">
               <div className="grid grid-cols-3 gap-2 items-center py-0.5 border-b border-white/10">
                 <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">FLAVOR</h3>
                 <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">EFFECTS</h3>
                 <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">DOSAGE</h3>
               </div>
               {edibleData.filter(edible => edible.category === 'moonwater').map((edible, index) => (
                 <div key={index} className="grid grid-cols-3 gap-2 items-center py-0.5 border-b border-white/5 last:border-b-0">
                   <h3 className="text-lg font-apple-semibold text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>{edible.name}</h3>
                   <span className="text-lg font-thin text-white/70 italic tracking-wide">{edible.description.split(' ').slice(-2).join(' ')}</span>
                   <span className="text-lg font-apple-bold text-cyan-400 tracking-tight text-right">{edible.dosage}</span>
                 </div>
               ))}
             </div>
           </div>
         </div>
      </main>
    </div>
  )
} 