/*
  # Influencer and Payment Tracking Schema

  1. New Tables
    - influencer_profiles
      - Extended profile info for influencers
      - Stores social media links and stats
    - influencer_payments
      - Tracks all payments to influencers
      - Records commission amounts and status
    - payment_methods
      - Stores influencer payment preferences
      - Supports multiple payment methods

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
*/

-- Create influencer_profiles table
CREATE TABLE influencer_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users,
    name text NOT NULL,
    email text NOT NULL,
    instagram_url text,
    tiktok_url text,
    niche text NOT NULL,
    followers_count integer NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    bio text,
    website text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create payment_methods table
CREATE TABLE payment_methods (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    type text NOT NULL,
    details jsonb NOT NULL,
    is_default boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create influencer_payments table
CREATE TABLE influencer_payments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    amount numeric(10,2) NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    payment_method_id uuid REFERENCES payment_methods,
    transaction_id text,
    payment_date timestamptz,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE influencer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_payments ENABLE ROW LEVEL SECURITY;

-- Policies for influencer_profiles
CREATE POLICY "Users can view own profile"
    ON influencer_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON influencer_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Policies for payment_methods
CREATE POLICY "Users can view own payment methods"
    ON payment_methods
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment methods"
    ON payment_methods
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods"
    ON payment_methods
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods"
    ON payment_methods
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Policies for influencer_payments
CREATE POLICY "Users can view own payments"
    ON influencer_payments
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Create function to handle new influencer signup
CREATE OR REPLACE FUNCTION handle_new_influencer()
RETURNS trigger AS $$
BEGIN
  INSERT INTO influencer_profiles (
    id,
    name,
    email,
    instagram_url,
    tiktok_url,
    niche,
    followers_count
  )
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    new.email,
    new.raw_user_meta_data->>'instagram_url',
    new.raw_user_meta_data->>'tiktok_url',
    new.raw_user_meta_data->>'niche',
    (new.raw_user_meta_data->>'followers_count')::integer
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    instagram_url = EXCLUDED.instagram_url,
    tiktok_url = EXCLUDED.tiktok_url,
    niche = EXCLUDED.niche,
    followers_count = EXCLUDED.followers_count,
    updated_at = now();
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new influencer signup
CREATE TRIGGER on_influencer_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (new.raw_user_meta_data->>'is_influencer' = 'true')
  EXECUTE FUNCTION handle_new_influencer();

-- Add indexes for better performance
CREATE INDEX idx_influencer_profiles_niche ON influencer_profiles(niche);
CREATE INDEX idx_influencer_payments_user_id ON influencer_payments(user_id);
CREATE INDEX idx_influencer_payments_status ON influencer_payments(status);
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);