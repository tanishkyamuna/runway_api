/*
  # Create templates and content tables

  1. New Tables
    - `templates`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)
    - `testimonials`
      - `id` (uuid, primary key)
      - `name` (text)
      - `role` (text)
      - `content` (text)
      - `rating` (integer)
      - `created_at` (timestamp)
    - `admins`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

CREATE TABLE templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  content text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE admins (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policies for templates
CREATE POLICY "Public read access for templates"
  ON templates
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin full access for templates"
  ON templates
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE id = auth.uid()
    )
  );

-- Policies for testimonials
CREATE POLICY "Public read access for testimonials"
  ON testimonials
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin full access for testimonials"
  ON testimonials
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE id = auth.uid()
    )
  );

-- Policies for admins
CREATE POLICY "Admin can view admin list"
  ON admins
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins WHERE id = auth.uid()
    )
  );