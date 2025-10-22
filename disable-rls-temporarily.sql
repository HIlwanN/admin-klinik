-- ========================================
-- DISABLE RLS TEMPORARILY FOR TESTING
-- ========================================

-- Disable RLS on all tables temporarily
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE stations DISABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE schedules DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to clean up
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Supervisors can manage users" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON users;

DROP POLICY IF EXISTS "Authenticated users can view patients" ON patients;
DROP POLICY IF EXISTS "Authenticated users can manage patients" ON patients;
DROP POLICY IF EXISTS "Enable all access for patients" ON patients;

DROP POLICY IF EXISTS "Authenticated users can view schedules" ON schedules;
DROP POLICY IF EXISTS "Authenticated users can manage schedules" ON schedules;
DROP POLICY IF EXISTS "Enable all access for schedules" ON schedules;

DROP POLICY IF EXISTS "Users can view their own sessions" ON active_sessions;
DROP POLICY IF EXISTS "Users can manage their own sessions" ON active_sessions;
DROP POLICY IF EXISTS "Enable all access for sessions" ON active_sessions;

DROP POLICY IF EXISTS "Authenticated users can view audit log" ON audit_log;
DROP POLICY IF EXISTS "Enable read access for audit log" ON audit_log;
DROP POLICY IF EXISTS "Enable insert for audit log" ON audit_log;

DROP POLICY IF EXISTS "Authenticated users can view stations" ON stations;
DROP POLICY IF EXISTS "Authenticated users can update stations" ON stations;
DROP POLICY IF EXISTS "Enable all access for stations" ON stations;

-- Verify no policies remain
SELECT schemaname, tablename, policyname
FROM pg_policies 
WHERE schemaname = 'public';
