-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public read access for video_packages" ON video_packages;
  DROP POLICY IF EXISTS "Admin full access for video_packages" ON video_packages;
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- Add new columns to video_packages if they don't exist
DO $$ 
BEGIN
  ALTER TABLE video_packages
    ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS is_free boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- Create policies for video_packages
CREATE POLICY "Public read access for video_packages"
  ON video_packages FOR SELECT TO public
  USING (active = true);

CREATE POLICY "Admin full access for video_packages"
  ON video_packages FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Update existing packages with features
UPDATE video_packages SET
  features = CASE 
    WHEN name = 'Starter Pack' THEN 
      jsonb_build_array(
        '10 video credits',
        'All video templates',
        '720p resolution',
        'Email support',
        'Credits valid for 30 days'
      )
    WHEN name = 'Pro Pack' THEN 
      jsonb_build_array(
        '30 video credits',
        'All video templates',
        '1080p resolution',
        'Priority support',
        'Credits valid for 60 days',
        'Custom watermark'
      )
    WHEN name = 'Business Pack' THEN 
      jsonb_build_array(
        '100 video credits',
        'All video templates',
        '4K resolution',
        '24/7 support',
        'Credits valid for 90 days',
        'Custom watermark',
        'API access',
        'Bulk processing'
      )
    ELSE features
  END,
  display_order = CASE 
    WHEN name = 'Starter Pack' THEN 1
    WHEN name = 'Pro Pack' THEN 2
    WHEN name = 'Business Pack' THEN 3
    ELSE display_order
  END
WHERE name IN ('Starter Pack', 'Pro Pack', 'Business Pack');

-- Insert free package if it doesn't exist
INSERT INTO video_packages (
  name,
  description,
  credits,
  price,
  price_ils,
  features,
  is_free,
  display_order,
  active
)
SELECT
  'Free Trial',
  'Start with free videos',
  2,
  0,
  0,
  jsonb_build_array(
    '2 free video credits',
    'All video templates',
    '720p resolution',
    'Email support',
    'Credits valid for 7 days'
  ),
  true,
  0,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM video_packages WHERE is_free = true
);

-- Create function to update free video credits
CREATE OR REPLACE FUNCTION update_free_video_credits(new_count integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE video_packages
  SET 
    credits = new_count,
    features = jsonb_set(
      features,
      '{0}',
      concat(new_count::text, ' free video credits')::jsonb
    ),
    updated_at = now()
  WHERE is_free = true;
END;
$$;