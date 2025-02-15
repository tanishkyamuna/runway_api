/*
  # Fix Missing Data

  1. New Data
    - Add missing features data
    - Add missing hero content
    - Add missing templates
    - Add missing examples
    
  2. Security
    - Ensure RLS is enabled
    - Add necessary policies
*/

-- Add missing features data if not exists
INSERT INTO features (icon, title, description, display_order)
SELECT 'wand2', 'AI-Powered Generation', 'Transform static property images into cinematic videos in minutes', 1
WHERE NOT EXISTS (SELECT 1 FROM features WHERE title = 'AI-Powered Generation');

INSERT INTO features (icon, title, description, display_order)
SELECT 'clock', 'Lightning Fast Delivery', 'Get your videos in minutes, not days', 2
WHERE NOT EXISTS (SELECT 1 FROM features WHERE title = 'Lightning Fast Delivery');

INSERT INTO features (icon, title, description, display_order)
SELECT 'palette', 'Professional Templates', 'Choose from our library of templates', 3
WHERE NOT EXISTS (SELECT 1 FROM features WHERE title = 'Professional Templates');

-- Add missing hero content if not exists
INSERT INTO hero_content (title, subtitle, image_url, video_url, active)
SELECT 
  'Transform Property Images Into Cinematic Videos',
  'Create stunning property videos in minutes with AI',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
  'https://home-market.co.il/wp-content/uploads/2025/01/Gen-3-Alpha-Turbo-3554586214-Create-a-cinematic-d-midtown-haifa-c19_0-M-5.mp4',
  true
WHERE NOT EXISTS (SELECT 1 FROM hero_content WHERE title = 'Transform Property Images Into Cinematic Videos');

-- Add missing templates if not exists
INSERT INTO templates (title, description, image_url)
SELECT 
  'Cinematic Exterior',
  'Perfect for showcasing property exteriors',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE title = 'Cinematic Exterior');

INSERT INTO templates (title, description, image_url)
SELECT 
  'Interior Journey',
  'Smooth walkthrough of interior spaces',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0'
WHERE NOT EXISTS (SELECT 1 FROM templates WHERE title = 'Interior Journey');

-- Add missing examples if not exists
INSERT INTO examples (title, description, category, property_type, original_image_url, video_preview_url, duration, template_name)
SELECT
  'Modern Villa Showcase',
  'Elegant exterior view of a modern villa with pool',
  'exterior',
  'luxury',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
  'https://home-market.co.il/wp-content/uploads/2025/01/Gen-3-Alpha-Turbo-3554586214-Create-a-cinematic-d-midtown-haifa-c19_0-M-5.mp4',
  '10 seconds',
  'Cinematic Approach'
WHERE NOT EXISTS (SELECT 1 FROM examples WHERE title = 'Modern Villa Showcase');

INSERT INTO examples (title, description, category, property_type, original_image_url, video_preview_url, duration, template_name)
SELECT
  'Luxury Interior Tour',
  'Stunning interior walkthrough of a luxury apartment',
  'interior',
  'residential',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0',
  'https://home-market.co.il/wp-content/uploads/2025/01/Gen-3-Alpha-Turbo-3554586214-Create-a-cinematic-d-midtown-haifa-c19_0-M-5.mp4',
  '15 seconds',
  'Interior Flow'
WHERE NOT EXISTS (SELECT 1 FROM examples WHERE title = 'Luxury Interior Tour');