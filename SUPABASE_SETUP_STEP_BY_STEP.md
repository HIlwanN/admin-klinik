# 🚀 SUPABASE SETUP - Step by Step Guide

Panduan lengkap setup Supabase untuk Admin Klinik Multi-User System.

## 📋 **STEP 1: Buat Akun Supabase**

### 1.1 Daftar Akun
```bash
# 1. Buka https://supabase.com
# 2. Klik "Start your project"
# 3. Pilih "Sign up with GitHub" atau "Sign up with Google"
# 4. Isi form pendaftaran
# 5. Verifikasi email jika diperlukan
```

### 1.2 Login ke Dashboard
```bash
# 1. Login ke https://supabase.com/dashboard
# 2. Anda akan melihat dashboard Supabase
```

---

## 🎯 **STEP 2: Buat Project Baru**

### 2.1 Create New Project
```bash
# 1. Klik "New Project" (tombol hijau di kanan atas)
# 2. Isi form:
#    - Name: "Admin Klinik"
#    - Database Password: [buat password kuat, simpan!]
#    - Region: "Southeast Asia (Singapore)" [pilih yang terdekat]
# 3. Klik "Create new project"
# 4. Tunggu 2-3 menit sampai setup selesai
```

### 2.2 Tunggu Setup Selesai
```bash
# Status akan berubah dari "Setting up your project" 
# menjadi "Your project is ready"
# Biasanya butuh 2-3 menit
```

---

## 🔑 **STEP 3: Dapatkan API Credentials**

### 3.1 Buka Project Settings
```bash
# 1. Di dashboard, klik nama project "Admin Klinik"
# 2. Klik "Settings" (icon gear di sidebar kiri)
# 3. Klik "API" di menu settings
```

### 3.2 Copy Credentials
```bash
# Anda akan melihat:
# - Project URL: https://xxxxx.supabase.co
# - anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# COPY KEDUA NILAI INI!
# Simpan di notepad atau file text
```

### 3.3 Contoh Credentials
```env
# Contoh yang akan Anda dapatkan:
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2MjQwMCwiZXhwIjoyMDE0MzM4NDAwfQ.example_key_here
```

---

## 🗄️ **STEP 4: Setup Database Schema**

### 4.1 Buka SQL Editor
```bash
# 1. Di dashboard Supabase, klik "SQL Editor" di sidebar kiri
# 2. Klik "New query"
# 3. Anda akan melihat editor SQL
```

### 4.2 Copy Schema SQL
```bash
# 1. Buka file: supabase-schema.sql
# 2. Copy SEMUA isi file tersebut (Ctrl+A, Ctrl+C)
# 3. Paste ke SQL Editor (Ctrl+V)
```

### 4.3 Run Schema
```bash
# 1. Klik tombol "Run" (atau Ctrl+Enter)
# 2. Tunggu sampai selesai (biasanya 10-30 detik)
# 3. Anda akan melihat "Success" message
```

### 4.4 Verify Tables Created
```sql
-- Jalankan query ini untuk memastikan tabel sudah dibuat:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Harus menampilkan:
-- active_sessions
-- audit_log
-- patients
-- schedules
-- stations
-- users
```

---

## ⚙️ **STEP 5: Configure Application**

### 5.1 Backend Configuration
```bash
# 1. Buka file: backend/.env (buat jika belum ada)
# 2. Copy dari env.example
cp env.example backend/.env

# 3. Edit backend/.env dengan credentials Anda:
```

```env
# backend/.env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
PORT=3000
STATION_ID=pc-a
STATION_NAME="Komputer A - Resepsionis"
STATION_LOCATION="Ruang Resepsionis"
```

### 5.2 Frontend Configuration
```bash
# 1. Buka file: frontend/.env (buat jika belum ada)
# 2. Copy dari frontend/env.example
cp frontend/env.example frontend/.env

# 3. Edit frontend/.env dengan credentials Anda:
```

```env
# frontend/.env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_BASE_URL=/api
VITE_STATION_ID=pc-a
VITE_STATION_NAME="Komputer A - Resepsionis"
VITE_STATION_LOCATION="Ruang Resepsionis"
```

---

## 📦 **STEP 6: Install Dependencies**

### 6.1 Install Backend Dependencies
```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Dependencies yang akan diinstall:
# - @supabase/supabase-js
# - bcryptjs
# - jsonwebtoken
# - express
# - cors
```

### 6.2 Install Frontend Dependencies
```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Dependencies yang akan diinstall:
# - @supabase/supabase-js
# - react
# - react-dom
# - react-router-dom
```

### 6.3 Install Root Dependencies
```bash
# Kembali ke root folder
cd ..

# Install dependencies
npm install

# Dependencies yang akan diinstall:
# - electron
# - electron-builder
# - concurrently
# - cross-env
```

---

## 🧪 **STEP 7: Test Connection**

### 7.1 Test Backend Connection
```bash
# Masuk ke folder backend
cd backend

# Test connection
node -e "
import db from './config/supabase.js';
db.healthCheck().then(result => {
  console.log('✅ Database connection:', result);
  process.exit(0);
}).catch(err => {
  console.error('❌ Connection failed:', err);
  process.exit(1);
});
"
```

### 7.2 Expected Output
```bash
# Jika berhasil, Anda akan melihat:
✅ Database connection: { healthy: true, timestamp: '2024-01-01T00:00:00.000Z' }
```

### 7.3 Test Frontend Connection
```bash
# Masuk ke folder frontend
cd frontend

# Start development server
npm run dev

# Buka browser ke http://localhost:5173
# Cek console untuk error
```

---

## 🚀 **STEP 8: Start Application**

### 8.1 Development Mode
```bash
# Dari root folder, jalankan:
npm run dev

# Atau jalankan manual:
# Terminal 1: cd backend && npm run dev
# Terminal 2: cd frontend && npm run dev
# Terminal 3: npm run electron:dev
```

### 8.2 Production Mode
```bash
# Build aplikasi
npm run build

# Build Electron app
npm run electron:build:win

# File .exe akan ada di folder dist/
```

---

## 👥 **STEP 9: Create Users**

### 9.1 Default Admin User
```sql
-- Default admin sudah dibuat otomatis:
-- Username: admin
-- Password: admin123
-- Role: supervisor
```

### 9.2 Create Additional Users
```sql
-- Jalankan di SQL Editor untuk membuat user tambahan:

-- Doctor users
INSERT INTO users (username, password_hash, full_name, role, shift) VALUES 
('dr_ahmad', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Ahmad Santoso', 'doctor', 'pagi'),
('dr_siti', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. Siti Nurhaliza', 'doctor', 'siang');

-- Admin users
INSERT INTO users (username, password_hash, full_name, role, shift) VALUES 
('admin_john', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Anderson', 'admin', 'pagi'),
('admin_sarah', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah Johnson', 'admin', 'siang');

-- Nurse users
INSERT INTO users (username, password_hash, full_name, role, shift) VALUES 
('nurse_anna', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nurse Anna Pratiwi', 'nurse', 'pagi'),
('nurse_lisa', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nurse Lisa Permata', 'nurse', 'siang');
```

**Note:** Semua password di atas adalah `admin123`

---

## 🔧 **STEP 10: Configure Stations**

### 10.1 Check Default Stations
```sql
-- Jalankan query ini untuk melihat stations:
SELECT * FROM stations;

-- Harus menampilkan:
-- pc-a: Komputer A - Resepsionis
-- pc-b: Komputer B - Administrasi
```

### 10.2 Update Station Configuration
```bash
# Untuk PC-A, edit backend/.env:
STATION_ID=pc-a
STATION_NAME="Komputer A - Resepsionis"
STATION_LOCATION="Ruang Resepsionis"

# Untuk PC-B, edit backend/.env:
STATION_ID=pc-b
STATION_NAME="Komputer B - Administrasi"
STATION_LOCATION="Ruang Administrasi"
```

---

## 🧪 **STEP 11: Test Multi-User System**

### 11.1 Test Login
```bash
# 1. Start aplikasi: npm run dev
# 2. Buka browser ke http://localhost:5173
# 3. Klik "Quick Login"
# 4. Login dengan admin/admin123
# 5. Cek apakah dashboard muncul
```

### 11.2 Test User Management
```bash
# 1. Login sebagai admin
# 2. Klik "User Management" di menu
# 3. Coba tambah user baru
# 4. Coba edit user existing
# 5. Coba delete user
```

### 11.3 Test Real-time Features
```bash
# 1. Buka 2 browser tab
# 2. Login dengan user berbeda di masing-masing tab
# 3. Coba tambah/edit data di tab 1
# 4. Cek apakah perubahan muncul di tab 2
```

---

## 🔍 **STEP 12: Troubleshooting**

### 12.1 Common Issues

**❌ Connection Failed**
```bash
# Check .env files
# Verify SUPABASE_URL and SUPABASE_ANON_KEY
# Test internet connection
```

**❌ Authentication Failed**
```bash
# Check user exists in database
# Verify password hash
# Check user is_active = true
```

**❌ Real-time Not Working**
```bash
# Check Supabase realtime is enabled
# Verify RLS policies
# Check network connectivity
```

### 12.2 Debug Commands
```bash
# Check database health
curl http://localhost:3000/api/health

# Check active sessions
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/sessions

# Check audit log
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/audit
```

---

## ✅ **STEP 13: Success Checklist**

- [ ] ✅ Supabase account created
- [ ] ✅ Project created successfully
- [ ] ✅ API credentials obtained
- [ ] ✅ Database schema deployed
- [ ] ✅ Environment files configured
- [ ] ✅ Dependencies installed
- [ ] ✅ Backend connection tested
- [ ] ✅ Frontend connection tested
- [ ] ✅ Application starts successfully
- [ ] ✅ Default users created
- [ ] ✅ Login/logout works
- [ ] ✅ User management works
- [ ] ✅ Real-time sync works
- [ ] ✅ Multi-user access works

---

## 🎉 **CONGRATULATIONS!**

**Sistem multi-user Admin Klinik Anda sudah siap digunakan!**

### **✅ Yang Sudah Tersedia:**
- 👥 **25 admin users** bisa login
- 💻 **2 workstations** dengan real-time sync
- 🔐 **Secure authentication** dengan JWT
- 📊 **Complete audit trail** untuk semua aktivitas
- 🎯 **Role-based access control**
- ⚡ **Real-time updates** antar workstation
- 🛡️ **Session management** dengan auto-logout
- 📱 **Modern UI/UX** yang responsive

### **🚀 Next Steps:**
1. **Deploy ke 2 PC** - Install aplikasi di workstation
2. **Configure stations** - Set PC-A dan PC-B
3. **Train users** - Ajarkan cara login dan menggunakan sistem
4. **Monitor usage** - Pantau aktivitas melalui dashboard
5. **Backup data** - Supabase otomatis backup, tapi bisa export manual

**Sistem siap untuk production! 🎊**
