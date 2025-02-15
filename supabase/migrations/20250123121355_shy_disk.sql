-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('images', 'images', true),
  ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Drop all existing storage policies first
DO $$ 
BEGIN
  -- Drop all existing policies for storage.objects
  DROP POLICY IF EXISTS "Users can upload own images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can read own images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload own videos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can read own videos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own videos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own videos" ON storage.objects;
  DROP POLICY IF EXISTS "Public can read completed videos" ON storage.objects;
  DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to update own objects" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to delete own objects" ON storage.objects;
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- Create new storage policies
CREATE POLICY "Allow public read access"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'videos' AND EXISTS (
    SELECT 1 FROM videos
    WHERE videos.video_path = name
    AND videos.status = 'completed'
  ));

CREATE POLICY "Allow authenticated users to upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (bucket_id = 'images' OR bucket_id = 'videos') AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Allow authenticated users to update own objects"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    (bucket_id = 'images' OR bucket_id = 'videos') AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Allow authenticated users to delete own objects"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    (bucket_id = 'images' OR bucket_id = 'videos') AND
    auth.uid()::text = (storage.foldername(name))[1]
  );