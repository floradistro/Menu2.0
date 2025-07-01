import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getStores, clearStoreCache } from '@/lib/stores'

export async function GET() {
  try {
    const stores = await getStores(true) // Force refresh
    return NextResponse.json({ stores })
  } catch (error) {
    console.error('Error fetching stores:', error)
    return NextResponse.json({ error: 'Failed to fetch stores' }, { status: 500 })
  }
}

export async function POST() {
  try {
    clearStoreCache()
    const stores = await getStores(true) // Force refresh after clearing cache
    return NextResponse.json({ stores, message: 'Cache cleared and refreshed' })
  } catch (error) {
    console.error('Error refreshing stores:', error)
    return NextResponse.json({ error: 'Failed to refresh stores' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    
    if (!code) {
      return NextResponse.json({ error: 'Store code required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('store')
      .delete()
      .eq('code', code.toUpperCase())

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete store' }, { status: 500 })
  }
} 