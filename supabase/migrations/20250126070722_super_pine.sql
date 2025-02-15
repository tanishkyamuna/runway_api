-- Add new camera movement templates
INSERT INTO templates (title, description, image_url, prompt)
VALUES 
  (
    'The Reveal Glide',
    'Smooth horizontal movement revealing the property with cinematic motion blur',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
    'Create 5-second horizontal movement from behind object to reveal building. Maintain 2ft/sec speed, center-framed. Set at f/2.8, 1/50 shutter, 24fps for cinematic motion blur.'
  ),
  (
    'Ascending Drone Shot',
    'Dramatic vertical rise showcasing the property from ground to aerial view',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
    '10-second vertical rise from ground to 100ft elevation. Building centered, 3ft/sec ascent. Shoot at f/4, 1/60 shutter, ND filter if needed. Export 24fps.'
  ),
  (
    'Push-In Portrait',
    'Vertical push-in movement perfect for tall buildings and entrances',
    'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
    '5-second push-in from wide to detail. Vertical framing emphasizes building height. 1.5ft/sec movement, f/2.8, 1/50 shutter, 24fps.'
  ),
  (
    'Orbital Sweep',
    'Elegant 180-degree arc movement around the property',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
    '10-second 180° arc movement. 2ft/sec constant speed, building centered. f/4, 1/60 shutter, 24fps for smooth motion.'
  ),
  (
    'Interior Flow',
    'Smooth vertical walkthrough of interior spaces',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
    '10-second vertical interior walkthrough. 2ft/sec pace, gentle turns. f/2.8, 1/50 shutter, 24fps. Vertical frame captures room height.'
  ),
  (
    'Parallax Slide',
    'Dynamic lateral movement with depth layers',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
    '5-second lateral slide with foreground elements. 2ft/sec, f/4, 1/60 shutter, 24fps. Wide aspect captures depth layers.'
  ),
  (
    'Elevated Reveal',
    'Dramatic diagonal descent approach',
    'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
    '10-second diagonal descent. Start high/back, approach at 45°. 3ft/sec, f/4, 1/60 shutter, 24fps. Wide frame shows property context.'
  ),
  (
    'Bookend Push',
    'Elegant push-in with static start and end frames',
    'https://images.unsplash.com/photo-1600607689372-6fb345b100f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80',
    '5-second push-in to entrance. Static start/end (1sec each). f/2.8, 1/50 shutter, 24fps. Vertical frame emphasizes entrance detail.'
  );