/*
  # Update RLS policies for existing tables

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new policies for templates, testimonials, and admins tables
    - Ensure proper access control for different user roles
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for templates" ON templates;
DROP POLICY IF EXISTS "Admin insert access for templates" ON templates;
DROP POLICY IF EXISTS "Admin update access for templates" ON templates;
DROP POLICY IF EXISTS "Admin delete access for templates" ON templates;

DROP POLICY IF EXISTS "Public read access for testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin insert access for testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin update access for testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin delete access for testimonials" ON testimonials;

DROP POLICY IF EXISTS "Admin read access" ON admins;
DROP POLICY IF EXISTS "Admin insert access" ON admins;
DROP POLICY IF EXISTS "Admin update access" ON admins;
DROP POLICY IF EXISTS "Admin delete access" ON admins;

-- Ensure RLS is enabled
DO $$ 
BEGIN
  ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
  ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
  ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN
  NULL;
END $$;

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