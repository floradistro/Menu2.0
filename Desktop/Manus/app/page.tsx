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
      <main className="flex-1 p-8">
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
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-white/10">
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">STRAIN</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">TERPENES</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">THCA</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Purple Kush</h3>
                <span className="text-xs font-apple-medium text-purple-400 tracking-wide">Myrcene</span>
                <span className="text-lg font-apple-bold text-purple-400 tracking-tight text-right">19%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Granddaddy Purple</h3>
                <span className="text-xs font-apple-medium text-purple-400 tracking-wide">Myrcene</span>
                <span className="text-lg font-apple-bold text-purple-400 tracking-tight text-right">23%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Northern Lights</h3>
                <span className="text-xs font-apple-medium text-purple-400 tracking-wide">Myrcene</span>
                <span className="text-lg font-apple-bold text-purple-400 tracking-tight text-right">18%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-2">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Bubba Kush</h3>
                <span className="text-xs font-apple-medium text-green-400 tracking-wide">Caryophyllene</span>
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
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-white/10">
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">STRAIN</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">TERPENES</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">THCA</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Crusher Candy</h3>
                <span className="text-xs font-apple-medium text-green-400 tracking-wide">Caryophyllene</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">24%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Cheetah Piss</h3>
                <span className="text-xs font-apple-medium text-orange-400 tracking-wide">Limonene</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">22%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Gelato Runtz</h3>
                <span className="text-xs font-apple-medium text-green-400 tracking-wide">Caryophyllene</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">25%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Mint Cake</h3>
                <span className="text-xs font-apple-medium text-purple-400 tracking-wide">Myrcene</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">23%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Fire Cookie</h3>
                <span className="text-xs font-apple-medium text-orange-400 tracking-wide">Limonene</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">26%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Sherb Pie</h3>
                <span className="text-xs font-apple-medium text-blue-400 tracking-wide">Linalool</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">21%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Wild Runtz</h3>
                <span className="text-xs font-apple-medium text-orange-400 tracking-wide">Limonene</span>
                <span className="text-lg font-apple-bold text-emerald-400 tracking-tight text-right">24%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-2">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Whale Candy</h3>
                <span className="text-xs font-apple-medium text-green-400 tracking-wide">Caryophyllene</span>
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
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-white/10">
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">STRAIN</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide">TERPENES</h3>
                <h3 className="text-sm font-apple-semibold text-white/80 tracking-wide text-right">THCA</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Green Crack</h3>
                <span className="text-xs font-apple-medium text-purple-400 tracking-wide">Myrcene</span>
                <span className="text-lg font-apple-bold text-orange-400 tracking-tight text-right">22%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Jack Herer</h3>
                <span className="text-xs font-apple-medium text-yellow-400 tracking-wide">Terpinolene</span>
                <span className="text-lg font-apple-bold text-orange-400 tracking-tight text-right">20%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-white/5">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Durban Poison</h3>
                <span className="text-xs font-apple-medium text-yellow-400 tracking-wide">Terpinolene</span>
                <span className="text-lg font-apple-bold text-orange-400 tracking-tight text-right">24%</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center py-2">
                <h3 className="text-lg font-apple-semibold text-white tracking-wide">Sour Diesel</h3>
                <span className="text-xs font-apple-medium text-green-400 tracking-wide">Caryophyllene</span>
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