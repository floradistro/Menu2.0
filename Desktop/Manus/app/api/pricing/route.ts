import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export interface PricingRule {
  id?: string
  name: string
  category: 'flower' | 'vapes' | 'edibles' | 'concentrates' | 'prerolls' | 'moonwater'
  type: 'base_price' | 'percentage_discount' | 'fixed_discount' | 'bundle' | 'special'
  value: number // Percentage for percentage_discount, dollar amount for others
  conditions?: {
    min_quantity?: number
    max_quantity?: number
    specific_products?: string[]
    time_restrictions?: {
      start_time?: string
      end_time?: string
      days_of_week?: number[]
    }
  }
  is_active: boolean
  priority: number // Higher priority rules apply first
  created_at?: string
  updated_at?: string
}

export interface BasePricing {
  id?: string
  category: string
  weight_or_quantity: string
  base_price: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export async function GET() {
  try {
    const [pricingRulesResponse, basePricingResponse] = await Promise.all([
      supabase.from('pricing_rules').select('*').order('priority', { ascending: false }),
      supabase.from('base_pricing').select('*').order('category', { ascending: true })
    ])

    if (pricingRulesResponse.error) throw pricingRulesResponse.error
    if (basePricingResponse.error) throw basePricingResponse.error

    return NextResponse.json({
      pricing_rules: pricingRulesResponse.data || [],
      base_pricing: basePricingResponse.data || []
    })
  } catch (error) {
    console.error('Error fetching pricing data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pricing data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (type === 'pricing_rule') {
      const { error } = await supabase
        .from('pricing_rules')
        .insert([data])

      if (error) throw error
    } else if (type === 'base_pricing') {
      const { error } = await supabase
        .from('base_pricing')
        .insert([data])

      if (error) throw error
    } else {
      return NextResponse.json(
        { error: 'Invalid type specified' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating pricing data:', error)
    return NextResponse.json(
      { error: 'Failed to create pricing data' },
      { status: 500 }
    )
  }
} 