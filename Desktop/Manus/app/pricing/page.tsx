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
        <div className="text-center mb-4 p-6">
          <h1 className="font-don-graffiti text-white tracking-[0.3em] mb-2 drop-shadow-2xl" style={{ fontSize: '80px', textShadow: '0 8px 32px rgba(0, 0, 0, 0.8)' }}>PRICING</h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pb-6">
          {/* Top Row - Flower & Concentrates */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Flower Pricing */}
            <div className="rounded-xl p-6 bg-white/5 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-5xl font-apple-bold text-emerald-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>FLOWER</h2>
                <div className="w-20 h-px bg-gradient-to-r from-emerald-400 to-teal-400"></div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-2xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Weight</th>
                    <th className="text-2xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="text-2xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>1g</td>
                    <td className="text-3xl font-apple-bold text-green-400 drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$15</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="text-2xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>3.5g</td>
                    <td className="text-3xl font-apple-bold text-green-400 drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$40</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="text-2xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>7g</td>
                    <td className="text-3xl font-apple-bold text-green-400 drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$70</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="text-2xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>14g</td>
                    <td className="text-3xl font-apple-bold text-green-400 drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$110</td>
                  </tr>
                  <tr>
                    <td className="text-2xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>28g</td>
                    <td className="text-3xl font-apple-bold text-green-400 drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$200</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Concentrates Pricing */}
            <div className="rounded-xl p-6 bg-white/5 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-5xl font-apple-bold text-purple-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>CONCENTRATES</h2>
                <div className="w-20 h-px bg-gradient-to-r from-purple-400 to-pink-400"></div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-2xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Weight</th>
                    <th className="text-2xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="text-2xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>1g</td>
                    <td className="text-3xl font-apple-bold text-green-400 drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$35</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="text-2xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>3.5g</td>
                    <td className="text-3xl font-apple-bold text-green-400 drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$75</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="text-2xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>7g</td>
                    <td className="text-3xl font-apple-bold text-green-400 drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$125</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="text-2xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>14g</td>
                    <td className="text-3xl font-apple-bold text-green-400 drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$200</td>
                  </tr>
                  <tr>
                    <td className="text-2xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>21g</td>
                    <td className="text-3xl font-apple-bold text-green-400 drop-shadow-lg py-3 text-center" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$300</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Middle Row - Vapes, Edibles, Pre-rolls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Vapes Pricing */}
            <div className="rounded-xl p-6 bg-white/5 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-4xl font-apple-bold text-orange-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>VAPES</h2>
                <div className="w-16 h-px bg-gradient-to-r from-orange-400 to-red-400"></div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Quantity</th>
                    <th className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>1 Cart</td>
                    <td className="text-2xl font-apple-bold text-green-400 drop-shadow-lg py-2 text-right" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$35</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>2 Carts</td>
                    <td className="text-2xl font-apple-bold text-green-400 drop-shadow-lg py-2 text-right" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$60</td>
                  </tr>
                  <tr>
                    <td className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>3 Carts</td>
                    <td className="text-2xl font-apple-bold text-green-400 drop-shadow-lg py-2 text-right" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$75</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Edibles Pricing */}
            <div className="rounded-xl p-6 bg-white/5 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-4xl font-apple-bold text-pink-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>EDIBLES</h2>
                <div className="w-16 h-px bg-gradient-to-r from-pink-400 to-purple-400"></div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Quantity</th>
                    <th className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>1 Pack</td>
                    <td className="text-2xl font-apple-bold text-green-400 drop-shadow-lg py-2 text-right" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$30</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>2 Packs</td>
                    <td className="text-2xl font-apple-bold text-green-400 drop-shadow-lg py-2 text-right" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$50</td>
                  </tr>
                  <tr>
                    <td className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>3 Packs</td>
                    <td className="text-2xl font-apple-bold text-green-400 drop-shadow-lg py-2 text-right" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$70</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pre-rolls Pricing */}
            <div className="rounded-xl p-6 bg-white/5 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-4xl font-apple-bold text-yellow-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>PRE-ROLLS</h2>
                <div className="w-16 h-px bg-gradient-to-r from-yellow-400 to-amber-400"></div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Quantity</th>
                    <th className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>1 Roll</td>
                    <td className="text-2xl font-apple-bold text-green-400 drop-shadow-lg py-2 text-right" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$15</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>3 Rolls</td>
                    <td className="text-2xl font-apple-bold text-green-400 drop-shadow-lg py-2 text-right" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$40</td>
                  </tr>
                  <tr>
                    <td className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>5 Rolls</td>
                    <td className="text-2xl font-apple-bold text-green-400 drop-shadow-lg py-2 text-right" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$60</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Row - Moonwater (Full Width) */}
          <div className="mb-6">
            <div className="rounded-xl p-6 bg-white/5 backdrop-blur-md" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-5xl font-apple-bold text-cyan-400 tracking-tight drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>MOONWATER</h2>
                <div className="w-20 h-px bg-gradient-to-r from-cyan-400 to-blue-400"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 5mg Strength */}
                <div>
                  <h3 className="text-3xl font-apple-bold text-cyan-400 tracking-wide drop-shadow-lg text-center mb-3" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>5mg</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Type</th>
                        <th className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10">
                        <td className="text-lg font-apple-medium text-white/90 drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Single</td>
                        <td className="text-xl font-apple-bold text-green-400 drop-shadow-lg py-2 text-right" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$5</td>
                      </tr>
                      <tr>
                        <td className="text-lg font-apple-medium text-white/90 drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>4-Pack</td>
                        <td className="text-xl font-apple-bold text-green-400 drop-shadow-lg py-2 text-right" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$12</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 10mg Strength */}
                <div>
                  <h3 className="text-3xl font-apple-bold text-cyan-400 tracking-wide drop-shadow-lg text-center mb-3" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>10mg</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Type</th>
                        <th className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10">
                        <td className="text-lg font-apple-medium text-white/90 drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Single</td>
                        <td className="text-xl font-apple-bold text-green-400 drop-shadow-lg py-2 text-right" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$8</td>
                      </tr>
                      <tr>
                        <td className="text-lg font-apple-medium text-white/90 drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>4-Pack</td>
                        <td className="text-xl font-apple-bold text-green-400 drop-shadow-lg py-2 text-right" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$20</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 30mg Strength */}
                <div>
                  <h3 className="text-3xl font-apple-bold text-cyan-400 tracking-wide drop-shadow-lg text-center mb-3" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>30mg</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Type</th>
                        <th className="text-xl font-apple-bold text-white/90 tracking-wide drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10">
                        <td className="text-lg font-apple-medium text-white/90 drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>Single</td>
                        <td className="text-xl font-apple-bold text-green-400 drop-shadow-lg py-2 text-right" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$9</td>
                      </tr>
                      <tr>
                        <td className="text-lg font-apple-medium text-white/90 drop-shadow-lg py-2" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>4-Pack</td>
                        <td className="text-xl font-apple-bold text-green-400 drop-shadow-lg py-2 text-right" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>$25</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Note Section */}
          <div className="rounded-xl p-4 bg-white/5 backdrop-blur-md border border-white/10" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
            <p className="text-xl font-apple-light text-white/80 italic text-center leading-relaxed drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.6)' }}>
              All prices include taxes • Bulk discounts available • Contact for wholesale pricing
            </p>
          </div>
        </div>
      </main>
    </div>
  )
} 