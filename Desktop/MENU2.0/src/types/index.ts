// Product types
export interface Product {
  id: string
  product_name: string
  product_category?: string
  strain_type?: string
  strain_cross?: string
  description?: string
  terpene?: string
  strength?: string
  thca_percent?: number
  delta9_percent?: number
  store_code?: string
  created_at?: string
  is_gummy?: boolean
  is_cookie?: boolean
}

// Store types
export interface StoreConfig {
  code: string
  name: string
  address?: string
}

export interface Store {
  id: string
  code: string
  name: string
  address?: string
}

// Category types
export type CategoryName = 'Flower' | 'Vape' | 'Edible' | 'Concentrate' | 'Moonwater'

// Form types
export interface ProductFormData extends Partial<Product> {}

// Validation types
export interface ValidationError {
  row: number
  errors: string[]
}

// CSV types
export interface ProductRow {
  store_code: string
  product_category: string
  product_name: string
  strain_type?: string
  strain_cross?: string
  description?: string
  terpene?: string
  strength?: string
  thca_percent?: string
  delta9_percent?: string
  is_gummy?: string
  is_cookie?: string
} 