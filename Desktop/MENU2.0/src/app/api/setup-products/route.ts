import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // First, let's check if the products table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (tableError) {
      return NextResponse.json({
        success: false,
        message: 'Products table not accessible',
        error: tableError.message
      }, { status: 500 })
    }

    // Try to insert sample data
    const sampleProducts = [
      {
        product_name: 'Candyland',
        product_category: 'Flower',
        strain_type: 'Sativa',
        strain_cross: 'Granddaddy Purple x Bay Platinum Cookies',
        description: 'Premium indoor flower with sweet, spicy flavor',
        terpene: 'Limonene',
        strength: '3.5g',
        thca_percent: 26.4,
        delta9_percent: 0.3,
        store_code: 'TN'
      },
      {
        product_name: 'Blue Dream',
        product_category: 'Flower',
        strain_type: 'Sativa-dominant Hybrid',
        strain_cross: 'Blueberry x Haze',
        description: 'Classic favorite with berry sweetness',
        terpene: 'Myrcene',
        strength: '3.5g',
        thca_percent: 24.8,
        delta9_percent: 0.28,
        store_code: 'TN'
      },
      {
        product_name: 'OG Kush Cart',
        product_category: 'Vape',
        strain_type: 'Indica',
        description: 'Premium distillate cartridge',
        terpene: 'Limonene',
        strength: '1g',
        thca_percent: 85.2,
        delta9_percent: 0.1,
        store_code: 'TN'
      },
      {
        product_name: 'Gummy Bears',
        product_category: 'Edible',
        description: 'Delicious fruit-flavored gummies',
        strength: '10mg',
        delta9_percent: 10.0,
        store_code: 'TN'
      },
      {
        product_name: 'Moonwater Original',
        product_category: 'Moonwater',
        description: 'Cannabis-infused sparkling water',
        strength: '10mg',
        delta9_percent: 10.0,
        store_code: 'TN'
      }
    ]

    // Try to insert sample data
    const { data: insertData, error: insertError } = await supabase
      .from('products')
      .insert(sampleProducts)
      .select()

    if (insertError) {
      return NextResponse.json({
        success: false,
        message: 'Failed to insert sample data',
        error: insertError.message,
        hint: 'You may need to set up RLS policies in Supabase for the products table'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Products table setup completed successfully',
      insertedCount: insertData?.length || 0,
      data: insertData
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Setup failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 