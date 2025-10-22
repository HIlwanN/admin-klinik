-- Update Users: Hanya 2 Admin dengan Email dan Password Baru
-- admin1@hemodialisa.com & admin2@hemodialisa.com
-- Password: admin123

-- 1. Hapus semua user yang ada
DELETE FROM users;

-- 2. Insert 2 admin baru dengan credential yang ditentukan
-- Email: admin1@hemodialisa.com & admin2@hemodialisa.com
-- Password: admin123 (untuk kedua user)
-- Password hash (bcrypt): $2b$10$jAQoDTRwKuK6ORnmpHWAROjSV0.93rsdkjh7YlISUbT/VzpE5Dz.m

INSERT INTO users (
  username,
  email,
  password_hash,
  full_name,
  role,
  shift,
  is_active
) VALUES 
(
  'admin1',
  'admin1@hemodialisa.com',
  '$2b$10$jAQoDTRwKuK6ORnmpHWAROjSV0.93rsdkjh7YlISUbT/VzpE5Dz.m',
  'Admin Satu',
  'admin',
  'pagi',
  true
),
(
  'admin2',
  'admin2@hemodialisa.com',
  '$2b$10$jAQoDTRwKuK6ORnmpHWAROjSV0.93rsdkjh7YlISUbT/VzpE5Dz.m',
  'Admin Dua',
  'admin',
  'siang',
  true
);

-- 3. Verifikasi hasil
SELECT 
  id,
  username,
  email,
  full_name,
  role,
  shift,
  is_active,
  created_at
FROM users
ORDER BY username;

