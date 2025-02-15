/*
  # Fix Affiliate Data Management

  1. Changes
    - Add cleanup function to handle duplicates
    - Add unique constraint safely
    - Improve affiliate info retrieval
    - Update affiliate creation logic

  2. Security
    - Maintain RLS policies
    - Add proper validation
*/

-- First clean up duplicate records
CREATE OR REPLACE FUNCTION cleanup_duplicate_affiliates()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete duplicate records keeping the most recent one
  WITH ranked_affiliates AS (
    SELECT id,
      user_id,
      ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
    FROM affiliates
  ),
  duplicates AS (
    SELECT id 
    FROM ranked_affiliates 
    WHERE rn > 1
  )
  DELETE FROM affiliates
  WHERE id IN (SELECT id FROM duplicates);
END;
$$;

-- Run cleanup
SELECT cleanup_duplicate_affiliates();

-- Now safely add unique constraint
ALTER TABLE affiliates 
DROP CONSTRAINT IF EXISTS affiliates_user_id_key;

ALTER TABLE affiliates
ADD CONSTRAINT affiliates_user_id_key UNIQUE (user_id);

-- Create improved affiliate info function
CREATE OR REPLACE FUNCTION get_affiliate_info(user_id uuid)
RETURNS TABLE (
  id uuid,
  code text,
  commission_rate numeric,
  status text,
  total_earnings numeric,
  created_at timestamptz,
  updated_at timestamptz,
  referral_count bigint,
  pending_referrals bigint,
  converted_referrals bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.code,
    a.commission_rate,
    a.status,
    a.total_earnings,
    a.created_at,
    a.updated_at,
    COUNT(ar.id) as referral_count,
    COUNT(ar.id) FILTER (WHERE ar.status = 'pending') as pending_referrals,
    COUNT(ar.id) FILTER (WHERE ar.status = 'converted') as converted_referrals
  FROM affiliates a
  LEFT JOIN affiliate_referrals ar ON ar.affiliate_id = a.id
  WHERE a.user_id = get_affiliate_info.user_id
  GROUP BY a.id;
END;
$$;

-- Update create_affiliate function to handle duplicates
CREATE OR REPLACE FUNCTION create_affiliate(user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_affiliate_id uuid;
BEGIN
  -- Check if affiliate already exists
  SELECT id INTO new_affiliate_id
  FROM affiliates
  WHERE user_id = create_affiliate.user_id;

  -- If exists, return existing ID
  IF new_affiliate_id IS NOT NULL THEN
    RETURN new_affiliate_id;
  END IF;

  -- Create new affiliate
  INSERT INTO affiliates (user_id, code)
  VALUES (user_id, generate_affiliate_code())
  RETURNING id INTO new_affiliate_id;
  
  RETURN new_affiliate_id;
END;
$$;