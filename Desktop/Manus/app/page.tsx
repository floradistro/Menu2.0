'use client'

import React, { useState, useEffect, useRef } from 'react'

interface Strain {
  name: string
  thc: string
  cbd: string
  price: string
  effects: string[]
  description: string
  inStock: boolean
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

const StrainItem = ({ strain }: { strain: Strain }) => (
  <div className="flex justify-between items-center py-3 border-b border-white/10 last:border-b-0">
    <h3 className="text-lg font-apple-semibold text-white">{strain.name}</h3>
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

  return (
    <div className="h-screen w-screen flex flex-col bg-black relative overflow-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain />
      
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
      <main className="flex-1 p-8 relative z-20">
        {/* Luxury Title */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-don-graffiti text-white tracking-[0.3em] mb-2">FLOWER</h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Indica Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-apple-bold text-white tracking-tight">INDICA</h2>
              <div className="w-16 h-px bg-gradient-to-r from-purple-400 to-pink-400"></div>
            </div>
            <div className="space-y-0">
              <div className="grid grid-cols-4 gap-4 items-center py-0.5 border-b border-white/10">
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">STRAIN</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">TERPENES</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">EFFECTS</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">THCA</h3>
              </div>
              <div className="grid grid-cols-4 gap-4 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Purple Kush</h3>
                <span className="text-lg font-thin text-purple-400 italic tracking-wide">Myrcene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Sleepy</span>
                <span className="text-lg font-apple-bold text-purple-400 tracking-tight text-right">19%</span>
              </div>
              <div className="grid grid-cols-4 gap-4 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Granddaddy Purple</h3>
                <span className="text-lg font-thin text-purple-400 italic tracking-wide">Myrcene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-purple-400 tracking-tight text-right">23%</span>
              </div>
              <div className="grid grid-cols-4 gap-4 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Northern Lights</h3>
                <span className="text-lg font-thin text-purple-400 italic tracking-wide">Myrcene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Happy</span>
                <span className="text-lg font-apple-bold text-purple-400 tracking-tight text-right">18%</span>
              </div>
              <div className="grid grid-cols-4 gap-4 items-center py-0.5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Bubba Kush</h3>
                <span className="text-lg font-thin text-green-400 italic tracking-wide">Caryophyllene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Sleepy</span>
                <span className="text-lg font-apple-bold text-purple-400 tracking-tight text-right">20%</span>
              </div>
            </div>
          </div>

          {/* Hybrid Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-apple-bold text-white tracking-tight">HYBRID</h2>
              <div className="w-16 h-px bg-gradient-to-r from-emerald-400 to-teal-400"></div>
            </div>
            <div className="space-y-0">
              <div className="grid grid-cols-4 gap-4 items-center py-0.5 border-b border-white/10">
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">STRAIN</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">TERPENES</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">EFFECTS</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">THCA</h3>
              </div>
              <div className="grid grid-cols-4 gap-4 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Crusher Candy</h3>
                <span className="text-lg font-thin text-green-400 italic tracking-wide">Caryophyllene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">24%</span>
              </div>
              <div className="grid grid-cols-4 gap-4 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Cheetah Piss</h3>
                <span className="text-lg font-thin text-orange-400 italic tracking-wide">Limonene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">22%</span>
              </div>
              <div className="grid grid-cols-4 gap-4 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Gelato Runtz</h3>
                <span className="text-lg font-thin text-green-400 italic tracking-wide">Caryophyllene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">25%</span>
              </div>
              <div className="grid grid-cols-4 gap-4 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Mint Cake</h3>
                <span className="text-lg font-thin text-purple-400 italic tracking-wide">Myrcene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">23%</span>
              </div>
              <div className="grid grid-cols-4 gap-4 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Fire Cookie</h3>
                <span className="text-lg font-thin text-orange-400 italic tracking-wide">Limonene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">26%</span>
              </div>
              <div className="grid grid-cols-4 gap-4 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Sherb Pie</h3>
                <span className="text-lg font-thin text-blue-400 italic tracking-wide">Linalool</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">21%</span>
              </div>
              <div className="grid grid-cols-4 gap-4 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Wild Runtz</h3>
                <span className="text-lg font-thin text-orange-400 italic tracking-wide">Limonene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">24%</span>
              </div>
              <div className="grid grid-cols-4 gap-4 items-center py-0.5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Whale Candy</h3>
                <span className="text-lg font-thin text-green-400 italic tracking-wide">Caryophyllene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Relaxing, Euphoric</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">23%</span>
              </div>
            </div>
          </div>

          {/* Sativa Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-apple-bold text-white tracking-tight">SATIVA</h2>
              <div className="w-16 h-px bg-gradient-to-r from-orange-400 to-red-400"></div>
            </div>
            <div className="space-y-0">
              <div className="grid grid-cols-4 gap-4 items-center py-0.5 border-b border-white/10">
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">STRAIN</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">TERPENES</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">EFFECTS</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">THCA</h3>
              </div>
              <div className="grid grid-cols-4 gap-4 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Green Crack</h3>
                <span className="text-lg font-thin text-purple-400 italic tracking-wide">Myrcene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Energetic, Creative</span>
                <span className="text-lg font-apple-bold text-orange-400 tracking-tight text-right">22%</span>
              </div>
              <div className="grid grid-cols-4 gap-4 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Jack Herer</h3>
                <span className="text-lg font-thin text-yellow-400 italic tracking-wide">Terpinolene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Uplifting, Creative</span>
                <span className="text-lg font-apple-bold text-orange-400 tracking-tight text-right">20%</span>
              </div>
              <div className="grid grid-cols-4 gap-4 items-center py-0.5 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Durban Poison</h3>
                <span className="text-lg font-thin text-yellow-400 italic tracking-wide">Terpinolene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Energetic, Euphoric</span>
                <span className="text-lg font-apple-bold text-orange-400 tracking-tight text-right">24%</span>
              </div>
              <div className="grid grid-cols-4 gap-4 items-center py-0.5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Sour Diesel</h3>
                <span className="text-lg font-thin text-green-400 italic tracking-wide">Caryophyllene</span>
                <span className="text-lg font-thin text-white/70 italic tracking-wide">Energetic, Uplifting</span>
                <span className="text-lg font-apple-bold text-orange-400 tracking-tight text-right">21%</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Luxury Footer */}
      <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10 p-4 flex-shrink-0">
        <div className="text-center">
          <p className="text-white/60 text-sm font-apple-light tracking-wide">
            Menu updates every 15 minutes • For medical and recreational use • Must be 21+
          </p>
        </div>
      </footer>
    </div>
  )
} 