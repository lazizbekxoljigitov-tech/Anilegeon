require('dotenv').config();

const url = process.env.SUPABASE_URL + '/rest/v1/anime?select=id&limit=1';
const key = process.env.SUPABASE_ANON_KEY;

console.log('Testing raw fetch to:', url);

async function testFetch() {
  try {
    console.log('1. Fetching Google (connectivity check)...');
    const google = await fetch('https://www.google.com', { method: 'HEAD' });
    console.log('✅ Google fetch status:', google.status);
  } catch (err) {
    console.error('❌ Google fetch failed:', err.message);
  }

  try {
    console.log('\n2. Fetching Supabase (GET)...');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    
    console.log('Response Status:', response.status);
    console.log('Response Text:', await response.text());
  } catch (err) {
    console.error('❌ Supabase fetch failed:', err.message);
    if (err.cause) console.error('Cause:', err.cause);
  }
}

testFetch();
