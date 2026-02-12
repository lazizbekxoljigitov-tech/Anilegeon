import { supabase } from './src/config/supabase';

async function checkUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, is_verified, otp_code')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching users:', error);
    return;
  }

  console.log('Recent Users:');
  console.table(data);
}

checkUsers();
