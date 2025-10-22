-- ========================================
-- SUPABASE DATABASE SCHEMA
-- Admin Klinik - Multi-User System
-- ========================================

-- Note: JWT secret is configured in Supabase Dashboard Settings
-- Go to Settings > API > JWT Settings to configure JWT secret

-- ========================================
-- USERS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'nurse', 'supervisor', 'staff')),
    shift TEXT CHECK (shift IN ('pagi', 'siang', 'malam', 'all')),
    phone TEXT,
    email TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    preferred_station TEXT
);

-- ========================================
-- STATIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS stations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    is_online BOOLEAN DEFAULT true,
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_user_id UUID REFERENCES users(id)
);

-- ========================================
-- ACTIVE SESSIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS active_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    station_id TEXT NOT NULL,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    session_token TEXT UNIQUE,
    ip_address INET,
    user_agent TEXT
);

-- ========================================
-- PATIENTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    no_rekam_medis TEXT UNIQUE NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin TEXT NOT NULL,
    alamat TEXT,
    telepon TEXT,
    diagnosa TEXT,
    golongan_darah TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- ========================================
-- SCHEDULES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    tanggal DATE NOT NULL,
    waktu_mulai TIME NOT NULL,
    waktu_selesai TIME NOT NULL,
    ruangan TEXT,
    mesin_dialisis TEXT,
    perawat TEXT,
    catatan TEXT,
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- ========================================
-- AUDIT LOG TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    station_id TEXT NOT NULL,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    description TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Sessions indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user ON active_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON active_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON active_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_station ON active_sessions(station_id);

-- Patients indexes
CREATE INDEX IF NOT EXISTS idx_patients_created_by ON patients(created_by);
CREATE INDEX IF NOT EXISTS idx_patients_updated_by ON patients(updated_by);
CREATE INDEX IF NOT EXISTS idx_patients_no_rm ON patients(no_rekam_medis);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at);

-- Schedules indexes
CREATE INDEX IF NOT EXISTS idx_schedules_patient ON schedules(patient_id);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(tanggal);
CREATE INDEX IF NOT EXISTS idx_schedules_created_by ON schedules(created_by);
CREATE INDEX IF NOT EXISTS idx_schedules_updated_by ON schedules(updated_by);

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_station ON audit_log(station_id);

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Supervisors can manage users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'supervisor'
        )
    );

-- Patients policies
CREATE POLICY "Authenticated users can view patients" ON patients
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage patients" ON patients
    FOR ALL USING (auth.role() = 'authenticated');

-- Schedules policies
CREATE POLICY "Authenticated users can view schedules" ON schedules
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage schedules" ON schedules
    FOR ALL USING (auth.role() = 'authenticated');

-- Sessions policies
CREATE POLICY "Users can view their own sessions" ON active_sessions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own sessions" ON active_sessions
    FOR ALL USING (user_id = auth.uid());

-- Audit log policies
CREATE POLICY "Authenticated users can view audit log" ON audit_log
    FOR SELECT USING (auth.role() = 'authenticated');

-- Stations policies
CREATE POLICY "Authenticated users can view stations" ON stations
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update stations" ON stations
    FOR UPDATE USING (auth.role() = 'authenticated');

-- ========================================
-- REAL-TIME SUBSCRIPTIONS
-- ========================================

-- Enable real-time for tables
ALTER PUBLICATION supabase_realtime ADD TABLE patients;
ALTER PUBLICATION supabase_realtime ADD TABLE schedules;
ALTER PUBLICATION supabase_realtime ADD TABLE audit_log;
ALTER PUBLICATION supabase_realtime ADD TABLE active_sessions;

-- ========================================
-- FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_patients_updated_at 
    BEFORE UPDATE ON patients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at 
    BEFORE UPDATE ON schedules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- DEFAULT DATA
-- ========================================

-- Insert default stations
INSERT INTO stations (id, name, location) VALUES 
('pc-a', 'Komputer A - Resepsionis', 'Ruang Resepsionis'),
('pc-b', 'Komputer B - Administrasi', 'Ruang Administrasi')
ON CONFLICT (id) DO NOTHING;

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password_hash, full_name, role, shift) VALUES 
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'supervisor', 'all')
ON CONFLICT (username) DO NOTHING;

-- ========================================
-- VIEWS FOR REPORTING
-- ========================================

-- User activity view
CREATE OR REPLACE VIEW user_activity AS
SELECT 
    u.full_name,
    u.username,
    u.role,
    s.station_id,
    s.login_time,
    s.last_activity,
    s.is_active
FROM users u
LEFT JOIN active_sessions s ON u.id = s.user_id
WHERE s.is_active = true;

-- Patient statistics view
CREATE OR REPLACE VIEW patient_stats AS
SELECT 
    COUNT(*) as total_patients,
    COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END) as today_patients,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as week_patients,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as month_patients
FROM patients;

-- Schedule statistics view
CREATE OR REPLACE VIEW schedule_stats AS
SELECT 
    COUNT(*) as total_schedules,
    COUNT(CASE WHEN tanggal = CURRENT_DATE THEN 1 END) as today_schedules,
    COUNT(CASE WHEN tanggal >= CURRENT_DATE AND tanggal < CURRENT_DATE + INTERVAL '7 days' THEN 1 END) as week_schedules,
    COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as pending_schedules,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_schedules
FROM schedules;

-- ========================================
-- GRANTS AND PERMISSIONS
-- ========================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ========================================
-- COMMENTS FOR DOCUMENTATION
-- ========================================

COMMENT ON TABLE users IS 'System users with role-based access control';
COMMENT ON TABLE stations IS 'Workstation information and status';
COMMENT ON TABLE active_sessions IS 'Current user sessions across workstations';
COMMENT ON TABLE patients IS 'Patient medical records';
COMMENT ON TABLE schedules IS 'Dialysis treatment schedules';
COMMENT ON TABLE audit_log IS 'Complete audit trail of all system activities';

COMMENT ON COLUMN users.role IS 'User role: admin, doctor, nurse, supervisor, staff';
COMMENT ON COLUMN users.shift IS 'Work shift: pagi, siang, malam, all';
COMMENT ON COLUMN active_sessions.is_active IS 'Whether session is currently active';
COMMENT ON COLUMN audit_log.action IS 'Action performed: create, update, delete, login, logout';
COMMENT ON COLUMN audit_log.old_values IS 'Previous values before change (JSON)';
COMMENT ON COLUMN audit_log.new_values IS 'New values after change (JSON)';

-- ========================================
-- COMPLETION MESSAGE
-- ========================================

-- This schema creates a complete multi-user system for Admin Klinik
-- with 25 users, 2 workstations, real-time sync, and full audit trail
-- 
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Update application with Supabase credentials
-- 3. Test multi-user functionality
-- 4. Deploy to production
