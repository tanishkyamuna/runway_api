-- First drop the dependent storage policy
DROP POLICY IF EXISTS "Public can read completed videos" ON storage.objects;

-- Create the video status type
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'video_status') THEN
    CREATE TYPE video_status AS ENUM (
      'pending',
      'processing',
      'completed',
      'failed'
    );
  END IF;
END $$;

-- Add temporary columns with new type
ALTER TABLE videos 
ADD COLUMN IF NOT EXISTS new_status video_status;

ALTER TABLE video_generations 
ADD COLUMN IF NOT EXISTS new_status video_status;

-- Convert existing status values
UPDATE videos 
SET new_status = CASE 
  WHEN status = 'pending' THEN 'pending'::video_status
  WHEN status = 'processing' THEN 'processing'::video_status
  WHEN status = 'completed' THEN 'completed'::video_status
  WHEN status = 'failed' THEN 'failed'::video_status
  ELSE 'pending'::video_status
END;

UPDATE video_generations 
SET new_status = CASE 
  WHEN status = 'pending' THEN 'pending'::video_status
  WHEN status = 'processing' THEN 'processing'::video_status
  WHEN status = 'completed' THEN 'completed'::video_status
  WHEN status = 'failed' THEN 'failed'::video_status
  ELSE 'pending'::video_status
END;

-- Drop old columns
ALTER TABLE videos DROP COLUMN IF EXISTS status CASCADE;
ALTER TABLE video_generations DROP COLUMN IF EXISTS status CASCADE;

-- Rename new columns
ALTER TABLE videos
RENAME COLUMN new_status TO status;

ALTER TABLE video_generations
RENAME COLUMN new_status TO status;

-- Add NOT NULL constraints
ALTER TABLE videos
ALTER COLUMN status SET NOT NULL,
ALTER COLUMN status SET DEFAULT 'pending'::video_status;

ALTER TABLE video_generations
ALTER COLUMN status SET NOT NULL,
ALTER COLUMN status SET DEFAULT 'pending'::video_status;

-- Recreate storage policy with new enum type
CREATE POLICY "Public can read completed videos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (
    bucket_id = 'videos' AND
    EXISTS (
      SELECT 1 FROM videos 
      WHERE videos.video_path = name 
      AND videos.status = 'completed'::video_status
    )
  );

-- Create helper functions
CREATE OR REPLACE FUNCTION check_video_status(video_id uuid)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN (
    SELECT status::text 
    FROM videos 
    WHERE id = video_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION update_video_status(
  video_id uuid,
  new_status video_status,
  error_message text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE videos 
  SET 
    status = new_status,
    error = error_message,
    updated_at = now()
  WHERE id = video_id;
  
  UPDATE video_generations
  SET 
    status = new_status,
    error = error_message,
    updated_at = now()
  WHERE video_id = video_id;
END;
$$;