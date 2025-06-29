import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, isSupabaseConfigured } from '../../../../lib/supabase'

// GET /api/ai/actions - Get all AI actions (with optional filters)
export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Database connection not configured' },
        { status: 503 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()

    const { searchParams } = new URL(request.url)
    const approved = searchParams.get('approved')
    const limit = searchParams.get('limit') || '50'

    let query = supabaseAdmin
      .from('ai_actions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))

    if (approved !== null) {
      query = query.eq('approved', approved === 'true')
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching AI actions:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ actions: data, count: data.length })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/ai/actions - Create new AI action
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Database connection not configured' },
        { status: 503 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()
    const body = await request.json()
    
    const { data, error } = await supabaseAdmin
      .from('ai_actions')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Error creating AI action:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ action: data }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 