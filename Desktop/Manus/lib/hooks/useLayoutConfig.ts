import { useState, useEffect, useCallback } from 'react'

export interface LayoutColumn {
  id: string
  label: string
  enabled: boolean
  width: string
  align?: 'left' | 'center' | 'right'
}

export interface LayoutSection {
  id: string
  title: string
  enabled: boolean
  color: string
  columns: LayoutColumn[]
}

export interface AvailableField {
  id: string
  label: string
  type: 'text' | 'array' | 'boolean' | 'number'
}

export interface PageLayout {
  sections: LayoutSection[]
  availableFields: AvailableField[]
}

export function useLayoutConfig(page: 'flower' | 'vapes' | 'edibles') {
  const [layout, setLayout] = useState<PageLayout | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoSaving, setAutoSaving] = useState(false)

  // Fetch layout configuration
  const fetchLayout = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/menu-settings?page=${page}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch layout')
      }
      
      setLayout(data.layout)
      setError(null)
    } catch (err) {
      console.error('Error fetching layout:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [page])

  // Auto-save layout configuration
  const autoSaveLayout = useCallback(async (newLayout: PageLayout) => {
    try {
      setAutoSaving(true)
      const response = await fetch('/api/menu-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page,
          layout: newLayout
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to auto-save layout')
      }
      
      console.log(`Auto-saved ${page} layout successfully`)
      return data.layout
    } catch (err) {
      console.error('Error auto-saving layout:', err)
      // Don't throw error for auto-save failures to avoid disrupting user flow
    } finally {
      setAutoSaving(false)
    }
  }, [page])

  // Save layout configuration (manual save)
  const saveLayout = async (newLayout: PageLayout) => {
    try {
      const response = await fetch('/api/menu-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page,
          layout: newLayout
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save layout')
      }
      
      setLayout(data.layout)
      return data.layout
    } catch (err) {
      console.error('Error saving layout:', err)
      throw err
    }
  }

  // Add a new section
  const addSection = useCallback(async (sectionData: Omit<LayoutSection, 'id'> | LayoutSection) => {
    if (!layout) return
    
    const newSection: LayoutSection = 'id' in sectionData ? sectionData : {
      ...sectionData,
      id: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    const newLayout = {
      ...layout,
      sections: [...layout.sections, newSection]
    }
    
    setLayout(newLayout)
    
    // Auto-save the layout
    await autoSaveLayout(newLayout)
    
    return newLayout
  }, [layout, autoSaveLayout])

  // Remove a section
  const removeSection = useCallback(async (sectionId: string) => {
    if (!layout) return
    
    const newLayout = {
      ...layout,
      sections: layout.sections.filter(s => s.id !== sectionId)
    }
    
    setLayout(newLayout)
    
    // Auto-save the layout
    await autoSaveLayout(newLayout)
    
    return newLayout
  }, [layout, autoSaveLayout])

  // Update a section
  const updateSection = useCallback(async (sectionId: string, updates: Partial<LayoutSection>) => {
    if (!layout) return
    
    const newLayout = {
      ...layout,
      sections: layout.sections.map(s => 
        s.id === sectionId ? { ...s, ...updates } : s
      )
    }
    
    setLayout(newLayout)
    
    // Auto-save the layout
    await autoSaveLayout(newLayout)
    
    return newLayout
  }, [layout, autoSaveLayout])

  // Add column to section
  const addColumnToSection = useCallback(async (sectionId: string, fieldId: string) => {
    if (!layout) return
    
    const field = layout.availableFields.find(f => f.id === fieldId)
    if (!field) return
    
    const newColumn: LayoutColumn = {
      id: fieldId,
      label: field.label.toUpperCase(),
      enabled: true,
      width: 'auto',
      align: field.type === 'text' ? 'left' : 'right'
    }
    
    const newLayout = {
      ...layout,
      sections: layout.sections.map(s => 
        s.id === sectionId 
          ? { ...s, columns: [...s.columns, newColumn] }
          : s
      )
    }
    
    setLayout(newLayout)
    
    // Auto-save the layout
    await autoSaveLayout(newLayout)
    
    return newLayout
  }, [layout, autoSaveLayout])

  // Remove column from section
  const removeColumnFromSection = useCallback(async (sectionId: string, columnId: string) => {
    if (!layout) return
    
    const newLayout = {
      ...layout,
      sections: layout.sections.map(s => 
        s.id === sectionId 
          ? { ...s, columns: s.columns.filter(c => c.id !== columnId) }
          : s
      )
    }
    
    setLayout(newLayout)
    
    // Auto-save the layout
    await autoSaveLayout(newLayout)
    
    return newLayout
  }, [layout, autoSaveLayout])

  // Update column in section
  const updateColumnInSection = useCallback(async (sectionId: string, columnId: string, updates: Partial<LayoutColumn>) => {
    if (!layout) return
    
    const newLayout = {
      ...layout,
      sections: layout.sections.map(s => 
        s.id === sectionId 
          ? { 
              ...s, 
              columns: s.columns.map(c => 
                c.id === columnId ? { ...c, ...updates } : c
              )
            }
          : s
      )
    }
    
    setLayout(newLayout)
    
    // Auto-save the layout
    await autoSaveLayout(newLayout)
    
    return newLayout
  }, [layout, autoSaveLayout])

  // Get columns count for a section
  const getColumnCount = useCallback((sectionId: string) => {
    if (!layout) return 0
    const section = layout.sections.find(s => s.id === sectionId)
    return section ? section.columns.filter(c => c.enabled).length : 0
  }, [layout])

  // Get enabled sections
  const getEnabledSections = useCallback(() => {
    if (!layout) return []
    return layout.sections.filter(s => s.enabled)
  }, [layout])

  // Initialize
  useEffect(() => {
    fetchLayout()
  }, [fetchLayout])

  return {
    layout,
    loading,
    error,
    autoSaving,
    fetchLayout,
    saveLayout,
    addSection,
    removeSection,
    updateSection,
    addColumnToSection,
    removeColumnFromSection,
    updateColumnInSection,
    getColumnCount,
    getEnabledSections
  }
} 