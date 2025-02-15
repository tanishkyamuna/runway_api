-- Update template descriptions with more detailed information
UPDATE templates 
SET description = CASE 
  WHEN title = 'The Reveal Glide' THEN 
    'A cinematic horizontal movement that gracefully reveals the property. Perfect for dramatic exterior shots, this template creates anticipation through smooth motion and professional motion blur effects. Ideal for modern homes and architectural showcases.'
  
  WHEN title = 'Ascending Drone Shot' THEN
    'An impressive vertical rise that transforms from ground-level to aerial view. This template creates a sense of grandeur by revealing the full scope of the property and its surroundings. Excellent for large estates and properties with stunning landscapes.'
  
  WHEN title = 'Push-In Portrait' THEN
    'A vertical push-in movement designed specifically for tall buildings and grand entrances. This template emphasizes height and architectural details through smooth forward motion. Perfect for high-rise properties and impressive facades.'
  
  WHEN title = 'Orbital Sweep' THEN
    'An elegant 180-degree arc movement that showcases the property from multiple angles. This template creates a comprehensive view of the exterior while maintaining professional pacing. Ideal for properties with interesting architectural features on multiple sides.'
  
  WHEN title = 'Interior Flow' THEN
    'A smooth vertical walkthrough specially designed for interior spaces. This template creates an immersive experience with gentle transitions between rooms. Perfect for showcasing open floor plans and interior design features.'
  
  WHEN title = 'Parallax Slide' THEN
    'A dynamic lateral movement that creates depth through parallax effects. This template uses foreground and background elements to add visual interest. Great for properties with layered architectural elements or landscaping.'
  
  WHEN title = 'Elevated Reveal' THEN
    'A dramatic diagonal descent that approaches the property from an elevated position. This template combines height and forward motion to create impact. Excellent for properties with impressive approaches or unique positioning.'
  
  WHEN title = 'Bookend Push' THEN
    'An elegant push-in movement with static start and end frames for maximum impact. This template creates a professional opening and closing sequence. Perfect for formal properties and luxury real estate.'
  
  ELSE description
END,
prompt = CASE
  WHEN title = 'The Reveal Glide' THEN
    'Create a 5-second horizontal movement that reveals the property with cinematic elegance. Start behind an architectural element or landscaping feature, then smoothly glide to reveal the main facade. Maintain consistent 2ft/sec speed with the building perfectly center-framed. Use f/2.8 aperture and 1/50 shutter at 24fps for professional motion blur. Do not modify, change, or invent any elements in the original image - only add camera movement.'
  
  WHEN title = 'Ascending Drone Shot' THEN
    'Create a 10-second vertical rise starting at ground level and ascending to 100ft elevation. Keep the building centered throughout the movement. Use 3ft/sec constant ascent speed with f/4 aperture and 1/60 shutter at 24fps for smooth motion. Ensure the final frame provides context of the surrounding area. Do not modify, change, or invent any elements in the original image - only add camera movement.'
  
  WHEN title = 'Push-In Portrait' THEN
    'Create a 5-second push-in movement emphasizing the vertical aspects of the property. Start wide to establish scale, then move forward at 1.5ft/sec to focus on entrance details. Use f/2.8 aperture and 1/50 shutter at 24fps in vertical framing. Maintain perfect centering throughout the movement. Do not modify, change, or invent any elements in the original image - only add camera movement.'
  
  ELSE prompt
END
WHERE title IN (
  'The Reveal Glide',
  'Ascending Drone Shot',
  'Push-In Portrait',
  'Orbital Sweep',
  'Interior Flow',
  'Parallax Slide',
  'Elevated Reveal',
  'Bookend Push'
);