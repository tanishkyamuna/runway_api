/*
  # Add Content Management Tables

  1. New Tables
    - `hero_content` - עמוד הבית hero section
      - `id` (uuid, primary key)
      - `title` (text) - כותרת ראשית
      - `subtitle` (text) - כותרת משנה
      - `image_url` (text) - תמונת רקע
      - `video_url` (text) - סרטון רקע (אופציונלי)
      - `active` (boolean) - האם פעיל
      - `created_at` (timestamptz)

    - `features` - תכונות המערכת
      - `id` (uuid, primary key)
      - `icon` (text) - שם האייקון
      - `title` (text) - כותרת
      - `description` (text) - תיאור
      - `display_order` (integer) - סדר הצגה
      - `created_at` (timestamptz)

    - `examples` - דוגמאות לסרטונים
      - `id` (uuid, primary key)
      - `title` (text) - כותרת
      - `category` (text) - קטגוריה
      - `property_type` (text) - סוג הנכס
      - `original_image_url` (text) - תמונה מקורית
      - `video_preview_url` (text) - סרטון לדוגמה
      - `duration` (text) - אורך הסרטון
      - `views` (integer) - מספר צפיות
      - `template_name` (text) - שם התבנית
      - `description` (text) - תיאור
      - `active` (boolean) - האם פעיל
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for admin write access
*/

-- Hero Content Table
CREATE TABLE hero_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text NOT NULL,
  image_url text NOT NULL,
  video_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Features Table
CREATE TABLE features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  display_order integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Examples Table
CREATE TABLE examples (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  property_type text NOT NULL,
  original_image_url text NOT NULL,
  video_preview_url text NOT NULL,
  duration text NOT NULL,
  views integer DEFAULT 0,
  template_name text NOT NULL,
  description text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE examples ENABLE ROW LEVEL SECURITY;

-- Public Read Access Policies
CREATE POLICY "Public read access for hero_content"
  ON hero_content
  FOR SELECT
  TO public
  USING (active = true);

CREATE POLICY "Public read access for features"
  ON features
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for examples"
  ON examples
  FOR SELECT
  TO public
  USING (active = true);

-- Admin Full Access Policies
CREATE POLICY "Admin full access for hero_content"
  ON hero_content
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "Admin full access for features"
  ON features
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "Admin full access for examples"
  ON examples
  TO authenticated
  USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));