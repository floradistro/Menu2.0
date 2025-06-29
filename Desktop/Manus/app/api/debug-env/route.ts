import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isSupabaseConfigured } from '../../../lib/supabase'

export async function GET() {
  try {
    // Create debug response object
    const debugResponse = {
      envVars: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        supabaseUrlStart: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) || 'not set',
        supabaseUrlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
        anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
        serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV || 'not on Vercel',
        isConfigured: isSupabaseConfigured(),
        allSupabaseKeys: Object.keys(process.env).filter(key => key.includes('SUPABASE'))
      },
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(debugResponse)
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to get debug info',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 