-- Add features management columns to video_packages
ALTER TABLE video_packages
ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS max_resolution text DEFAULT '1080p',
ADD COLUMN IF NOT EXISTS max_duration integer DEFAULT 30,
ADD COLUMN IF NOT EXISTS support_level text DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS validity_days integer DEFAULT 30;

-- Update Pro Pack with specific features
UPDATE video_packages 
SET 
  features = jsonb_build_array(
    '30 video credits',
    'All video templates',
    '1080p resolution',
    'Priority support', 
    'Credits valid for 60 days',
    'Custom watermark'
  ),
  max_resolution = '1080p',
  max_duration = 30,
  support_level = 'priority',
  validity_days = 60,
  description = 'Professional package with advanced features and priority support'
WHERE name = 'Pro Pack';

-- Create function to update package features
CREATE OR REPLACE FUNCTION update_package_features(
  package_id uuid,
  new_features jsonb,
  new_resolution text DEFAULT NULL,
  new_duration integer DEFAULT NULL,
  new_support text DEFAULT NULL,
  new_validity integer DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE video_packages
  SET 
    features = new_features,
    max_resolution = COALESCE(new_resolution, max_resolution),
    max_duration = COALESCE(new_duration, max_duration),
    support_level = COALESCE(new_support, support_level),
    validity_days = COALESCE(new_validity, validity_days),
    updated_at = now()
  WHERE id = package_id;
END;
$$;