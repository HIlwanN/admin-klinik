-- ========================================
-- FIX USERS TABLE RLS ONLY
-- ========================================

-- Disable RLS on users table only
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Supervisors can manage users" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON users;

-- Insert default data if not exists
INSERT INTO stations (id, name, location) VALUES 
('pc-a', 'Komputer A - Resepsionis', 'Ruang Resepsionis'),
('pc-b', 'Komputer B - Administrasi', 'Ruang Administrasi')
ON CONFLICT (id) DO NOTHING;

-- Insert default admin user if not exists
INSERT INTO users (username, password_hash, full_name, role, shift) VALUES 
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'supervisor', 'all')
ON CONFLICT (username) DO NOTHING;

-- Verify data
SELECT 'Stations:' as table_name, count(*) as count FROM stations
UNION ALL
SELECT 'Users:', count(*) FROM users;
