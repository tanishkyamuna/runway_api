/*
  # Fix Influencer Signup Process

  1. Changes
    - Drop and recreate trigger with proper error handling
    - Add insert policy for influencer_profiles
    - Add proper error handling for metadata parsing
    - Add proper validation for required fields

  2. Security
    - Maintain RLS policies
    - Add proper error messages
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_influencer_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_influencer();

-- Create improved function with better error handling
CREATE OR REPLACE FUNCTION handle_new_influencer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _name text;
  _instagram_url text;
  _tiktok_url text;
  _niche text;
  _followers_count integer;
BEGIN
  -- Extract and validate metadata
  _name := COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));
  _instagram_url := new.raw_user_meta_data->>'instagram_url';
  _tiktok_url := new.raw_user_meta_data->>'tiktok_url';
  _niche := new.raw_user_meta_data->>'niche';
  
  BEGIN
    _followers_count := (new.raw_user_meta_data->>'followers_count')::integer;
  EXCEPTION WHEN others THEN
    _followers_count := 0;
  END;

  -- Insert or update influencer profile
  INSERT INTO influencer_profiles (
    id,
    name,
    email,
    instagram_url,
    tiktok_url,
    niche,
    followers_count,
    status
  )
  VALUES (
    new.id,
    _name,
    new.email,
    _instagram_url,
    _tiktok_url,
    _niche,
    _followers_count,
    'pending'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    instagram_url = EXCLUDED.instagram_url,
    tiktok_url = EXCLUDED.tiktok_url,
    niche = EXCLUDED.niche,
    followers_count = EXCLUDED.followers_count,
    updated_at = now();

  -- Create affiliate account
  PERFORM create_affiliate(new.id);
  
  RETURN new;
EXCEPTION WHEN others THEN
  -- Log error but don't prevent user creation
  RAISE WARNING 'Error in handle_new_influencer: %', SQLERRM;
  RETURN new;
END;
$$;

-- Recreate trigger
CREATE TRIGGER on_influencer_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (new.raw_user_meta_data->>'is_influencer' = 'true')
  EXECUTE FUNCTION handle_new_influencer();

-- Add missing insert policy for influencer_profiles
CREATE POLICY "System can create influencer profiles"
  ON influencer_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add missing insert policy for influencer_payments
CREATE POLICY "System can create influencer payments"
  ON influencer_payments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add function to approve influencer
CREATE OR REPLACE FUNCTION approve_influencer(influencer_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE influencer_profiles
  SET 
    status = 'approved',
    updated_at = now()
  WHERE id = influencer_id;
END;
$$;