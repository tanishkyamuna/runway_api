/*
  # Add Affiliate Marketing System

  1. New Tables
    - `affiliates` - Stores affiliate user information
      - `id` (uuid, primary key)
      - `user_id` (references auth.users)
      - `code` (unique referral code)
      - `commission_rate` (percentage)
      - `status` (active/inactive)
      
    - `affiliate_referrals` - Tracks referral visits and conversions
      - `id` (uuid, primary key)
      - `affiliate_id` (references affiliates)
      - `referred_user_id` (references auth.users)
      - `status` (pending/converted)
      - `commission_amount` (if converted)

  2. Security
    - Enable RLS on both tables
    - Add policies for affiliates and admins
*/

-- Create affiliates table
CREATE TABLE affiliates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    code text UNIQUE NOT NULL,
    commission_rate numeric(5,2) NOT NULL DEFAULT 10.00,
    status text NOT NULL DEFAULT 'active',
    total_earnings numeric(10,2) DEFAULT 0.00,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create affiliate_referrals table
CREATE TABLE affiliate_referrals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id uuid REFERENCES affiliates NOT NULL,
    referred_user_id uuid REFERENCES auth.users,
    status text NOT NULL DEFAULT 'pending',
    commission_amount numeric(10,2),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;

-- Policies for affiliates table
CREATE POLICY "Affiliates can view own data"
    ON affiliates
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admin full access for affiliates"
    ON affiliates
    TO authenticated
    USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Policies for affiliate_referrals table
CREATE POLICY "Affiliates can view own referrals"
    ON affiliate_referrals
    FOR SELECT
    TO authenticated
    USING (
        affiliate_id IN (
            SELECT id FROM affiliates WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admin full access for referrals"
    ON affiliate_referrals
    TO authenticated
    USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create function to generate unique affiliate code
CREATE OR REPLACE FUNCTION generate_affiliate_code()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
    new_code text;
    code_exists boolean;
BEGIN
    LOOP
        -- Generate random 6 character code
        new_code := upper(substring(md5(random()::text) from 1 for 6));
        
        -- Check if code exists
        SELECT EXISTS (
            SELECT 1 FROM affiliates WHERE code = new_code
        ) INTO code_exists;
        
        -- Exit loop if code is unique
        EXIT WHEN NOT code_exists;
    END LOOP;
    
    RETURN new_code;
END;
$$;

-- Create function to create affiliate
CREATE OR REPLACE FUNCTION create_affiliate(user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_affiliate_id uuid;
BEGIN
    INSERT INTO affiliates (user_id, code)
    VALUES (user_id, generate_affiliate_code())
    RETURNING id INTO new_affiliate_id;
    
    RETURN new_affiliate_id;
END;
$$;