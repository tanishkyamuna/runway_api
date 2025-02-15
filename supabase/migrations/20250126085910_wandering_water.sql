-- Add video preview URL column to templates table
ALTER TABLE templates
ADD COLUMN IF NOT EXISTS video_preview_url text,
ADD COLUMN IF NOT EXISTS orientation text DEFAULT 'landscape',
ADD COLUMN IF NOT EXISTS duration integer DEFAULT 10;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_templates_orientation ON templates(orientation);

-- Update existing templates with default values
UPDATE templates
SET 
  orientation = CASE 
    WHEN LOWER(title) LIKE '%portrait%' OR LOWER(title) LIKE '%vertical%' OR LOWER(title) LIKE '%interior flow%' THEN 'portrait'
    ELSE 'landscape'
  END,
  duration = CASE
    WHEN description LIKE '%5-second%' OR description LIKE '%5 second%' THEN 5
    WHEN description LIKE '%15-second%' OR description LIKE '%15 second%' THEN 15
    ELSE 10
  END
WHERE orientation IS NULL OR duration IS NULL;

-- Add check constraint for orientation
ALTER TABLE templates
ADD CONSTRAINT templates_orientation_check 
CHECK (orientation IN ('landscape', 'portrait'));

-- Add check constraint for duration
ALTER TABLE templates
ADD CONSTRAINT templates_duration_check 
CHECK (duration BETWEEN 5 AND 60);