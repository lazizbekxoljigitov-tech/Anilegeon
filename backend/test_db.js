require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  global: { fetch: (...args) => fetch(...args) }
});

async function testConnection() {
  console.log('--- Database Connection Test ---');
  console.log('URL:', process.env.SUPABASE_URL);
  
  try {
    // 1. Test basic connectivity
    const { data: anime, error: animeError } = await supabase.from('anime').select('count', { count: 'exact' });
    if (animeError) {
      console.error('❌ Anime table access failed:', animeError.message);
    } else {
      console.log('✅ Anime table access successful. Count:', anime[0]?.count || 0);
    }

    // 2. Test users table
    const { data: users, error: userError } = await supabase.from('users').select('id, email, is_verified');
    if (userError) {
      console.error('❌ Users table access failed:', userError.message);
    } else {
      console.log('✅ Users table access successful.');
      console.log('Users found:', users.length);
      users.forEach(u => console.log(` - ${u.email} (Verified: ${u.is_verified})`));
    }

    // 3. Test Supabase Auth (listing users requires service role key)
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.error('❌ Supabase Auth access failed:', authError.message);
    } else {
      console.log('✅ Supabase Auth access successful. Total Auth Users:', authUsers.users.length);
    }

  } catch (err) {
    console.error('💥 Critical Error:', err.message);
  }
}

testConnection();
