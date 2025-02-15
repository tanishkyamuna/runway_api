/*
  # Update default free videos

  1. Changes
    - Update default free videos from 2 to 10 in user_credits table
    - Update existing users to have 10 free videos if they have less

  2. Security
    - Maintains existing RLS policies
    - Safe update that won't affect users who already have more than 10 credits
*/

-- Update the default value for new users
ALTER TABLE user_credits 
ALTER COLUMN free_videos_remaining 
SET DEFAULT 10;

-- Update existing users who have less than 10 credits
UPDATE user_credits 
SET free_videos_remaining = 10,
    updated_at = now()
WHERE free_videos_remaining < 10;