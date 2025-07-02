'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { parseCSV, generateCSVTemplate } from '@/lib/csvParser'
import { ProductRow, ValidationError } from '@/types'
import { VALID_CATEGORIES, CATEGORY_COLORS } from '@/lib/constants'
import { parseNumericValue } from '@/lib/utils'

export default function BulkUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<ProductRow[]>([])
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResults, setUploadResults] = useState<{
    success: number
    failed: number
    errors: string[]
  } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const validateRow = (row: ProductRow, index: number): string[] => {
    const errors: string[] = []
    
    // Required fields
    if (!row.store_code?.trim()) errors.push('Store code is required')
    if (!row.product_category?.trim()) errors.push('Product category is required')
    if (!row.product_name?.trim()) errors.push('Product name is required')
    
    // Valid categories
    if (row.product_category && !VALID_CATEGORIES.includes(row.product_category as any)) {
      errors.push(`Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`)
    }
    
    // Category-specific validation
    switch (row.product_category) {
      case 'Flower':
        if (!row.thca_percent) errors.push('THCA % is required for Flower products')
        if (!row.delta9_percent) errors.push('Delta-9 % is required for Flower products')
        break
      case 'Edible':
      case 'Moonwater':
        if (!row.strength) errors.push(`Strength is required for ${row.product_category} products`)
        break
      case 'Concentrate':
        if (!row.thca_percent) errors.push('THCA % is required for Concentrate products')
        break
      case 'Vape':
        if (!row.strength) errors.push('Strength is required for Vape products')
        break
    }
    
    // Validate numeric fields
    if (row.thca_percent && isNaN(parseFloat(row.thca_percent))) {
      errors.push('THCA % must be a valid number')
    }
    if (row.delta9_percent && isNaN(parseFloat(row.delta9_percent))) {
      errors.push('Delta-9 % must be a valid number')
    }
    
    return errors
  }

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return
    
    processFile(selectedFile)
  }, [])

  const processFile = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      alert('Please select a CSV file')
      return
    }
    
    setFile(selectedFile)
    setUploadResults(null)
    
    const text = await selectedFile.text()
    const rows = parseCSV<ProductRow>(text)
    setPreview(rows)
    
    // Validate all rows
    const errors: ValidationError[] = []
    rows.forEach((row, index) => {
      const rowErrors = validateRow(row, index)
      if (rowErrors.length > 0) {
        errors.push({ row: index + 2, errors: rowErrors }) // +2 for 1-based + header
      }
    })
    setValidationErrors(errors)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      processFile(droppedFile)
    }
  }

  const handleUpload = async () => {
    if (!preview.length || validationErrors.length > 0) return
    
    setUploading(true)
    setUploadProgress(0)
    
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    }
    
    try {
      // Process in batches
      const batchSize = 10
      for (let i = 0; i < preview.length; i += batchSize) {
        const batch = preview.slice(i, i + batchSize)
        
        const products = batch.map(row => ({
          product_name: row.product_name,
          product_category: row.product_category,
          strain_type: row.strain_type || null,
          strain_cross: row.strain_cross || null,
          description: row.description || null,
          terpene: row.terpene || null,
          strength: row.strength || null,
          thca_percent: parseNumericValue(row.thca_percent),
          delta9_percent: parseNumericValue(row.delta9_percent),
          store_code: row.store_code,
          is_gummy: row.is_gummy === 'true' || row.is_gummy === '1' || false,
          is_cookie: row.is_cookie === 'true' || row.is_cookie === '1' || false
        }))
        
        const { error } = await supabase
          .from('products')
          .insert(products)
        
        if (error) {
          results.failed += batch.length
          results.errors.push(`Batch ${i/batchSize + 1}: ${error.message}`)
        } else {
          results.success += batch.length
        }
        
        setUploadProgress(Math.round(((i + batch.length) / preview.length) * 100))
      }
      
      setUploadResults(results)
    } catch (error) {
      results.errors.push(`Upload failed: ${error}`)
      setUploadResults(results)
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    const template = generateCSVTemplate()
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'product_upload_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const getCategoryColor = (category: string) => {
    return CATEGORY_COLORS[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-light text-gray-100">Bulk Product Upload</h2>
        <button
          onClick={downloadTemplate}
          className="inline-flex items-center px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors duration-200"
        >
          <span className="mr-2">📥</span>
          Download Template
        </button>
      </div>

      {/* File Upload */}
      <div 
        className={`bg-gray-800/50 rounded-lg p-8 border-2 border-dashed transition-all duration-200 ${
          isDragging 
            ? 'border-green-500 bg-green-900/20' 
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="text-gray-300 hover:text-gray-100">
              {isDragging ? (
                <span className="text-green-400">Drop your CSV file here</span>
              ) : (
                <>Drop CSV file here or <span className="text-green-400">browse</span></>
              )}
            </span>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="sr-only"
            />
          </label>
          {file && (
            <p className="mt-2 text-sm text-gray-400">
              Selected: {file.name} ({preview.length} products)
            </p>
          )}
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <h3 className="text-red-400 font-medium mb-2">⚠️ Validation Errors</h3>
          <div className="space-y-1 text-sm">
            {validationErrors.slice(0, 5).map((error, idx) => (
              <div key={idx} className="text-red-300">
                Row {error.row}: {error.errors.join(', ')}
              </div>
            ))}
            {validationErrors.length > 5 && (
              <div className="text-red-400 mt-2">
                ...and {validationErrors.length - 5} more errors
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview Table */}
      {preview.length > 0 && validationErrors.length === 0 && (
        <div className="bg-gray-700/30 rounded-lg p-4">
          <h3 className="text-gray-100 font-medium mb-4">Preview (First 5 products)</h3>
          <div className="overflow-x-auto hide-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-2 px-3 text-gray-400">Store</th>
                  <th className="text-left py-2 px-3 text-gray-400">Category</th>
                  <th className="text-left py-2 px-3 text-gray-400">Product Name</th>
                  <th className="text-left py-2 px-3 text-gray-400">Strain Type</th>
                  <th className="text-left py-2 px-3 text-gray-400">Strength</th>
                  <th className="text-left py-2 px-3 text-gray-400">THCA %</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 5).map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-700">
                    <td className="py-2 px-3 text-gray-300">{row.store_code}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-md border ${getCategoryColor(row.product_category)}`}>
                        {row.product_category}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-200">{row.product_name}</td>
                    <td className="py-2 px-3 text-gray-300">{row.strain_type || '-'}</td>
                    <td className="py-2 px-3 text-gray-300">{row.strength || '-'}</td>
                    <td className="py-2 px-3 text-gray-300">{row.thca_percent || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {preview.length > 5 && (
              <p className="text-gray-400 text-sm mt-2">
                ...and {preview.length - 5} more products
              </p>
            )}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-gray-700/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300">Uploading products...</span>
            <span className="text-gray-400">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Results */}
      {uploadResults && (
        <div className={`rounded-lg p-4 ${uploadResults.errors.length > 0 ? 'bg-red-900/20 border border-red-500/30' : 'bg-green-900/20 border border-green-500/30'}`}>
          <h3 className={`font-medium mb-2 ${uploadResults.errors.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
            Upload Complete
          </h3>
          <div className="space-y-1 text-sm">
            <div className="text-green-300">✓ Successfully uploaded: {uploadResults.success} products</div>
            {uploadResults.failed > 0 && (
              <div className="text-red-300">✗ Failed: {uploadResults.failed} products</div>
            )}
            {uploadResults.errors.map((error, idx) => (
              <div key={idx} className="text-red-300 mt-2">{error}</div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {preview.length > 0 && validationErrors.length === 0 && !uploading && !uploadResults && (
        <button
          onClick={handleUpload}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-md hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg"
        >
          🚀 Upload {preview.length} Products
        </button>
      )}
    </div>
  )
} 