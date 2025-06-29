import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../../../lib/supabase'

// POST /api/ai/actions/[id]/approve - Approve or reject AI action
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { approved, approved_by } = body

    if (approved === undefined) {
      return NextResponse.json(
        { error: 'approved field is required' },
        { status: 400 }
      )
    }

    // First, get the AI action
    const { data: action, error: fetchError } = await supabaseAdmin
      .from('ai_actions')
      .select('*')
      .eq('id', params.id)
      .single()

    if (fetchError || !action) {
      return NextResponse.json(
        { error: 'AI action not found' },
        { status: 404 }
      )
    }

    // Update the approval status
    const { data, error } = await supabaseAdmin
      .from('ai_actions')
      .update({
        approved,
        approved_by,
        approved_at: approved ? new Date().toISOString() : null
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating AI action:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If approved, apply the changes to the product
    if (approved && action.product_id && action.new_data) {
      const { error: updateError } = await supabaseAdmin
        .from('products')
        .update({
          ...action.new_data,
          ai_managed: true,
          ai_last_updated: new Date().toISOString(),
          ai_update_reason: action.reasoning,
          ai_confidence_score: action.confidence_score
        })
        .eq('id', action.product_id)

      if (updateError) {
        console.error('Error applying AI changes to product:', updateError)
        return NextResponse.json(
          { error: 'Failed to apply changes to product' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ action: data })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 