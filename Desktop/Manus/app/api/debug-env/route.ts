import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Debug all environment variables
    const allEnvVars = Object.keys(process.env)
      .filter(key => key.includes('SUPABASE') || key.includes('NEXT_PUBLIC'))
      .reduce((acc, key) => {
        acc[key] = process.env[key] ? `${process.env[key].substring(0, 10)}...` : 'undefined'
        return acc
      }, {} as Record<string, string>)

    // Try to create client with known values
    const url = 'https://reodhmvktvfjloyqzmj.supabase.co'
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing'
    
    const debug = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      allSupabaseVars: allEnvVars,
      directUrlTest: url,
      anonKeyFound: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
    }

    // Try direct connection
    if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const testClient = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      
      const { data, error } = await testClient
        .from('products')
        .select('count')
        .limit(1)

      return NextResponse.json({
        success: !error,
        debug,
        connectionTest: {
          error: error?.message || null,
          hasData: !!data
        }
      })
    }

    return NextResponse.json({
      success: false,
      debug,
      error: 'No anon key found'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        timestamp: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV
      }
    })
  }
} 