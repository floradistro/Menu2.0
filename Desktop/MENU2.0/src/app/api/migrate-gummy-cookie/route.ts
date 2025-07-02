import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting gummy and cookie fields migration...')

    // First check if columns already exist
    const { data: existingData, error: checkError } = await supabase
      .from('products')
      .select('is_gummy, is_cookie')
      .limit(1)

    if (!checkError) {
      return NextResponse.json({
        success: true,
        message: 'Gummy and cookie fields already exist',
        alreadyExists: true
      })
    }

    // If columns don't exist, we need to add them using raw SQL
    // Note: Supabase client doesn't support ALTER TABLE, so we'll need to use RPC
    
    // Create a function to add the columns
    const migrationSQL = `
      DO $$
      BEGIN
        -- Add columns if they don't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_gummy') THEN
          ALTER TABLE products ADD COLUMN is_gummy BOOLEAN DEFAULT FALSE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'is_cookie') THEN
          ALTER TABLE products ADD COLUMN is_cookie BOOLEAN DEFAULT FALSE;
        END IF;
        
        -- Add comments
        COMMENT ON COLUMN products.is_gummy IS 'True if the product is a gummy edible';
        COMMENT ON COLUMN products.is_cookie IS 'True if the product is a cookie edible';
        
        -- Create indexes if they don't exist
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_products_is_gummy') THEN
          CREATE INDEX idx_products_is_gummy ON products(is_gummy) WHERE is_gummy = TRUE;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_products_is_cookie') THEN
          CREATE INDEX idx_products_is_cookie ON products(is_cookie) WHERE is_cookie = TRUE;
        END IF;
      END
      $$;
    `

    // Execute the migration using RPC
    const { data: migrationResult, error: migrationError } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    })

    if (migrationError) {
      console.error('Migration error:', migrationError)
      
      // If RPC doesn't work, try a different approach
      // Let's try using the supabase client to test if we can add a test product with these fields
      const testProduct = {
        product_name: 'Migration Test',
        product_category: 'Edible',
        store_code: 'TEST',
        is_gummy: true,
        is_cookie: false
      }

      const { error: testError } = await supabase
        .from('products')
        .insert([testProduct])
        .select()

      if (testError) {
        return NextResponse.json({
          success: false,
          message: 'Migration failed - columns need to be added manually in Supabase SQL Editor',
          error: testError.message,
          migrationSQL: `
-- Run this in Supabase SQL Editor:
ALTER TABLE products 
ADD COLUMN is_gummy BOOLEAN DEFAULT FALSE,
ADD COLUMN is_cookie BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN products.is_gummy IS 'True if the product is a gummy edible';
COMMENT ON COLUMN products.is_cookie IS 'True if the product is a cookie edible';

CREATE INDEX idx_products_is_gummy ON products(is_gummy) WHERE is_gummy = TRUE;
CREATE INDEX idx_products_is_cookie ON products(is_cookie) WHERE is_cookie = TRUE;
          `
        }, { status: 500 })
      } else {
        // Clean up test product
        await supabase
          .from('products')
          .delete()
          .eq('product_name', 'Migration Test')
          .eq('store_code', 'TEST')

        return NextResponse.json({
          success: true,
          message: 'Migration appears to have been applied already - columns are working',
          note: 'Test product was inserted and removed successfully'
        })
      }
    }

    // Verify the migration worked by testing a query
    const { data: verifyData, error: verifyError } = await supabase
      .from('products')
      .select('is_gummy, is_cookie')
      .limit(1)

    if (verifyError) {
      return NextResponse.json({
        success: false,
        message: 'Migration may have failed - cannot query new columns',
        error: verifyError.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Gummy and cookie fields migration completed successfully',
      migrationResult
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({
      success: false,
      message: 'Migration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 