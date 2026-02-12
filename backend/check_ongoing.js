require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use native fetch to avoid the previous error
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  global: { fetch: (...args) => fetch(...args) }
});

async function checkOngoing() {
  console.log('Checking "ongoing" animes...');
  
  const { data, error } = await supabase
    .from('anime')
    .select('title, status')
    .eq('status', 'ongoing');

  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log(`✅ Found ${data.length} ongoing animes:`);
    data.forEach(a => console.log(` - ${a.title} (${a.status})`));
    
    if (data.length < 2) {
      console.log('\n⚠️ Slider needs at least 2 animes to animate/change!');
    }
  }
}

checkOngoing();
