-- Add OTP columns to users table for registration and password reset
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS otp_code VARCHAR(6),
ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Optional: Add a comment
COMMENT ON COLUMN public.users.is_verified IS 'Whether the user has verified their email via OTP';
