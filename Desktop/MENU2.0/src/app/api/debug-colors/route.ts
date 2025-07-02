import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Get all color schemes
    const { data: allColors, error: allError } = await supabase
      .from('menu_colors')
      .select('*')
      .order('created_at', { ascending: false })

    if (allError) {
      return NextResponse.json({ 
        error: 'Failed to fetch colors', 
        details: allError 
      }, { status: 500 })
    }

    // Get active color scheme
    const { data: activeColors, error: activeError } = await supabase
      .from('menu_colors')
      .select('*')
      .eq('is_active', true)
      .single()

    // Check localStorage status (this will be empty on server)
    const localStorageInfo = {
      note: 'localStorage check only works in browser',
      instruction: 'Check browser console for localStorage data'
    }

    return NextResponse.json({
      success: true,
      totalSchemes: allColors?.length || 0,
      activeScheme: activeColors || null,
      allSchemes: allColors || [],
      localStorageInfo,
      timestamp: new Date().toISOString()
    })

  } catch (err) {
    console.error('Debug error:', err)
    return NextResponse.json({ 
      error: 'Debug failed', 
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Clear cache test endpoint
    return NextResponse.json({
      message: 'To clear cache, run this in browser console:',
      commands: [
        "localStorage.removeItem('activeMenuColors')",
        "window.dispatchEvent(new Event('themeUpdated'))",
        "window.dispatchEvent(new Event('forceThemeRefresh'))",
        "location.reload()"
      ]
    })
  } catch (err) {
    return NextResponse.json({ 
      error: 'Failed', 
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
} 