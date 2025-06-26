'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Vape {
  name: string
  type: string
  thca: string
  terpenes: string[]
  effects: string[]
  description: string
}

const vapeData: Vape[] = [
  {
    name: "Jungle Cake",
    type: "Hybrid",
    thca: "89%",
    terpenes: ["Myrcene", "Caryophyllene", "Limonene"],
    effects: ["Relaxing", "Euphoric", "Creative"],
    description: "Rich earthy flavors with tropical undertones and balanced hybrid effects"
  },
  {
    name: "White Runtz",
    type: "Hybrid",
    thca: "89%",
    terpenes: ["Limonene", "Linalool", "Caryophyllene"],
    effects: ["Balanced", "Uplifting", "Creative"],
    description: "Sweet candy-like flavor profile with perfectly balanced effects"
  },
  {
    name: "Super Skunk",
    type: "Indica",
    thca: "89%",
    terpenes: ["Myrcene", "Pinene", "Caryophyllene"],
    effects: ["Relaxing", "Sleepy", "Hungry"],
    description: "Classic skunk aroma with heavy-hitting indica effects"
  },
  {
    name: "Gelato 33",
    type: "Hybrid",
    thca: "89%",
    terpenes: ["Limonene", "Caryophyllene", "Linalool"],
    effects: ["Balanced", "Creative", "Happy"],
    description: "Dessert-like sweetness with well-rounded euphoric effects"
  },
  {
    name: "Jet Fuel",
    type: "Sativa",
    thca: "89%",
    terpenes: ["Terpinolene", "Myrcene", "Pinene"],
    effects: ["Energetic", "Focus", "Uplifting"],
    description: "Diesel-like aroma with high-energy cerebral stimulation"
  },
  {
    name: "Lemon Soda",
    type: "Sativa",
    thca: "89%",
    terpenes: ["Limonene", "Terpinolene", "Pinene"],
    effects: ["Energetic", "Happy", "Creative"],
    description: "Bright citrus flavor with effervescent uplifting effects"
  }
]

// Matrix Rain Component (same as flower page)
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
          className="block px-6 py-4 text-white hover:bg-white/10 transition-all duration-200 font-apple-medium text-cyan-400 border-b border-white/10"
        >
          VAPES
        </Link>
        <Link 
          href="/edibles"
          className="block px-6 py-4 text-white hover:bg-white/10 transition-all duration-200 font-apple-medium"
        >
          EDIBLES
        </Link>
      </div>
    </div>
  )
}

const VapeCard = ({ vape }: { vape: Vape }) => {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'indica': return 'text-purple-400'
      case 'sativa': return 'text-orange-400'
      case 'hybrid': return 'text-emerald-400'
      default: return 'text-white'
    }
  }

  const getTypeGradient = (type: string) => {
    switch (type.toLowerCase()) {
      case 'indica': return 'from-purple-400 to-pink-400'
      case 'sativa': return 'from-orange-400 to-red-400'
      case 'hybrid': return 'from-emerald-400 to-teal-400'
      default: return 'from-white to-gray-400'
    }
  }

  return (
    <div className="glass-dark rounded-2xl p-4 hover:bg-white/5 transition-all duration-300 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-4xl font-apple-light text-white tracking-wide">{vape.name}</h3>
          <span className={`text-xl font-apple-light ${getTypeColor(vape.type)} tracking-tight`}>{vape.type.toUpperCase()}</span>
        </div>
        <span className="text-xl font-apple-light text-cyan-400 tracking-tight">THCA {vape.thca}</span>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-4">
          <h4 className="text-xl font-apple-light text-white/60 tracking-wide">TERPENES</h4>
          <div className="flex flex-wrap gap-1">
            {vape.terpenes.map((terpene, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-white/10 rounded-full text-lg font-apple-light text-white/80 border border-white/20"
              >
                {terpene}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-4">
          <h4 className="text-xl font-apple-light text-white/60 tracking-wide">EFFECTS</h4>
          <div className="flex flex-wrap gap-1">
            {vape.effects.map((effect, index) => (
              <span 
                key={index}
                className={`px-2 py-1 bg-white/10 rounded-full text-lg font-apple-light ${getTypeColor(vape.type)} border border-white/20`}
              >
                {effect}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-3">
        <p className="text-lg font-apple-light text-white/70 italic leading-snug">
          {vape.description}
        </p>
      </div>
    </div>
  )
}

export default function VapesPage() {
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
          <h1 className="font-don-graffiti text-white tracking-[0.3em] mb-2" style={{ fontSize: '96px' }}>VAPES</h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent mx-auto"></div>
        </div>
        
        {/* Vapes Grid */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-2 gap-4 max-w-7xl mx-auto">
            {vapeData.map((vape, index) => (
              <VapeCard key={index} vape={vape} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
} 