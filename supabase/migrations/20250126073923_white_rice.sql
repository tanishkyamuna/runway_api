-- Create content_sections table
CREATE TABLE content_sections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    content jsonb NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create content_blocks table
CREATE TABLE content_blocks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id uuid REFERENCES content_sections NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    content jsonb NOT NULL,
    display_order integer NOT NULL,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access for content_sections"
    ON content_sections FOR SELECT TO public
    USING (true);

CREATE POLICY "Admin full access for content_sections"
    ON content_sections FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "Public read access for content_blocks"
    ON content_blocks FOR SELECT TO public
    USING (active = true);

CREATE POLICY "Admin full access for content_blocks"
    ON content_blocks FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Insert initial content sections
INSERT INTO content_sections (name, slug, content) VALUES
('Homepage Hero', 'homepage-hero', '{"title": "Transform Property Images Into Cinematic Videos", "subtitle": "Create stunning property videos in minutes with AI-powered technology"}'),
('Features', 'features', '{"title": "Features that Transform Your Property Listings", "subtitle": "Everything you need to create stunning property videos"}'),
('Pricing', 'pricing', '{"title": "Choose Your Plan", "subtitle": "Start with 2 free videos, no credit card required"}'),
('Templates', 'templates', '{"title": "Professional Video Templates", "subtitle": "Choose from our collection of expertly designed templates"}');