-- Update Pro Pack features and settings
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
  description = 'Professional package with advanced features and priority support',
  max_resolution = '1080p',
  max_duration = 30,
  support_level = 'priority',
  updated_at = now()
WHERE name = 'Pro Pack';

-- Create function to update package features
CREATE OR REPLACE FUNCTION update_package_features(
  package_id uuid,
  new_features jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE video_packages
  SET 
    features = new_features,
    updated_at = now()
  WHERE id = package_id;
END;
$$;

-- Create function to get package details
CREATE OR REPLACE FUNCTION get_package_details(package_name text)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  credits integer,
  price numeric,
  price_ils numeric,
  features jsonb,
  max_resolution text,
  max_duration integer,
  support_level text,
  active boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.description,
    p.credits,
    p.price,
    p.price_ils,
    p.features,
    p.max_resolution,
    p.max_duration,
    p.support_level,
    p.active
  FROM video_packages p
  WHERE p.name = package_name;
END;
$$;