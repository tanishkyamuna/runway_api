-- Create settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value jsonb NOT NULL,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for settings" ON settings;
DROP POLICY IF EXISTS "Admin full access for settings" ON settings;

-- Create policies for settings
CREATE POLICY "Public read access for settings"
    ON settings FOR SELECT TO public
    USING (true);

CREATE POLICY "Admin full access for settings"
    ON settings FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Insert default settings if they don't exist
INSERT INTO settings (key, value, description)
SELECT 
    'site',
    jsonb_build_object(
        'title', 'PropVid',
        'description', 'AI-Powered Property Video Platform',
        'contact_email', 'support@propvid.com',
        'support_phone', '+1 (234) 567-890'
    ),
    'General site settings'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE key = 'site');

INSERT INTO settings (key, value, description)
SELECT 
    'video_generation',
    jsonb_build_object(
        'max_duration', 30,
        'max_file_size', 100,
        'supported_formats', ARRAY['mp4', 'mov'],
        'default_quality', '1080p'
    ),
    'Video generation settings'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE key = 'video_generation');

INSERT INTO settings (key, value, description)
SELECT 
    'integrations',
    jsonb_build_object(
        'make_webhook_url', 'https://hook.eu1.make.com/urhqhs1gwa9j3ykqnnpgmitsvpnkrmdk',
        'runway_api_key', 'key_c708e176d986ae854f5dc0e2b70e8ed0e881e051352d9a8b36a40cc314f57654c449317964a6cf28fe46f48344991398c030f37a83801f39b427f9757cfd48bc'
    ),
    'Third-party integration settings'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE key = 'integrations');