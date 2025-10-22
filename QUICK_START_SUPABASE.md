# ⚡ Quick Start dengan Supabase (5 Menit!)

## 🎯 Yang Anda Butuhkan

1. ✅ Akun Supabase (gratis)
2. ✅ Source code ini
3. ✅ Node.js terinstall

---

## 📝 Step-by-Step (Super Simple!)

### STEP 1: Setup Supabase (2 menit)

```bash
# 1. Buka https://supabase.com
# 2. Sign up (gratis)
# 3. Klik "New Project"

Isi form:
  - Name: adminklinik
  - Database Password: [buat password kuat]
  - Region: Southeast Asia (Singapore)
  
# 4. Klik "Create new project"
# 5. Tunggu ~2 menit sampai project ready
```

### STEP 2: Copy Credentials (30 detik)

```bash
# Di Supabase Dashboard:
# Settings > API

Copy 3 hal ini:
1. Project URL: https://xxx.supabase.co
2. Anon/Public Key: eyJhbGc...
3. Service Role Key: eyJhbGc...
```

### STEP 3: Setup Database Tables (1 menit)

```bash
# Di Supabase Dashboard:
# SQL Editor > New Query

# Copy-paste SQL ini dan RUN:
```

```sql
-- Patients
CREATE TABLE patients (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  no_rekam_medis TEXT UNIQUE NOT NULL,
  tanggal_lahir TEXT NOT NULL,
  jenis_kelamin TEXT NOT NULL,
  alamat TEXT,
  telepon TEXT,
  diagnosa TEXT,
  golongan_darah TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schedules
CREATE TABLE schedules (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT REFERENCES patients(id) ON DELETE CASCADE,
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

-- Users
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy untuk allow backend access
CREATE POLICY "Allow service role" ON patients FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role" ON schedules FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role" ON users FOR ALL USING (auth.role() = 'service_role');
```

### STEP 4: Setup Environment Variables (30 detik)

```bash
# Di folder backend, buat file .env

cd backend
cp env.example .env
nano .env  # atau buka dengan text editor
```

Isi file `.env`:
```
SUPABASE_URL=https://xxx.supabase.co          ← Paste dari step 2
SUPABASE_ANON_KEY=eyJhbGc...                  ← Paste dari step 2
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...          ← Paste dari step 2
JWT_SECRET=random-secret-123-change-this      ← Ganti dengan random string
NODE_ENV=development
```

### STEP 5: Install & Run (1 menit)

```bash
# Install dependencies
cd backend
npm install

cd ../frontend
npm install

# Jalankan backend
cd ../backend
npm start
# ✅ Backend running di http://localhost:3000

# Terminal baru - Jalankan frontend
cd frontend
npm run dev
# ✅ Frontend running di http://localhost:5173
```

### STEP 6: Create First User (30 detik)

```bash
# Di Supabase SQL Editor, jalankan:

INSERT INTO users (username, password_hash, full_name, role)
VALUES (
  'admin',
  '$2b$10$YourHashedPasswordHere',
  'Administrator',
  'admin'
);
```

**Generate password hash:**
```bash
# Di terminal backend:
cd backend
node -e "const bcrypt = require('bcrypt'); console.log(bcrypt.hashSync('admin123', 10));"

# Copy hash yang dihasilkan dan paste ke SQL query
```

### STEP 7: Login & Test! 🎉

```
1. Buka: http://localhost:5173
2. Login:
   Username: admin
   Password: admin123
3. Test auto-scheduler:
   - Tambah beberapa pasien
   - Buka "🤖 Jadwal Otomatis"
   - Generate jadwal!
```

---

## ✅ Selesai!

**Sistem sudah jalan dengan Supabase!**

### Test 2 Device:

```
Device 1: http://localhost:5173 (Tab 1)
Device 2: http://localhost:5173 (Tab 2)

Buat jadwal di Device 1 → Muncul di Device 2 (10 detik)
```

---

## 🚀 Deploy ke Vercel (Optional)

Baca: `VERCEL_SUPABASE_DEPLOYMENT.md`

Quick steps:
1. Push code ke GitHub
2. Import ke Vercel
3. Set environment variables
4. Deploy!

URL: `https://adminklinik.vercel.app`

---

## 🆘 Troubleshooting

### Error: "Invalid API key"
→ Cek `.env`, pastikan SUPABASE keys benar

### Error: "relation does not exist"  
→ Jalankan ulang SQL create tables di Supabase

### Error: "Failed to fetch"
→ Pastikan backend running di port 3000

### Blank screen setelah login
→ Cek console browser untuk error

---

## 📚 Dokumentasi Lengkap

- **Full Deployment**: `VERCEL_SUPABASE_DEPLOYMENT.md`
- **Auto-Scheduler**: `AUTO_SCHEDULING_GUIDE.md`
- **2 Device Setup**: `SETUP_2_DEVICES.md`

---

**Total waktu: ~5 menit!** ⚡

Sistem sudah siap pakai dengan:
- ✅ Supabase Cloud Database
- ✅ Auto-Scheduler
- ✅ Real-time 2 Device Sync
- ✅ Gratis!

**Selamat mencoba! 🎉**

