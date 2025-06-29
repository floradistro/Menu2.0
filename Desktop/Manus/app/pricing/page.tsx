'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

// Types
interface BasePricing {
  id: string
  category: string
  weight_or_quantity: string
  base_price: number
  is_active: boolean
}

interface PricingRule {
  id: string
  name: string
  category: string
  type: 'percentage_discount' | 'fixed_discount' | 'bundle' | 'special'
  value: number
  conditions: any
  is_active: boolean
  priority: number
}

interface CalculatedPrice {
  original: number
  final: number
  discount: number
  appliedRules: PricingRule[]
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
          className="block px-6 py-4 text-white hover:bg-white/10 transition-all duration-200 font-apple-medium text-emerald-400 border-b border-white/10"
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

export default function PricingPage() {
  const [fontSize, setFontSize] = useState(170)
  const [basePricing, setBasePricing] = useState<BasePricing[]>([])
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([])
  const [loading, setLoading] = useState(true)

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 10, 250))
  }

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 10, 80))
  }

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`
  }, [fontSize])

  // Auto-refresh for time-based pricing rules (every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update time-based pricing
      setBasePricing(prev => [...prev])
    }, 60000) // Refresh every minute

    return () => clearInterval(interval)
  }, [pricingRules])

  // Fetch pricing data and rules from database
  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch('/api/pricing')
        if (response.ok) {
          const data = await response.json()
          setBasePricing(data.base_pricing?.filter((pricing: BasePricing) => pricing.is_active) || [])
          setPricingRules(data.pricing_rules?.filter((rule: PricingRule) => rule.is_active) || [])
        }
      } catch (error) {
        console.error('Error fetching pricing data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPricing()
  }, [])

  // Calculate final price with rules applied
  const calculatePrice = (basePrice: BasePricing): CalculatedPrice => {
    const currentTime = new Date()
    const currentHour = currentTime.getHours()
    const currentMinutes = currentTime.getMinutes()
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`
    
    // Find applicable rules for this category
    const applicableRules = pricingRules
      .filter(rule => rule.category === basePrice.category || rule.category === 'all')
      .filter(rule => {
        // Check time restrictions
        if (rule.conditions?.time_restrictions) {
          const { start_time, end_time } = rule.conditions.time_restrictions
          if (start_time && end_time) {
            return currentTimeString >= start_time && currentTimeString <= end_time
          }
        }
        return true
      })
      .sort((a, b) => b.priority - a.priority) // Higher priority first
    
    let finalPrice = basePrice.base_price
    let totalDiscount = 0
    const appliedRules: PricingRule[] = []
    
    // Apply rules in priority order
    for (const rule of applicableRules) {
      let ruleDiscount = 0
      
      switch (rule.type) {
        case 'percentage_discount':
          ruleDiscount = (finalPrice * rule.value) / 100
          finalPrice -= ruleDiscount
          appliedRules.push(rule)
          break
          
        case 'fixed_discount':
          ruleDiscount = Math.min(rule.value, finalPrice) // Don't go below $0
          finalPrice -= ruleDiscount
          appliedRules.push(rule)
          break
          
        case 'special':
          // Special pricing overrides everything
          finalPrice = rule.value
          ruleDiscount = basePrice.base_price - rule.value
          appliedRules.push(rule)
          break
          
        case 'bundle':
          // Bundle pricing (would need more complex logic for actual bundles)
          // For now, just show the bundle price if it's better
          if (rule.value < finalPrice) {
            ruleDiscount = finalPrice - rule.value
            finalPrice = rule.value
            appliedRules.push(rule)
          }
          break
      }
      
      totalDiscount += ruleDiscount
    }
    
    return {
      original: basePrice.base_price,
      final: Math.max(0, finalPrice), // Never go below $0
      discount: totalDiscount,
      appliedRules
    }
  }

  // Group pricing by category
  const getPricingByCategory = (category: string) => {
    return basePricing.filter(pricing => pricing.category === category)
  }

  // Category configurations
  const categories = [
    {
      key: 'flower',
      title: 'FLOWER',
      color: 'emerald-400',
      gradient: 'from-emerald-400 to-teal-400'
    },
    {
      key: 'concentrates',
      title: 'CONCENTRATES',
      color: 'purple-400',
      gradient: 'from-purple-400 to-pink-400'
    },
    {
      key: 'vapes',
      title: 'VAPES',
      color: 'orange-400',
      gradient: 'from-orange-400 to-red-400'
    },
    {
      key: 'edibles',
      title: 'EDIBLES',
      color: 'pink-400',
      gradient: 'from-pink-400 to-purple-400'
    },
    {
      key: 'prerolls',
      title: 'PRE-ROLLS',
      color: 'yellow-400',
      gradient: 'from-yellow-400 to-amber-400'
    },
    {
      key: 'moonwater',
      title: 'MOONWATER',
      color: 'cyan-400',
      gradient: 'from-cyan-400 to-blue-400'
    }
  ]

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-neutral-600">
        <div className="text-white text-2xl">Loading pricing...</div>
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

      {/* Luxury Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 relative z-20 overflow-y-auto p-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <h1 className="font-don-graffiti text-white tracking-[0.2em] drop-shadow-2xl text-4xl" style={{ textShadow: '0 8px 32px rgba(0, 0, 0, 0.8)' }}>PRICING</h1>
            {pricingRules.length > 0 && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-yellow-500/20 backdrop-blur-md rounded-lg px-3 py-1 border border-emerald-400/30">
                <span className="text-emerald-300 font-apple-semibold text-xs">🎉 {pricingRules.length} ACTIVE DEALS</span>
                <span className="text-white/60 text-xs">🕐 {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Optimized Category Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => {
            const categoryPricing = getPricingByCategory(category.key)
            
            if (categoryPricing.length === 0) return null

            return (
              <div key={category.key} className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10">
                {/* Category Header */}
                <div className="flex items-center space-x-2 mb-3 border-b border-white/10 pb-2">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.gradient} flex-shrink-0`}></div>
                  <h2 className={`text-lg font-apple-bold text-${category.color} tracking-wide`} style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)' }}>
                    {category.title}
                  </h2>
                </div>

                {/* Compact Pricing Rows */}
                <div className="space-y-1">
                  {categoryPricing
                    .sort((a, b) => {
                      const order = ['1g', '3.5g', '7g', '14g', '28g', '1 cart', '2 carts', '3 carts', '1 pack', '2 packs', '3 packs', '1 roll', '3 rolls', '5 rolls']
                      const aIndex = order.indexOf(a.weight_or_quantity)
                      const bIndex = order.indexOf(b.weight_or_quantity)
                      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
                      return a.weight_or_quantity.localeCompare(b.weight_or_quantity)
                    })
                    .map((pricing, index) => {
                      const calculatedPrice = calculatePrice(pricing)
                      const hasDiscount = calculatedPrice.discount > 0
                      
                      return (
                        <div key={pricing.id} className={`flex items-center justify-between py-2 px-3 rounded transition-all duration-200 hover:bg-white/10 ${index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'}`}>
                          {/* Weight & Promotion */}
                          <div className="flex flex-col">
                            <span className="text-sm font-apple-semibold text-white">
                              {pricing.weight_or_quantity}
                            </span>
                            {hasDiscount && calculatedPrice.appliedRules.length > 0 && (
                              <span className="text-xs text-yellow-400 font-apple-medium">
                                🎉 -{Math.round((calculatedPrice.discount / calculatedPrice.original) * 100)}%
                              </span>
                            )}
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            {hasDiscount ? (
                              <div className="flex flex-col items-end">
                                <span className="text-xs text-white/60 line-through">
                                  ${calculatedPrice.original.toFixed(2)}
                                </span>
                                <span className="text-lg font-apple-bold text-emerald-400">
                                  ${calculatedPrice.final.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-lg font-apple-bold text-green-400">
                                ${calculatedPrice.final.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Compact Footer */}
        <div className="mt-4 p-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
          {basePricing.length === 0 ? (
            <div className="text-center">
              <span className="text-white/60 font-apple-medium">No pricing configured</span>
            </div>
          ) : (
            <div className="flex flex-col space-y-1 text-center">
              <p className="text-sm font-apple-medium text-red-400">
                All prices include taxes • {pricingRules.length > 0 ? 'Discounts applied automatically' : 'Bulk discounts available'} • Contact for wholesale
              </p>
              {pricingRules.length > 0 && (
                <p className="text-xs font-apple-medium text-emerald-300">
                  💰 Live pricing • 🕐 Updates every minute
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 