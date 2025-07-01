# Bulk Upload Guide for MENU 2.0

## Overview
The Bulk Upload feature allows you to import products with category-specific handling. The system intelligently processes different product types (Flower, Vape, Edible, Concentrate, Moonwater) with their unique requirements.

## Key Features
- **Dynamic Category Handling**: One CSV template with conditional validation
- **Automatic Variant Creation**: Flower products auto-create weight-based variants
- **Smart Pricing**: Different pricing structures per category
- **Batch Processing**: Upload hundreds of products at once

## CSV Template Structure

### Universal Fields (Required for All Categories)
| Field | Description | Example |
|-------|-------------|---------|
| `store_code` | Store identifier | CLT, SAL, TN, BR |
| `category` | Product category | Flower, Vape, Edible, Concentrate, Moonwater |
| `product_name` | Product name | Blue Dream, Gummy Bears |
| `qty_on_hand` | Current inventory | 25 |

### Category-Specific Requirements

#### 🌿 **FLOWER**
Required fields:
- `thca_pct` - THCA percentage
- `delta9_pct` - Delta-9 THC percentage  
- At least one weight price: `sale_price_1g`, `sale_price_3_5g`, `sale_price_7g`, `sale_price_14g`, `sale_price_28g`

**Note**: Each flower product automatically creates variants for all weight tiers that have prices.

#### 💨 **VAPE**
Required fields:
- `strength_mg` - THC/CBD strength in milligrams
- `sale_price_1_unit` - Unit price
- `variant_label` - Size/type (e.g., "1g", "0.5g")

#### 🍬 **EDIBLE**
Required fields:
- `strength_mg` - THC/CBD strength in milligrams (typically 10mg, 20mg, etc.)
- `sale_price_1_unit` - Single unit price

Optional bundle pricing:
- `sale_price_2_units`, `sale_price_3_units`, `sale_price_4_units`

#### 🧪 **CONCENTRATE**
Required fields:
- `thca_pct` - THCA percentage
- `sale_price_1_unit` - Unit price

#### 💧 **MOONWATER**
Required fields:
- `strength_mg` - THC/CBD strength (5mg, 10mg, 30mg tiers)
- `sale_price_1_unit` - Single unit price

Optional:
- `sale_price_4_units` - 4-pack pricing

### Complete Field Reference

```csv
store_code,category,product_name,strain_name,strain_type,base_description,variant_label,strength_mg,thca_pct,delta9_pct,sale_price_1_unit,sale_price_1g,sale_price_3_5g,sale_price_7g,sale_price_14g,sale_price_28g,sale_price_2_units,sale_price_3_units,sale_price_4_units,qty_on_hand,low_stock_threshold,sku,flavor_name,special_price,special_starts,special_ends
```

### Example Data

#### Flower (creates multiple weight variants):
```csv
CLT,Flower,Blue Dream,Blue Dream,Hybrid,Premium indoor flower,,,24.8,0.004,,12.00,35.00,65.00,120.00,220.00,,,,,25,5,BD,,,,,
```

#### Vape (single variant):
```csv
CLT,Vape,OG Kush Cart,OG Kush,Indica,Premium distillate,1g,1000,85.2,0.1,45.00,,,,,,,,,,20,5,OGC-1G,,,,,
```

#### Edible (with bundle pricing):
```csv
CLT,Edible,Gummy Bears,,,Delicious fruit gummies,10mg,10,,,15.00,,,,,,25.00,,50.00,,30,10,GB-10,Mixed Berry,,,,
```

#### Moonwater (with 4-pack option):
```csv
CLT,Moonwater,Moonwater,,,Cannabis beverage,5mg,5,,,8.00,,,,,,,,30.00,,40,10,MW-5,Watermelon,,,,
```

## Upload Process

### 1. Prepare Your Data
- Download the CSV template from the admin panel
- Fill in data according to category requirements
- Ensure all required fields are populated
- Save as UTF-8 encoded CSV

### 2. Upload Steps
1. Navigate to `/admin`
2. Click **"Bulk Upload"** tab (📤)
3. Click **"Select CSV File"**
4. Review the preview - check category colors and validation
5. Click **"🚀 Start Upload"**
6. Monitor progress bar
7. Review results and any errors

### 3. Post-Upload Verification
- **Products Tab**: Verify all products were created
- **Variants Tab**: Check auto-created variants (especially for Flower)
- **Inventory Tab**: Confirm stock levels
- **Pricing Tab**: Review pricing tiers

## Validation Rules

### Dynamic Validation
The system validates each row based on its category:

```
if category == 'Flower':
    require: THCA%, Δ9%, at least one weight price
    create: variants for each weight with pricing
    
elif category == 'Vape':
    require: strength_mg, sale_price_1_unit
    create: single variant
    
elif category == 'Edible':
    require: strength_mg, sale_price_1_unit
    optional: bundle prices (2/3/4 units)
    
elif category == 'Concentrate':
    require: THCA%, sale_price_1_unit
    
elif category == 'Moonwater':
    require: strength_mg, sale_price_1_unit
    optional: 4-pack pricing
```

## Common Issues & Solutions

### Validation Errors
- **"Invalid category"**: Check spelling (Flower, not Flowers)
- **"thca_pct is required for Flower"**: Add THCA percentage
- **"Flower products need at least one weight pricing"**: Add price for 1g, 3.5g, or 7g

### Data Format
- **Prices**: Use decimal format (35.00, not $35)
- **Percentages**: Use decimal format (24.8, not 24.8%)
- **Dates**: YYYY-MM-DD format (2024-01-15)
- **Store codes**: Must match existing stores (CLT, SAL, TN, BR)

### Performance Tips
- Start with small batches (10-50 rows) for testing
- For large uploads (>500 rows), expect 2-5 minutes processing time
- Check browser console for detailed error messages

## Advanced Features

### Special Pricing
Add time-limited special prices:
```csv
...,special_price,special_starts,special_ends
...,29.99,2024-01-01,2024-01-15
```

### SKU Management
- For Flower: SKUs auto-append weight (BD + 3.5g = BD-3.5g)
- For others: Use exact SKU from CSV

### Flavor Variants
- Currently manual - create flavors in admin first
- Link via `flavor_name` column

## Best Practices

1. **Test First**: Always test with 5-10 rows before full upload
2. **Category Grouping**: Group products by category in your CSV
3. **Consistent Naming**: Use consistent product names across stores
4. **Inventory Accuracy**: Double-check quantities before upload
5. **Price Validation**: Ensure special prices are less than regular prices

## Database Schema Notes
- Prices stored in cents (automatic conversion from USD)
- Flower products create multiple variant records
- Bundle pricing for Edibles/Moonwater requires schema updates (coming soon)
- All products set to `active: true` by default

## Next Steps
After successful upload:
1. Review all tabs in admin panel
2. Check live menu at `/menus/[store]/[category]`
3. Test special pricing dates
4. Set up regular inventory update schedules 