/*
  # Add Storage Buckets and Policies

  1. New Buckets
    - `images` bucket for storing uploaded property images
    - `videos` bucket for storing generated videos

  2. Security
    - Enable RLS on both buckets
    - Add policies for authenticated users to manage their own files
    - Add policies for public read access to completed videos
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('images', 'images', false),
  ('videos', 'videos', true);

-- Set up RLS policies for images bucket
CREATE POLICY "Users can upload own images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Set up RLS policies for videos bucket
CREATE POLICY "Users can view own videos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public can view completed videos"
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

CREATE POLICY "Users can update own videos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own videos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'videos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );