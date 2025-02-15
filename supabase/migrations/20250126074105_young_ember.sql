-- Add izikdekel@gmail.com as admin
INSERT INTO admins (id, email)
SELECT 
  id,
  email
FROM auth.users 
WHERE email = 'izikdekel@gmail.com'
ON CONFLICT (id) DO NOTHING;