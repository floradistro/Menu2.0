'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

// Navigation Component
const Navigation = () => {
  return (
    <nav className="absolute top-4 left-4 z-[9999]">
      <div className="flex items-center space-x-4 bg-black/40 backdrop-blur-xl rounded-full px-6 py-3 border border-white/20">
        <Link href="/" className="text-white/80 hover:text-white font-apple-medium text-sm tracking-wide transition-all duration-200 hover:scale-105">
          FLOWER
        </Link>
        <div className="w-px h-4 bg-white/20"></div>
        <Link href="/vapes" className="text-white/80 hover:text-white font-apple-medium text-sm tracking-wide transition-all duration-200 hover:scale-105">
          VAPES
        </Link>
        <div className="w-px h-4 bg-white/20"></div>
        <Link href="/edibles" className="text-white/80 hover:text-white font-apple-medium text-sm tracking-wide transition-all duration-200 hover:scale-105">
          EDIBLES
        </Link>
        <div className="w-px h-4 bg-white/20"></div>
        <Link href="/pricing" className="text-white font-apple-bold text-sm tracking-wide transition-all duration-200 hover:scale-105">
          PRICING
        </Link>
      </div>
    </nav>
  )
}

export default function PricingPage() {
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
      <main className="flex-1 relative z-20 overflow-y-auto">
        {/* Luxury Title */}
        <div className="text-center -mb-6 p-8">
          <h1 className="font-don-graffiti text-white tracking-[0.3em] mb-2 drop-shadow-2xl" style={{ fontSize: '96px', textShadow: '0 8px 32px rgba(0, 0, 0, 0.8)' }}>PRICING</h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
        </div>
        
        <div className="space-y-4 px-8 pb-8">
          {/* Flower Pricing */}
          <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-4xl font-apple-bold text-emerald-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>FLOWER</h2>
              <div className="w-20 h-px bg-gradient-to-r from-emerald-400 to-teal-400"></div>
            </div>
            <div className="grid grid-cols-5 gap-4 items-center text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-apple-bold text-white/80 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>1g</h3>
                <p className="text-2xl font-apple-bold text-emerald-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$15.00</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-apple-bold text-white/80 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>3.5g</h3>
                <p className="text-2xl font-apple-bold text-emerald-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$40.00</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-apple-bold text-white/80 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>7g</h3>
                <p className="text-2xl font-apple-bold text-emerald-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$70.00</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-apple-bold text-white/80 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>14g</h3>
                <p className="text-2xl font-apple-bold text-emerald-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$110.00</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-apple-bold text-white/80 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>28g</h3>
                <p className="text-2xl font-apple-bold text-emerald-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$200.00</p>
              </div>
            </div>
          </div>

          {/* Concentrates Pricing */}
          <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-4xl font-apple-bold text-purple-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>CONCENTRATES</h2>
              <div className="w-20 h-px bg-gradient-to-r from-purple-400 to-pink-400"></div>
            </div>
            <div className="grid grid-cols-5 gap-4 items-center text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-apple-bold text-white/80 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>1g</h3>
                <p className="text-2xl font-apple-bold text-purple-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$35.00</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-apple-bold text-white/80 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>3.5g</h3>
                <p className="text-2xl font-apple-bold text-purple-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$75.00</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-apple-bold text-white/80 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>7g</h3>
                <p className="text-2xl font-apple-bold text-purple-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$125.00</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-apple-bold text-white/80 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>14g</h3>
                <p className="text-2xl font-apple-bold text-purple-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$200.00</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-apple-bold text-white/80 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>21g</h3>
                <p className="text-2xl font-apple-bold text-purple-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$300.00</p>
              </div>
            </div>
          </div>

          {/* Vapes & Edibles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vapes Pricing */}
            <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-apple-bold text-orange-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>VAPES</h2>
                <div className="w-16 h-px bg-gradient-to-r from-orange-400 to-red-400"></div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-apple-bold text-white/80 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>1 Cart</h3>
                  <p className="text-2xl font-apple-bold text-orange-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$35</p>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-apple-bold text-white/80 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>2 Carts</h3>
                  <p className="text-2xl font-apple-bold text-orange-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$60</p>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-apple-bold text-white/80 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>3 Carts</h3>
                  <p className="text-2xl font-apple-bold text-orange-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$75</p>
                </div>
              </div>
            </div>

            {/* Edibles Pricing */}
            <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-apple-bold text-pink-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>EDIBLES</h2>
                <div className="w-16 h-px bg-gradient-to-r from-pink-400 to-purple-400"></div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-apple-bold text-white/80 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>1 Pack</h3>
                  <p className="text-2xl font-apple-bold text-pink-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$30</p>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-apple-bold text-white/80 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>2 Packs</h3>
                  <p className="text-2xl font-apple-bold text-pink-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$50</p>
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-apple-bold text-white/80 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>3 Packs</h3>
                  <p className="text-2xl font-apple-bold text-pink-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$70</p>
                </div>
              </div>
            </div>
          </div>

          {/* Moonwater Pricing */}
          <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-4xl font-apple-bold text-cyan-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>MOONWATER</h2>
              <div className="w-20 h-px bg-gradient-to-r from-cyan-400 to-blue-400"></div>
            </div>
            <div className="space-y-6">
              {/* 5mg Row */}
              <div className="space-y-2">
                <h3 className="text-2xl font-apple-bold text-cyan-400 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>5mg Strength</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="space-y-1">
                    <p className="text-lg font-apple-medium text-white/80 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Single</p>
                    <p className="text-xl font-apple-bold text-cyan-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$5.00</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-apple-medium text-white/80 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>5-Pack</p>
                    <p className="text-xl font-apple-bold text-cyan-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$11.99</p>
                  </div>
                </div>
              </div>

              {/* 10mg Row */}
              <div className="space-y-2">
                <h3 className="text-2xl font-apple-bold text-cyan-400 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>10mg Strength</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="space-y-1">
                    <p className="text-lg font-apple-medium text-white/80 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Single</p>
                    <p className="text-xl font-apple-bold text-cyan-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$7.99</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-apple-medium text-white/80 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>10-Pack</p>
                    <p className="text-xl font-apple-bold text-cyan-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$19.99</p>
                  </div>
                </div>
              </div>

              {/* 30mg Row */}
              <div className="space-y-2">
                <h3 className="text-2xl font-apple-bold text-cyan-400 tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>30mg Strength</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="space-y-1">
                    <p className="text-lg font-apple-medium text-white/80 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Single</p>
                    <p className="text-xl font-apple-bold text-cyan-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$8.99</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-apple-medium text-white/80 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>30-Pack</p>
                    <p className="text-xl font-apple-bold text-cyan-400 drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$24.99</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Note Section */}
          <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-md border border-white/10" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
            <p className="text-lg font-apple-light text-white/70 italic text-center leading-relaxed drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>
              All prices include applicable taxes. Bulk discounts available for larger quantities. 
              Contact us for custom pricing on wholesale orders.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 