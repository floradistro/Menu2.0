'use client'

import { useState } from 'react'
import ProductManager from '@/components/admin/ProductManager'
import StoreManager from '@/components/admin/StoreManager'
import BulkUpload from '@/components/admin/BulkUpload'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('stores')

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-light text-gray-100 mb-8 font-sf-pro-display">Admin Dashboard</h1>
        
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
            </nav>
          </div>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6">
          {activeTab === 'stores' && <StoreManager />}
          {activeTab === 'products' && <ProductManager />}
          {activeTab === 'bulk-upload' && <BulkUpload />}
        </div>
      </div>
    </main>
  )
} 