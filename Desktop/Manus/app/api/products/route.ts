import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin, Product } from '../../../lib/supabase'

// GET /api/products - Fetch all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const inStock = searchParams.get('in_stock')

    let query = supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    if (inStock !== null) {
      query = query.eq('in_stock', inStock === 'true')
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Group products by category and type for easier frontend consumption
    const groupedProducts = data.reduce((acc: any, product: Product) => {
      if (!acc[product.category]) {
        acc[product.category] = {}
      }
      if (!acc[product.category][product.type]) {
        acc[product.category][product.type] = []
      }
      acc[product.category][product.type].push(product)
      return acc
    }, {})

    return NextResponse.json({
      products: data,
      grouped: groupedProducts,
      count: data.length
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ product: data }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 