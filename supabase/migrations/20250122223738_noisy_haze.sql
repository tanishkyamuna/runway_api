-- Add error column to videos table
ALTER TABLE videos 
ADD COLUMN IF NOT EXISTS error text;

-- Add error column to video_generations table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'video_generations' 
    AND column_name = 'error'
  ) THEN
    ALTER TABLE video_generations ADD COLUMN error text;
  END IF;
END $$;