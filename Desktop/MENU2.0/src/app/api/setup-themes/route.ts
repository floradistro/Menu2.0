import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // Check if themes table exists and has data
    const { data: existingThemes, error: checkError } = await supabase
      .from('themes')
      .select('*')
      .limit(1)

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking themes table:', checkError)
      return NextResponse.json(
        { error: 'Failed to access themes table', details: checkError.message },
        { status: 500 }
      )
    }

    // If no themes exist, insert default theme
    if (!existingThemes || existingThemes.length === 0) {
      const { error: insertError } = await supabase
        .from('themes')
        .insert([{
          background_color: '#1f2937',
          header_indica_color: '#9333ea',
          header_sativa_color: '#f97316',
          header_hybrid_color: '#3b82f6',
          text_color: '#f3f4f6',
          table_header_bg: '#111827',
          table_row_hover: '#374151'
        }])

      if (insertError) {
        console.error('Error inserting default theme:', insertError)
        return NextResponse.json(
          { error: 'Failed to insert default theme', details: insertError.message },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Themes table setup completed successfully' 
    })

  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Setup failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 