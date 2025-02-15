/*
  # Add Email Notification System

  1. New Tables
    - `email_templates` - Stores email templates for different notification types
    - `email_logs` - Tracks sent emails for auditing and troubleshooting

  2. Security
    - Enable RLS on new tables
    - Add policies for admin access
*/

-- Create email_templates table
CREATE TABLE email_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text UNIQUE NOT NULL,
    subject text NOT NULL,
    body text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create email_logs table
CREATE TABLE email_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    template_type text REFERENCES email_templates(type) NOT NULL,
    status text NOT NULL,
    error text,
    metadata jsonb,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin full access for email_templates"
    ON email_templates
    TO authenticated
    USING (EXISTS (SELECT 1 FROM admins WHERE id = auth.uid()));

CREATE POLICY "Users can view own email logs"
    ON email_logs
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Insert default email templates
INSERT INTO email_templates (type, subject, body) VALUES
(
    'welcome',
    'Welcome to PropVid! 🎥',
    'Hi {{name}},

Thank you for joining PropVid! We''re excited to help you create stunning property videos.

You have {{credits}} free video credits to get started. Here''s what you can do next:
1. Browse our video templates
2. Upload your first property image
3. Generate your first video

Need help? Our support team is here for you!

Best regards,
The PropVid Team'
),
(
    'video_started',
    'Your Video is Being Created 🎬',
    'Hi {{name}},

We''ve started creating your video for "{{property_name}}". This usually takes about 2-3 minutes.

We''ll notify you as soon as your video is ready!

Video Details:
- Template: {{template_name}}
- Started: {{start_time}}
- Estimated completion: {{eta}}

Best regards,
The PropVid Team'
),
(
    'video_complete',
    'Your Video is Ready! 🎉',
    'Hi {{name}},

Great news! Your video for "{{property_name}}" is ready to view.

View your video here: {{video_url}}

Video Details:
- Duration: {{duration}}
- Resolution: {{resolution}}
- Template Used: {{template_name}}

Want to create another video? You have {{credits_remaining}} credits remaining.

Best regards,
The PropVid Team'
),
(
    'low_credits',
    'Running Low on Video Credits ⚠️',
    'Hi {{name}},

You''re down to {{credits_remaining}} video credits. To ensure you can continue creating stunning property videos, consider upgrading your plan.

View our pricing plans here: {{pricing_url}}

Best regards,
The PropVid Team'
);

-- Create function to update updated_at
CREATE TRIGGER update_email_templates_updated_at
    BEFORE UPDATE ON email_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();