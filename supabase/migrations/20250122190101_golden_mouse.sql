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