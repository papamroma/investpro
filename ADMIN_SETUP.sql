-- Add is_admin column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);

-- UPDATE YOUR USER TO BE ADMIN
-- Replace 'ojappolo@gmail.com' with your actual email if different
UPDATE users 
SET is_admin = TRUE 
WHERE email = 'ojappolo@gmail.com';
