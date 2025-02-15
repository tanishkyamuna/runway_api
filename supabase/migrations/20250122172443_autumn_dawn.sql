/*
  # Add user credits tracking

  1. New Tables
    - user_credits
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - free_videos_remaining (integer)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS
    - Add policies for user access
*/

-- Create user_credits table
CREATE TABLE user_credits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    free_videos_remaining integer DEFAULT 2,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own credits"
    ON user_credits
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Insert user credits on signup"
    ON user_credits
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credits"
    ON user_credits
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Function to create user credits on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_credits (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user credits on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();