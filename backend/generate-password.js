import bcrypt from 'bcryptjs';

const password = 'admin123';
const saltRounds = 10;

console.log('🔐 Generating password hash for:', password);

try {
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('✅ Generated hash:', hash);
  
  // Test the hash
  const isValid = await bcrypt.compare(password, hash);
  console.log('✅ Hash validation:', isValid);
  
  // Test with existing hash
  const existingHash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
  const isExistingValid = await bcrypt.compare(password, existingHash);
  console.log('❌ Existing hash validation:', isExistingValid);
  
} catch (error) {
  console.error('Error:', error);
}
