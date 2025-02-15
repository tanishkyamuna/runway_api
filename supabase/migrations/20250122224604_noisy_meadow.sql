-- Ensure template_id is UUID and has proper foreign key constraint
ALTER TABLE videos 
DROP CONSTRAINT IF EXISTS videos_template_id_fkey;

ALTER TABLE videos 
ALTER COLUMN template_id TYPE uuid USING template_id::uuid;

ALTER TABLE videos 
ADD CONSTRAINT videos_template_id_fkey 
FOREIGN KEY (template_id) 
REFERENCES templates(id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_template_id ON videos(template_id);
CREATE INDEX IF NOT EXISTS idx_video_generations_video_id ON video_generations(video_id);