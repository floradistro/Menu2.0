import { createClient } from '@supabase/supabase-js'

// Using environment variables for security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cullazwyqnczfbavfkzk.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bGxhend5cW5jemZiYXZma3prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMzE5NTgsImV4cCI6MjA2NjkwNzk1OH0.9bIfBhQgcSBsNf3fUdtveqlmQ4ChMR7UTkn-KXTPsQM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 