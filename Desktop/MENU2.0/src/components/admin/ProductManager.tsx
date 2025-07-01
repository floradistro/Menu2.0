'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { FormInput } from '@/components/ui/FormInput'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { VALID_CATEGORIES } from '@/lib/constants'
import { parseNumericValue } from '@/lib/utils'

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    product_name: '',
    product_category: '',
    strain_type: '',
    strain_cross: '',
    description: '',
    terpene: '',
    strength: '',
    thca_percent: undefined,
    delta9_percent: undefined,
    store_code: ''
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('product_name')

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      // Error handled above
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const productData = {
        ...formData,
        thca_percent: formData.thca_percent ? parseFloat(formData.thca_percent.toString()) : null,
        delta9_percent: formData.delta9_percent ? parseFloat(formData.delta9_percent.toString()) : null
      }

      if (editingProduct?.id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)

        if (error) throw error
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData])

        if (error) throw error
      }

      // Reset form and refresh data
      setShowForm(false)
      setEditingProduct(null)
      setFormData({
        product_name: '',
        product_category: '',
        strain_type: '',
        strain_cross: '',
        description: '',
        terpene: '',
        strength: '',
        thca_percent: undefined,
        delta9_percent: undefined,
        store_code: ''
      })
      fetchProducts()
    } catch (error) {
      alert('Error saving product. Please try again.')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      product_name: product.product_name,
      product_category: product.product_category || '',
      strain_type: product.strain_type || '',
      strain_cross: product.strain_cross || '',
      description: product.description || '',
      terpene: product.terpene || '',
      strength: product.strength || '',
      thca_percent: product.thca_percent,
      delta9_percent: product.delta9_percent,
      store_code: product.store_code || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchProducts()
    } catch (error) {
      alert('Error deleting product. Please try again.')
    }
  }

  const handleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      newSelected.add(productId)
    }
    setSelectedProducts(newSelected)
    setSelectAll(newSelected.size === products.length)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts(new Set())
      setSelectAll(false)
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)))
      setSelectAll(true)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return
    
    const confirmed = confirm(`Are you sure you want to delete ${selectedProducts.size} selected products? This action cannot be undone.`)
    if (!confirmed) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', Array.from(selectedProducts))

      if (error) throw error
      
      setSelectedProducts(new Set())
      setSelectAll(false)
      fetchProducts()
      alert(`Successfully deleted ${selectedProducts.size} products.`)
    } catch (error) {
      alert('Error deleting products. Please try again.')
    }
  }

  if (loading) {
    return <div className="text-gray-400 text-center py-8">Loading products...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-light text-gray-100">Product Management</h2>
          {selectedProducts.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-md hover:from-red-700 hover:to-red-600 transition-all duration-200 shadow-lg"
            >
              <span className="mr-2">🗑️</span>
              Delete Selected ({selectedProducts.size})
            </button>
          )}
        </div>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingProduct(null)
            setFormData({
              product_name: '',
              product_category: '',
              strain_type: '',
              strain_cross: '',
              description: '',
              terpene: '',
              strength: '',
              thca_percent: undefined,
              delta9_percent: undefined,
              store_code: ''
            })
          }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-medium rounded-md hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg"
        >
          <span className="mr-2">➕</span>
          Add Product
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="mb-8 bg-gray-700/50 rounded-lg p-6 border border-gray-600">
          <h3 className="text-xl font-medium text-gray-100 mb-4">
            {editingProduct ? 'Edit Product' : 'New Product'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.product_name || ''}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.product_category || ''}
                  onChange={(e) => setFormData({ ...formData, product_category: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Flower">Flower</option>
                  <option value="Vape">Vape</option>
                  <option value="Edible">Edible</option>
                  <option value="Concentrate">Concentrate</option>
                  <option value="Moonwater">Moonwater</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Strain Type
                </label>
                <input
                  type="text"
                  value={formData.strain_type || ''}
                  onChange={(e) => setFormData({ ...formData, strain_type: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Indica, Sativa, Hybrid"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Strain Cross
                </label>
                <input
                  type="text"
                  value={formData.strain_cross || ''}
                  onChange={(e) => setFormData({ ...formData, strain_cross: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., OG Kush x Purple Haze"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Terpene
                </label>
                <input
                  type="text"
                  value={formData.terpene || ''}
                  onChange={(e) => setFormData({ ...formData, terpene: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Limonene, Myrcene"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Strength
                </label>
                <input
                  type="text"
                  value={formData.strength || ''}
                  onChange={(e) => setFormData({ ...formData, strength: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 10mg, 100mg, 1g"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  THCA %
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.thca_percent || ''}
                  onChange={(e) => setFormData({ ...formData, thca_percent: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 25.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Delta-9 THC %
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.delta9_percent || ''}
                  onChange={(e) => setFormData({ ...formData, delta9_percent: e.target.value ? parseFloat(e.target.value) : undefined })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 0.3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Store Code
                </label>
                <input
                  type="text"
                  value={formData.store_code || ''}
                  onChange={(e) => setFormData({ ...formData, store_code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., TN, LA"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingProduct(null)
                }}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-medium rounded-md hover:from-green-700 hover:to-green-600 transition-all duration-200"
              >
                {editingProduct ? 'Update' : 'Create'} Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400 w-12">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500 focus:ring-offset-gray-800"
                />
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Product Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Category</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Strain Type</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Strength</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">THCA %</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Store</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-700/30 transition-colors duration-150">
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500 focus:ring-offset-gray-800"
                  />
                </td>
                <td className="py-3 px-4 text-gray-200">{product.product_name}</td>
                <td className="py-3 px-4 text-gray-300">{product.product_category || '-'}</td>
                <td className="py-3 px-4 text-gray-300">{product.strain_type || '-'}</td>
                <td className="py-3 px-4 text-gray-300">{product.strength || '-'}</td>
                <td className="py-3 px-4 text-gray-300">{product.thca_percent ? `${product.thca_percent}%` : '-'}</td>
                <td className="py-3 px-4 text-gray-300">{product.store_code || '-'}</td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-150"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-150"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No products found. Click "Add Product" to create your first product.
          </div>
        )}
      </div>
    </div>
  )
} 