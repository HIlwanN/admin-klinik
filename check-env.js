import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, 'backend', '.env');

console.log('🔍 Checking for backend/.env file...');
console.log('   Path:', envPath);

if (!fs.existsSync(envPath)) {
  console.error('❌ .env file NOT FOUND!');
  console.error('   Please create backend/.env with your Supabase credentials');
  console.error('   Copy from backend/env.example and fill in your values');
  process.exit(1);
}

console.log('✓ .env file found');

// Validate content
const envContent = fs.readFileSync(envPath, 'utf-8');
const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'JWT_SECRET'];
const missing = [];

requiredVars.forEach(key => {
  const regex = new RegExp(`^${key}=(.+)$`, 'm');
  const match = envContent.match(regex);
  if (!match || !match[1] || match[1].trim() === '') {
    missing.push(key);
  }
});

if (missing.length > 0) {
  console.error('❌ Missing or empty required variables:', missing.join(', '));
  process.exit(1);
}

console.log('✓ All required environment variables are set');
console.log('   Ready to build!');


