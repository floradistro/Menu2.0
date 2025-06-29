import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin, isSupabaseConfigured } from '../../../lib/supabase'

export interface Bundle {
  id?: string
  name: string
  description: string
  products: string[] // Product IDs
  bundle_price: number
  original_price: number
  discount_percentage: number
  category: string
  is_active: boolean
  valid_from?: string
  valid_until?: string
  max_uses?: number
  uses_count?: number
  created_at?: string
  updated_at?: string
}

// GET /api/bundles - Get all bundles
export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Database connection not configured' },
        { status: 503 }
      )
    }

    const supabaseAdmin = getSupabaseAdmin()
    
    const { data: bundles, error } = await supabaseAdmin
      .from('pricing_rules')
      .select('*')
      .eq('type', 'bundle')
      .order('priority', { ascending: false })

    if (error) throw error

    // Fetch product details for each bundle
    const bundlesWithProducts = await Promise.all(
      bundles.map(async (bundle) => {
        if (bundle.conditions?.specific_products) {
          const { data: products } = await supabaseAdmin
            .from('products')
            .select('id, name, price, category')
            .in('id', bundle.conditions.specific_products)

          return {
            ...bundle,
            products: products || []
          }
        }
        return bundle
      })
    )

    return NextResponse.json({ bundles: bundlesWithProducts })
  } catch (error) {
    console.error('Error fetching bundles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bundles' },
      { status: 500 }
    )
  }
}

// POST /api/bundles - Create a new bundle
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
    const { 
      name, 
      description, 
      bundle_price, 
      category, 
      valid_from, 
      valid_until, 
      max_uses,
      bundle_type,
      products,
      product_details,
      category_requirements,
      original_price,
      discount_percentage
    } = body

    let calculatedOriginalPrice = original_price
    let calculatedDiscountPercentage = discount_percentage

    // For specific product bundles, calculate original price from actual products
    if (bundle_type === 'specific' && products && products.length > 0) {
      const { data: productData, error: productError } = await supabaseAdmin
        .from('products')
        .select('price')
        .in('id', products)

      if (productError) throw productError

      calculatedOriginalPrice = productData.reduce((sum, p) => {
        const price = parseFloat(p.price.replace(/[^0-9.]/g, ''))
        return sum + price
      }, 0)

      calculatedDiscountPercentage = Math.round(((calculatedOriginalPrice - bundle_price) / calculatedOriginalPrice) * 100)
    }

    // Use a valid category for bundles - default to 'flower' if 'all' is selected
    const validCategory = category === 'all' ? 'flower' : category

    const bundleRule = {
      name,
      category: validCategory,
      type: 'bundle',
      value: bundle_price,
      conditions: {
        bundle_type: bundle_type || 'specific',
        description,
        original_price: calculatedOriginalPrice,
        discount_percentage: calculatedDiscountPercentage,
        valid_from,
        valid_until,
        max_uses,
        bundle_category: category, // Store the original category choice
        ...(bundle_type === 'specific' && {
          specific_products: products,
          product_details: product_details || {}, // Store weight/quantity info
          min_quantity: products?.length || 1
        }),
        ...(bundle_type === 'category' && {
          category_requirements: category_requirements || {},
          min_quantity: Object.values(category_requirements || {}).reduce((sum: number, req: any) => sum + req.quantity, 0)
        })
      },
      is_active: true,
      priority: 8 // Default priority for bundles
    }

    const { data, error } = await supabaseAdmin
      .from('pricing_rules')
      .insert(bundleRule)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ bundle: data })
  } catch (error) {
    console.error('Error creating bundle:', error)
    return NextResponse.json(
      { error: 'Failed to create bundle' },
      { status: 500 }
    )
  }
}

