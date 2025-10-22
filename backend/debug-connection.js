import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Debugging Supabase connection...');
console.log('📋 Environment variables:');
console.log('   SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('   SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Set (length: ' + process.env.SUPABASE_ANON_KEY.length + ')' : 'Not set');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('❌ Missing environment variables!');
  console.error('   Please check your .env file');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

console.log('🔗 Testing connection...');

try {
  // Test simple query
  const { data, error } = await supabase
    .from('users')
    .select('count')
    .limit(1);
  
  if (error) {
    console.error('❌ Supabase query error:', error.message);
    console.error('   Details:', error);
  } else {
    console.log('✅ Supabase connection successful!');
    console.log('   Query result:', data);
  }
} catch (err) {
  console.error('❌ Connection failed:', err.message);
  console.error('   Full error:', err);
}

// Test network connectivity
console.log('🌐 Testing network connectivity...');
try {
  const response = await fetch(process.env.SUPABASE_URL + '/rest/v1/', {
    headers: {
      'apikey': process.env.SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + process.env.SUPABASE_ANON_KEY
    }
  });
  
  console.log('📡 Network response status:', response.status);
  console.log('📡 Network response ok:', response.ok);
  
  if (response.ok) {
    console.log('✅ Network connectivity is working!');
  } else {
    console.error('❌ Network response not ok');
  }
} catch (err) {
  console.error('❌ Network test failed:', err.message);
  console.error('   This might be a firewall or network issue');
}
