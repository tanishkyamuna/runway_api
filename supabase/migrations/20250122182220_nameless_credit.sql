/*
  # Video Creation Tables

  1. New Tables
    - `videos`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `template_id` (uuid, references templates)
      - `image_path` (text)
      - `video_path` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `video_generations`
      - `id` (uuid, primary key)
      - `video_id` (uuid, references videos)
      - `status` (text)
      - `progress` (integer)
      - `error` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- Create videos table
CREATE TABLE videos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    template_id uuid REFERENCES templates NOT NULL,
    image_path text NOT NULL,
    video_path text,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create video_generations table
CREATE TABLE video_generations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id uuid REFERENCES videos NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    progress integer DEFAULT 0,
    error text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_generations ENABLE ROW LEVEL SECURITY;

-- Policies for videos table
CREATE POLICY "Users can view own videos"
    ON videos
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own videos"
    ON videos
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own videos"
    ON videos
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Policies for video_generations table
CREATE POLICY "Users can view own video generations"
    ON video_generations
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM videos 
            WHERE videos.id = video_generations.video_id 
            AND videos.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own video generations"
    ON video_generations
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM videos 
            WHERE videos.id = video_generations.video_id 
            AND videos.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own video generations"
    ON video_generations
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM videos 
            WHERE videos.id = video_generations.video_id 
            AND videos.user_id = auth.uid()
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_generations_updated_at
    BEFORE UPDATE ON video_generations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();