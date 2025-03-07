/*
  # Storage Policies Migration

  1. Changes
    - Drop existing storage policies
    - Create new policies for images bucket
    - Create new policies for videos bucket
    
  2. Security
    - Restrict public access to images
    - Allow authenticated users to manage their own files
    - Allow public access to completed videos
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Delete policies for images bucket
  DROP POLICY IF EXISTS "Public cannot read images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

  -- Delete policies for videos bucket
  DROP POLICY IF EXISTS "Public can read completed videos" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own videos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own videos" ON storage.objects;
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- Set up RLS policies for images bucket
CREATE POLICY "Public cannot read images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id != 'images');

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Set up RLS policies for videos bucket
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

CREATE POLICY "Authenticated users can upload videos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own videos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own videos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );