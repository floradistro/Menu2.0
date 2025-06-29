import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { type, data } = body
    const { id } = params

    if (type === 'pricing_rule') {
      const { error } = await supabase
        .from('pricing_rules')
        .update(data)
        .eq('id', id)

      if (error) throw error
    } else if (type === 'base_pricing') {
      const { error } = await supabase
        .from('base_pricing')
        .update(data)
        .eq('id', id)

      if (error) throw error
    } else {
      return NextResponse.json(
        { error: 'Invalid type specified' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating pricing data:', error)
    return NextResponse.json(
      { error: 'Failed to update pricing data' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const { id } = params

    if (type === 'pricing_rule') {
      const { error } = await supabase
        .from('pricing_rules')
        .delete()
        .eq('id', id)

      if (error) throw error
    } else if (type === 'base_pricing') {
      const { error } = await supabase
        .from('base_pricing')
        .delete()
        .eq('id', id)

      if (error) throw error
    } else {
      return NextResponse.json(
        { error: 'Invalid type specified' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting pricing data:', error)
    return NextResponse.json(
      { error: 'Failed to delete pricing data' },
      { status: 500 }
    )
  }
} 