-- ========================================
-- ADD DEFAULT USERS FOR TESTING
-- ========================================

-- Disable RLS on users table for easier access
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Insert default admin user
INSERT INTO users (username, password_hash, full_name, role, shift) VALUES 
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'supervisor', 'all')
ON CONFLICT (username) DO NOTHING;

-- Insert additional test users
INSERT INTO users (username, password_hash, full_name, role, shift) VALUES 
('dr_ahmad', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Ahmad Santoso', 'doctor', 'pagi'),
('dr_siti', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Siti Nurhaliza', 'doctor', 'siang'),
('admin_john', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Anderson', 'admin', 'pagi'),
('admin_sarah', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah Johnson', 'admin', 'siang'),
('nurse_anna', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nurse Anna Pratiwi', 'nurse', 'pagi'),
('nurse_lisa', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nurse Lisa Permata', 'nurse', 'siang'),
('supervisor_manager', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Manager Klinik', 'supervisor', 'all'),
('staff_reception', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Receptionist', 'staff', 'all')
ON CONFLICT (username) DO NOTHING;

-- Insert default stations
INSERT INTO stations (id, name, location) VALUES 
('pc-a', 'Komputer A - Resepsionis', 'Ruang Resepsionis'),
('pc-b', 'Komputer B - Administrasi', 'Ruang Administrasi')
ON CONFLICT (id) DO NOTHING;

-- Verify data inserted
SELECT 'Users created:' as info, count(*) as count FROM users
UNION ALL
SELECT 'Stations created:', count(*) FROM stations;

-- Show all users
SELECT username, full_name, role, shift, is_active FROM users ORDER BY created_at;
