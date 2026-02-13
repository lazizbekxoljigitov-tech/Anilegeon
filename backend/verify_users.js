require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Eslatmas: Service Role Key haqiqiy bo'lishi kerak!
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  global: { fetch: (...args) => fetch(...args) }
});

async function verifyAllUsers() {
  console.log('--- Barcha foydalanuvchilarni tasdiqlash (Verify) ---');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ is_verified: true, otp_code: null, otp_expires_at: null })
      .eq('is_verified', false)
      .select('email');

    if (error) {
      console.error('❌ Xatolik:', error.message);
      if (error.message.includes('permission denied')) {
        console.log('\n⚠️ Maslahat: .env faylidagi SUPABASE_SERVICE_ROLE_KEY ni tekshiring. U ANON_KEY bilan bir xil boʻlmasligi kerak!');
      }
    } else {
      console.log(`✅ Muvaffaqiyatli: ${data.length} ta foydalanuvchi tasdiqlandi.`);
      data.forEach(u => console.log(` - ${u.email}`));
      console.log('\nEndi login qilib koʻrishingiz mumkin!');
    }
  } catch (err) {
    console.error('💥 Kutilmagan xato:', err.message);
  }
}

verifyAllUsers();
