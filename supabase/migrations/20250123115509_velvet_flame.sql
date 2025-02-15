-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('images', 'images', true),
  ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  -- Drop policies for images bucket
  DROP POLICY IF EXISTS "Users can upload own images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can read own images" ON storage.objects;
  
  -- Drop policies for videos bucket
  DROP POLICY IF EXISTS "Users can upload own videos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can read own videos" ON storage.objects;
  DROP POLICY IF EXISTS "Public can read completed videos" ON storage.objects;
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- Recreate policies for images bucket
CREATE POLICY "Users can upload own images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read own images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Recreate policies for videos bucket
CREATE POLICY "Users can upload own videos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read own videos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Public can read completed videos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (
    bucket_id = 'videos' AND
    EXISTS (
      SELECT 1 FROM videos
      WHERE videos.video_path = name
      AND videos.status = 'completed'
    )
  );