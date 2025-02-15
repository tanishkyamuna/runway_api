-- Add category column to templates table
ALTER TABLE templates
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS orientation text DEFAULT 'landscape';

-- Update existing templates with categories
UPDATE templates
SET 
  category = CASE 
    WHEN LOWER(title) LIKE '%exterior%' OR LOWER(title) LIKE '%reveal%' OR LOWER(title) LIKE '%drone%' THEN 'exterior'
    WHEN LOWER(title) LIKE '%interior%' OR LOWER(title) LIKE '%flow%' THEN 'interior'
    WHEN LOWER(title) LIKE '%commercial%' OR LOWER(title) LIKE '%office%' THEN 'commercial'
    WHEN LOWER(title) LIKE '%luxury%' OR LOWER(title) LIKE '%elegant%' THEN 'luxury'
    ELSE 'exterior'
  END,
  orientation = CASE
    WHEN LOWER(title) LIKE '%portrait%' OR LOWER(title) LIKE '%vertical%' OR LOWER(title) LIKE '%interior flow%' THEN 'portrait'
    ELSE 'landscape'
  END;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);