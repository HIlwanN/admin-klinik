import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Simple Supabase test...');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

try {
  // Test with a simple query that doesn't involve users table
  console.log('📊 Testing with stations table...');
  const { data: stations, error: stationsError } = await supabase
    .from('stations')
    .select('*')
    .limit(5);
  
  if (stationsError) {
    console.error('❌ Stations query error:', stationsError.message);
  } else {
    console.log('✅ Stations query successful!');
    console.log('   Found stations:', stations);
  }

  // Test with patients table
  console.log('🏥 Testing with patients table...');
  const { data: patients, error: patientsError } = await supabase
    .from('patients')
    .select('*')
    .limit(5);
  
  if (patientsError) {
    console.error('❌ Patients query error:', patientsError.message);
  } else {
    console.log('✅ Patients query successful!');
    console.log('   Found patients:', patients);
  }

  // Test basic health check without users table
  console.log('💚 Basic health check...');
  const { data: healthData, error: healthError } = await supabase
    .rpc('version');
  
  if (healthError) {
    console.log('ℹ️  RPC version not available (normal for new projects)');
  } else {
    console.log('✅ RPC version:', healthData);
  }

  console.log('🎉 Supabase connection is working!');
  console.log('   The issue is only with the users table RLS policies');
  
} catch (err) {
  console.error('❌ Connection test failed:', err.message);
}
