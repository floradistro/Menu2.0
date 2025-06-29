# Complete Supabase Database Setup

## ⚠️ Action Required: Run This SQL in Supabase Dashboard

Go to your Supabase project dashboard → **SQL Editor** and run this script:

```sql
-- AI Actions Log Table
CREATE TABLE IF NOT EXISTS ai_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action_type TEXT NOT NULL CHECK (action_type IN ('create', 'update', 'delete', 'price_change', 'stock_toggle')),
  product_id UUID REFERENCES products(id),
  old_data JSONB,
  new_data JSONB,
  reasoning TEXT NOT NULL,
  confidence_score DECIMAL(3,2),
  approved BOOLEAN DEFAULT false,
  approved_by TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AI Settings Table
CREATE TABLE IF NOT EXISTS ai_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add AI fields to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS ai_managed BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ai_confidence_score DECIMAL(3,2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS ai_last_updated TIMESTAMP WITH TIME ZONE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ai_update_reason TEXT;

-- Enable RLS on new tables
ALTER TABLE ai_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to ai_actions" ON ai_actions
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to ai_settings" ON ai_settings
  FOR SELECT USING (true);

-- Create update trigger for ai_settings
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_settings_updated_at BEFORE UPDATE ON ai_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert AI configuration
INSERT INTO ai_settings (setting_key, setting_value) VALUES
('auto_approval_threshold', '0.85'),
('allowed_actions', '["update", "price_change", "stock_toggle"]'),
('restricted_fields', '["name", "category", "type"]'),
('price_change_limit', '{"max_increase_percent": 20, "max_decrease_percent": 15}'),
('notification_settings', '{"slack_webhook": "", "email_alerts": true}')
ON CONFLICT (setting_key) DO NOTHING;

-- Create some sample AI actions for testing
INSERT INTO ai_actions (action_type, reasoning, confidence_score, approved) VALUES
('price_change', 'Test AI action - market analysis suggests price adjustment', 0.85, false),
('stock_toggle', 'Test AI action - inventory system indicates low stock', 0.92, true);
```

## Steps:
1. Go to https://reodhmvktvfjioyqznmj.supabase.co/project/default/sql
2. Paste the SQL above
3. Click "Run" 
4. Come back and tell me "done"

This will complete the AI-ready database setup! 