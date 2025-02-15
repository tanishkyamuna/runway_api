-- Drop existing policies
DO $$ 
BEGIN
  -- Drop storage policies
  DROP POLICY IF EXISTS "Public cannot read images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
  DROP POLICY IF EXISTS "Public can read completed videos" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own videos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own videos" ON storage.objects;
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- Create new storage policies
CREATE POLICY "Allow public read access"
  ON storage.objects
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to upload"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update own objects"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete own objects"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (true);