-- ========================================
-- FIX PASSWORD HASH FOR ALL USERS
-- ========================================

-- Update all users with correct password hash for 'admin123'
UPDATE users 
SET password_hash = '$2a$10$FY30Oz6yM8qPV21eOMD9Ae861tb84tSfc3ARf9J56rF6z6uEkO1kC'
WHERE username IN (
  'admin', 'dr_ahmad', 'dr_siti', 'admin_john', 'admin_sarah', 
  'nurse_anna', 'nurse_lisa', 'supervisor_manager', 'staff_reception'
);

-- Verify update
SELECT username, full_name, role, 
       CASE 
         WHEN password_hash = '$2a$10$FY30Oz6yM8qPV21eOMD9Ae861tb84tSfc3ARf9J56rF6z6uEkO1kC' 
         THEN 'CORRECT HASH' 
         ELSE 'WRONG HASH' 
       END as hash_status
FROM users 
ORDER BY username;
