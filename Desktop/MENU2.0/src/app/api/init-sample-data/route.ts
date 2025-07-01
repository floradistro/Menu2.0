import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // Initialize categories
    const categories = [
      { id: 1, name: 'Flower' },
      { id: 2, name: 'Vape' },
      { id: 3, name: 'Edible' },
      { id: 4, name: 'Concentrate' },
      { id: 5, name: 'Moonwater' }
    ]
    
    await supabase.from('category').upsert(categories)

    // Initialize stores
    const stores = [
      { id: 1, code: 'CLT', name: 'Charlotte', address: '123 Main St, Charlotte, NC' },
      { id: 2, code: 'SAL', name: 'Salem', address: '456 Oak Ave, Salem, VA' },
      { id: 3, code: 'TN', name: 'Tennessee', address: '789 Broadway, Nashville, TN' },
      { id: 4, code: 'BR', name: 'Baton Rouge', address: '321 River Rd, Baton Rouge, LA' }
    ]
    
    await supabase.from('store').upsert(stores)

    // Initialize strains
    const strains = [
      { id: 1, name: 'Blue Dream', strain_type: 'Hybrid' },
      { id: 2, name: 'OG Kush', strain_type: 'Indica' },
      { id: 3, name: 'Sour Diesel', strain_type: 'Sativa' },
      { id: 4, name: 'Purple Haze', strain_type: 'Sativa' },
      { id: 5, name: 'Granddaddy Purple', strain_type: 'Indica' },
      { id: 6, name: 'Girl Scout Cookies', strain_type: 'Hybrid' }
    ]
    
    await supabase.from('strain').upsert(strains)

    // Initialize flavors
    const flavors = [
      { id: 1, name: 'Strawberry' },
      { id: 2, name: 'Watermelon' },
      { id: 3, name: 'Blue Raspberry' },
      { id: 4, name: 'Mango' },
      { id: 5, name: 'Vanilla' },
      { id: 6, name: 'Chocolate' }
    ]
    
    await supabase.from('flavor').upsert(flavors)

    // Initialize products
    const products = [
      // Flower products
      { id: 1, product_name: 'Blue Dream Premium', category_id: 1, strain_id: 1, base_description: 'Premium indoor grown flower', active: true },
      { id: 2, product_name: 'OG Kush Select', category_id: 1, strain_id: 2, base_description: 'Top shelf indica flower', active: true },
      { id: 3, product_name: 'Sour Diesel Outdoor', category_id: 1, strain_id: 3, base_description: 'Sun-grown sativa', active: true },
      
      // Vape products
      { id: 4, product_name: 'Dream Cart', category_id: 2, strain_id: 1, base_description: '510 thread cartridge', active: true },
      { id: 5, product_name: 'Disposable Vape', category_id: 2, strain_id: null, base_description: 'All-in-one disposable', active: true },
      
      // Edibles
      { id: 6, product_name: 'Gummy Bears', category_id: 3, strain_id: null, base_description: 'Assorted fruit flavors', active: true },
      { id: 7, product_name: 'Chocolate Bar', category_id: 3, strain_id: null, base_description: 'Premium dark chocolate', active: true },
      
      // Concentrates
      { id: 8, product_name: 'Live Resin', category_id: 4, strain_id: 2, base_description: 'Premium live resin extract', active: true },
      { id: 9, product_name: 'Shatter', category_id: 4, strain_id: 4, base_description: 'Glass-like concentrate', active: true },
      
      // Moonwater
      { id: 10, product_name: 'Moonwater Original', category_id: 5, strain_id: null, base_description: 'Cannabis-infused beverage', active: true }
    ]
    
    await supabase.from('product').upsert(products)

    // Initialize variants
    const variants = [
      // Blue Dream Premium variants
      { id: 1, product_id: 1, variant_label: '1g', thca_pct: 22.5, delta9_pct: 0.25, active: true },
      { id: 2, product_id: 1, variant_label: '3.5g', thca_pct: 22.5, delta9_pct: 0.25, active: true },
      { id: 3, product_id: 1, variant_label: '7g', thca_pct: 22.5, delta9_pct: 0.25, active: true },
      
      // OG Kush variants
      { id: 4, product_id: 2, variant_label: '3.5g', thca_pct: 24.0, delta9_pct: 0.29, active: true },
      { id: 5, product_id: 2, variant_label: '14g', thca_pct: 24.0, delta9_pct: 0.29, active: true },
      
      // Vape variants
      { id: 6, product_id: 4, variant_label: '0.5g', flavor_id: 1, active: true },
      { id: 7, product_id: 4, variant_label: '1g', flavor_id: 2, active: true },
      { id: 8, product_id: 5, variant_label: '2g', flavor_id: 3, active: true },
      
      // Edible variants
      { id: 9, product_id: 6, variant_label: '10mg', strength_mg: 10, active: true },
      { id: 10, product_id: 6, variant_label: '25mg', strength_mg: 25, active: true },
      { id: 11, product_id: 7, variant_label: '50mg', strength_mg: 50, flavor_id: 6, active: true },
      
      // Concentrate variants
      { id: 12, product_id: 8, variant_label: '0.5g', thca_pct: 75.0, active: true },
      { id: 13, product_id: 8, variant_label: '1g', thca_pct: 75.0, active: true },
      
      // Moonwater variants
      { id: 14, product_id: 10, variant_label: '12oz', strength_mg: 10, active: true }
    ]
    
    await supabase.from('variant').upsert(variants)

    // Initialize inventory for each store
    const inventory = []
    let inventoryId = 1
    
    // For each store and variant, create inventory
    for (const store of stores) {
      for (const variant of variants) {
        inventory.push({
          id: inventoryId++,
          store_id: store.id,
          variant_id: variant.id,
          qty_on_hand: Math.floor(Math.random() * 50) + 10, // Random 10-60
          low_stock_threshold: 10,
          active: true
        })
      }
    }
    
    await supabase.from('inventory').upsert(inventory)

    // Initialize prices for each store and variant
    const prices = []
    let priceId = 1
    
    const basePrices: Record<number, number> = {
      1: 10,   // 1g flower
      2: 35,   // 3.5g flower
      3: 65,   // 7g flower
      4: 45,   // 3.5g premium
      5: 150,  // 14g
      6: 25,   // 0.5g vape
      7: 45,   // 1g vape
      8: 40,   // 2g disposable
      9: 15,   // 10mg edible
      10: 30,  // 25mg edible
      11: 45,  // 50mg chocolate
      12: 35,  // 0.5g concentrate
      13: 65,  // 1g concentrate
      14: 8    // 12oz moonwater
    }
    
    for (const store of stores) {
      for (const variant of variants) {
        const basePrice = basePrices[variant.id] || 20
        const isSpecial = Math.random() > 0.8 // 20% chance of special
        
        prices.push({
          id: priceId++,
          store_id: store.id,
          variant_id: variant.id,
          price_usd: basePrice,
          is_special: isSpecial,
          special_price_usd: isSpecial ? basePrice * 0.85 : null,
          active: true
        })
      }
    }
    
    await supabase.from('variant_price').upsert(prices)

    return NextResponse.json({ 
      success: true, 
      message: 'Sample data initialized successfully',
      counts: {
        categories: categories.length,
        stores: stores.length,
        strains: strains.length,
        flavors: flavors.length,
        products: products.length,
        variants: variants.length,
        inventory: inventory.length,
        prices: prices.length
      }
    })
  } catch (error) {
    console.error('Error initializing data:', error)
    return NextResponse.json({ 
      error: 'Failed to initialize sample data',
      details: error
    }, { status: 500 })
  }
} 