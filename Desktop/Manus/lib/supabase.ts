import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

// Check if we're in a build environment
const isBuildTime = process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SUPABASE_URL

// Client-side Supabase client (for public operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client (for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && 
         process.env.SUPABASE_SERVICE_ROLE_KEY
}

// Wrapper function for admin operations that checks configuration
export const getSupabaseAdmin = () => {
  if (!isSupabaseConfigured() && !isBuildTime) {
    throw new Error('Supabase environment variables are not configured')
  }
  return supabaseAdmin
}

// Database types
export interface Product {
  id: string
  name: string
  category: 'flower' | 'vapes' | 'edibles'
  type: string
  thca?: string
  cbd?: string
  dosage?: string
  terpenes?: string[]
  effects: string[]
  description: string
  price: string
  in_stock: boolean
  sort_order: number
  ai_managed?: boolean
  ai_confidence_score?: number
  ai_last_updated?: string
  ai_update_reason?: string
  created_at: string
  updated_at: string
}

export interface MenuSettings {
  id: string
  setting_key: string
  setting_value: any
  updated_at: string
}

export interface AIAction {
  id: string
  action_type: 'create' | 'update' | 'delete' | 'price_change' | 'stock_toggle'
  product_id?: string
  old_data?: any
  new_data?: any
  reasoning: string
  confidence_score?: number
  approved: boolean
  approved_by?: string
  approved_at?: string
  created_at: string
} 