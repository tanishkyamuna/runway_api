-- Add prompt column to templates table
ALTER TABLE templates 
ADD COLUMN IF NOT EXISTS prompt text;

-- Update existing templates with default prompts
UPDATE templates 
SET prompt = CASE 
  WHEN title LIKE '%Exterior%' THEN 'Create a cinematic and professional real estate video showcasing the exterior with smooth camera movements and dramatic angles'
  WHEN title LIKE '%Interior%' THEN 'Create an elegant interior walkthrough video with smooth transitions and focus on spatial flow'
  WHEN title LIKE '%Aerial%' THEN 'Create a dynamic aerial perspective video highlighting the property location and surroundings'
  ELSE 'Create a cinematic property video with professional camera movements and transitions'
END
WHERE prompt IS NULL;