-- Drop existing storage policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to update own objects" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to delete own objects" ON storage.objects;
EXCEPTION WHEN others THEN
  NULL;
END $$;

-- Create new storage policies with admin access
CREATE POLICY "Public read access for storage"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id IN ('images', 'videos'));

CREATE POLICY "Admin full access for storage"
  ON storage.objects
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      JOIN public.admins ON auth.users.id = admins.id
      WHERE auth.users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      JOIN public.admins ON auth.users.id = admins.id
      WHERE auth.users.id = auth.uid()
    )
  );

-- Update bucket settings
UPDATE storage.buckets 
SET public = true 
WHERE id IN ('images', 'videos');