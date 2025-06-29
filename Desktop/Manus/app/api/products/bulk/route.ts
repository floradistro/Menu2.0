import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'

// POST /api/products/bulk - Bulk operations on products
export async function POST(request: NextRequest) {
  try {
    const { action, productIds, updates } = await request.json()

    switch (action) {
      case 'update': {
        // Bulk update products
        const promises = productIds.map((id: string) => 
          supabaseAdmin
            .from('products')
            .update(updates)
            .eq('id', id)
        )
        
        const results = await Promise.all(promises)
        const errors = results.filter(r => r.error)
        
        if (errors.length > 0) {
          return NextResponse.json({ 
            error: 'Some updates failed', 
            details: errors 
          }, { status: 500 })
        }
        
        return NextResponse.json({ 
          success: true, 
          updated: productIds.length 
        })
      }

      case 'delete': {
        // Bulk delete products
        const { error } = await supabaseAdmin
          .from('products')
          .delete()
          .in('id', productIds)

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ 
          success: true, 
          deleted: productIds.length 
        })
      }

      case 'reorder': {
        // Bulk reorder products
        const promises = productIds.map((id: string, index: number) => 
          supabaseAdmin
            .from('products')
            .update({ sort_order: index })
            .eq('id', id)
        )
        
        await Promise.all(promises)
        
        return NextResponse.json({ 
          success: true, 
          reordered: productIds.length 
        })
      }

      case 'clone': {
        // Clone products
        const { data: products, error } = await supabaseAdmin
          .from('products')
          .select('*')
          .in('id', productIds)

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const clonedProducts = products.map(p => ({
          ...p,
          id: undefined,
          name: `${p.name} (Copy)`,
          created_at: undefined,
          updated_at: undefined
        }))

        const { data: newProducts, error: insertError } = await supabaseAdmin
          .from('products')
          .insert(clonedProducts)
          .select()

        if (insertError) {
          return NextResponse.json({ error: insertError.message }, { status: 500 })
        }

        return NextResponse.json({ 
          success: true, 
          cloned: newProducts 
        })
      }

      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Bulk operation error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 