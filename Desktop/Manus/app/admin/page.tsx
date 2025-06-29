'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Product } from '../../lib/supabase'
import { PricingRule, BasePricing } from '../api/pricing/route'

interface MenuSettings {
  display_config?: {
    font_size: number
    theme: string
    auto_refresh_interval: number
    display_effects: boolean
  }
  flipboard_messages?: {
    [key: string]: string[]
  }
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<MenuSettings>({})
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([])
  const [basePricing, setBasePricing] = useState<BasePricing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'flower' | 'vapes' | 'edibles' | 'pricing' | 'specials' | 'bundles' | 'settings'>('flower')
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchInput, setShowSearchInput] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'a' && activeTab !== 'pricing' && activeTab !== 'settings') {
        e.preventDefault()
        selectAll()
      }
      if (e.key === 'Escape') {
        setSelectedProducts(new Set())
        setEditingProduct(null)
        setShowAddModal(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsResponse, settingsResponse, pricingResponse] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/menu-settings'),
        fetch('/api/pricing')
      ])
      
      if (!productsResponse.ok || !settingsResponse.ok || !pricingResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const productsData = await productsResponse.json()
      const settingsData = await settingsResponse.json()
      const pricingData = await pricingResponse.json()
      
      setProducts(productsData.products || [])
      setSettings(settingsData.settings || {})
      setPricingRules(pricingData.pricing_rules || [])
      setBasePricing(pricingData.base_pricing || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filtered products based on search
  const filteredProducts = useMemo(() => {
    const categoryProducts = products.filter(p => p.category === activeTab)
    
    if (!searchQuery) return categoryProducts
    
    return categoryProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.effects?.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [products, activeTab, searchQuery])

  const selectAll = useCallback(() => {
    const allIds = new Set(filteredProducts.map(p => p.id))
    setSelectedProducts(allIds)
  }, [filteredProducts])

  const toggleProductSelection = useCallback((productId: string) => {
    const newSelection = new Set(selectedProducts)
    if (newSelection.has(productId)) {
      newSelection.delete(productId)
    } else {
      newSelection.add(productId)
    }
    setSelectedProducts(newSelection)
  }, [selectedProducts])

  const handleBulkAction = async (action: string, data?: any) => {
    const productIds = Array.from(selectedProducts)
    
    try {
      setSaving(true)
      const response = await fetch('/api/products/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, productIds, ...data })
      })

      if (!response.ok) throw new Error('Bulk action failed')
      
      await fetchData()
      setSelectedProducts(new Set())
    } catch (err) {
      alert('Error performing bulk action: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const updateProduct = async (product: Product, updates: Partial<Product>) => {
    try {
      setSaving(true)
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, ...updates })
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      await fetchData()
      setEditingProduct(null)
    } catch (err) {
      alert('Error updating product: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      setSaving(true)
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      await fetchData()
    } catch (err) {
      alert('Error deleting product: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const addProduct = async (newProduct: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setSaving(true)
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      })

      if (!response.ok) {
        throw new Error('Failed to add product')
      }

      await fetchData()
      setShowAddModal(false)
    } catch (err) {
      alert('Error adding product: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const getProductsByCategory = (category: string) => {
    return products.filter(p => p.category === category)
  }

  if (loading) {
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
        
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <div className="text-2xl text-white font-apple-semibold drop-shadow-lg">Loading admin panel...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
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
        
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="text-2xl text-red-400 mb-4 font-apple-semibold drop-shadow-lg">Error: {error}</div>
            <button 
              onClick={fetchData}
              className="px-6 py-3 bg-emerald-600/80 hover:bg-emerald-600 backdrop-blur-xl rounded-xl transition-all duration-200 text-white font-apple-medium border border-emerald-400/30"
            >
              Retry
            </button>
          </div>
        </div>
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

      {/* Luxury Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>
      
      {/* Combined Header & Navigation */}
      <header className="bg-black/40 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <h1 className="font-don-graffiti text-white tracking-[0.2em] drop-shadow-2xl text-xl sm:text-2xl">
                ADMIN
              </h1>
              
              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-2 sm:gap-4 lg:gap-6">
                {[
                  { key: 'flower', label: 'FLOWER', count: getProductsByCategory('flower').length },
                  { key: 'vapes', label: 'VAPES', count: getProductsByCategory('vapes').length },
                  { key: 'edibles', label: 'EDIBLES', count: getProductsByCategory('edibles').length },
                  { key: 'pricing', label: 'PRICING', count: pricingRules.length },
                  { key: 'specials', label: 'SPECIALS', count: null },
                  { key: 'bundles', label: 'BUNDLES', count: null }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key as any)
                      setSelectedProducts(new Set())
                    }}
                    className={`font-apple-medium transition-all duration-200 flex items-center space-x-1 hover:text-white text-xs sm:text-sm whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'text-emerald-400'
                        : 'text-white/70'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {tab.count !== null && (
                      <span className="text-xs">
                        ({tab.count})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {showSearchInput ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="px-3 py-2 bg-white/10 backdrop-blur-xl rounded-lg text-white placeholder-white/60 text-sm border border-white/20 focus:border-emerald-400/50 focus:outline-none transition-all duration-200 w-48 sm:w-64"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowSearchInput(false)
                      setSearchQuery('')
                    }}
                    className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-lg transition-all duration-200 text-white/70 hover:text-white border border-white/20"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 transition-all duration-200 text-white/70 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => setActiveTab('settings')}
                className={`p-2 transition-all duration-200 ${
                  activeTab === 'settings'
                    ? 'text-emerald-400'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              {selectedProducts.size > 0 && (
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="px-3 py-2 bg-emerald-600/80 hover:bg-emerald-600 backdrop-blur-xl rounded-lg text-sm transition-all duration-200 text-white font-apple-medium border border-emerald-400/30"
                >
                  Bulk Actions ({selectedProducts.size})
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Bulk Actions Bar */}
      {showBulkActions && selectedProducts.size > 0 && (
        <div className="bg-emerald-600/90 backdrop-blur-xl text-white px-6 py-4 sticky top-16 z-20 border-b border-emerald-400/30">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-apple-semibold">{selectedProducts.size} items selected</span>
              <button
                onClick={() => setSelectedProducts(new Set())}
                className="text-sm hover:underline font-apple-medium"
              >
                Clear selection
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleBulkAction('update', { updates: { in_stock: true } })}
                className="px-4 py-2 bg-green-500/80 hover:bg-green-500 backdrop-blur-xl rounded-xl transition-all duration-200 font-apple-medium border border-green-400/30"
              >
                Mark In Stock
              </button>
              <button
                onClick={() => handleBulkAction('update', { updates: { in_stock: false } })}
                className="px-4 py-2 bg-orange-500/80 hover:bg-orange-500 backdrop-blur-xl rounded-xl transition-all duration-200 font-apple-medium border border-orange-400/30"
              >
                Mark Out of Stock
              </button>
              <button
                onClick={() => handleBulkAction('clone')}
                className="px-4 py-2 bg-purple-500/80 hover:bg-purple-500 backdrop-blur-xl rounded-xl transition-all duration-200 font-apple-medium border border-purple-400/30"
              >
                Clone
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete ${selectedProducts.size} products?`)) {
                    handleBulkAction('delete')
                  }
                }}
                className="px-4 py-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-xl rounded-xl transition-all duration-200 font-apple-medium border border-red-400/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 relative z-20 overflow-y-auto">
        <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {(activeTab === 'flower' || activeTab === 'vapes' || activeTab === 'edibles') && (
            <ProductManagement
              category={activeTab}
              products={filteredProducts}
              selectedProducts={selectedProducts}
              onToggleSelection={toggleProductSelection}
              onSelectAll={selectAll}
              editingProduct={editingProduct}
              setEditingProduct={setEditingProduct}
              onUpdate={updateProduct}
              onDelete={deleteProduct}
              onAdd={addProduct}
              onRefresh={fetchData}
              saving={saving}
              showAddModal={showAddModal}
              setShowAddModal={setShowAddModal}
            />
          )}

          {activeTab === 'pricing' && (
            <PricingPanel
              pricingRules={pricingRules}
              basePricing={basePricing}
              products={products}
              onRefresh={fetchData}
              saving={saving}
              setSaving={setSaving}
            />
          )}

          {activeTab === 'specials' && (
            <SpecialsPanel
              products={products}
              onRefresh={fetchData}
              saving={saving}
              setSaving={setSaving}
            />
          )}

          {activeTab === 'bundles' && (
            <BundlesPanel
              products={products}
              onRefresh={fetchData}
              saving={saving}
              setSaving={setSaving}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPanel settings={settings} />
          )}
        </div>
      </main>
    </div>
  )
}

// Product Management Component
function ProductManagement({
  category,
  products,
  selectedProducts,
  onToggleSelection,
  onSelectAll,
  editingProduct,
  setEditingProduct,
  onUpdate,
  onDelete,
  onAdd,
  onRefresh,
  saving,
  showAddModal,
  setShowAddModal
}: {
  category: string
  products: Product[]
  selectedProducts: Set<string>
  onToggleSelection: (productId: string) => void
  onSelectAll: () => void
  editingProduct: Product | null
  setEditingProduct: (product: Product | null) => void
  onUpdate: (product: Product, updates: Partial<Product>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onAdd: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onRefresh: () => Promise<void>
  saving: boolean
  showAddModal: boolean
  setShowAddModal: (show: boolean) => void
}) {
  const getTypesByCategory = (cat: string) => {
    switch (cat) {
      case 'flower': return ['indica', 'sativa', 'hybrid']
      case 'vapes': return ['indica', 'sativa', 'hybrid']
      case 'edibles': return ['cookie', 'gummy', 'moonwater']
      default: return []
    }
  }

  const getProductsByType = (type: string) => {
    return products.filter(p => p.type.toLowerCase() === type.toLowerCase())
  }

  const allTypes = getTypesByCategory(category)

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/20">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-don-graffiti text-white capitalize tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>{category}</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={onRefresh}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-lg transition-all duration-200 flex items-center space-x-2 text-white font-apple-medium border border-white/20"
              disabled={saving}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <button
              onClick={onSelectAll}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-xl text-sm transition-all duration-200 text-white font-apple-medium border border-white/20"
            >
              Select All
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-emerald-600/80 hover:bg-emerald-600 backdrop-blur-xl rounded-xl transition-all duration-200 flex items-center space-x-2 text-white font-apple-medium border border-emerald-400/30"
              disabled={saving}
            >
              <span>+</span>
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Show all types, even empty ones */}
      {allTypes.map(type => (
        <TypeSection
          key={type}
          type={type}
          products={getProductsByType(type)}
          category={category}
          selectedProducts={selectedProducts}
          onToggleSelection={onToggleSelection}
          onUpdate={onUpdate}
          onDelete={onDelete}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          saving={saving}
        />
      ))}

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          category={category}
          onAdd={onAdd}
          onClose={() => setShowAddModal(false)}
          saving={saving}
        />
      )}
    </div>
  )
}

// Type Section Component (same as before but organized better)
function TypeSection({
  type,
  products,
  category,
  selectedProducts,
  onToggleSelection,
  onUpdate,
  onDelete,
  editingProduct,
  setEditingProduct,
  saving
}: {
  type: string
  products: Product[]
  category: string
  selectedProducts: Set<string>
  onToggleSelection: (productId: string) => void
  onUpdate: (product: Product, updates: Partial<Product>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  editingProduct: Product | null
  setEditingProduct: (product: Product | null) => void
  saving: boolean
}) {
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'indica': return 'text-purple-400'
      case 'sativa': return 'text-orange-400'
      case 'hybrid': return 'text-emerald-400'
      case 'cookie': return 'text-amber-400'
      case 'gummy': return 'text-pink-400'
      case 'moonwater': return 'text-cyan-400'
      default: return 'text-white'
    }
  }

  const getTypeBorder = (type: string) => {
    switch (type.toLowerCase()) {
      case 'indica': return 'border-purple-400/30'
      case 'sativa': return 'border-orange-400/30'
      case 'hybrid': return 'border-emerald-400/30'
      case 'cookie': return 'border-amber-400/30'
      case 'gummy': return 'border-pink-400/30'
      case 'moonwater': return 'border-cyan-400/30'
      default: return 'border-white/20'
    }
  }

  return (
    <div className={`bg-white/5 backdrop-blur-md rounded-xl border ${getTypeBorder(type)} overflow-hidden`}>
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <h3 className={`text-2xl font-apple-bold ${getTypeColor(type)} capitalize tracking-wide drop-shadow-lg`} style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>{type}</h3>
        <span className="text-sm text-white/70 font-apple-medium">{products.length} items</span>
      </div>

      {products.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-apple-semibold text-white/80 w-8"></th>
                <th className="text-left py-3 px-4 text-sm font-apple-semibold text-white/80">Name</th>
                <th className="text-left py-3 px-4 text-sm font-apple-semibold text-white/80">Price</th>
                {(category === 'flower' || category === 'vapes') && (
                  <>
                    <th className="text-left py-3 px-4 text-sm font-apple-semibold text-white/80">THCA</th>
                    <th className="text-left py-3 px-4 text-sm font-apple-semibold text-white/80">Terpenes</th>
                  </>
                )}
                {category === 'edibles' && (
                  <th className="text-left py-3 px-4 text-sm font-apple-semibold text-white/80">Dosage</th>
                )}
                <th className="text-left py-3 px-4 text-sm font-apple-semibold text-white/80">Status</th>
                <th className="text-right py-3 px-4 text-sm font-apple-semibold text-white/80">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  category={category}
                  isSelected={selectedProducts.has(product.id)}
                  onToggleSelection={() => onToggleSelection(product.id)}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  isEditing={editingProduct?.id === product.id}
                  setEditing={setEditingProduct}
                  saving={saving}
                  isEven={index % 2 === 0}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-white/60 py-12">
          <div className="text-lg font-apple-semibold mb-2">No {type} products found</div>
          <div className="text-sm font-apple-medium">Click "Add" to add the first one.</div>
        </div>
      )}
    </div>
  )
}

// Enhanced Product Row for table layout
function ProductRow({
  product,
  category,
  isSelected,
  onToggleSelection,
  onUpdate,
  onDelete,
  isEditing,
  setEditing,
  saving,
  isEven
}: {
  product: Product
  category: string
  isSelected: boolean
  onToggleSelection: () => void
  onUpdate: (product: Product, updates: Partial<Product>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  isEditing: boolean
  setEditing: (product: Product | null) => void
  saving: boolean
  isEven: boolean
}) {
  const [editForm, setEditForm] = useState({
    name: product.name,
    price: product.price,
    thca: product.thca || '',
    dosage: product.dosage || '',
    terpenes: product.terpenes ? product.terpenes.join(', ') : '',
  })

  const handleSave = () => {
    const updates = {
      name: editForm.name,
      price: editForm.price,
      thca: editForm.thca || null,
      dosage: editForm.dosage || null,
      terpenes: editForm.terpenes ? editForm.terpenes.split(',').map(t => t.trim()) : [],
    }
    onUpdate(product, updates)
  }

  const handleCancel = () => {
    setEditForm({
      name: product.name,
      price: product.price,
      thca: product.thca || '',
      dosage: product.dosage || '',
      terpenes: product.terpenes ? product.terpenes.join(', ') : '',
    })
    setEditing(null)
  }

  if (isEditing) {
    return (
      <tr className={`${isEven ? 'bg-white/5' : ''} border-b border-white/5`}>
        <td className="py-3 px-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelection}
            className="rounded bg-white/20 border-white/30 text-emerald-400 focus:ring-emerald-400"
          />
        </td>
        <td className="py-3 px-4">
          <input
            type="text"
            value={editForm.name}
            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
            className="w-full px-3 py-1 bg-white/10 backdrop-blur-xl rounded-lg text-white placeholder-white/60 border border-white/20 focus:border-emerald-400/50 focus:outline-none transition-all duration-200 text-sm"
            placeholder="Product name"
          />
        </td>
        <td className="py-3 px-4">
          <input
            type="text"
            value={editForm.price}
            onChange={(e) => setEditForm({...editForm, price: e.target.value})}
            className="w-full px-3 py-1 bg-white/10 backdrop-blur-xl rounded-lg text-white placeholder-white/60 border border-white/20 focus:border-emerald-400/50 focus:outline-none transition-all duration-200 text-sm"
            placeholder="Price"
          />
        </td>
        {(category === 'flower' || category === 'vapes') && (
          <>
            <td className="py-3 px-4">
              <input
                type="text"
                value={editForm.thca}
                onChange={(e) => setEditForm({...editForm, thca: e.target.value})}
                className="w-full px-3 py-1 bg-white/10 backdrop-blur-xl rounded-lg text-white placeholder-white/60 border border-white/20 focus:border-emerald-400/50 focus:outline-none transition-all duration-200 text-sm"
                placeholder="THCA %"
              />
            </td>
            <td className="py-3 px-4">
              <input
                type="text"
                value={editForm.terpenes}
                onChange={(e) => setEditForm({...editForm, terpenes: e.target.value})}
                className="w-full px-3 py-1 bg-white/10 backdrop-blur-xl rounded-lg text-white placeholder-white/60 border border-white/20 focus:border-emerald-400/50 focus:outline-none transition-all duration-200 text-sm"
                placeholder="Terpenes"
              />
            </td>
          </>
        )}
        {category === 'edibles' && (
          <td className="py-3 px-4">
            <input
              type="text"
              value={editForm.dosage}
              onChange={(e) => setEditForm({...editForm, dosage: e.target.value})}
              className="w-full px-3 py-1 bg-white/10 backdrop-blur-xl rounded-lg text-white placeholder-white/60 border border-white/20 focus:border-emerald-400/50 focus:outline-none transition-all duration-200 text-sm"
              placeholder="Dosage"
            />
          </td>
        )}
        <td className="py-3 px-4">
          <button
            onClick={() => onUpdate(product, { in_stock: !product.in_stock })}
            className={`px-3 py-1 text-xs rounded-full transition-all duration-200 font-apple-medium ${
              product.in_stock 
                ? 'bg-green-500/80 text-white hover:bg-green-500' 
                : 'bg-red-500/80 text-white hover:bg-red-500'
            }`}
            disabled={saving}
          >
            {product.in_stock ? 'In Stock' : 'Out of Stock'}
          </button>
        </td>
        <td className="py-3 px-4 text-right">
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-emerald-600/80 hover:bg-emerald-600 rounded-lg text-xs transition-all duration-200 text-white font-apple-medium"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition-all duration-200 text-white font-apple-medium"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className={`${isSelected ? 'bg-emerald-900/20' : isEven ? 'bg-white/5' : ''} hover:bg-white/10 transition-all duration-200 border-b border-white/5`}>
      <td className="py-3 px-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelection}
          className="rounded bg-white/20 border-white/30 text-emerald-400 focus:ring-emerald-400"
        />
      </td>
      <td className="py-3 px-4">
        <div className="font-apple-semibold text-white">{product.name}</div>
        {product.description && (
          <div className="text-xs text-white/60 font-apple-medium mt-1 max-w-xs truncate">{product.description}</div>
        )}
      </td>
      <td className="py-3 px-4">
        <span className="text-emerald-400 font-apple-bold">{product.price}</span>
      </td>
      {(category === 'flower' || category === 'vapes') && (
        <>
          <td className="py-3 px-4">
            <span className="text-white font-apple-medium">{product.thca || '-'}</span>
          </td>
          <td className="py-3 px-4">
            <span className="text-white/80 font-apple-medium text-sm">
              {product.terpenes && product.terpenes.length > 0 ? product.terpenes[0] : '-'}
            </span>
          </td>
        </>
      )}
      {category === 'edibles' && (
        <td className="py-3 px-4">
          <span className="text-white font-apple-medium">{product.dosage || '-'}</span>
        </td>
      )}
      <td className="py-3 px-4">
        <button
          onClick={() => onUpdate(product, { in_stock: !product.in_stock })}
          className={`px-3 py-1 text-xs rounded-full transition-all duration-200 font-apple-medium ${
            product.in_stock 
              ? 'bg-green-500/80 text-white hover:bg-green-500' 
              : 'bg-red-500/80 text-white hover:bg-red-500'
          }`}
          disabled={saving}
        >
          {product.in_stock ? 'In Stock' : 'Out of Stock'}
        </button>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setEditing(product)}
            className="px-3 py-1 bg-blue-600/80 hover:bg-blue-600 rounded-lg text-xs transition-all duration-200 text-white font-apple-medium"
            disabled={saving}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="px-3 py-1 bg-red-600/80 hover:bg-red-600 rounded-lg text-xs transition-all duration-200 text-white font-apple-medium"
            disabled={saving}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}

// Enhanced Pricing Panel with controls
function PricingPanel({
  pricingRules,
  basePricing,
  products,
  onRefresh,
  saving,
  setSaving
}: {
  pricingRules: PricingRule[]
  basePricing: BasePricing[]
  products: Product[]
  onRefresh: () => Promise<void>
  saving: boolean
  setSaving: (saving: boolean) => void
}) {
  const [showAddRule, setShowAddRule] = useState(false)
  const [showPriceCalculator, setShowPriceCalculator] = useState(false)
  const [editingBasePricing, setEditingBasePricing] = useState<BasePricing | null>(null)
  const [showAddBasePricing, setShowAddBasePricing] = useState(false)

  const createPricingRule = async (ruleData: any) => {
    try {
      setSaving(true)
      const response = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ruleData)
      })

      if (!response.ok) throw new Error('Failed to create pricing rule')
      
      await onRefresh()
      setShowAddRule(false)
    } catch (err) {
      alert('Error creating pricing rule: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const deletePricingRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this pricing rule?')) return

    try {
      setSaving(true)
      const response = await fetch(`/api/pricing/${ruleId}?type=pricing_rule`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete pricing rule')
      
      await onRefresh()
    } catch (err) {
      alert('Error deleting pricing rule: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const updateBasePricing = async (pricing: BasePricing, updates: Partial<BasePricing>) => {
    try {
      setSaving(true)
      const response = await fetch(`/api/pricing/${pricing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'base_pricing', data: { ...pricing, ...updates } })
      })

      if (!response.ok) throw new Error('Failed to update base pricing')
      await onRefresh()
      setEditingBasePricing(null)
    } catch (error) {
      alert('Error updating base pricing: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const createBasePricing = async (pricingData: Omit<BasePricing, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setSaving(true)
      const response = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'base_pricing', data: pricingData })
      })

      if (!response.ok) throw new Error('Failed to create base pricing')
      await onRefresh()
      setShowAddBasePricing(false)
    } catch (error) {
      alert('Error creating base pricing: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const deleteBasePricing = async (pricingId: string) => {
    if (!confirm('Are you sure you want to delete this pricing tier?')) return

    try {
      setSaving(true)
      const response = await fetch(`/api/pricing/${pricingId}?type=base_pricing`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete base pricing')
      await onRefresh()
    } catch (error) {
      alert('Error deleting base pricing: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/20">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-don-graffiti text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>Pricing</h2>
          <div className="flex space-x-3">
            <button
              onClick={onRefresh}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-lg transition-all duration-200 flex items-center space-x-2 text-white font-apple-medium border border-white/20"
              disabled={saving}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowPriceCalculator(true)}
              className="px-6 py-3 bg-blue-600/80 hover:bg-blue-600 backdrop-blur-xl rounded-xl transition-all duration-200 text-white font-apple-medium border border-blue-400/30"
            >
              Price Calculator
            </button>
            <button
              onClick={() => setShowAddRule(true)}
              className="px-6 py-3 bg-emerald-600/80 hover:bg-emerald-600 backdrop-blur-xl rounded-xl transition-all duration-200 text-white font-apple-medium border border-emerald-400/30"
              disabled={saving}
            >
              + Add Pricing Rule
            </button>
          </div>
        </div>
      </div>

      {/* Active Pricing Rules */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <h3 className="text-xl font-apple-bold text-white mb-4 drop-shadow-lg">Active Pricing Rules ({pricingRules.length})</h3>
        {pricingRules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pricingRules.map(rule => (
              <div key={rule.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-apple-semibold text-white">{rule.name}</h4>
                  <button
                    onClick={() => deletePricingRule(rule.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-apple-medium transition-colors duration-200"
                    disabled={saving}
                  >
                    Delete
                  </button>
                </div>
                <p className="text-sm text-white/70 capitalize mb-2 font-apple-medium">
                  {rule.category} • {rule.type.replace('_', ' ')}
                </p>
                <div className="text-lg font-apple-bold text-emerald-400 mb-2">
                  {rule.type === 'percentage_discount' ? `${rule.value}% OFF` : `$${rule.value}`}
                </div>
                <div className="text-xs text-white/60 mt-1 font-apple-medium">
                  Priority: {rule.priority}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white/60 py-8">
            <div className="text-lg font-apple-semibold mb-2">No pricing rules active</div>
            <div className="text-sm font-apple-medium">Create your first rule to manage discounts and promotions.</div>
          </div>
        )}
      </div>

      {/* Base Pricing Management */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-apple-bold text-white drop-shadow-lg">Base Pricing Management</h3>
          <button
            onClick={() => setShowAddBasePricing(true)}
            className="px-4 py-2 bg-green-600/80 hover:bg-green-600 backdrop-blur-xl rounded-lg transition-all duration-200 text-white font-apple-medium border border-green-400/30"
          >
            + Add Pricing Tier
          </button>
        </div>
        
        {['flower', 'vapes', 'edibles', 'concentrates', 'prerolls', 'moonwater'].map(category => {
          const categoryPricing = basePricing.filter(bp => bp.category === category && bp.is_active)
          
          if (categoryPricing.length === 0) return null
          
          return (
            <div key={category} className="mb-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4">
              <h4 className="font-apple-semibold text-white capitalize mb-3 drop-shadow-lg text-lg">
                {category} ({categoryPricing.length} tiers)
              </h4>
              <div className="space-y-2">
                {categoryPricing
                  .sort((a, b) => {
                    // Custom sort for better display order
                    const order = ['1g', '3.5g', '7g', '14g', '28g', '1 cart', '2 carts', '3 carts', '1 pack', '2 packs', '3 packs', '1 roll', '3 rolls', '5 rolls']
                    const aIndex = order.indexOf(a.weight_or_quantity)
                    const bIndex = order.indexOf(b.weight_or_quantity)
                    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
                    return a.weight_or_quantity.localeCompare(b.weight_or_quantity)
                  })
                  .map((pricing, index) => (
                    <div key={pricing.id} className={`flex items-center justify-between p-3 rounded-lg ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'}`}>
                      {editingBasePricing?.id === pricing.id ? (
                        <div className="flex items-center space-x-4 flex-1">
                          <input
                            type="text"
                            value={editingBasePricing.weight_or_quantity}
                            onChange={(e) => setEditingBasePricing({...editingBasePricing, weight_or_quantity: e.target.value})}
                            className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded text-white placeholder-white/60 text-sm border border-white/30 focus:border-emerald-400/50 focus:outline-none w-24"
                          />
                          <span className="text-white/60">→</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-white/60">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={editingBasePricing.base_price}
                              onChange={(e) => setEditingBasePricing({...editingBasePricing, base_price: parseFloat(e.target.value) || 0})}
                              className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded text-white placeholder-white/60 text-sm border border-white/30 focus:border-emerald-400/50 focus:outline-none w-20"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateBasePricing(pricing, editingBasePricing)}
                              className="px-3 py-1 bg-green-600/80 hover:bg-green-600 rounded text-white text-sm font-apple-medium transition-all duration-200"
                              disabled={saving}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingBasePricing(null)}
                              className="px-3 py-1 bg-gray-600/80 hover:bg-gray-600 rounded text-white text-sm font-apple-medium transition-all duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center space-x-4">
                            <span className="text-white font-apple-semibold min-w-[80px]">
                              {pricing.weight_or_quantity}
                            </span>
                            <span className="text-emerald-400 font-apple-bold text-lg">
                              ${pricing.base_price}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingBasePricing(pricing)}
                              className="px-3 py-1 bg-blue-600/80 hover:bg-blue-600 rounded text-white text-sm font-apple-medium transition-all duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteBasePricing(pricing.id!)}
                              className="px-3 py-1 bg-red-600/80 hover:bg-red-600 rounded text-white text-sm font-apple-medium transition-all duration-200"
                              disabled={saving}
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )
        })}
        
        {basePricing.length === 0 && (
          <div className="text-center text-white/60 py-8">
            <div className="text-lg font-apple-semibold mb-2">No base pricing configured</div>
            <div className="text-sm font-apple-medium">Add pricing tiers to display on your menus.</div>
          </div>
        )}
      </div>

      {/* Add Pricing Rule Modal */}
      {showAddRule && (
        <AddPricingRuleModal
          onAdd={createPricingRule}
          onClose={() => setShowAddRule(false)}
          saving={saving}
        />
      )}

      {/* Price Calculator Modal */}
      {showPriceCalculator && (
        <PriceCalculatorModal
          products={products}
          onClose={() => setShowPriceCalculator(false)}
        />
      )}

      {/* Add Base Pricing Modal */}
      {showAddBasePricing && (
        <AddBasePricingModal
          onAdd={createBasePricing}
          onClose={() => setShowAddBasePricing(false)}
          saving={saving}
        />
      )}
    </div>
  )
}

// Specials Panel for managing daily/weekly specials
function SpecialsPanel({
  products,
  onRefresh,
  saving,
  setSaving
}: {
  products: Product[]
  onRefresh: () => Promise<void>
  saving: boolean
  setSaving: (saving: boolean) => void
}) {
  const [specials, setSpecials] = useState<any[]>([])
  const [showAddSpecial, setShowAddSpecial] = useState(false)
  const [editingSpecial, setEditingSpecial] = useState<any | null>(null)

  useEffect(() => {
    fetchSpecials()
  }, [])

  const fetchSpecials = async () => {
    try {
      const response = await fetch('/api/pricing')
      if (response.ok) {
        const data = await response.json()
        // Get all pricing rules that are specials, bundles, discounts
        const allSpecials = (data.pricing_rules || []).filter((rule: any) => 
          ['special', 'bundle', 'percentage_discount', 'fixed_discount'].includes(rule.type)
        )
        setSpecials(allSpecials)
      }
    } catch (err) {
      console.error('Error fetching specials:', err)
    }
  }

  const createSpecial = async (specialData: any) => {
    try {
      setSaving(true)
      const response = await fetch('/api/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...specialData, type: 'special' })
      })

      if (!response.ok) throw new Error('Failed to create special')
      
      await fetchSpecials()
      await onRefresh()
      setShowAddSpecial(false)
    } catch (err) {
      alert('Error creating special: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const updateSpecial = async (specialId: string, updates: any) => {
    try {
      setSaving(true)
      const response = await fetch(`/api/pricing/${specialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) throw new Error('Failed to update special')
      
      await fetchSpecials()
      await onRefresh()
      setEditingSpecial(null)
    } catch (err) {
      alert('Error updating special: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const toggleSpecialStatus = async (specialId: string, isActive: boolean) => {
    try {
      setSaving(true)
      const response = await fetch(`/api/pricing/${specialId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !isActive })
      })

      if (!response.ok) throw new Error('Failed to toggle special status')
      
      await fetchSpecials()
      await onRefresh()
    } catch (err) {
      alert('Error toggling special: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const deleteSpecial = async (specialId: string) => {
    if (!confirm('Are you sure you want to delete this special?')) return

    try {
      setSaving(true)
      const response = await fetch(`/api/pricing/${specialId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete special')
      
      await fetchSpecials()
      await onRefresh()
    } catch (err) {
      alert('Error deleting special: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'percentage_discount': return 'purple-400'
      case 'fixed_discount': return 'emerald-400'
      case 'bundle': return 'amber-400'
      case 'special': return 'pink-400'
      default: return 'white'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage_discount': return 'PERCENTAGE DISCOUNT'
      case 'fixed_discount': return 'FIXED DISCOUNT'
      case 'bundle': return 'BUNDLE DEAL'
      case 'special': return 'SPECIAL OFFER'
      default: return 'OFFER'
    }
  }

  const formatValue = (special: any) => {
    switch (special.type) {
      case 'percentage_discount': return `${special.value}% OFF`
      case 'fixed_discount': return `$${special.value} OFF`
      case 'bundle': return `$${special.value}`
      case 'special': return `$${special.value}`
      default: return `$${special.value}`
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/20">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-don-graffiti text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>Specials & Deals</h2>
          <div className="flex space-x-3">
            <button
              onClick={onRefresh}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-lg transition-all duration-200 flex items-center space-x-2 text-white font-apple-medium border border-white/20"
              disabled={saving}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowAddSpecial(true)}
              className="px-6 py-3 bg-purple-600/80 hover:bg-purple-600 backdrop-blur-xl rounded-xl transition-all duration-200 text-white font-apple-medium border border-purple-400/30"
              disabled={saving}
            >
              + Create Special
            </button>
          </div>
        </div>
      </div>

      {/* All Specials Table */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/20 p-4 sm:p-6">
        <h3 className="text-xl font-apple-bold text-white mb-4 drop-shadow-lg">All Specials & Deals ({specials.length})</h3>
        {specials.length > 0 ? (
          <div className="space-y-2">
            {/* Header - Hidden on mobile */}
            <div className="hidden lg:grid grid-cols-7 gap-4 py-3 px-4 bg-white/10 rounded-lg font-apple-semibold text-white/80 text-sm">
              <div>NAME</div>
              <div>TYPE</div>
              <div>CATEGORY</div>
              <div>VALUE</div>
              <div>STATUS</div>
              <div>EXPIRES</div>
              <div className="text-right">ACTIONS</div>
            </div>
            
            {/* Specials List */}
            {specials.map((special, index) => (
              <div key={special.id} className={`rounded-lg transition-all duration-200 ${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'} hover:bg-white/15`}>
                {/* Mobile Card Layout */}
                <div className="lg:hidden p-4 space-y-3">
                  {editingSpecial?.id === special.id ? (
                    // Mobile Edit Mode
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-1">NAME</label>
                        <input
                          type="text"
                          value={editingSpecial.name}
                          onChange={(e) => setEditingSpecial({...editingSpecial, name: e.target.value})}
                          className="w-full px-2 py-1 bg-white/10 text-white rounded border border-white/20 focus:border-emerald-400/50 focus:outline-none text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-white/60 mb-1">CATEGORY</label>
                          <select
                            value={editingSpecial.category}
                            onChange={(e) => setEditingSpecial({...editingSpecial, category: e.target.value})}
                            className="w-full px-2 py-1 bg-white/10 text-white rounded border border-white/20 focus:border-emerald-400/50 focus:outline-none text-sm"
                          >
                            <option value="flower">Flower</option>
                            <option value="vapes">Vapes</option>
                            <option value="edibles">Edibles</option>
                            <option value="all">All Categories</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-white/60 mb-1">VALUE</label>
                          <input
                            type="number"
                            value={editingSpecial.value}
                            onChange={(e) => setEditingSpecial({...editingSpecial, value: parseFloat(e.target.value)})}
                            className="w-full px-2 py-1 bg-white/10 text-white rounded border border-white/20 focus:border-emerald-400/50 focus:outline-none text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white/60 mb-1">EXPIRES</label>
                        <input
                          type="date"
                          value={editingSpecial.valid_until ? editingSpecial.valid_until.split('T')[0] : ''}
                          onChange={(e) => setEditingSpecial({...editingSpecial, valid_until: e.target.value ? e.target.value + 'T23:59:59' : null})}
                          className="w-full px-2 py-1 bg-white/10 text-white rounded border border-white/20 focus:border-emerald-400/50 focus:outline-none text-sm"
                        />
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={() => updateSpecial(special.id, editingSpecial)}
                          className="flex-1 px-3 py-2 bg-green-500/80 hover:bg-green-500 text-white rounded text-sm font-apple-medium transition-all duration-200"
                          disabled={saving}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSpecial(null)}
                          className="flex-1 px-3 py-2 bg-gray-500/80 hover:bg-gray-500 text-white rounded text-sm font-apple-medium transition-all duration-200"
                          disabled={saving}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Mobile View Mode
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-apple-semibold text-white text-lg">{special.name}</h4>
                        <div className={`px-2 py-1 rounded-full text-xs font-apple-medium ${special.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {special.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-white/60 font-apple-medium">Type</div>
                          <div className={`text-${getTypeColor(special.type)} font-apple-medium`}>{getTypeLabel(special.type)}</div>
                        </div>
                        <div>
                          <div className="text-white/60 font-apple-medium">Category</div>
                          <div className="text-white/70 font-apple-medium capitalize">{special.category}</div>
                        </div>
                        <div>
                          <div className="text-white/60 font-apple-medium">Value</div>
                          <div className={`text-${getTypeColor(special.type)} font-apple-bold text-lg`}>{formatValue(special)}</div>
                        </div>
                        <div>
                          <div className="text-white/60 font-apple-medium">Expires</div>
                          <div className="text-white/60 font-apple-medium">{special.valid_until ? new Date(special.valid_until).toLocaleDateString() : 'No expiry'}</div>
                        </div>
                      </div>
                      <div className="flex space-x-2 pt-3 border-t border-white/10 mt-3">
                        <button
                          onClick={() => toggleSpecialStatus(special.id, special.is_active)}
                          className={`flex-1 px-3 py-2 rounded text-sm font-apple-medium transition-all duration-200 ${
                            special.is_active 
                              ? `bg-${getTypeColor(special.type)}/20 text-${getTypeColor(special.type)} hover:bg-${getTypeColor(special.type)}/30`
                              : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                          }`}
                          disabled={saving}
                        >
                          {special.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => setEditingSpecial(special)}
                          className="px-3 py-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded text-sm font-apple-medium transition-all duration-200"
                          disabled={saving}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteSpecial(special.id)}
                          className="px-3 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded text-sm font-apple-medium transition-all duration-200"
                          disabled={saving}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Grid Layout */}
                <div className="hidden lg:grid grid-cols-7 gap-4 py-3 px-4">
                {editingSpecial?.id === special.id ? (
                  // Edit Mode
                  <>
                    <input
                      type="text"
                      value={editingSpecial.name}
                      onChange={(e) => setEditingSpecial({...editingSpecial, name: e.target.value})}
                      className="px-2 py-1 bg-white/10 text-white rounded border border-white/20 focus:border-emerald-400/50 focus:outline-none"
                    />
                    <div className={`text-${getTypeColor(special.type)} font-apple-medium text-sm`}>
                      {getTypeLabel(special.type)}
                    </div>
                    <select
                      value={editingSpecial.category}
                      onChange={(e) => setEditingSpecial({...editingSpecial, category: e.target.value})}
                      className="px-2 py-1 bg-white/10 text-white rounded border border-white/20 focus:border-emerald-400/50 focus:outline-none"
                    >
                      <option value="flower">Flower</option>
                      <option value="vapes">Vapes</option>
                      <option value="edibles">Edibles</option>
                      <option value="all">All Categories</option>
                    </select>
                    <input
                      type="number"
                      value={editingSpecial.value}
                      onChange={(e) => setEditingSpecial({...editingSpecial, value: parseFloat(e.target.value)})}
                      className="px-2 py-1 bg-white/10 text-white rounded border border-white/20 focus:border-emerald-400/50 focus:outline-none"
                    />
                    <div className={`px-3 py-1 rounded-full text-sm font-apple-medium ${special.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {special.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </div>
                    <input
                      type="date"
                      value={editingSpecial.valid_until ? editingSpecial.valid_until.split('T')[0] : ''}
                      onChange={(e) => setEditingSpecial({...editingSpecial, valid_until: e.target.value ? e.target.value + 'T23:59:59' : null})}
                      className="px-2 py-1 bg-white/10 text-white rounded border border-white/20 focus:border-emerald-400/50 focus:outline-none text-sm"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => updateSpecial(special.id, editingSpecial)}
                        className="px-3 py-1 bg-green-500/80 hover:bg-green-500 text-white rounded text-sm font-apple-medium transition-all duration-200"
                        disabled={saving}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingSpecial(null)}
                        className="px-3 py-1 bg-gray-500/80 hover:bg-gray-500 text-white rounded text-sm font-apple-medium transition-all duration-200"
                        disabled={saving}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  // View Mode
                  <>
                    <div className="font-apple-semibold text-white">
                      {special.name}
                    </div>
                    <div className={`text-${getTypeColor(special.type)} font-apple-medium text-sm`}>
                      {getTypeLabel(special.type)}
                    </div>
                    <div className="text-white/70 font-apple-medium capitalize">
                      {special.category}
                    </div>
                    <div className={`text-${getTypeColor(special.type)} font-apple-bold`}>
                      {formatValue(special)}
                    </div>
                    <div>
                      <button
                        onClick={() => toggleSpecialStatus(special.id, special.is_active)}
                        className={`px-3 py-1 rounded-full text-sm font-apple-medium transition-all duration-200 ${
                          special.is_active 
                            ? `bg-${getTypeColor(special.type)}/20 text-${getTypeColor(special.type)} hover:bg-${getTypeColor(special.type)}/30`
                            : 'bg-gray-600/20 text-gray-400 hover:bg-gray-600/30'
                        }`}
                        disabled={saving}
                      >
                        {special.is_active ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </div>
                    <div className="text-white/60 font-apple-medium text-sm">
                      {special.valid_until ? new Date(special.valid_until).toLocaleDateString() : 'No expiry'}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setEditingSpecial(special)}
                        className="px-3 py-1 bg-blue-500/80 hover:bg-blue-500 text-white rounded text-sm font-apple-medium transition-all duration-200"
                        disabled={saving}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteSpecial(special.id)}
                        className="px-3 py-1 bg-red-500/80 hover:bg-red-500 text-white rounded text-sm font-apple-medium transition-all duration-200"
                        disabled={saving}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white/60 py-8">
            <div className="text-lg font-apple-semibold mb-2">No specials created</div>
            <div className="text-sm font-apple-medium">Create specials and deals to attract customers.</div>
          </div>
        )}
      </div>

      {/* Add Special Modal */}
      {showAddSpecial && (
        <AddSpecialModal
          products={products}
          onAdd={createSpecial}
          onClose={() => setShowAddSpecial(false)}
          saving={saving}
        />
      )}
    </div>
  )
}

// Bundles Panel for creating product bundles
function BundlesPanel({
  products,
  onRefresh,
  saving,
  setSaving
}: {
  products: Product[]
  onRefresh: () => Promise<void>
  saving: boolean
  setSaving: (saving: boolean) => void
}) {
  const [bundles, setBundles] = useState<any[]>([])
  const [showCreateBundle, setShowCreateBundle] = useState(false)

  useEffect(() => {
    fetchBundles()
  }, [])

  const fetchBundles = async () => {
    try {
      const response = await fetch('/api/bundles')
      if (response.ok) {
        const data = await response.json()
        setBundles(data.bundles || [])
      }
    } catch (err) {
      console.error('Error fetching bundles:', err)
    }
  }

  const createBundle = async (bundleData: any) => {
    try {
      setSaving(true)
      const response = await fetch('/api/bundles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bundleData)
      })

      if (!response.ok) throw new Error('Failed to create bundle')
      
      await fetchBundles()
      await onRefresh()
      setShowCreateBundle(false)
    } catch (err) {
      alert('Error creating bundle: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const deleteBundle = async (bundleId: string) => {
    if (!confirm('Are you sure you want to delete this bundle?')) return

    try {
      setSaving(true)
      const response = await fetch(`/api/bundles/${bundleId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete bundle')
      
      await fetchBundles()
      await onRefresh()
    } catch (err) {
      alert('Error deleting bundle: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/20">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-don-graffiti text-white tracking-wide drop-shadow-lg" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>Bundle Deals</h2>
          <div className="flex space-x-3">
            <button
              onClick={onRefresh}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-lg transition-all duration-200 flex items-center space-x-2 text-white font-apple-medium border border-white/20"
              disabled={saving}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowCreateBundle(true)}
              className="px-6 py-3 bg-amber-600/80 hover:bg-amber-600 backdrop-blur-xl rounded-xl transition-all duration-200 text-white font-apple-medium border border-amber-400/30"
              disabled={saving}
            >
              + Create Bundle
            </button>
          </div>
        </div>
      </div>

      {/* Active Bundles */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <h3 className="text-xl font-apple-bold text-white mb-4 drop-shadow-lg">Active Bundles ({bundles.length})</h3>
        {bundles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bundles.map(bundle => (
              <div key={bundle.id} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-apple-semibold text-white">{bundle.name}</h4>
                    <button
                      onClick={() => deleteBundle(bundle.id)}
                      className="text-red-400 hover:text-red-300 text-sm font-apple-medium transition-colors duration-200"
                      disabled={saving}
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-sm text-white/70 mb-2 font-apple-medium">{bundle.description}</p>
                  <div className="text-sm text-white/60 mb-2 font-apple-medium">
                  {bundle.conditions?.bundle_type === 'category' ? (
                    <>
                      Type: Category-based bundle
                      {bundle.conditions?.category_requirements && (
                        <div className="mt-1 text-xs text-white/50">
                          {Object.entries(bundle.conditions.category_requirements).map(([category, req]: [string, any]) => (
                            <div key={category}>
                              {req.quantity}x {category.charAt(0).toUpperCase() + category.slice(1)}
                              {req.weight && ` (${req.weight} each)`}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      Products: {bundle.conditions?.specific_products?.length || 0} items
                      {bundle.conditions?.product_details && (
                        <div className="mt-1 text-xs text-white/50">
                          {Object.entries(bundle.conditions.product_details).map(([productId, details]: [string, any]) => {
                            const product = products.find(p => p.id === productId)
                            if (!product) return null
                            return (
                              <div key={productId}>
                                {product.name}: {details.weight || `${details.quantity || 1}x`}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-apple-bold text-emerald-400">
                    ${bundle.value}
                  </div>
                  <div className="text-sm text-green-400 font-apple-medium">
                    Save ${((bundle.conditions?.original_price || 0) - bundle.value).toFixed(2)} ({bundle.conditions?.discount_percentage || 0}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white/60 py-8">
            <div className="text-lg font-apple-semibold mb-2">No bundles created</div>
            <div className="text-sm font-apple-medium">Create product bundles to increase average order value.</div>
          </div>
        )}
      </div>



      {/* Create Bundle Modal */}
      {showCreateBundle && (
        <CreateBundleModal
          products={products}
          onAdd={createBundle}
          onClose={() => setShowCreateBundle(false)}
          saving={saving}
        />
      )}
    </div>
  )
}

function SettingsPanel({ settings }: { settings: MenuSettings }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Settings</h2>
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Display Configuration</h3>
        <div className="text-gray-400">
          Font Size: {settings.display_config?.font_size || 170}% • 
          Auto Refresh: {settings.display_config?.auto_refresh_interval || 30}s
        </div>
      </div>
    </div>
  )
}

// Add Product Modal (simplified version)
function AddProductModal({
  category,
  onAdd,
  onClose,
  saving
}: {
  category: string
  onAdd: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onClose: () => void
  saving: boolean
}) {
  const getTypesByCategory = (cat: string) => {
    switch (cat) {
      case 'flower': return ['indica', 'sativa', 'hybrid']
      case 'vapes': return ['indica', 'sativa', 'hybrid']
      case 'edibles': return ['cookie', 'gummy', 'moonwater']
      default: return []
    }
  }

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: getTypesByCategory(category)[0] || '',
    category: category,
    thca: '',
    dosage: '',
    terpenes: '',
    effects: '',
    price: '$0',
    in_stock: true,
    sort_order: 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      alert('Please fill in the product name')
      return
    }

    const productData = {
      name: formData.name,
      category: formData.category as 'flower' | 'vapes' | 'edibles',
      type: formData.type,
      description: formData.description,
      price: formData.price,
      in_stock: formData.in_stock,
      sort_order: formData.sort_order,
      // Category-specific fields
      ...(category === 'flower' && {
        thca: formData.thca,
        terpenes: formData.terpenes ? formData.terpenes.split(',').map(t => t.trim()) : [],
        effects: formData.effects ? formData.effects.split(',').map(e => e.trim()) : []
      }),
      ...(category === 'vapes' && {
        thca: formData.thca,
        terpenes: formData.terpenes ? formData.terpenes.split(',').map(t => t.trim()) : [],
        effects: formData.effects.split(',').map(e => e.trim())
      }),
      ...(category === 'edibles' && {
        dosage: formData.dosage,
        effects: formData.effects ? formData.effects.split(',').map(e => e.trim()) : []
      })
    }

    onAdd(productData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Add New {category.charAt(0).toUpperCase() + category.slice(1)}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              required
            >
              {getTypesByCategory(category).map(type => (
                <option key={type} value={type} className="capitalize">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Price *</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="$40"
              required
            />
          </div>

          {category === 'flower' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">THCA %</label>
              <input
                type="text"
                value={formData.thca}
                onChange={(e) => setFormData({...formData, thca: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                placeholder="19%"
              />
            </div>
          )}

          {category === 'edibles' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Dosage</label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                placeholder="100mg"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white resize-none"
              rows={3}
              placeholder="Product description"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="in_stock"
              checked={formData.in_stock}
              onChange={(e) => setFormData({...formData, in_stock: e.target.checked})}
              className="rounded bg-gray-700"
            />
            <label htmlFor="in_stock" className="text-sm text-gray-300">In Stock</label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
              disabled={saving}
            >
              {saving ? 'Adding...' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Modal Components for Pricing, Specials, and Bundles
function AddPricingRuleModal({
  onAdd,
  onClose,
  saving
}: {
  onAdd: (rule: any) => Promise<void>
  onClose: () => void
  saving: boolean
}) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'percentage_discount',
    value: '',
    category: 'all',
    description: '',
    priority: 1,
    max_uses: '',
    valid_from: '',
    valid_until: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.value) {
      alert('Please fill in required fields')
      return
    }

    onAdd({
      ...formData,
      value: parseFloat(formData.value),
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
      valid_from: formData.valid_from || null,
      valid_until: formData.valid_until || null
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Add Pricing Rule</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Rule Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Happy Hour 20% Off"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Discount Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              required
            >
              <option value="percentage_discount">Percentage Off</option>
              <option value="fixed_discount">Fixed Amount Off</option>
              <option value="fixed_price">Set Fixed Price</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Value * {formData.type === 'percentage_discount' ? '(%)' : '($)'}
            </label>
            <input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder={formData.type === 'percentage_discount' ? '20' : '5.00'}
              min="0"
              step={formData.type === 'percentage_discount' ? '1' : '0.01'}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
            >
              <option value="all">All Categories</option>
              <option value="flower">Flower</option>
              <option value="vapes">Vapes</option>
              <option value="edibles">Edibles</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Valid From</label>
              <input
                type="date"
                value={formData.valid_from}
                onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Valid Until</label>
              <input
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
              disabled={saving}
            >
              {saving ? 'Creating...' : 'Create Rule'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function PriceCalculatorModal({
  products,
  onClose
}: {
  products: Product[]
  onClose: () => void
}) {
  const [selectedCategory, setSelectedCategory] = useState('flower')
  const [costPrice, setCostPrice] = useState('')
  const [markupPercent, setMarkupPercent] = useState('100')

  const calculatePrice = () => {
    const cost = parseFloat(costPrice)
    const markup = parseFloat(markupPercent)
    if (cost && markup) {
      return (cost * (1 + markup / 100)).toFixed(2)
    }
    return '0.00'
  }

  const calculateMargin = () => {
    const cost = parseFloat(costPrice)
    const markup = parseFloat(markupPercent)
    if (cost && markup) {
      const sellPrice = cost * (1 + markup / 100)
      return ((sellPrice - cost) / sellPrice * 100).toFixed(1)
    }
    return '0.0'
  }

  const categoryProducts = products.filter(p => p.category === selectedCategory)
  const avgPrice = categoryProducts.length > 0 
    ? categoryProducts.reduce((sum, p) => sum + parseFloat(p.price.replace(/[^0-9.]/g, '')), 0) / categoryProducts.length
    : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Price Calculator</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
            >
              <option value="flower">Flower</option>
              <option value="vapes">Vapes</option>
              <option value="edibles">Edibles</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Cost Price ($)</label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                placeholder="20.00"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Markup (%)</label>
              <input
                type="number"
                value={markupPercent}
                onChange={(e) => setMarkupPercent(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                placeholder="100"
              />
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span>Suggested Sell Price:</span>
              <span className="font-bold text-green-400">${calculatePrice()}</span>
            </div>
            <div className="flex justify-between">
              <span>Profit Margin:</span>
              <span className="font-bold text-blue-400">{calculateMargin()}%</span>
            </div>
            <div className="flex justify-between">
              <span>Category Average:</span>
              <span className="text-gray-300">${avgPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddBasePricingModal({
  onAdd,
  onClose,
  saving
}: {
  onAdd: (pricing: Omit<BasePricing, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onClose: () => void
  saving: boolean
}) {
  const [formData, setFormData] = useState({
    category: 'flower',
    weight_or_quantity: '',
    base_price: '',
    is_active: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.weight_or_quantity || !formData.base_price) {
      alert('Please fill in all required fields')
      return
    }

    onAdd({
      category: formData.category,
      weight_or_quantity: formData.weight_or_quantity,
      base_price: parseFloat(formData.base_price),
      is_active: formData.is_active
    })
  }

  const getWeightOptions = (category: string) => {
    switch (category) {
      case 'flower':
        return ['1g', '3.5g', '7g', '14g', '28g']
      case 'concentrates':
        return ['1g', '3.5g', '7g', '14g', '28g']
      case 'vapes':
        return ['1 cart', '2 carts', '3 carts']
      case 'edibles':
        return ['1 pack', '2 packs', '3 packs']
      case 'prerolls':
        return ['1 roll', '3 rolls', '5 rolls']
      case 'moonwater':
        return ['5mg single', '5mg 4-pack', '10mg single', '10mg 4-pack', '30mg single', '30mg 4-pack']
      default:
        return []
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4 text-green-200">Add Base Pricing</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value, weight_or_quantity: ''})}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              required
            >
              <option value="flower">Flower</option>
              <option value="concentrates">Concentrates</option>
              <option value="vapes">Vapes</option>
              <option value="edibles">Edibles</option>
              <option value="prerolls">Pre-rolls</option>
              <option value="moonwater">Moonwater</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Weight/Quantity *</label>
            <select
              value={formData.weight_or_quantity}
              onChange={(e) => setFormData({...formData, weight_or_quantity: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              required
            >
              <option value="">Select weight/quantity</option>
              {getWeightOptions(formData.category).map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Base Price ($) *</label>
            <input
              type="number"
              value={formData.base_price}
              onChange={(e) => setFormData({...formData, base_price: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="35.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              className="rounded"
            />
            <label htmlFor="is_active" className="text-sm text-gray-300">Active</label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
              disabled={saving}
            >
              {saving ? 'Adding...' : 'Add Pricing'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AddSpecialModal({
  products,
  onAdd,
  onClose,
  saving
}: {
  products: Product[]
  onAdd: (special: any) => Promise<void>
  onClose: () => void
  saving: boolean
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount_type: 'percentage',
    value: '',
    category: 'all',
    valid_from: '',
    valid_until: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.value) {
      alert('Please fill in required fields')
      return
    }

    onAdd({
      ...formData,
      value: parseFloat(formData.value),
      valid_from: formData.valid_from || null,
      valid_until: formData.valid_until || null
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 text-purple-200">Create Special</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Special Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              placeholder="Happy Hour Special"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white resize-none"
              rows={3}
              placeholder="20% off all flower products during happy hour"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Discount Type</label>
              <select
                value={formData.discount_type}
                onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              >
                <option value="percentage">Percentage Off</option>
                <option value="fixed">Fixed Amount Off</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Value * {formData.discount_type === 'percentage' ? '(%)' : '($)'}
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                placeholder={formData.discount_type === 'percentage' ? '20' : '5.00'}
                min="0"
                step={formData.discount_type === 'percentage' ? '1' : '0.01'}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
            >
              <option value="all">All Categories</option>
              <option value="flower">Flower</option>
              <option value="vapes">Vapes</option>
              <option value="edibles">Edibles</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.valid_from}
                onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                value={formData.valid_until}
                onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
              disabled={saving}
            >
              {saving ? 'Creating...' : 'Create Special'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function CreateBundleModal({
  products,
  onAdd,
  onClose,
  saving
}: {
  products: Product[]
  onAdd: (bundle: any) => Promise<void>
  onClose: () => void
  saving: boolean
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bundle_price: '',
    category: 'all'
  })
  const [bundleType, setBundleType] = useState<'specific' | 'category'>('specific')
  const [selectedProducts, setSelectedProducts] = useState<{[key: string]: {weight?: string, quantity?: number}}>({})
  const [categoryRequirements, setCategoryRequirements] = useState<{[key: string]: {quantity: number, weight?: string}}>({})

  const getWeightOptions = (category: string) => {
    if (category === 'flower') {
      return ['1g', '3.5g', '7g', '14g', '28g']
    }
    return []
  }

  const getQuantityOptions = () => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  }

  const getCategoryDisplayName = (category: string) => {
    const names: {[key: string]: string} = {
      'flower': 'Flower',
      'vapes': 'Vapes', 
      'edibles': 'Edibles',
      'concentrates': 'Concentrates',
      'prerolls': 'Pre-rolls'
    }
    return names[category] || category
  }

  const calculateOriginalPrice = () => {
    if (bundleType === 'specific') {
      return Object.keys(selectedProducts).reduce((total, productId) => {
        const product = products.find(p => p.id === productId)
        return total + (product ? parseFloat(product.price.replace(/[^0-9.]/g, '')) : 0)
      }, 0)
    } else {
      // For category-based bundles, estimate based on average prices
      return Object.entries(categoryRequirements).reduce((total, [category, req]) => {
        const categoryProducts = products.filter(p => p.category === category)
        if (categoryProducts.length > 0) {
          const avgPrice = categoryProducts.reduce((sum, p) => sum + parseFloat(p.price.replace(/[^0-9.]/g, '')), 0) / categoryProducts.length
          return total + (avgPrice * req.quantity)
        }
        return total
      }, 0)
    }
  }

  const calculateDiscount = () => {
    const original = calculateOriginalPrice()
    const bundle = parseFloat(formData.bundle_price) || 0
    return original > 0 ? ((original - bundle) / original * 100).toFixed(1) : '0'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (bundleType === 'specific') {
      if (!formData.name || !formData.bundle_price || Object.keys(selectedProducts).length === 0) {
        alert('Please fill in required fields and select products')
        return
      }

      onAdd({
        ...formData,
        bundle_type: 'specific',
        products: Object.keys(selectedProducts),
        product_details: selectedProducts,
        bundle_price: parseFloat(formData.bundle_price),
        original_price: calculateOriginalPrice(),
        discount_percentage: parseFloat(calculateDiscount())
      })
    } else {
      if (!formData.name || !formData.bundle_price || Object.keys(categoryRequirements).length === 0) {
        alert('Please fill in required fields and category requirements')
        return
      }

      onAdd({
        ...formData,
        bundle_type: 'category',
        category_requirements: categoryRequirements,
        bundle_price: parseFloat(formData.bundle_price),
        original_price: calculateOriginalPrice(),
        discount_percentage: parseFloat(calculateDiscount())
      })
    }
  }

  const filteredProducts = formData.category === 'all' 
    ? products 
    : products.filter(p => p.category === formData.category)

  const availableCategories = Array.from(new Set(products.map(p => p.category)))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4 text-amber-200">Create Bundle</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bundle Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                placeholder="Weekend Special Bundle"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bundle Price *</label>
              <input
                type="number"
                value={formData.bundle_price}
                onChange={(e) => setFormData({...formData, bundle_price: e.target.value})}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                placeholder="75.00"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white resize-none"
              rows={2}
              placeholder="Perfect starter bundle with flower, vape, and edible"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Bundle Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="specific"
                  checked={bundleType === 'specific'}
                  onChange={(e) => setBundleType(e.target.value as 'specific' | 'category')}
                  className="text-amber-600"
                />
                <span className="text-gray-300">Specific Products</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="category"
                  checked={bundleType === 'category'}
                  onChange={(e) => setBundleType(e.target.value as 'specific' | 'category')}
                  className="text-amber-600"
                />
                <span className="text-gray-300">Category Based</span>
              </label>
            </div>
          </div>

          {bundleType === 'specific' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Filter by Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="flower">Flower</option>
                  <option value="vapes">Vapes</option>
                  <option value="edibles">Edibles</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Products ({Object.keys(selectedProducts).length} selected)
                </label>
                <div className="max-h-48 overflow-y-auto bg-gray-700 rounded p-3 space-y-3">
                  {filteredProducts.map(product => {
                    const isSelected = selectedProducts[product.id]
                    const useWeight = product.category === 'flower'
                    
                    return (
                      <div key={product.id} className="space-y-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProducts({
                                  ...selectedProducts, 
                                  [product.id]: useWeight ? { weight: '3.5g' } : { quantity: 1 }
                                })
                              } else {
                                const newSelected = { ...selectedProducts }
                                delete newSelected[product.id]
                                setSelectedProducts(newSelected)
                              }
                            }}
                            className="rounded bg-gray-600"
                          />
                          <span className="flex-1 font-medium">{product.name}</span>
                          <span className="text-xs text-gray-400 capitalize">{product.category}</span>
                        </label>
                        
                        {isSelected && (
                          <div className="ml-6 flex items-center space-x-2">
                            {useWeight ? (
                              <>
                                <span className="text-sm text-gray-300">Weight:</span>
                                <select
                                  value={isSelected.weight || '3.5g'}
                                  onChange={(e) => setSelectedProducts({
                                    ...selectedProducts,
                                    [product.id]: { weight: e.target.value }
                                  })}
                                  className="px-2 py-1 bg-gray-600 rounded text-white text-sm"
                                >
                                  {getWeightOptions(product.category).map(weight => (
                                    <option key={weight} value={weight}>{weight}</option>
                                  ))}
                                </select>
                              </>
                            ) : (
                              <>
                                <span className="text-sm text-gray-300">Quantity:</span>
                                <select
                                  value={isSelected.quantity || 1}
                                  onChange={(e) => setSelectedProducts({
                                    ...selectedProducts,
                                    [product.id]: { quantity: parseInt(e.target.value) }
                                  })}
                                  className="px-2 py-1 bg-gray-600 rounded text-white text-sm"
                                >
                                  {getQuantityOptions().map(qty => (
                                    <option key={qty} value={qty}>{qty}</option>
                                  ))}
                                </select>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {Object.keys(selectedProducts).length > 0 && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Bundle Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Original Price:</span>
                      <span>${calculateOriginalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bundle Price:</span>
                      <span className="text-amber-400">${formData.bundle_price || '0.00'}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Customer Saves:</span>
                      <span className="text-green-400">
                        ${(calculateOriginalPrice() - (parseFloat(formData.bundle_price) || 0)).toFixed(2)} ({calculateDiscount()}%)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {bundleType === 'category' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category Requirements ({Object.keys(categoryRequirements).length} categories)
              </label>
              <div className="space-y-3">
                {availableCategories.map(category => (
                  <div key={category} className="bg-gray-700 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!categoryRequirements[category]}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCategoryRequirements({
                                ...categoryRequirements,
                                [category]: { quantity: 1, weight: category === 'flower' ? '3.5g' : undefined }
                              })
                            } else {
                              const newRequirements = { ...categoryRequirements }
                              delete newRequirements[category]
                              setCategoryRequirements(newRequirements)
                            }
                          }}
                          className="rounded bg-gray-600"
                        />
                        <span className="font-medium text-white">{getCategoryDisplayName(category)}</span>
                      </label>
                    </div>
                    
                    {categoryRequirements[category] && (
                      <div className="ml-6 space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-300">Quantity:</span>
                          <select
                            value={categoryRequirements[category].quantity}
                            onChange={(e) => setCategoryRequirements({
                              ...categoryRequirements,
                              [category]: { 
                                ...categoryRequirements[category], 
                                quantity: parseInt(e.target.value) 
                              }
                            })}
                            className="px-2 py-1 bg-gray-600 rounded text-white text-sm"
                          >
                            {getQuantityOptions().map(qty => (
                              <option key={qty} value={qty}>{qty}</option>
                            ))}
                          </select>
                        </div>
                        
                        {category === 'flower' && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-300">Weight per item:</span>
                            <select
                              value={categoryRequirements[category].weight || '3.5g'}
                              onChange={(e) => setCategoryRequirements({
                                ...categoryRequirements,
                                [category]: { 
                                  ...categoryRequirements[category], 
                                  weight: e.target.value 
                                }
                              })}
                              className="px-2 py-1 bg-gray-600 rounded text-white text-sm"
                            >
                              {getWeightOptions(category).map(weight => (
                                <option key={weight} value={weight}>{weight}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-400">
                          Example: "Any {categoryRequirements[category].quantity} {getCategoryDisplayName(category).toLowerCase()} item{categoryRequirements[category].quantity > 1 ? 's' : ''}"
                          {categoryRequirements[category].weight && ` (${categoryRequirements[category].weight} each)`}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {((bundleType === 'specific' && Object.keys(selectedProducts).length > 0) || 
            (bundleType === 'category' && Object.keys(categoryRequirements).length > 0)) && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Bundle Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Estimated Original Price:</span>
                  <span>${calculateOriginalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bundle Price:</span>
                  <span className="text-amber-400">${formData.bundle_price || '0.00'}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Customer Saves:</span>
                  <span className="text-green-400">
                    ${(calculateOriginalPrice() - (parseFloat(formData.bundle_price) || 0)).toFixed(2)} ({calculateDiscount()}%)
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded transition-colors"
              disabled={saving}
            >
              {saving ? 'Creating...' : 'Create Bundle'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 