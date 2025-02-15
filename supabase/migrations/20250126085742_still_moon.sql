-- Drop existing storage policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public read access for storage" ON storage.objects;
  DROP POLICY IF EXISTS "Admin full access for storage" ON storage.objects;
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- Create specific policies for template assets
CREATE POLICY "Public read access for all storage"
  ON storage.objects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin template image upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'images' AND
    (storage.foldername(name))[1] = 'template-images' AND
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admin template video upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'videos' AND
    (storage.foldername(name))[1] = 'template-previews' AND
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admin can update template assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    (bucket_id = 'images' AND (storage.foldername(name))[1] = 'template-images') OR
    (bucket_id = 'videos' AND (storage.foldername(name))[1] = 'template-previews') AND
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admin can delete template assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    (bucket_id = 'images' AND (storage.foldername(name))[1] = 'template-images') OR
    (bucket_id = 'videos' AND (storage.foldername(name))[1] = 'template-previews') AND
    EXISTS (
      SELECT 1 FROM admins 
      WHERE id = auth.uid()
    )
  );

-- Ensure buckets are public
UPDATE storage.buckets 
SET public = true 
WHERE id IN ('images', 'videos');