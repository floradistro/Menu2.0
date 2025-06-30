import { NextRequest, NextResponse } from 'next/server'
import { supabase, getSupabaseAdmin, isSupabaseConfigured } from '../../../../lib/supabase'

// Test endpoint to verify database connection and layout functionality
export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Database connection not configured' },
        { status: 503 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    // Test 1: Check if menu_settings table exists
    const { data: tableCheck, error: tableError } = await supabaseAdmin
      .from('menu_settings')
      .select('count(*)')
      .limit(1)

    if (tableError) {
      return NextResponse.json({
        success: false,
        error: 'Database table not accessible',
        details: tableError.message
      }, { status: 500 })
    }

    // Test 2: Try to insert a test layout
    const testLayout = {
      sections: [
        {
          id: 'test_section',
          title: 'TEST SECTION',
          enabled: true,
          color: 'purple',
          columns: [
            { id: 'name', label: 'NAME', enabled: true, width: 'auto' }
          ]
        }
      ],
      availableFields: [
        { id: 'name', label: 'Name', type: 'text' }
      ]
    }

    // Insert test layout
    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('menu_settings')
      .insert([{
        setting_key: 'test_layout_sections',
        setting_value: testLayout
      }])
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to insert test layout',
        details: insertError.message
      }, { status: 500 })
    }

    // Test 3: Try to retrieve the test layout
    const { data: retrieveData, error: retrieveError } = await supabaseAdmin
      .from('menu_settings')
      .select('*')
      .eq('setting_key', 'test_layout_sections')
      .single()

    if (retrieveError) {
      return NextResponse.json({
        success: false,
        error: 'Failed to retrieve test layout',
        details: retrieveError.message
      }, { status: 500 })
    }

    // Test 4: Clean up test data
    const { error: deleteError } = await supabaseAdmin
      .from('menu_settings')
      .delete()
      .eq('setting_key', 'test_layout_sections')

    if (deleteError) {
      console.warn('Failed to clean up test data:', deleteError.message)
    }

    // Test 5: Check existing page layouts
    const { data: existingLayouts, error: layoutError } = await supabaseAdmin
      .from('menu_settings')
      .select('*')
      .in('setting_key', ['page_layout_flower', 'page_layout_vapes', 'page_layout_edibles'])

    if (layoutError) {
      console.warn('Could not fetch existing layouts:', layoutError.message)
    }

    return NextResponse.json({
      success: true,
      message: 'All tests passed!',
      results: {
        database_connection: 'OK',
        table_access: 'OK',
        jsonb_insert: 'OK',
        jsonb_retrieve: 'OK',
        test_cleanup: deleteError ? 'WARNING' : 'OK',
        inserted_data: insertData,
        retrieved_data: retrieveData,
        existing_layouts: existingLayouts?.length || 0,
        layout_data_sample: existingLayouts?.[0] || null
      }
    })

  } catch (error) {
    console.error('Test API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed with exception',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST endpoint to test layout saving
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Database connection not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { page } = body

    if (!page || !['flower', 'vapes', 'edibles'].includes(page)) {
      return NextResponse.json(
        { error: 'Valid page parameter required (flower, vapes, edibles)' },
        { status: 400 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()
    const layoutKey = `page_layout_${page}`

    // Create a test section
    const testSection = {
      id: `test_section_${Date.now()}`,
      title: 'TEST SECTION',
      enabled: true,
      color: 'blue',
      columns: [
        { id: 'name', label: 'NAME', enabled: true, width: 'auto' },
        { id: 'price', label: 'PRICE', enabled: true, width: 'auto', align: 'right' }
      ]
    }

    // Get existing layout
    const { data: existingData, error: fetchError } = await supabaseAdmin
      .from('menu_settings')
      .select('*')
      .eq('setting_key', layoutKey)
      .single()

    let currentLayout = {
      sections: [],
      availableFields: [
        { id: 'name', label: 'Name', type: 'text' },
        { id: 'price', label: 'Price', type: 'text' }
      ]
    }

    if (existingData?.setting_value) {
      currentLayout = typeof existingData.setting_value === 'string' 
        ? JSON.parse(existingData.setting_value) 
        : existingData.setting_value
    }

    // Add test section
    const newLayout = {
      ...currentLayout,
      sections: [...currentLayout.sections, testSection]
    }

    // Save updated layout
    let result
    let error

    if (existingData) {
      const { data, error: updateError } = await supabaseAdmin
        .from('menu_settings')
        .update({ setting_value: newLayout })
        .eq('id', existingData.id)
        .select()
        .single()
      
      result = data
      error = updateError
    } else {
      const { data, error: insertError } = await supabaseAdmin
        .from('menu_settings')
        .insert([{ 
          setting_key: layoutKey, 
          setting_value: newLayout
        }])
        .select()
        .single()
      
      result = data
      error = insertError
    }

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Failed to save test layout',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Test section added to ${page} layout`,
      layout: typeof result.setting_value === 'string' 
        ? JSON.parse(result.setting_value) 
        : result.setting_value,
      sections_count: newLayout.sections.length
    })

  } catch (error) {
    console.error('Test POST API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed with exception',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 