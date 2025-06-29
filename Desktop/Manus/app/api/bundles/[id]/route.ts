import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, isSupabaseConfigured } from '../../../../lib/supabase'

// DELETE /api/bundles/[id] - Delete a bundle
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Bundle ID is required' },
        { status: 400 }
      )
    }

    const { error } = await getSupabaseAdmin()
      .from('pricing_rules')
      .delete()
      .eq('id', id)
      .eq('type', 'bundle')

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting bundle:', error)
    return NextResponse.json(
      { error: 'Failed to delete bundle' },
      { status: 500 }
    )
  }
}

// PUT /api/bundles/[id] - Update a bundle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { ...updates } = body

    const { data, error } = await getSupabaseAdmin()
      .from('pricing_rules')
      .update(updates)
      .eq('id', id)
      .eq('type', 'bundle')
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ bundle: data })
  } catch (error) {
    console.error('Error updating bundle:', error)
    return NextResponse.json(
      { error: 'Failed to update bundle' },
      { status: 500 }
    )
  }
}

// GET /api/bundles/[id] - Get single bundle
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Database connection not configured' },
        { status: 503 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()
    
    // ... existing code ...
  } catch (error) {
    console.error('Error getting bundle:', error)
    return NextResponse.json(
      { error: 'Failed to get bundle' },
      { status: 500 }
    )
  }
} 