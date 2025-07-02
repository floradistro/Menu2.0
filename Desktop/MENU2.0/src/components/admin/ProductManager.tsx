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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState('')
  
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
    store_code: '',
    is_gummy: false,
    is_cookie: false
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  // Filter products when products, selectedCategory, or searchTerm changes
  useEffect(() => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.product_category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.strain_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.strain_cross?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.store_code?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
    setSelectedProducts(new Set()) // Clear selections when filter changes
    setSelectAll(false)
  }, [products, selectedCategory, searchTerm])

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
      // Validate required fields
      if (!formData.product_name?.trim()) {
        alert('Product name is required.')
        return
      }
      
      if (!formData.product_category?.trim()) {
        alert('Product category is required.')
        return
      }
      
      if (!formData.store_code?.trim()) {
        alert('Store code is required.')
        return
      }

      // Prepare product data - only include supported fields
      const productData: any = {
        product_name: formData.product_name?.trim(),
        product_category: formData.product_category?.trim(),
        store_code: formData.store_code?.trim().toUpperCase(),
        strain_type: formData.strain_type?.trim() || null,
        strain_cross: formData.strain_cross?.trim() || null,
        description: formData.description?.trim() || null,
        terpene: formData.terpene?.trim() || null,
        strength: formData.strength?.trim() || null,
        thca_percent: formData.thca_percent ? parseFloat(formData.thca_percent.toString()) : null,
        delta9_percent: formData.delta9_percent ? parseFloat(formData.delta9_percent.toString()) : null,
      }

      console.log('Submitting product data:', productData)

      if (editingProduct?.id) {
        // Update existing product
        console.log('Updating product with ID:', editingProduct.id)
        
        // Try with gummy/cookie fields first
        let { data, error } = await supabase
          .from('products')
          .update({
            ...productData,
            is_gummy: formData.is_gummy || false,
            is_cookie: formData.is_cookie || false
          })
          .eq('id', editingProduct.id)
          .select()

        // If that fails due to missing columns, try without them
        if (error && error.message.includes('is_cookie')) {
          console.log('Retrying without gummy/cookie fields...')
          const result = await supabase
            .from('products')
            .update(productData)
            .eq('id', editingProduct.id)
            .select()
          
          data = result.data
          error = result.error
        }

        console.log('Update response:', { data, error })
        if (error) {
          console.error('Update error details:', error)
          throw error
        }
      } else {
        // Create new product
        console.log('Creating new product')
        
        // Try with gummy/cookie fields first
        let { data, error } = await supabase
          .from('products')
          .insert([{
            ...productData,
            is_gummy: formData.is_gummy || false,
            is_cookie: formData.is_cookie || false
          }])
          .select()

        // If that fails due to missing columns, try without them
        if (error && error.message.includes('is_cookie')) {
          console.log('Retrying without gummy/cookie fields...')
          const result = await supabase
            .from('products')
            .insert([productData])
            .select()
          
          data = result.data
          error = result.error
        }

        console.log('Insert response:', { data, error })
        if (error) {
          console.error('Insert error details:', error)
          throw error
        }
      }

      // Reset form and refresh data
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
        store_code: '',
        is_gummy: false,
        is_cookie: false
      })
      setEditingProduct(null)
      setShowForm(false)
      
      // Refresh products list
      await fetchProducts()
      
      alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!')

    } catch (error) {
      console.error('Error saving product:', error)
      
      if (error instanceof Error && error.message.includes('is_cookie')) {
        alert('Database schema needs to be updated. Please run the database setup at /admin/setup to add the missing columns.')
      } else {
        alert(`Error saving product: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
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
      store_code: product.store_code || '',
      is_gummy: product.is_gummy || false,
      is_cookie: product.is_cookie || false
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
    setSelectAll(newSelected.size === filteredProducts.length)
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts(new Set())
      setSelectAll(false)
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)))
      setSelectAll(true)
    }
  }

  // Group products by category for display
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const category = product.product_category || 'Uncategorized'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(product)
    return acc
  }, {} as Record<string, Product[]>)

  // Get category counts
  const getCategoryCounts = () => {
    const counts = products.reduce((acc, product) => {
      const category = product.product_category || 'Uncategorized'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return counts
  }

  const categoryCounts = getCategoryCounts()

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
          <div className="text-sm text-gray-400">
            {filteredProducts.length} of {products.length} products
          </div>
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
              store_code: '',
              is_gummy: false,
              is_cookie: false
            })
          }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white font-medium rounded-md hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg"
        >
          <span className="mr-2">➕</span>
          Add Product
        </button>
      </div>

      {/* Category Filter Tabs and Search */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products by name, strain type, lineage, or store..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All ({products.length})
          </button>
          {VALID_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {category} ({categoryCounts[category] || 0})
            </button>
          ))}
          {categoryCounts['Uncategorized'] && (
            <button
              onClick={() => setSelectedCategory('Uncategorized')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                selectedCategory === 'Uncategorized'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Uncategorized ({categoryCounts['Uncategorized']})
            </button>
          )}
        </div>
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

            {/* Edible Type Checkboxes - Only show for Edible category */}
            {formData.product_category === 'Edible' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_gummy"
                    checked={formData.is_gummy || false}
                    onChange={(e) => setFormData({ ...formData, is_gummy: e.target.checked })}
                    className="rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500 focus:ring-offset-gray-800"
                  />
                  <label htmlFor="is_gummy" className="text-sm font-medium text-gray-300">
                    🍬 Is Gummy
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_cookie"
                    checked={formData.is_cookie || false}
                    onChange={(e) => setFormData({ ...formData, is_cookie: e.target.checked })}
                    className="rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500 focus:ring-offset-gray-800"
                  />
                  <label htmlFor="is_cookie" className="text-sm font-medium text-gray-300">
                    🍪 Is Cookie
                  </label>
                </div>
              </div>
            )}

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
      <div className="overflow-x-auto hide-scrollbar">
        {selectedCategory === 'All' && filteredProducts.length > 0 ? (
          // Grouped view when showing all categories
          <div className="space-y-6">
            {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
              <div key={category}>
                <div className="flex items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-200 flex items-center">
                    <span className="mr-2">
                      {category === 'Flower' && '🌸'}
                      {category === 'Vape' && '💨'}
                      {category === 'Edible' && '🍬'}
                      {category === 'Concentrate' && '💎'}
                      {category === 'Moonwater' && '🌙'}
                      {category === 'Uncategorized' && '❓'}
                    </span>
                    {category} ({categoryProducts.length})
                  </h3>
                </div>
                
                <table className="w-full mb-6 bg-gray-800/50 rounded-lg overflow-hidden">
                  <thead className="bg-gray-700/50">
                    <tr className="border-b border-gray-600">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300 w-12">
                        <input
                          type="checkbox"
                          checked={categoryProducts.every(p => selectedProducts.has(p.id))}
                          onChange={() => {
                            const allSelected = categoryProducts.every(p => selectedProducts.has(p.id))
                            const newSelected = new Set(selectedProducts)
                            if (allSelected) {
                              categoryProducts.forEach(p => newSelected.delete(p.id))
                            } else {
                              categoryProducts.forEach(p => newSelected.add(p.id))
                            }
                            setSelectedProducts(newSelected)
                          }}
                          className="rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500 focus:ring-offset-gray-800"
                        />
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Product Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Strain Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Strength</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">THCA %</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Store</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-600">
                    {categoryProducts.map((product) => (
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
                        <td className="py-3 px-4 text-gray-300">
                          {product.product_category === 'Edible' ? (
                            <div className="flex space-x-2">
                              {product.is_gummy && <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">🍬 Gummy</span>}
                              {product.is_cookie && <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">🍪 Cookie</span>}
                              {!product.is_gummy && !product.is_cookie && <span className="text-gray-500">-</span>}
                            </div>
                          ) : '-'}
                        </td>
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
              </div>
            ))}
          </div>
        ) : (
          // Standard view when filtering by specific category
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
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Strain Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Strength</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">THCA %</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Store</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredProducts.map((product) => (
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
                  <td className="py-3 px-4 text-gray-300">
                    {product.product_category === 'Edible' ? (
                      <div className="flex space-x-2">
                        {product.is_gummy && <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">🍬 Gummy</span>}
                        {product.is_cookie && <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">🍪 Cookie</span>}
                        {!product.is_gummy && !product.is_cookie && <span className="text-gray-500">-</span>}
                      </div>
                    ) : '-'}
                  </td>
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
        )}

        {filteredProducts.length === 0 && products.length > 0 && (
          <div className="text-center py-12 text-gray-500">
            No products found matching your filters. Try adjusting your search or category selection.
          </div>
        )}

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No products found. Click "Add Product" to create your first product.
          </div>
        )}
      </div>
    </div>
  )
} 