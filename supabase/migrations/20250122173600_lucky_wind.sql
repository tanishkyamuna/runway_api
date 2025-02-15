/*
  # Update security policies for existing tables
  
  1. Changes
    - Drop existing policies
    - Create new policies with proper access control
    - Fix infinite recursion in admin policies
  
  2. Security
    - Enable RLS on all tables
    - Public read access for templates and testimonials
    - Admin-only write access
    - Fixed admin self-reference policies
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for templates" ON templates;
DROP POLICY IF EXISTS "Admin full access for templates" ON templates;
DROP POLICY IF EXISTS "Public read access for testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin full access for testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin can view admin list" ON admins;

-- Ensure RLS is enabled
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policies for templates
CREATE POLICY "Public read access for templates"
  ON templates
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin insert access for templates"
  ON templates
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admins WHERE admins.id = auth.uid()
  ));

CREATE POLICY "Admin update access for templates"
  ON templates
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE admins.id = auth.uid()
  ));

CREATE POLICY "Admin delete access for templates"
  ON templates
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE admins.id = auth.uid()
  ));

-- Policies for testimonials
CREATE POLICY "Public read access for testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin insert access for testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM admins WHERE admins.id = auth.uid()
  ));

CREATE POLICY "Admin update access for testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE admins.id = auth.uid()
  ));

CREATE POLICY "Admin delete access for testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admins WHERE admins.id = auth.uid()
  ));

-- Policies for admins
CREATE POLICY "Admin read access"
  ON admins
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admin insert access"
  ON admins
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admin update access"
  ON admins
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admin delete access"
  ON admins
  FOR DELETE
  TO authenticated
  USING (id = auth.uid());