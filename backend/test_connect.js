require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

console.log('Testing connection to:', supabaseUrl);
// console.log('Using Key:', supabaseKey); // Don't log full key

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('anime').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection Failed:', error.message);
      console.error('Details:', error);
    } else {
      console.log('✅ Connection Successful!');
      console.log('Anime count:', data); // data is null for head:true, count is in data? No, check count.
      // count is returned separately
    }
  } catch (err) {
    console.error('❌ Unexpected Error:', err.message);
  }
}

testConnection();
