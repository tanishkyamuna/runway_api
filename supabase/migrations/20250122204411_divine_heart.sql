-- Create video_packages table
CREATE TABLE video_packages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    credits integer NOT NULL,
    price numeric(10,2) NOT NULL,
    price_ils numeric(10,2) NOT NULL,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create payment_transactions table
CREATE TABLE payment_transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    package_id uuid REFERENCES video_packages NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency text NOT NULL,
    status text NOT NULL,
    provider text NOT NULL,
    payment_id text,
    error text,
    metadata jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE video_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for video_packages
CREATE POLICY "Public read access for video_packages"
    ON video_packages
    FOR SELECT
    TO public
    USING (active = true);

CREATE POLICY "Admin full access for video_packages"
    ON video_packages
    TO authenticated
    USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

-- Create policies for payment_transactions
CREATE POLICY "Users can view own transactions"
    ON payment_transactions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
    ON payment_transactions
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Create function to add video credits
CREATE OR REPLACE FUNCTION add_video_credits(
    user_id uuid,
    credits_to_add integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO user_credits (user_id, free_videos_remaining)
    VALUES (user_id, credits_to_add)
    ON CONFLICT (user_id) DO UPDATE
    SET free_videos_remaining = user_credits.free_videos_remaining + credits_to_add,
        updated_at = now();
END;
$$;

-- Insert default packages
INSERT INTO video_packages (name, description, credits, price, price_ils)
VALUES 
    (
        'Starter Pack',
        '10 video credits with basic features',
        10,
        99.00,
        399.00
    ),
    (
        'Pro Pack',
        '30 video credits with advanced features',
        30,
        249.00,
        999.00
    ),
    (
        'Business Pack',
        '100 video credits with all features',
        100,
        499.00,
        1999.00
    );

-- Create updated_at triggers
CREATE TRIGGER update_video_packages_updated_at
    BEFORE UPDATE ON video_packages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
    BEFORE UPDATE ON payment_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();