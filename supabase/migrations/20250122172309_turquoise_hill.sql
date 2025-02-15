/*
  # Update examples table and data

  1. Changes
    - Add new example data if table exists
    - Skip table and policy creation if they already exist
*/

-- Check if table exists and create if it doesn't
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'examples') THEN
        CREATE TABLE examples (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            title text NOT NULL,
            description text NOT NULL,
            category text NOT NULL,
            property_type text NOT NULL,
            original_image_url text NOT NULL,
            video_preview_url text NOT NULL,
            duration text NOT NULL,
            views integer DEFAULT 0,
            template_name text NOT NULL,
            active boolean DEFAULT true,
            created_at timestamptz DEFAULT now()
        );

        -- Enable Row Level Security
        ALTER TABLE examples ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Public read access for examples"
            ON examples
            FOR SELECT
            TO public
            USING (active = true);

        CREATE POLICY "Admin full access for examples"
            ON examples
            TO authenticated
            USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));
    END IF;
END $$;

-- Insert example data if it doesn't exist
INSERT INTO examples (
    title,
    description,
    category,
    property_type,
    original_image_url,
    video_preview_url,
    duration,
    template_name
)
SELECT
    'Modern Villa Showcase',
    'Elegant exterior view of a modern villa with pool',
    'exterior',
    'luxury',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
    'https://home-market.co.il/wp-content/uploads/2025/01/Gen-3-Alpha-Turbo-3554586214-Create-a-cinematic-d-midtown-haifa-c19_0-M-5.mp4',
    '10 seconds',
    'Cinematic Approach'
WHERE NOT EXISTS (
    SELECT 1 FROM examples WHERE title = 'Modern Villa Showcase'
);

INSERT INTO examples (
    title,
    description,
    category,
    property_type,
    original_image_url,
    video_preview_url,
    duration,
    template_name
)
SELECT
    'Luxury Interior Tour',
    'Stunning interior walkthrough of a luxury apartment',
    'interior',
    'residential',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
    'https://home-market.co.il/wp-content/uploads/2025/01/Gen-3-Alpha-Turbo-3554586214-Create-a-cinematic-d-midtown-haifa-c19_0-M-5.mp4',
    '15 seconds',
    'Interior Flow'
WHERE NOT EXISTS (
    SELECT 1 FROM examples WHERE title = 'Luxury Interior Tour'
);

INSERT INTO examples (
    title,
    description,
    category,
    property_type,
    original_image_url,
    video_preview_url,
    duration,
    template_name
)
SELECT
    'Commercial Space Overview',
    'Modern office space with panoramic views',
    'aerial',
    'commercial',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    'https://home-market.co.il/wp-content/uploads/2025/01/Gen-3-Alpha-Turbo-3554586214-Create-a-cinematic-d-midtown-haifa-c19_0-M-5.mp4',
    '20 seconds',
    'Commercial Pro'
WHERE NOT EXISTS (
    SELECT 1 FROM examples WHERE title = 'Commercial Space Overview'
);