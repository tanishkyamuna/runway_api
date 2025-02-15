/*
  # Fix Features Table RLS Policies

  1. Changes
    - Add proper RLS policies for features table
    - Allow public read access
    - Restrict write access to admins only

  2. Security
    - Public can read features
    - Only admins can modify features
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for features" ON features;
DROP POLICY IF EXISTS "Admin full access for features" ON features;

-- Create new policies
CREATE POLICY "Public read access for features"
  ON features
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin full access for features"
  ON features
  FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));