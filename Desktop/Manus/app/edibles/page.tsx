'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Edible {
  name: string
  type: string
  dosage: string
  description: string
  category: string
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
  }
]

// Matrix Rain Component
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Matrix characters
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{}[]|:;<>,.?=-"
    const matrixArray = matrix.split("")

    const fontSize = 12
    const columns = canvas.width / fontSize

    const drops: number[] = []
    for (let x = 0; x < columns; x++) {
      drops[x] = 1
    }

    const draw = () => {
      // Semi-transparent black background for trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#00ff41' // Matrix green
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ opacity: 0.3 }}
    />
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
        <h3 className="text-4xl font-apple-light text-white tracking-wide">{edible.name}</h3>
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

  return (
    <div className="h-screen w-screen flex flex-col bg-black relative overflow-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain />
      
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
      <main className="flex-1 relative z-20 overflow-y-auto">
        {/* Luxury Title */}
        <div className="text-center p-8 mb-2">
          <h1 className="font-don-graffiti text-white tracking-[0.3em] mb-2" style={{ fontSize: '96px' }}>EDIBLES</h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent mx-auto mb-6"></div>
          
          {/* Fun Warning */}
          <div className="glass-dark rounded-2xl p-6 max-w-4xl mx-auto border border-red-400/30 bg-red-400/5">
            <h2 className="text-3xl font-apple-bold text-red-400 tracking-wide mb-2">⚠️ EFFECTS WARNING</h2>
            <p className="text-2xl font-apple-light text-white italic tracking-wide">
              These will fuck you up.
            </p>
          </div>
        </div>
        
        {/* Cookies Section */}
        <div className="px-8 py-3 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-apple-bold text-amber-400 tracking-tight">COOKIES</h2>
            <div className="w-16 h-px bg-gradient-to-r from-amber-400 to-orange-400"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-7xl mx-auto mb-8">
            {edibleData.filter(edible => edible.category === 'cookies').map((edible, index) => (
              <EdibleCard key={index} edible={edible} />
            ))}
          </div>
        </div>

        {/* Gummies Section */}
        <div className="px-8 py-3 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-apple-bold text-pink-400 tracking-tight">GUMMIES</h2>
            <div className="w-16 h-px bg-gradient-to-r from-pink-400 to-purple-400"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-7xl mx-auto pb-8">
            {edibleData.filter(edible => edible.category === 'gummies').map((edible, index) => (
              <EdibleCard key={index} edible={edible} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 