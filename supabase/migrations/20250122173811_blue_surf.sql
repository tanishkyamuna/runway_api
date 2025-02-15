/*
  # Add user profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `email` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `profiles` table
    - Add policies for users to read/update their own profiles
    - Add trigger to create profile on user signup
*/

-- Create profiles table
CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users,
    name text,
    email text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Function to handle profile creation
CREATE OR REPLACE FUNCTION handle_new_user_profile()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'name',
        new.email
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for profile creation
CREATE OR REPLACE TRIGGER on_auth_user_created_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user_profile();