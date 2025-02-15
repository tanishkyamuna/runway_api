/*
  # Ensure Features Table Data

  1. Changes
    - Add initial features data if not exists
    - Use safe INSERT ... ON CONFLICT DO NOTHING

  2. Data
    - Core features for the platform
    - Each feature has icon, title, description, and display order
*/

INSERT INTO features (icon, title, description, display_order)
VALUES 
  (
    'wand2',
    'AI-Powered Generation',
    'Transform static property images into cinematic videos in minutes using cutting-edge AI technology',
    1
  ),
  (
    'clock',
    'Lightning Fast Delivery',
    'Get your videos in minutes, not days. Perfect for time-sensitive listings',
    2
  ),
  (
    'palette',
    'Professional Templates',
    'Choose from our library of professionally designed real estate video templates',
    3
  ),
  (
    'video',
    'Custom Branding',
    'Add your logo, colors, and contact information to maintain brand consistency',
    4
  ),
  (
    'chart',
    'Analytics Dashboard',
    'Track video performance and viewer engagement with detailed analytics',
    5
  ),
  (
    'mobile',
    'Mobile Optimized',
    'All videos are optimized for mobile viewing and social media sharing',
    6
  )
ON CONFLICT (id) DO NOTHING;