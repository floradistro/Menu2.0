# Pricing Management System Guide

## Overview

The Pricing Management System is a comprehensive pricing center that allows you to manage all aspects of your cannabis business pricing through the admin panel. This system provides:

- **Base Pricing**: Set standard prices for all product categories and quantities
- **Discount Rules**: Create percentage or fixed-amount discounts
- **Bundle Deals**: Set up multi-item bundles with special pricing
- **Special Offers**: Time-limited or product-specific specials

## Getting Started

### 1. Database Setup

First, run the SQL setup script in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `PRICING_DATABASE_SETUP.sql`
4. Click "Run" to create the necessary tables and sample data

### 2. Accessing the Pricing Center

1. Navigate to your admin panel at `/admin`
2. Click on the "Pricing Center" tab
3. You'll see four main sections:
   - **Base Pricing**: Fundamental prices for all categories
   - **Discounts**: Percentage and fixed-amount discounts
   - **Bundles**: Multi-item deals
   - **Specials**: Time-limited or targeted offers

## Base Pricing

Base pricing sets the foundation for all your product pricing. This is where you define the standard price for each product category and quantity.

### Categories Supported:
- **Flower**: 1g, 3.5g, 7g, 14g, 28g
- **Concentrates**: 1g, 3.5g, 7g, 14g, 28g
- **Vapes**: 1 cart, 2 carts, 3 carts
- **Edibles**: 1 pack, 2 packs, 3 packs
- **Pre-rolls**: 1 roll, 3 rolls, 5 rolls
- **Moonwater**: Various dosages and pack sizes

### Adding Base Prices:
1. Click "Add Base Price"
2. Select the category
3. Enter the weight/quantity (e.g., "3.5g", "1 cart")
4. Set the base price
5. Toggle active/inactive status

## Discount Rules

Create flexible discount rules that can apply to specific categories, quantities, or time periods.

### Types of Discounts:

#### Percentage Discounts
- Set a percentage off (e.g., 10%, 15%, 25%)
- Can apply to entire categories or specific conditions
- Example: "15% off all flower purchases over 3 items"

#### Fixed Discounts
- Set a fixed dollar amount off (e.g., $5, $10, $20)
- Good for simple promotions
- Example: "$10 off any purchase over $100"

### Discount Conditions:
- **Minimum Quantity**: Require a minimum number of items
- **Maximum Quantity**: Limit the discount to smaller purchases
- **Time Restrictions**: Set specific hours when the discount applies
- **Priority**: Higher priority rules are applied first

### Examples:
- **Happy Hour**: 20% off vapes from 4-6 PM
- **Bulk Discount**: 15% off when buying 3+ flower items
- **First Time Customer**: 25% off first purchase

## Bundle Deals

Create special pricing for multiple items purchased together.

### Bundle Types:
- **Mix & Match**: Buy X items, get bundle price
- **Category Bundles**: Special pricing for multiple items from same category
- **Cross-Category**: Combine different product types

### Examples:
- **Mix & Match 3 Eighths**: $120 for any 3 eighth purchases
- **Premium Ounce**: $360 for 8 eighths (equivalent to 1 oz)
- **Vape + Flower Combo**: $85 for 1 vape + 1 eighth

## Special Offers

Time-limited or product-specific offers that override normal pricing.

### Special Offer Types:
- **Daily Specials**: Featured products at special prices
- **Flash Sales**: Limited-time offers
- **Product-Specific**: Target specific strains or products

### Time Restrictions:
- Set start and end times
- Specify days of the week
- Create urgency with limited-time offers

### Examples:
- **Daily Special**: Blue Dream eighths for $35 (normally $40)
- **Flash Sale**: All OG Kush products 30% off today only
- **Weekend Special**: 20% off all concentrates Saturday-Sunday

## Priority System

The pricing system uses a priority-based approach to determine which rules apply:

1. **Higher Priority Numbers = Applied First**
2. **Special Offers** typically have highest priority (10-15)
3. **Bundle Deals** have medium priority (6-9)
4. **Regular Discounts** have lower priority (1-5)

### Priority Examples:
- First Time Customer Discount: Priority 15
- Daily Specials: Priority 10
- Happy Hour: Priority 8
- Bundle Deals: Priority 6-8
- Regular Discounts: Priority 1-5

## Managing Your Pricing

### Best Practices:

1. **Start with Base Pricing**: Set your foundation prices first
2. **Create Strategic Discounts**: Use discounts to drive specific behaviors
3. **Use Bundles for Higher Sales**: Encourage larger purchases
4. **Rotate Specials**: Keep customers engaged with changing offers
5. **Monitor Performance**: Track which rules drive the most sales

### Common Strategies:

#### Drive Traffic During Slow Hours
- Create "Happy Hour" discounts during slow periods
- Offer time-limited specials to create urgency

#### Increase Average Order Value
- Bundle discounts that require multiple items
- Percentage discounts that increase with quantity

#### Move Specific Inventory
- Product-specific specials for overstocked items
- Category-wide discounts to boost slow-moving categories

#### Customer Acquisition
- First-time customer discounts
- Referral bonuses
- Loyalty program integration

## Advanced Features

### Conditional Logic
The system supports complex conditions using JSON:

```json
{
  "min_quantity": 3,
  "max_quantity": 10,
  "specific_products": ["Blue Dream", "OG Kush"],
  "time_restrictions": {
    "start_time": "16:00",
    "end_time": "18:00",
    "days_of_week": [1, 2, 3, 4, 5]
  }
}
```

### Integration with Menu System
- Pricing rules automatically apply to your public menus
- Real-time updates across all displays
- Consistent pricing across all touchpoints

## Troubleshooting

### Common Issues:

1. **Rules Not Applying**: Check priority order and conditions
2. **Conflicting Discounts**: Higher priority rules override lower ones
3. **Time Restrictions**: Ensure time format is correct (24-hour format)
4. **Category Mismatches**: Verify category names match exactly

### Support:
- Check the admin panel for error messages
- Verify database connections
- Ensure all required fields are filled
- Test with small changes first

## Future Enhancements

The pricing system is designed to be extensible. Future features may include:

- Customer-specific pricing tiers
- Automatic inventory-based pricing
- Integration with POS systems
- Advanced analytics and reporting
- Automated A/B testing of pricing strategies

---

This pricing management system gives you complete control over your cannabis business pricing strategy. Use it to optimize revenue, drive customer behavior, and stay competitive in your market. 