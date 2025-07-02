'use client'

import { useState } from 'react'
import Image from 'next/image'
import ProductManager from '@/components/admin/ProductManager'
import StoreManager from '@/components/admin/StoreManager'
import BulkUpload from '@/components/admin/BulkUpload'
import ColorCustomizer from '@/components/admin/ColorCustomizer'
import AdminMenuGrid from '@/components/admin/AdminMenuGrid'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('stores')
  const [selectedStore, setSelectedStore] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('flower')

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Image
            src="/newlogo.png"
            alt="Cannabis Menu Logo"
            width={60}
            height={60}
            className="w-15 h-15 object-contain"
          />
          <h1 className="text-4xl font-light text-gray-100 font-sf-pro-display">Admin Dashboard</h1>
        </div>
        
        <div className="mb-6">
          <div className="border-b border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('stores')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'stores'
                    ? 'border-green-500 text-green-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                Stores
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-green-500 text-green-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab('bulk-upload')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'bulk-upload'
                    ? 'border-green-500 text-green-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <span className="mr-1">📤</span>
                Bulk Upload
              </button>
              <button
                onClick={() => setActiveTab('themes')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'themes'
                    ? 'border-green-500 text-green-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <span className="mr-1">🎨</span>
                Color Customization
              </button>
              <button
                onClick={() => setActiveTab('menu-preview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'menu-preview'
                    ? 'border-green-500 text-green-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                <span className="mr-1">👁️</span>
                Menu Preview
              </button>
            </nav>
          </div>
        </div>
        
        {activeTab !== 'menu-preview' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6">
            {activeTab === 'stores' && <StoreManager />}
            {activeTab === 'products' && <ProductManager />}
            {activeTab === 'bulk-upload' && <BulkUpload />}
            {activeTab === 'themes' && <ColorCustomizer />}
          </div>
        )}
        
        {activeTab === 'menu-preview' && (
          <div className="space-y-4">
            {/* Menu Preview Controls */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-300">Store:</label>
                  <input
                    type="text"
                    value={selectedStore}
                    onChange={(e) => setSelectedStore(e.target.value)}
                    placeholder="Enter store code (e.g., TN)"
                    className="bg-gray-700 text-white text-sm px-3 py-1 rounded border border-gray-600"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-300">Category:</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-700 text-white text-sm px-3 py-1 rounded border border-gray-600"
                  >
                    <option value="flower">Flower</option>
                    <option value="vape">Vape</option>
                    <option value="edible">Edible</option>
                    <option value="concentrate">Concentrate</option>
                    <option value="moonwater">Moonwater</option>
                  </select>
                </div>
              </div>
              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400 text-sm">
                  💡 <strong>Tip:</strong> Use the Color Customization tab to customize every aspect of your menu's appearance. 
                  Changes apply instantly to all menu displays including this preview.
                </p>
              </div>
            </div>
            
            {/* Menu Preview */}
            {selectedStore && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 overflow-hidden">
                <AdminMenuGrid 
                  storeCode={selectedStore} 
                  category={selectedCategory} 
                />
              </div>
            )}
            
            {!selectedStore && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-8 text-center">
                <p className="text-gray-400">Enter a store code to preview the menu with auto refresh controls</p>
                <p className="text-gray-500 text-sm mt-2">The preview will use your current color customization settings</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
} 