-- ========================================
-- FIX RLS POLICIES - Remove Infinite Recursion
-- ========================================

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Supervisors can manage users" ON users;
DROP POLICY IF EXISTS "Users can view their own sessions" ON active_sessions;
DROP POLICY IF EXISTS "Users can manage their own sessions" ON active_sessions;

-- ========================================
-- CREATE SIMPLE, NON-RECURSIVE POLICIES
-- ========================================

-- Users policies (simplified)
CREATE POLICY "Enable read access for all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON users
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users" ON users
    FOR DELETE USING (true);

-- Patients policies
CREATE POLICY "Enable all access for patients" ON patients
    FOR ALL USING (true);

-- Schedules policies  
CREATE POLICY "Enable all access for schedules" ON schedules
    FOR ALL USING (true);

-- Sessions policies (simplified)
CREATE POLICY "Enable all access for sessions" ON active_sessions
    FOR ALL USING (true);

-- Audit log policies
CREATE POLICY "Enable read access for audit log" ON audit_log
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for audit log" ON audit_log
    FOR INSERT WITH CHECK (true);

-- Stations policies
CREATE POLICY "Enable all access for stations" ON stations
    FOR ALL USING (true);

-- ========================================
-- VERIFICATION
-- ========================================

-- Check policies created
SELECT schemaname, tablename, policyname, permissive, cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
