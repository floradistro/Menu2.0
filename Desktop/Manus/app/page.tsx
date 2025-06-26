'use client'

import React from 'react'

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

const StrainItem = ({ strain }: { strain: Strain }) => (
  <div className="flex justify-between items-center py-3 border-b border-white/10 last:border-b-0">
    <h3 className="text-lg font-apple-semibold text-white">{strain.name}</h3>
    <span className="text-xl font-apple-bold text-accent-green">THCA: {strain.thc}</span>
  </div>
)

export default function MenuPage() {
  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Luxury Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle luxury flares */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-white/3 to-transparent rounded-full blur-3xl"></div>
        
        {/* Elegant floating elements */}
        <div className="absolute top-32 right-32 w-1 h-1 bg-white/40 rounded-full animate-pulse"></div>
        <div className="absolute top-48 left-40 w-0.5 h-0.5 bg-white/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 right-40 w-1.5 h-1.5 bg-white/20 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Premium mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto">
        {/* Luxury Title */}
        <div className="text-center mb-16">
          <h1 className="text-8xl font-don-graffiti text-white tracking-[0.3em] mb-4">FLOWER</h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-8 min-h-full justify-center max-w-5xl mx-auto">
          {/* Hybrid Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-5xl font-apple-bold text-white tracking-tight">HYBRID</h2>
              <div className="w-20 h-px bg-gradient-to-r from-emerald-400 to-teal-400"></div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/10">
                <h3 className="text-lg font-apple-semibold text-white/80 tracking-wide">STRAIN</h3>
                <h3 className="text-lg font-apple-semibold text-white/80 tracking-wide">TERPENES</h3>
                <h3 className="text-lg font-apple-semibold text-white/80 tracking-wide text-right">THCA</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/5 last:border-b-0">
                <h3 className="text-xl font-apple-semibold text-white tracking-wide">Crusher Candy</h3>
                <span className="text-sm font-apple-medium text-green-400 tracking-wide text-left">Caryophyllene (spicy, earthy)</span>
                <span className="text-2xl font-apple-bold text-emerald-400 tracking-tight text-right">THCA: 24%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/5 last:border-b-0">
                <h3 className="text-xl font-apple-semibold text-white tracking-wide">Cheetah Piss</h3>
                <span className="text-sm font-apple-medium text-orange-400 tracking-wide text-left">Limonene (citrus, euphoric)</span>
                <span className="text-2xl font-apple-bold text-emerald-400 tracking-tight text-right">THCA: 22%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/5 last:border-b-0">
                <h3 className="text-xl font-apple-semibold text-white tracking-wide">Gelato Runtz</h3>
                <span className="text-sm font-apple-medium text-green-400 tracking-wide text-left">Caryophyllene (sweet, creamy funk)</span>
                <span className="text-2xl font-apple-bold text-emerald-400 tracking-tight text-right">THCA: 25%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/5 last:border-b-0">
                <h3 className="text-xl font-apple-semibold text-white tracking-wide">Mint Cake</h3>
                <span className="text-sm font-apple-medium text-purple-400 tracking-wide text-left">Myrcene (herbal, sleepy)</span>
                <span className="text-2xl font-apple-bold text-emerald-400 tracking-tight text-right">THCA: 23%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/5 last:border-b-0">
                <h3 className="text-xl font-apple-semibold text-white tracking-wide">Fire Cookie</h3>
                <span className="text-sm font-apple-medium text-orange-400 tracking-wide text-left">Limonene (sweet, gassy citrus)</span>
                <span className="text-2xl font-apple-bold text-emerald-400 tracking-tight text-right">THCA: 26%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/5 last:border-b-0">
                <h3 className="text-xl font-apple-semibold text-white tracking-wide">Sherb Pie</h3>
                <span className="text-sm font-apple-medium text-blue-400 tracking-wide text-left">Linalool (floral, calming)</span>
                <span className="text-2xl font-apple-bold text-emerald-400 tracking-tight text-right">THCA: 21%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/5 last:border-b-0">
                <h3 className="text-xl font-apple-semibold text-white tracking-wide">Wild Runtz</h3>
                <span className="text-sm font-apple-medium text-orange-400 tracking-wide text-left">Limonene (candy citrus, energetic)</span>
                <span className="text-2xl font-apple-bold text-emerald-400 tracking-tight text-right">THCA: 24%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/5 last:border-b-0">
                <h3 className="text-xl font-apple-semibold text-white tracking-wide">Whale Candy</h3>
                <span className="text-sm font-apple-medium text-green-400 tracking-wide text-left">Caryophyllene (funky, sweet pepper)</span>
                <span className="text-2xl font-apple-bold text-emerald-400 tracking-tight text-right">THCA: 23%</span>
              </div>
            </div>
          </div>

          {/* Indica Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-5xl font-apple-bold text-white tracking-tight">INDICA</h2>
              <div className="w-20 h-px bg-gradient-to-r from-purple-400 to-pink-400"></div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/10">
                <h3 className="text-lg font-apple-semibold text-white/80 tracking-wide">STRAIN</h3>
                <h3 className="text-lg font-apple-semibold text-white/80 tracking-wide">TERPENES</h3>
                <h3 className="text-lg font-apple-semibold text-white/80 tracking-wide text-right">THCA</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/5 last:border-b-0">
                <h3 className="text-xl font-apple-semibold text-white tracking-wide">Purple Kush</h3>
                <span className="text-sm font-apple-medium text-purple-400 tracking-wide text-left">Myrcene (sedative, earthy)</span>
                <span className="text-2xl font-apple-bold text-purple-400 tracking-tight text-right">THCA: 19%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/5 last:border-b-0">
                <h3 className="text-xl font-apple-semibold text-white tracking-wide">Granddaddy Purple</h3>
                <span className="text-sm font-apple-medium text-purple-400 tracking-wide text-left">Myrcene (grape, body-heavy)</span>
                <span className="text-2xl font-apple-bold text-purple-400 tracking-tight text-right">THCA: 23%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/5 last:border-b-0">
                <h3 className="text-xl font-apple-semibold text-white tracking-wide">Northern Lights</h3>
                <span className="text-sm font-apple-medium text-purple-400 tracking-wide text-left">Myrcene (woodsy, relaxing)</span>
                <span className="text-2xl font-apple-bold text-purple-400 tracking-tight text-right">THCA: 18%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/5 last:border-b-0">
                <h3 className="text-xl font-apple-semibold text-white tracking-wide">Bubba Kush</h3>
                <span className="text-sm font-apple-medium text-green-400 tracking-wide text-left">Caryophyllene (chocolate spice, chill)</span>
                <span className="text-2xl font-apple-bold text-purple-400 tracking-tight text-right">THCA: 20%</span>
              </div>
            </div>
          </div>

          {/* Sativa Section */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-5xl font-apple-bold text-white tracking-tight">SATIVA</h2>
              <div className="w-20 h-px bg-gradient-to-r from-orange-400 to-red-400"></div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/10">
                <h3 className="text-lg font-apple-semibold text-white/80 tracking-wide">STRAIN</h3>
                <h3 className="text-lg font-apple-semibold text-white/80 tracking-wide">TERPENES</h3>
                <h3 className="text-lg font-apple-semibold text-white/80 tracking-wide text-right">THCA</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/5 last:border-b-0">
                <h3 className="text-xl font-apple-semibold text-white tracking-wide">Green Crack</h3>
                <span className="text-sm font-apple-medium text-purple-400 tracking-wide text-left">Myrcene (bright citrus, uplift)</span>
                <span className="text-2xl font-apple-bold text-orange-400 tracking-tight text-right">THCA: 22%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/5 last:border-b-0">
                <h3 className="text-xl font-apple-semibold text-white tracking-wide">Jack Herer</h3>
                <span className="text-sm font-apple-medium text-yellow-400 tracking-wide text-left">Terpinolene (pine, energetic)</span>
                <span className="text-2xl font-apple-bold text-orange-400 tracking-tight text-right">THCA: 20%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/5 last:border-b-0">
                <h3 className="text-xl font-apple-semibold text-white tracking-wide">Durban Poison</h3>
                <span className="text-sm font-apple-medium text-yellow-400 tracking-wide text-left">Terpinolene (sweet, electric)</span>
                <span className="text-2xl font-apple-bold text-orange-400 tracking-tight text-right">THCA: 24%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-4 border-b border-white/5 last:border-b-0">
                <h3 className="text-xl font-apple-semibold text-white tracking-wide">Sour Diesel</h3>
                <span className="text-sm font-apple-medium text-green-400 tracking-wide text-left">Caryophyllene (diesel funk, focus)</span>
                <span className="text-2xl font-apple-bold text-orange-400 tracking-tight text-right">THCA: 21%</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Luxury Footer */}
      <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10 p-6 flex-shrink-0">
        <div className="text-center">
          <p className="text-white/60 text-sm font-apple-light tracking-wide">
            Menu updates every 15 minutes • For medical and recreational use • Must be 21+
          </p>
        </div>
      </footer>
    </div>
  )
} 