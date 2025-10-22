# 🚀 Deploy ke Vercel + Supabase (LENGKAP)

## 🎯 Overview

Sistem ini akan di-deploy dengan arsitektur:
- **Frontend** → Vercel (Hosting)
- **Backend** → Vercel Serverless Functions
- **Database** → Supabase (PostgreSQL Cloud)

## ✅ Keuntungan Setup Ini

| Fitur | Keuntungan |
|-------|------------|
| **2 Device Sync** | ✅ Real-time, instant sync via Supabase |
| **Akses Global** | ✅ Bisa diakses dari mana saja (internet) |
| **Zero Configuration** | ✅ Tidak perlu setup network/firewall |
| **Auto Backup** | ✅ Supabase handle backup otomatis |
| **Scalable** | ✅ Bisa handle banyak user |
| **HTTPS** | ✅ Secure by default |
| **Cost** | ✅ **GRATIS** untuk usage normal! |

---

## 📋 Prerequisites

1. **Akun GitHub** (untuk source code)
2. **Akun Vercel** (gratis di vercel.com)
3. **Akun Supabase** (gratis di supabase.com)

---

## 🗂️ STEP 1: Setup Supabase Database

### 1.1. Buat Project Supabase

```bash
# 1. Buka https://supabase.com
# 2. Sign Up/Login
# 3. Klik "New Project"

Nama Project: adminklinik
Database Password: [buat password kuat, simpan!]
Region: Southeast Asia (Singapore) ← pilih yang terdekat
```

### 1.2. Copy Credentials

Setelah project dibuat (~2 menit):

```bash
# Buka Project Settings > API

📝 Copy ini:
- Project URL: https://xxxxx.supabase.co
- Anon/Public Key: eyJhbGc...
- Service Role Key: eyJhbGc... (keep secret!)
```

### 1.3. Buat Database Tables

```sql
-- Buka SQL Editor di Supabase Dashboard
-- Copy-paste SQL ini dan Run:

-- ==================== PATIENTS TABLE ====================
CREATE TABLE IF NOT EXISTS patients (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  no_rekam_medis TEXT UNIQUE NOT NULL,
  tanggal_lahir TEXT NOT NULL,
  jenis_kelamin TEXT NOT NULL,
  alamat TEXT,
  telepon TEXT,
  diagnosa TEXT,
  golongan_darah TEXT,
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_patients_no_rm ON patients(no_rekam_medis);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at);

-- ==================== SCHEDULES TABLE ====================
CREATE TABLE IF NOT EXISTS schedules (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  waktu_mulai TIME NOT NULL,
  waktu_selesai TIME NOT NULL,
  ruangan TEXT,
  mesin_dialisis TEXT,
  perawat TEXT,
  catatan TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_schedules_patient ON schedules(patient_id);
CREATE INDEX IF NOT EXISTS idx_schedules_tanggal ON schedules(tanggal);
CREATE INDEX IF NOT EXISTS idx_schedules_status ON schedules(status);

-- ==================== USERS TABLE ====================
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ==================== AUDIT LOG TABLE ====================
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id BIGINT,
  old_values JSONB,
  new_values JSONB,
  description TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- ==================== SESSIONS TABLE ====================
CREATE TABLE IF NOT EXISTS sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
```

### 1.4. Setup RLS (Row Level Security) - PENTING!

```sql
-- Enable RLS untuk keamanan
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow semua untuk service role (backend)
-- Ini supaya backend bisa CRUD via service role key

CREATE POLICY "Allow all for service role" ON patients
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow all for service role" ON schedules
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow all for service role" ON users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow all for service role" ON audit_logs
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow all for service role" ON sessions
  FOR ALL USING (auth.role() = 'service_role');
```

### 1.5. Insert Default User

```sql
-- Insert default admin user
-- Password: admin123 (hash bcrypt)
INSERT INTO users (username, password_hash, full_name, role)
VALUES (
  'admin',
  '$2b$10$YourBcryptHashHere', -- Ganti dengan hash yang benar
  'Administrator',
  'super_admin'
);

-- Untuk generate hash password:
-- Gunakan tool online: https://bcrypt-generator.com/
-- Atau via Node.js:
```

**Generate Password Hash:**
```javascript
// Jalankan di terminal backend:
const bcrypt = require('bcrypt');
const hash = bcrypt.hashSync('admin123', 10);
console.log(hash);
// Copy hash yang dihasilkan dan masukkan ke query SQL
```

---

## 📦 STEP 2: Persiapan Code untuk Vercel

### 2.1. Update Backend untuk Supabase

```javascript
// backend/server.js - Pastikan sudah pakai Supabase
const db = require('./config/supabase'); // ← Pakai Supabase
```

### 2.2. Buat vercel.json di Root Project

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2.3. Update Frontend API Base URL

```javascript
// frontend/src/config/api.js (buat file ini jika belum ada)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export default API_BASE_URL;
```

```javascript
// Update semua fetch calls di frontend
// Dari:
fetch('/api/patients', ...)

// Jadi:
import API_BASE_URL from './config/api';
fetch(`${API_BASE_URL}/patients`, ...)
```

### 2.4. Update package.json Scripts

```json
// frontend/package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

```json
// backend/package.json  
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## 🚢 STEP 3: Deploy ke Vercel

### 3.1. Push Code ke GitHub

```bash
# 1. Init git (jika belum)
git init

# 2. Add gitignore
echo "node_modules
.env
*.db
dist
.vercel" > .gitignore

# 3. Commit
git add .
git commit -m "Prepare for Vercel deployment with Supabase"

# 4. Create repo di GitHub
# Buka github.com > New Repository > adminklinik

# 5. Push
git remote add origin https://github.com/username/adminklinik.git
git branch -M main
git push -u origin main
```

### 3.2. Deploy via Vercel Dashboard

```bash
# 1. Buka https://vercel.com
# 2. Login dengan GitHub
# 3. Klik "Add New..." > "Project"
# 4. Import your GitHub repo: adminklinik
# 5. Configure:

Framework Preset: Vite
Root Directory: ./
Build Command: cd frontend && npm install && npm run build
Output Directory: frontend/dist
Install Command: npm install

# 6. Environment Variables (PENTING!)
```

**Environment Variables di Vercel:**
```
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_ANON_KEY = eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc...
JWT_SECRET = your-random-secret-key-123
NODE_ENV = production
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
# 7. Klik "Deploy"
# 8. Tunggu ~2-3 menit
# 9. Done! URL: https://adminklinik.vercel.app
```

---

## ✅ STEP 4: Test Deployment

### 4.1. Akses Aplikasi

```
URL: https://adminklinik.vercel.app

Login:
Username: admin
Password: admin123
```

### 4.2. Test Auto-Scheduler

```
1. Buka "Data Pasien" > Tambah beberapa pasien
2. Buka "🤖 Jadwal Otomatis"
3. Set parameter:
   - Tanggal Mulai: 2024-01-01
   - Tanggal Selesai: 2024-01-31
   - Shift: Semua Shift
   - Max Pasien: 3
4. Klik "Buat Jadwal Otomatis"
5. Jadwal akan ter-generate!
```

### 4.3. Test 2 Device Real-Time Sync

```
Device 1:
  → Buka https://adminklinik.vercel.app
  → Login sebagai admin
  → Buat jadwal

Device 2 (Komputer/HP lain):
  → Buka https://adminklinik.vercel.app
  → Login dengan akun berbeda (atau sama)
  → Lihat jadwal muncul otomatis (10 detik)
```

---

## 🎨 STEP 5: Customisasi (Optional)

### 5.1. Custom Domain

```bash
# Di Vercel Dashboard:
# Settings > Domains > Add Domain
# Contoh: adminklinik.com

# Update DNS di registrar domain:
# Type: CNAME
# Name: @ atau www
# Value: cname.vercel-dns.com
```

### 5.2. Update Branding

```javascript
// frontend/src/App.jsx
<h1>Sistem Manajemen [Nama Klinik Anda]</h1>
```

### 5.3. Add More Users

```sql
-- Di Supabase SQL Editor:
INSERT INTO users (username, password_hash, full_name, role)
VALUES 
  ('admin_ruang1', '[hash]', 'Admin Ruang 1', 'admin'),
  ('admin_ruang2', '[hash]', 'Admin Ruang 2', 'admin');
```

---

## 📊 STEP 6: Monitoring & Maintenance

### 6.1. Monitor Vercel

```
Vercel Dashboard > Your Project > Analytics
  - Page views
  - Errors
  - Performance
```

### 6.2. Monitor Supabase

```
Supabase Dashboard > Your Project
  - Database > Tables (lihat data)
  - API > Logs (lihat errors)
  - Reports > Usage (cek quota)
```

### 6.3. Backup Data

```sql
-- Export via Supabase Dashboard
-- Database > Backups > Download
-- Atau via SQL:
COPY patients TO STDOUT WITH CSV HEADER;
```

---

## 🚨 Troubleshooting

### Error: "Failed to fetch"

**Cause**: CORS atau API URL salah

**Solution**:
```javascript
// backend/server.js
app.use(cors({
  origin: ['https://adminklinik.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

### Error: "Unauthorized" atau "Invalid token"

**Cause**: JWT secret mismatch

**Solution**:
- Pastikan JWT_SECRET sama di Vercel dan local
- Re-deploy dengan env variable yang benar

### Error: "relation does not exist"

**Cause**: Table belum dibuat di Supabase

**Solution**:
- Jalankan ulang SQL create table di Supabase
- Cek nama tabel case-sensitive (lowercase)

### Auto-scheduler tidak bisa generate

**Cause**: Tidak ada data pasien

**Solution**:
- Tambah data pasien via UI atau SQL
- Cek Supabase table "patients" ada data

---

## 💰 Cost Estimate (Gratis!)

### Vercel Free Tier
```
✅ 100GB Bandwidth/month
✅ Unlimited deployments
✅ HTTPS included
✅ Custom domain (1)
```

### Supabase Free Tier
```
✅ 500MB Database storage
✅ 2GB File storage
✅ 50,000 Monthly Active Users
✅ Unlimited API requests
✅ Auto backups (7 days)
```

**Total Cost: $0/month** (sampai scale besar!)

---

## 📱 Akses Multi-Device

### Scenario 1: 2 Komputer Berbeda

```
Komputer 1 (Admin Utama):
  → https://adminklinik.vercel.app
  → Login sebagai admin_ruang1
  → Kelola jadwal

Komputer 2 (Admin Pendukung):
  → https://adminklinik.vercel.app
  → Login sebagai admin_ruang2
  → Monitor jadwal real-time
```

### Scenario 2: Komputer + Mobile

```
Komputer (Desktop):
  → https://adminklinik.vercel.app
  → Full features

Handphone (Mobile):
  → https://adminklinik.vercel.app
  → Responsive, semua fitur available
```

---

## 🔐 Security Best Practices

### 1. Change Default Password

```sql
-- Ganti password default admin
UPDATE users 
SET password_hash = '[new_bcrypt_hash]'
WHERE username = 'admin';
```

### 2. Enable RLS Policies

```sql
-- Sudah disetup di step 1.4
-- Pastikan RLS enabled untuk semua tables
```

### 3. Rotate JWT Secret

```bash
# Generate secret baru setiap 3-6 bulan
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update di Vercel env variables
# Re-deploy
```

### 4. Monitor Logs

```
Vercel > Logs
Supabase > API Logs
```

---

## 🎉 Selesai!

Sistem Anda sekarang:
- ✅ **Hosted di Vercel** (production-ready)
- ✅ **Database di Supabase** (cloud PostgreSQL)
- ✅ **2 Device Real-Time Sync** (instant sync)
- ✅ **Auto-Scheduler** (generate jadwal otomatis)
- ✅ **HTTPS Secure**
- ✅ **Gratis** (free tier cukup untuk klinik)

**URL Production**: `https://adminklinik.vercel.app`

---

## 📞 Quick Reference

### URLs
- **App**: https://adminklinik.vercel.app
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com

### Credentials (Change in Production!)
- **Username**: admin
- **Password**: admin123

### Support Files
- `SETUP_2_DEVICES.md` - Setup guide
- `AUTO_SCHEDULING_GUIDE.md` - Auto-scheduler guide
- `SUPABASE_SETUP_GUIDE.md` - Supabase details

---

**Happy Deployment! 🚀**

