-- Update Business Pack package with correct details
UPDATE video_packages 
SET 
  name = 'Business Pack',
  description = 'Enterprise-level package with premium features and dedicated support',
  credits = 100,
  price = 499.00,
  price_ils = 1999.00,
  features = jsonb_build_array(
    '100 video credits',
    'All video templates',
    '4K resolution',
    '24/7 support',
    'Credits valid for 90 days',
    'Custom watermark',
    'API access',
    'Bulk processing',
    'Priority rendering',
    'Advanced analytics'
  ),
  max_resolution = '4K',
  max_duration = 60,
  support_level = '24/7',
  validity_days = 90,
  updated_at = now()
WHERE name = 'Business Pack';

-- Ensure the package is active
UPDATE video_packages 
SET active = true 
WHERE name = 'Business Pack';