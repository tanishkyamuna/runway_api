/*
  # Fix user profile trigger

  1. Changes
    - Drop and recreate the profile trigger with proper error handling
    - Add insert policy for profiles table
    - Add function to handle user metadata properly
*/

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user_profile();

-- Create improved function with error handling
CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    updated_at = now();
  
  RETURN new;
EXCEPTION WHEN others THEN
  -- Log error and continue
  RAISE WARNING 'Failed to create profile for user %: %', new.id, SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_profile();

-- Add insert policy for profiles
CREATE POLICY "System can create profiles"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);