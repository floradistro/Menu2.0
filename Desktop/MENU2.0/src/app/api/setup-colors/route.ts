import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('Setting up color customization...')

    // First, try to insert a default color scheme
    const defaultColors = {
      preset_name: 'Apple Dark',
      main_background_color: '#000000',
      main_background_type: 'gradient',
      main_background_gradient: 'linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #1a1a1a 50%, #0a0a0a 75%, #000000 100%)',
      primary_text_color: '#f2f2f7',
      secondary_text_color: '#8e8e93',
      table_header_bg: '#1c1c1e',
      table_row_even_bg: '#0a0a0a',
      table_row_odd_bg: '#000000',
      table_row_hover_bg: '#2c2c2e',
      table_border_color: '#38383a',
      section_indica_bg: '#1c1c1e',
      section_indica_gradient_start: '#1c1c1e',
      section_indica_gradient_end: '#3a3a3c',
      section_indica_text: '#ffffff',
      section_sativa_bg: '#2c2c2e',
      section_sativa_gradient_start: '#2c2c2e',
      section_sativa_gradient_end: '#48484a',
      section_sativa_text: '#ffffff',
      section_hybrid_bg: '#1a1a1c',
      section_hybrid_gradient_start: '#1a1a1c',
      section_hybrid_gradient_end: '#3a3a3c',
      section_hybrid_text: '#ffffff',
      section_other_bg: '#1f1f1f',
      section_other_gradient_start: '#1f1f1f',
      section_other_gradient_end: '#3a3a3a',
      section_other_text: '#ffffff',
      thca_percent_color: '#4ade80',
      delta9_percent_color: '#60a5fa',
      product_count_bg: '#000000',
      product_count_text: '#ffffff',
      use_gradient_headers: true,
      header_blur_effect: true,
      row_hover_lift: true,
      is_active: true
    }

    // Check if table exists and has data
    const { data: existingColors, error: selectError } = await supabase
      .from('menu_colors')
      .select('*')
      .limit(1)

    if (selectError) {
      return NextResponse.json({ 
        error: 'Table does not exist or permissions issue', 
        details: selectError,
        message: 'Please run the SQL setup script in your Supabase dashboard'
      }, { status: 500 })
    }

    // If no colors exist, insert default
    if (!existingColors || existingColors.length === 0) {
      const { error: insertError } = await supabase
        .from('menu_colors')
        .insert([defaultColors])

      if (insertError) {
        return NextResponse.json({ 
          error: 'Failed to insert default colors', 
          details: insertError 
        }, { status: 500 })
      }
    }

    // Test that we can read the colors
    const { data: testColors, error: testError } = await supabase
      .from('menu_colors')
      .select('*')
      .eq('is_active', true)
      .single()

    if (testError && testError.code !== 'PGRST116') {
      return NextResponse.json({ 
        error: 'Failed to read colors after setup', 
        details: testError 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Color customization is working',
      activeColors: testColors,
      totalColors: existingColors?.length || 1
    })

  } catch (err) {
    console.error('Setup error:', err)
    return NextResponse.json({ 
      error: 'Setup failed', 
      details: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
} 