'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { clearStoreCache } from '@/lib/stores'
import Link from 'next/link'

interface Store {
  id: string
  code: string
  name: string
  address?: string
}

export default function StoreManager() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ code: '', name: '', address: '' })
  const [tableExists, setTableExists] = useState(true)
  const [editingStore, setEditingStore] = useState<Store | null>(null)

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('store')
        .select('*')
        .order('name')

      if (error) {
        if (error.code === '42P01') {
          // Table doesn't exist
          setTableExists(false)
        }
      } else {
        setStores(data || [])
        setTableExists(true)
      }
    } catch (error) {
      // Error handled above
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingStore) {
        // Update existing store
        const { data, error } = await supabase
          .from('store')
          .update({
            name: formData.name,
            address: formData.address || null
          })
          .eq('id', editingStore.id)
          .select()

        if (error) throw error
        
        setStores(stores.map(store => 
          store.id === editingStore.id ? data[0] : store
        ))
        setEditingStore(null)
      } else {
        // Create new store
        const { data, error } = await supabase
          .from('store')
          .insert([{
            code: formData.code.toUpperCase(),
            name: formData.name,
            address: formData.address || null
          }])
          .select()

        if (error) throw error
        
        setStores([...stores, data[0]])
      }
      
      setFormData({ code: '', name: '', address: '' })
      setShowForm(false)
      clearStoreCache()
      
      // Force refresh the cache via API call
      try {
        await fetch('/api/stores', { method: 'POST' })
      } catch (refreshError) {
        // Silently fail cache refresh
      }
    } catch (error) {
      alert(editingStore ? 'Error updating store.' : 'Error adding store. Code may already exist.')
    }
  }

  const handleEdit = (store: Store) => {
    setEditingStore(store)
    setFormData({
      code: store.code,
      name: store.name,
      address: store.address || ''
    })
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingStore(null)
    setFormData({ code: '', name: '', address: '' })
  }

  const handleDelete = async (code: string) => {
    if (!confirm(`Are you sure you want to delete store ${code}? This will affect all associated data.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('store')
        .delete()
        .eq('code', code)

      if (error) throw error
      
      setStores(stores.filter(store => store.code !== code))
      clearStoreCache()
      
      // Force refresh the cache via API call
      try {
        await fetch('/api/stores', { method: 'POST' })
      } catch (refreshError) {
        // Silently fail cache refresh
      }
    } catch (error) {
      alert('Error deleting store. There may be associated data.')
    }
  }

  if (loading) return <div className="text-gray-400">Loading stores...</div>

  if (!tableExists) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-yellow-400 font-semibold text-xl mb-4">Store Table Not Found</h3>
          <p className="text-gray-300 mb-6">
            The store table doesn't exist in your database. You need to create it first.
          </p>
          <Link
            href="/setup/store-setup"
            className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            Go to Store Setup
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-light text-gray-100">Store Management</h2>
        <button
          onClick={() => {
            setEditingStore(null)
            setFormData({ code: '', name: '', address: '' })
            setShowForm(!showForm)
          }}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-md hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg"
        >
          <span className="mr-2">➕</span>
          Add Store
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-gray-700/50 rounded-lg p-6 border border-gray-600">
          <h3 className="text-xl font-medium text-gray-100 mb-4">
            {editingStore ? 'Edit Store' : 'New Store'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Store Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  maxLength={10}
                  required
                  disabled={editingStore !== null}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Optional"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-md hover:from-green-700 hover:to-green-600 transition-all duration-200"
              >
                {editingStore ? 'Update Store' : 'Add Store'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Code</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Address</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {stores.map((store) => (
              <tr key={store.id} className="hover:bg-gray-700/30 transition-colors duration-150">
                <td className="py-3 px-4 text-gray-200 font-mono text-sm bg-gray-800/30 rounded">{store.code}</td>
                <td className="py-3 px-4 text-gray-200 font-medium">{store.name}</td>
                <td className="py-3 px-4 text-gray-300 text-sm">{store.address || '-'}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-3">
                    <button
                      onClick={() => handleEdit(store)}
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-150 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(store.code)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-150 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {stores.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No stores found. Click "Add Store" to create your first store.
          </div>
        )}
      </div>
    </div>
  )
}