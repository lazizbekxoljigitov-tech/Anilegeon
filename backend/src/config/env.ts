import dotenv from 'dotenv';
dotenv.config();

const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'JWT_SECRET'];

export function validateEnv(): void {
  const missing = required.filter((key) => !process.env[key] || process.env[key]?.includes('your_'));
  
  if (missing.length > 0) {
    throw new Error(
      `❌ Missing or invalid environment variables: ${missing.join(', ')}\n` +
      `Please update your backend/.env file with real values from your Supabase dashboard.`
    );
  }
}

// Perform validation immediately on load
validateEnv();

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};
