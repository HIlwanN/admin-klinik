import db from './config/supabase.js';

console.log('🔍 Testing Supabase connection...');

try {
  const result = await db.healthCheck();
  console.log('✅ Database connection successful:', result);
  console.log('🎉 Supabase is ready to use!');
  process.exit(0);
} catch (err) {
  console.error('❌ Connection failed:', err.message);
  console.error('🔧 Please check your .env configuration');
  process.exit(1);
}
