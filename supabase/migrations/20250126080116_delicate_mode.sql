-- Create free_video_settings table for managing default free videos
CREATE TABLE free_video_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    videos_per_signup integer NOT NULL DEFAULT 2,
    description text,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE free_video_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for free_video_settings
CREATE POLICY "Public read access for free_video_settings"
    ON free_video_settings FOR SELECT TO public
    USING (active = true);

CREATE POLICY "Admin full access for free_video_settings"
    ON free_video_settings FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Insert default free video settings
INSERT INTO free_video_settings (videos_per_signup, description)
VALUES (2, 'Default number of free videos for new users');

-- Add new columns to video_packages
ALTER TABLE video_packages 
ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS max_duration integer DEFAULT 30,
ADD COLUMN IF NOT EXISTS max_resolution text DEFAULT '1080p',
ADD COLUMN IF NOT EXISTS support_level text DEFAULT 'standard';

-- Update existing packages with more details
UPDATE video_packages SET
    features = CASE 
        WHEN name = 'Starter Pack' THEN 
            jsonb_build_array(
                'All video templates',
                '720p resolution',
                'Email support',
                'Credits valid for 30 days'
            )
        WHEN name = 'Pro Pack' THEN 
            jsonb_build_array(
                'All video templates',
                '1080p resolution',
                'Priority support',
                'Credits valid for 60 days',
                'Custom watermark'
            )
        WHEN name = 'Business Pack' THEN 
            jsonb_build_array(
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
    max_duration = CASE 
        WHEN name = 'Starter Pack' THEN 15
        WHEN name = 'Pro Pack' THEN 30
        WHEN name = 'Business Pack' THEN 60
        ELSE max_duration
    END,
    max_resolution = CASE 
        WHEN name = 'Starter Pack' THEN '720p'
        WHEN name = 'Pro Pack' THEN '1080p'
        WHEN name = 'Business Pack' THEN '4K'
        ELSE max_resolution
    END,
    support_level = CASE 
        WHEN name = 'Starter Pack' THEN 'standard'
        WHEN name = 'Pro Pack' THEN 'priority'
        WHEN name = 'Business Pack' THEN '24/7'
        ELSE support_level
    END
WHERE name IN ('Starter Pack', 'Pro Pack', 'Business Pack');

-- Create function to update free video settings
CREATE OR REPLACE FUNCTION update_free_video_settings(new_count integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE free_video_settings
    SET 
        videos_per_signup = new_count,
        updated_at = now()
    WHERE active = true;
END;
$$;

-- Create function to get current free video count
CREATE OR REPLACE FUNCTION get_free_video_count()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    video_count integer;
BEGIN
    SELECT videos_per_signup INTO video_count
    FROM free_video_settings
    WHERE active = true
    LIMIT 1;
    
    RETURN COALESCE(video_count, 2);
END;
$$;

-- Update handle_new_user function to use dynamic free video count
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, free_videos_remaining)
  VALUES (new.id, get_free_video_count());
  RETURN new;
END;
$$;