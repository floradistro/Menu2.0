import { NextResponse } from 'next/server'
import { getTheme } from '@/lib/themes'

export async function GET() {
  try {
    const theme = await getTheme()
    return NextResponse.json({ 
      success: true,
      theme,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 