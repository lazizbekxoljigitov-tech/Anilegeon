require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    fetch: (...args) => fetch(...args),
  },
});

async function checkSchema() {
  console.log('--- START DIAGNOSTIC ---');
  
  // Test 1: Simple Count (HEAD)
  console.log('\n1. Testing HEAD request (count)...');
  const { count, error: countError } = await supabase.from('anime').select('*', { count: 'exact', head: true });
  if (countError) {
    console.error('❌ HEAD request failed:', countError.message);
    if (countError.cause) console.error('Cause:', countError.cause);
  } else {
    console.log('✅ HEAD request succeeded. Count:', count);
  }

  // Test 2: Fetch ID only
  console.log('\n2. Testing SELECT id FROM anime LIMIT 1...');
  const { data: idData, error: idError } = await supabase.from('anime').select('id').limit(1);
  if (idError) {
    console.error('❌ SELECT id failed:', idError.message);
  } else {
    console.log('✅ SELECT id succeeded:', idData);
  }

  // Test 3: Fetch All Columns
  console.log('\n3. Testing SELECT * FROM anime LIMIT 1...');
  const { data: allData, error: allError } = await supabase.from('anime').select('*').limit(1);
  if (allError) {
    console.error('❌ SELECT * failed:', allError.message);
    // console.dir(allError, { depth: null });
  } else {
    console.log('✅ SELECT * succeeded.');
    if (allData && allData.length > 0) {
      console.log('Columns:', Object.keys(allData[0]));
      // Check if 'status' column exists
      if ('status' in allData[0]) {
        console.log('✅ Column "status" exists.');
      } else {
        console.error('❌ Column "status" MISSING!');
      }
    } else {
      console.log('⚠️ Table is empty.');
    }
  }

  console.log('--- END DIAGNOSTIC ---');
}

checkSchema();
