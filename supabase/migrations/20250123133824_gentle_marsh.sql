-- Create function to add credits by email
CREATE OR REPLACE FUNCTION add_credits_by_email(
  user_email text,
  credits_to_add integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get user ID from auth.users
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Add credits
  UPDATE user_credits 
  SET 
    free_videos_remaining = COALESCE(free_videos_remaining, 0) + credits_to_add,
    updated_at = now()
  WHERE user_id = target_user_id;

  -- If no row exists, insert one
  IF NOT FOUND THEN
    INSERT INTO user_credits (user_id, free_videos_remaining)
    VALUES (target_user_id, credits_to_add);
  END IF;
END;
$$;

-- Add credits to specific user
SELECT add_credits_by_email('izikdekel@gmail.com', 100);