# 🚀 Supabase Setup Guide - Admin Klinik Multi-User

Panduan lengkap setup Supabase untuk sistem multi-user 25 admin, 2 PC.

## 📋 Prerequisites

- ✅ Supabase account (free)
- ✅ Internet connection
- ✅ 5-10 minutes setup time

---

## 🎯 Step 1: Create Supabase Project

### 1.1 Sign Up & Create Project

```bash
# 1. Go to https://supabase.com
# 2. Click "Start your project"
# 3. Sign up with GitHub/Google/Email
# 4. Click "New Project"
# 5. Fill in:
#    - Name: "Admin Klinik"
#    - Database Password: [strong password]
#    - Region: [choose closest to your location]
# 6. Click "Create new project"
# 7. Wait 2-3 minutes for setup
```

### 1.2 Get API Credentials

```bash
# 1. Go to Project Settings → API
# 2. Copy these values:
#    - Project URL: https://xxxxx.supabase.co
#    - anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# 3. Save them for later use
```

---

## 🗄️ Step 2: Setup Database Schema

### 2.1 Run SQL Schema

```bash
# 1. Go to SQL Editor in Supabase dashboard
# 2. Copy and paste the entire content of: supabase-schema.sql
# 3. Click "Run" button
# 4. Wait for completion (should show "Success")
```

### 2.2 Verify Tables Created

```sql
-- Run this query to verify tables:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should show:
-- active_sessions
-- audit_log  
-- patients
-- schedules
-- stations
-- users
```

### 2.3 Check Default Data

```sql
-- Check default admin user
SELECT username, full_name, role FROM users;

-- Check default stations
SELECT id, name, location FROM stations;
```

---

## ⚙️ Step 3: Configure Application

### 3.1 Create Environment File

```bash
# 1. Copy env.example to .env
cp env.example .env

# 2. Edit .env file with your Supabase credentials:
```

```env
# .env file content
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
PORT=3000
STATION_ID=pc-a
STATION_NAME="Komputer A - Resepsionis"
STATION_LOCATION="Ruang Resepsionis"
```

### 3.2 Update Station Configuration

**For PC-A:**
```env
STATION_ID=pc-a
STATION_NAME="Komputer A - Resepsionis"
STATION_LOCATION="Ruang Resepsionis"
```

**For PC-B:**
```env
STATION_ID=pc-b
STATION_NAME="Komputer B - Administrasi"
STATION_LOCATION="Ruang Administrasi"
```

---

## 👥 Step 4: Create User Accounts

### 4.1 Default Admin Account

```sql
-- Default admin already created:
-- Username: admin
-- Password: admin123
-- Role: supervisor
```

### 4.2 Create Additional Users

```sql
-- Example: Create doctor user
INSERT INTO users (username, password_hash, full_name, role, shift) VALUES 
('dr_ahmad', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Ahmad Santoso', 'doctor', 'pagi');

-- Example: Create nurse user  
INSERT INTO users (username, password_hash, full_name, role, shift) VALUES 
('nurse_anna', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nurse Anna Pratiwi', 'nurse', 'siang');

-- Example: Create admin user
INSERT INTO users (username, password_hash, full_name, role, shift) VALUES 
('admin_john', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Anderson', 'admin', 'all');
```

**Note:** All example passwords are `admin123` (hashed with bcrypt)

### 4.3 Bulk User Creation Script

```sql
-- Create 25 users for your system
-- Copy and modify this script:

INSERT INTO users (username, password_hash, full_name, role, shift) VALUES 
-- Doctors (3 users)
('dr_ahmad', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Ahmad Santoso', 'doctor', 'pagi'),
('dr_siti', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Siti Nurhaliza', 'doctor', 'siang'),
('dr_budi', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Budi Hartono', 'doctor', 'malam'),

-- Admins (8 users)
('admin_john', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Anderson', 'admin', 'pagi'),
('admin_sarah', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah Johnson', 'admin', 'pagi'),
('admin_mike', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mike Wilson', 'admin', 'siang'),
('admin_lisa', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lisa Brown', 'admin', 'siang'),
('admin_david', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'David Miller', 'admin', 'malam'),
('admin_anna', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Anna Davis', 'admin', 'malam'),
('admin_maria', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Maria Garcia', 'admin', 'all'),
('admin_ahmad', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ahmad Rahman', 'admin', 'all'),

-- Nurses (10 users)
('nurse_anna', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nurse Anna Pratiwi', 'nurse', 'pagi'),
('nurse_lisa', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nurse Lisa Permata', 'nurse', 'pagi'),
('nurse_maria', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nurse Maria Sari', 'nurse', 'siang'),
('nurse_siti', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nurse Siti Aminah', 'nurse', 'siang'),
('nurse_ratna', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nurse Ratna Dewi', 'nurse', 'malam'),
('nurse_dewi', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nurse Dewi Lestari', 'nurse', 'malam'),
('nurse_putri', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nurse Putri Maharani', 'nurse', 'all'),
('nurse_indah', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nurse Indah Sari', 'nurse', 'all'),
('nurse_maya', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nurse Maya Sari', 'nurse', 'all'),
('nurse_rina', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nurse Rina Melati', 'nurse', 'all'),

-- Supervisors (2 users)
('supervisor_manager', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Manager Klinik', 'supervisor', 'all'),
('supervisor_head', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Head Nurse', 'supervisor', 'all'),

-- Staff (2 users)
('staff_reception', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Receptionist', 'staff', 'all'),
('staff_assistant', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Assistant', 'staff', 'all');
```

---

## 🧪 Step 5: Test Setup

### 5.1 Test Database Connection

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Test connection
node -e "
import db from './config/supabase.js';
db.healthCheck().then(result => {
  console.log('Database health:', result);
  process.exit(0);
}).catch(err => {
  console.error('Connection failed:', err);
  process.exit(1);
});
"
```

### 5.2 Test User Authentication

```bash
# Test login with default admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "station_id": "pc-a"
  }'
```

### 5.3 Test Real-time Features

```bash
# Start the application
npm run dev

# Open browser to http://localhost:5173
# Login with admin/admin123
# Test creating/updating patients
# Check if changes appear in real-time
```

---

## 🔧 Step 6: Production Configuration

### 6.1 Security Settings

```sql
-- Update JWT secret in Supabase
-- Go to Settings → API → JWT Settings
-- Set a strong secret key
```

### 6.2 Backup Configuration

```bash
# Supabase automatically backs up your database
# But you can also export data:
# Go to Database → Backups in Supabase dashboard
```

### 6.3 Monitoring

```bash
# Monitor usage in Supabase dashboard:
# - Database → Logs
# - API → Logs  
# - Usage → Statistics
```

---

## 🚀 Step 7: Deploy to Production

### 7.1 Build Application

```bash
# Build for production
npm run build

# Build Electron app
npm run electron:build:win
```

### 7.2 Deploy to Users

```bash
# 1. Install on PC-A
# 2. Configure STATION_ID=pc-a
# 3. Test login

# 4. Install on PC-B  
# 5. Configure STATION_ID=pc-b
# 6. Test login

# 7. Test real-time sync between PCs
```

---

## 🎯 Step 8: User Management

### 8.1 Change Default Passwords

```sql
-- Update admin password (new password: newpass123)
UPDATE users 
SET password_hash = '$2b$10$newhash...' 
WHERE username = 'admin';
```

### 8.2 Add New Users

```sql
-- Add new user via SQL
INSERT INTO users (username, password_hash, full_name, role, shift) VALUES 
('new_user', '$2b$10$hash...', 'New User Name', 'admin', 'pagi');
```

### 8.3 User Management via App

```bash
# Login as supervisor
# Go to User Management section
# Add/edit/delete users through UI
```

---

## 🔍 Troubleshooting

### Common Issues

**1. Connection Failed**
```bash
# Check .env file
# Verify SUPABASE_URL and SUPABASE_ANON_KEY
# Test internet connection
```

**2. Authentication Failed**
```bash
# Check user exists in database
# Verify password hash
# Check user is_active = true
```

**3. Real-time Not Working**
```bash
# Check Supabase realtime is enabled
# Verify RLS policies
# Check network connectivity
```

**4. Permission Denied**
```bash
# Check RLS policies
# Verify user role permissions
# Check session is active
```

### Debug Commands

```bash
# Check database health
curl http://localhost:3000/api/health

# Check active sessions
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/sessions

# Check audit log
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/audit
```

---

## 📊 Monitoring & Analytics

### Supabase Dashboard Features

- ✅ **Real-time metrics** - Active users, requests
- ✅ **Database performance** - Query times, connections
- ✅ **API usage** - Request counts, bandwidth
- ✅ **Error logs** - Failed requests, exceptions
- ✅ **User activity** - Login patterns, usage stats

### Custom Analytics

```sql
-- Daily active users
SELECT DATE(login_time), COUNT(DISTINCT user_id) 
FROM active_sessions 
WHERE login_time >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(login_time);

-- Most active users
SELECT u.full_name, COUNT(*) as activity_count
FROM audit_log a
JOIN users u ON a.user_id = u.id
WHERE a.timestamp >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY u.id, u.full_name
ORDER BY activity_count DESC;
```

---

## 🎉 Success Checklist

- [ ] ✅ Supabase project created
- [ ] ✅ Database schema deployed
- [ ] ✅ Environment configured
- [ ] ✅ Default users created
- [ ] ✅ Application connects to Supabase
- [ ] ✅ Login/logout works
- [ ] ✅ Real-time sync works
- [ ] ✅ Multi-user access works
- [ ] ✅ Audit logging works
- [ ] ✅ Production deployment ready

---

## 🆘 Support

If you encounter issues:

1. **Check Supabase Status**: https://status.supabase.com
2. **Review Logs**: Supabase Dashboard → Logs
3. **Test Connection**: Use health check endpoint
4. **Verify Configuration**: Double-check .env file
5. **Check Network**: Ensure internet connectivity

---

**🎊 Congratulations! Your multi-user Admin Klinik system is ready! 🎊**

**Next:** Deploy to your 2 workstations and start using with 25 admin users! 🚀
