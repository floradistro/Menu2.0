"use client"

import React, { useState } from 'react'
import { useLayoutConfig, LayoutSection, LayoutColumn } from '../../../lib/hooks/useLayoutConfig'

interface LayoutConfigPanelProps {
  page: 'flower' | 'vapes' | 'edibles'
}

const colorOptions = [
  { id: 'purple', label: 'Purple', class: 'text-purple-400' },
  { id: 'emerald', label: 'Emerald', class: 'text-emerald-400' },
  { id: 'orange', label: 'Orange', class: 'text-orange-400' },
  { id: 'amber', label: 'Amber', class: 'text-amber-400' },
  { id: 'pink', label: 'Pink', class: 'text-pink-400' },
  { id: 'cyan', label: 'Cyan', class: 'text-cyan-400' },
  { id: 'blue', label: 'Blue', class: 'text-blue-400' },
  { id: 'red', label: 'Red', class: 'text-red-400' },
]

export default function LayoutConfigPanel({ page }: LayoutConfigPanelProps) {
  const {
    layout,
    loading,
    error,
    autoSaving,
    saveLayout,
    addSection,
    removeSection,
    updateSection,
    addColumnToSection,
    removeColumnFromSection,
    updateColumnInSection,
    getEnabledSections
  } = useLayoutConfig(page)

  const [newSectionName, setNewSectionName] = useState('')
  const [newSectionColor, setNewSectionColor] = useState('purple')
  const [newSectionType, setNewSectionType] = useState('hybrid')
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  // Available product types
  const productTypes = [
    { id: 'indica', label: 'Indica' },
    { id: 'hybrid', label: 'Hybrid' },
    { id: 'sativa', label: 'Sativa' },
    { id: 'custom', label: 'Custom Type' }
  ]

  const handleSave = async () => {
    if (!layout) return
    
    try {
      setSaving(true)
      await saveLayout(layout)
      setSaveStatus('Configuration saved successfully!')
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (err) {
      setSaveStatus('Error saving configuration')
      setTimeout(() => setSaveStatus(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleAddSection = async () => {
    if (!newSectionName.trim()) return
    
    try {
      const sectionId = newSectionType === 'custom' 
        ? `custom_${newSectionName.toLowerCase().replace(/[^a-z0-9]/g, '_')}` 
        : newSectionType
      
      // Create section with proper ID  
      const newSection = {
        id: sectionId,
        title: newSectionName.toUpperCase(),
        enabled: true,
        color: newSectionColor,
        columns: [
          { id: 'name', label: 'STRAIN', enabled: true, width: 'auto' },
          { id: 'thca', label: 'THCA', enabled: true, width: 'auto', align: 'right' as const }
        ]
      }
      
      await addSection(newSection)
      
      setNewSectionName('')
      setNewSectionType('hybrid')
    } catch (err) {
      console.error('Error adding section:', err)
    }
  }

  const handleAddColumn = async (sectionId: string, fieldId: string) => {
    try {
      await addColumnToSection(sectionId, fieldId)
    } catch (err) {
      console.error('Error adding column:', err)
    }
  }

  const handleRemoveSection = async (sectionId: string) => {
    try {
      await removeSection(sectionId)
    } catch (err) {
      console.error('Error removing section:', err)
    }
  }

  const handleUpdateSection = async (sectionId: string, updates: Partial<LayoutSection>) => {
    try {
      await updateSection(sectionId, updates)
    } catch (err) {
      console.error('Error updating section:', err)
    }
  }

  const handleRemoveColumn = async (sectionId: string, columnId: string) => {
    try {
      await removeColumnFromSection(sectionId, columnId)
    } catch (err) {
      console.error('Error removing column:', err)
    }
  }

  const handleUpdateColumn = async (sectionId: string, columnId: string, updates: Partial<LayoutColumn>) => {
    try {
      await updateColumnInSection(sectionId, columnId, updates)
    } catch (err) {
      console.error('Error updating column:', err)
    }
  }

  const renderColumnEditor = (section: LayoutSection, column: LayoutColumn) => {
    return (
      <div key={column.id} className="flex items-center gap-2 p-2 bg-gray-700 rounded border">
        <input
          type="checkbox"
          checked={column.enabled}
          onChange={(e) => handleUpdateColumn(section.id, column.id, { enabled: e.target.checked })}
          className="w-4 h-4"
        />
        <input
          type="text"
          value={column.label}
          onChange={(e) => handleUpdateColumn(section.id, column.id, { label: e.target.value })}
          className="flex-1 px-2 py-1 bg-gray-600 text-white rounded text-sm"
        />
        <select
          value={column.align || 'left'}
          onChange={(e) => handleUpdateColumn(section.id, column.id, { align: e.target.value as 'left' | 'center' | 'right' })}
          className="px-2 py-1 bg-gray-600 text-white rounded text-sm"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
        <button
          onClick={() => handleRemoveColumn(section.id, column.id)}
          className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
        >
          Remove
        </button>
      </div>
    )
  }

  const renderSectionEditor = (section: LayoutSection) => {
    const availableFields = layout?.availableFields.filter(
      field => !section.columns.some(col => col.id === field.id)
    ) || []

    return (
      <div key={section.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center gap-4 mb-4">
          <input
            type="checkbox"
            checked={section.enabled}
            onChange={(e) => handleUpdateSection(section.id, { enabled: e.target.checked })}
            className="w-4 h-4"
          />
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded"
          />
          <select
            value={section.color}
            onChange={(e) => handleUpdateSection(section.id, { color: e.target.value })}
            className="px-3 py-2 bg-gray-700 text-white rounded"
          >
            {colorOptions.map(color => (
              <option key={color.id} value={color.id}>{color.label}</option>
            ))}
          </select>
          <button
            onClick={() => handleRemoveSection(section.id)}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Delete Section
          </button>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Columns</h4>
          <div className="space-y-2">
            {section.columns.map(column => renderColumnEditor(section, column))}
          </div>
        </div>

        {availableFields.length > 0 && (
          <div className="flex gap-2">
            <select
              id={`add-field-${section.id}`}
              className="flex-1 px-3 py-2 bg-gray-700 text-white rounded"
              defaultValue=""
            >
              <option value="">Select field to add...</option>
              {availableFields.map(field => (
                <option key={field.id} value={field.id}>{field.label}</option>
              ))}
            </select>
            <button
              onClick={() => {
                const select = document.getElementById(`add-field-${section.id}`) as HTMLSelectElement
                if (select.value) {
                  handleAddColumn(section.id, select.value)
                  select.value = ''
                }
              }}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Add Column
            </button>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-900 text-white">
        <h2 className="text-2xl font-bold mb-4">Layout Configuration - {page.toUpperCase()}</h2>
        <div className="text-center py-8">Loading layout configuration...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-900 text-white">
        <h2 className="text-2xl font-bold mb-4">Layout Configuration - {page.toUpperCase()}</h2>
        <div className="text-center py-8 text-red-400">Error: {error}</div>
      </div>
    )
  }

  if (!layout) {
    return (
      <div className="p-6 bg-gray-900 text-white">
        <h2 className="text-2xl font-bold mb-4">Layout Configuration - {page.toUpperCase()}</h2>
        <div className="text-center py-8">No layout configuration found</div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-900 text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Layout Configuration - {page.toUpperCase()}</h2>
        <div className="flex gap-2 items-center">
          {autoSaving && (
            <span className="px-3 py-2 bg-blue-600 text-white rounded text-sm flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Auto-saving...
            </span>
          )}
          {saveStatus && (
            <span className={`px-3 py-2 rounded text-sm ${
              saveStatus.includes('Error') ? 'bg-red-600' : 'bg-green-600'
            }`}>
              {saveStatus}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded"
          >
            {saving ? 'Saving...' : 'Manual Save'}
          </button>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-400 bg-gray-800 p-3 rounded">
        <strong>Auto-save enabled:</strong> Changes to sections and columns are automatically saved to the database.
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Add New Section</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Section Name</label>
                <input
                  type="text"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="e.g., PREMIUM, TOP SHELF..."
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSection()}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Product Type</label>
                <select
                  value={newSectionType}
                  onChange={(e) => setNewSectionType(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                >
                  {productTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Color</label>
                <select
                  value={newSectionColor}
                  onChange={(e) => setNewSectionColor(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                >
                  {colorOptions.map(color => (
                    <option key={color.id} value={color.id}>{color.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-xs text-gray-400 bg-gray-900 p-2 rounded">
              💡 <strong>Tip:</strong> Choose the product type that this section should display. For example, "PREMIUM" section with "Hybrid" type will show all hybrid products.
            </div>
            <button
              onClick={handleAddSection}
              disabled={!newSectionName.trim()}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded"
            >
              Add Section
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current Sections ({layout.sections.length})</h3>
          {layout.sections.length === 0 ? (
            <div className="text-center py-8 text-gray-400 bg-gray-800 rounded-lg">
              No sections configured. Add a section above to get started.
            </div>
          ) : (
            layout.sections.map(section => renderSectionEditor(section))
          )}
        </div>

        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold mb-2">Available Fields</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {layout.availableFields.map(field => (
              <div key={field.id} className="px-3 py-2 bg-gray-700 rounded text-sm">
                <div className="font-medium">{field.label}</div>
                <div className="text-gray-400 text-xs">{field.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 