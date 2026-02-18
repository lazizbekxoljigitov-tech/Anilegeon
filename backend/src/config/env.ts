import dotenv from 'dotenv';
dotenv.config();

const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];

export function validateEnv(): void {
  const missing = required.filter((key) => {
    const val = (env as any)[key];
    return !val || val === '' || val.includes('your_');
  });
  
  if (missing.length > 0) {
    const errorMsg = `❌ Missing or invalid environment variables: ${missing.join(', ')}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
}

// Perform validation immediately on load
validateEnv();

const cleanEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) return '';
  // Remove surrounding quotes if they exist
  return value.replace(/^["'](.+)["']$/, '$1');
};

export const env = {
  PORT: parseInt(cleanEnv('PORT', '5000'), 10),
  NODE_ENV: cleanEnv('NODE_ENV', 'development'),
  SUPABASE_URL: cleanEnv('SUPABASE_URL'),
  SUPABASE_ANON_KEY: cleanEnv('SUPABASE_ANON_KEY'),
  SUPABASE_SERVICE_ROLE_KEY: cleanEnv('SUPABASE_SERVICE_ROLE_KEY'),
  JWT_SECRET: cleanEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: cleanEnv('JWT_EXPIRES_IN', '7d'),
  EMAIL_USER: cleanEnv('EMAIL_USER'),
  EMAIL_PASS: cleanEnv('EMAIL_PASS'),
  FRONTEND_URL: cleanEnv('FRONTEND_URL'),
};
