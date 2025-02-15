/*
  # Add Sample Testimonials

  1. New Data
    - Adds initial testimonial records with realistic real estate agent feedback
    - Includes variety of ratings and roles
    - Provides meaningful content about video generation experience

  2. Changes
    - Inserts sample testimonial data into testimonials table
*/

INSERT INTO testimonials (name, role, content, rating)
VALUES 
  (
    'Sarah Johnson',
    'Real Estate Agent at Luxury Homes',
    'PropVid has completely transformed how I showcase properties. The AI-generated videos are incredibly professional and save me hours of work. My listings are getting much more attention now!',
    5
  ),
  (
    'Michael Chen',
    'Property Developer',
    'As a developer with multiple projects, I needed a scalable solution for property videos. PropVid delivers consistent quality across all my properties, and the turnaround time is amazing.',
    5
  ),
  (
    'Emily Rodriguez',
    'Marketing Director at Real Estate Group',
    'The templates are versatile and the results are impressive. We''ve seen a 40% increase in engagement since we started using PropVid for our property listings.',
    4
  ),
  (
    'David Thompson',
    'Independent Realtor',
    'The ease of use and quality of videos is outstanding. My clients love the professional look, and it helps me stand out in a competitive market.',
    5
  ),
  (
    'Lisa Parker',
    'Real Estate Photography Studio Owner',
    'We''ve integrated PropVid into our service offerings, and our clients are thrilled with the results. The AI technology produces remarkably cinematic videos.',
    4
  );