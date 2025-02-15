/*
  # Add Initial Hero Content

  1. New Data
    - Adds initial hero content entries with titles, subtitles, and media URLs
    - Each entry represents a different hero section variation
    - All entries start as active

  2. Content Types
    - Main hero with video
    - Feature showcase
    - Call-to-action focused
*/

INSERT INTO hero_content (title, subtitle, image_url, video_url, active)
VALUES 
  (
    'Transform Property Images Into Cinematic Videos',
    'Create stunning property videos in minutes with AI-powered technology. Perfect for real estate agents, property developers, and marketing teams.',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1000&q=80',
    'https://home-market.co.il/wp-content/uploads/2025/01/Gen-3-Alpha-Turbo-3554586214-Create-a-cinematic-d-midtown-haifa-c19_0-M-5.mp4',
    true
  ),
  (
    'Professional Videos for Every Property',
    'Choose from our collection of expertly designed templates and create engaging property videos that capture attention.',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1000&q=80',
    null,
    true
  ),
  (
    'Start Creating Property Videos Today',
    'Get 2 free videos when you sign up. No credit card required. Experience the power of AI video generation.',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=1000&q=80',
    null,
    true
  );