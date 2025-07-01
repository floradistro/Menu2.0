import { createClient } from '@supabase/supabase-js'

// Using the provided Supabase credentials
const supabaseUrl = 'https://cullazwyqnczfbavfkzk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bGxhend5cW5jemZiYXZma3prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMzE5NTgsImV4cCI6MjA2NjkwNzk1OH0.9bIfBhQgcSBsNf3fUdtveqlmQ4ChMR7UTkn-KXTPsQM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definition for the new simplified products table
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
} 