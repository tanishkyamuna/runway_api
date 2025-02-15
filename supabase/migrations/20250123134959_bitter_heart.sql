-- Update storage bucket permissions
UPDATE storage.buckets 
SET public = true 
WHERE id IN ('images', 'videos');

-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to update own objects" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to delete own objects" ON storage.objects;
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- Create new policies with public read access
CREATE POLICY "Allow public read access"
  ON storage.objects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN ('images', 'videos') AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Allow authenticated users to update own objects"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id IN ('images', 'videos') AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Allow authenticated users to delete own objects"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id IN ('images', 'videos') AND
    auth.uid()::text = (storage.foldername(name))[1]
  );