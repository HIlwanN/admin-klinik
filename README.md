# Sistem Manajemen Pasien Cuci Darah

**Aplikasi Desktop** untuk mengelola data dan jadwal pasien cuci darah (hemodialisis) di rumah sakit. Sistem ini dilengkapi dengan fitur CRUD (Create, Read, Update, Delete) lengkap untuk manajemen pasien dan jadwal dialisis.

> 💻 **Aplikasi ini sekarang tersedia sebagai Desktop App** menggunakan Electron!  
> Baca panduan lengkap di [DESKTOP_APP.md](./DESKTOP_APP.md) atau [QUICK_START.md](./QUICK_START.md)

## 🚀 Fitur Utama

### 1. **Dashboard**
- Statistik real-time jumlah pasien dan jadwal
- Ringkasan jadwal hari ini dan mendatang
- Tampilan jadwal terbaru

### 2. **Manajemen Data Pasien**
- ✅ Tambah pasien baru
- ✅ Edit data pasien
- ✅ Hapus data pasien
- ✅ Lihat daftar semua pasien
- ✅ **Download data pasien ke CSV/Excel**
- Data meliputi: Nama, No. Rekam Medis, Tanggal Lahir, Jenis Kelamin, Alamat, Telepon, Diagnosa, Golongan Darah

### 3. **Manajemen Jadwal Cuci Darah**
- ✅ Buat jadwal baru
- ✅ Edit jadwal
- ✅ Hapus jadwal
- ✅ Filter jadwal berdasarkan tanggal
- ✅ Status jadwal (Scheduled, Completed, Cancelled)
- ✅ **Download jadwal ke CSV/Excel**
- Data meliputi: Pasien, Tanggal, Waktu Mulai-Selesai, Ruangan, Mesin Dialisis, Perawat, Catatan

## 🛠️ Teknologi yang Digunakan

### 🖥️ Desktop Application
- **Electron v28** - Framework untuk membangun aplikasi desktop cross-platform (Windows, macOS, Linux)
- **electron-builder v24** - Tool untuk packaging aplikasi menjadi installer (.exe, .dmg, .AppImage)
- **Node.js v18+** - Runtime JavaScript untuk menjalankan backend di dalam aplikasi desktop

### 🎨 Frontend
- **React 18.2** - Library JavaScript untuk membangun UI yang interaktif dan responsif
- **React Router DOM 6.20** - Routing untuk Single Page Application (SPA)
- **Vite 5.0** - Build tool modern yang cepat untuk development dan production
- **CSS3** - Styling dengan gradient, animasi, dan responsive design
- **Fetch API** - Native JavaScript API untuk HTTP requests ke backend

### ⚙️ Backend
- **Node.js v18+** - JavaScript runtime untuk server-side
- **Express.js 4.18** - Web framework untuk membangun REST API
- **Supabase JS Client 2.38** - Client library untuk berinteraksi dengan Supabase database
- **JWT (jsonwebtoken 9.0)** - JSON Web Tokens untuk authentication dan session management
- **bcryptjs 2.4** - Library untuk hashing password dengan salt
- **CORS 2.8** - Middleware untuk Cross-Origin Resource Sharing
- **dotenv 17.2** - Library untuk mengelola environment variables

### 🗄️ Database & Cloud Services
- **PostgreSQL** - Database relasional (hosted di Supabase)
- **Supabase** - Backend-as-a-Service (BaaS) platform yang menyediakan:
  - PostgreSQL database hosting
  - Real-time subscriptions
  - Row Level Security (RLS)
  - REST API otomatis
  - Authentication services

### 🔐 Security & Authentication
- **JWT (JSON Web Tokens)** - Token-based authentication
- **bcryptjs** - Password hashing dengan salt rounds
- **Row Level Security (RLS)** - Database-level security di Supabase
- **CORS** - Cross-Origin Resource Sharing protection

### 📦 Development Tools
- **npm** - Package manager untuk Node.js
- **Git** - Version control system
- **Concurrently 8.2** - Menjalankan multiple npm scripts secara bersamaan
- **cross-env 7.0** - Cross-platform environment variables
- **ES Modules (ESM)** - Modern JavaScript module system

### 🚀 Deployment Options
- **Desktop App** - Portable/Installer untuk Windows (tidak perlu hosting)
- **Vercel** - Platform untuk deploy frontend web application
- **Railway** - Platform cloud untuk deploy backend API
- **Supabase** - Database hosting (gratis tier available)

### 📊 Data Export
- **CSV Format** - Export data pasien dan jadwal ke Excel-compatible format
- **JSON Format** - Data exchange format untuk API

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:
- **Node.js** (versi 18 atau lebih baru) - [Download](https://nodejs.org/)
- **npm** (terinstall bersama Node.js)
- **Git** (untuk clone repository) - [Download](https://git-scm.com/)

### 🗄️ Database: Supabase (Cloud Database)

Sistem ini menggunakan **Supabase** sebagai database cloud. Anda perlu:

1. **Buat akun Supabase** (gratis) di [https://supabase.com](https://supabase.com)
2. **Buat project baru** di Supabase Dashboard
3. **Import database schema**:
   - Buka Supabase Dashboard → SQL Editor
   - Jalankan file `supabase-schema.sql` yang ada di root project
4. **Ambil credentials**:
   - Buka Settings → API
   - Copy `Project URL` dan `anon key`
   - Copy juga `service_role key` (untuk backend)

### ⚙️ Konfigurasi Environment

Setelah clone repository, buat file `backend/.env` dengan isi:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your-random-32-characters-secret-key
NODE_ENV=production
PORT=3000
```

**Catatan penting:**
- Jangan ada spasi sebelum/t setelah `=`
- Jangan ada karakter `@` di depan URL
- Generate JWT_SECRET dengan: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## 🚀 Instalasi dan Menjalankan Aplikasi

### Mode Desktop App (Direkomendasikan) 💻

#### Langkah Instalasi Lengkap

1. **Clone repository**
```bash
git clone https://github.com/your-username/AdminKlinik.git
cd AdminKlinik
```

2. **Setup Supabase Database** (WAJIB)
   - Buat project Supabase baru
   - Import `supabase-schema.sql` ke SQL Editor
   - Ambil credentials (URL, anon key, service_role key)

3. **Buat file `backend/.env`**
```bash
# Copy dari template
cp backend/env.example backend/.env

# Edit file .env dan isi dengan credentials Supabase Anda
```

4. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
npm --prefix frontend install

# Install backend dependencies
npm --prefix backend install
```

5. **Validasi konfigurasi**
```bash
# Cek apakah .env sudah benar
node check-env.js
```

6. **Jalankan aplikasi (Development)**
```bash
npm run dev
```

7. **Build aplikasi desktop (Production)**
```bash
# Windows
npm run electron:build:win

# macOS
npm run electron:build:mac

# Linux
npm run electron:build:linux
```

File installer/portable akan ada di folder `dist-electron3/`

**Baca panduan lengkap**: [DESKTOP_APP.md](./DESKTOP_APP.md) | [QUICK_START.md](./QUICK_START.md)

---

### Mode Web Application (Alternatif) 🌐

#### 1. Install Dependencies

**Backend**
```bash
cd backend
npm install
```

**Frontend**
```bash
cd frontend
npm install
```

#### 2. Menjalankan Aplikasi

**Jalankan Backend (Terminal 1)**
```bash
cd backend
npm start
```
Backend akan berjalan di `http://localhost:3000`

**Jalankan Frontend (Terminal 2)**
```bash
cd frontend
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`

#### 3. Akses Aplikasi

Buka browser dan kunjungi: **http://localhost:5173**

## 📁 Struktur Folder

```
AdminKlinik/
├── backend/
│   ├── database.js          # Konfigurasi database
│   ├── server.js            # API server
│   ├── package.json         # Dependencies backend
│   └── hospital.db          # Database SQLite (auto-generated)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Halaman dashboard
│   │   │   ├── Patients.jsx     # Halaman data pasien
│   │   │   └── Schedules.jsx    # Halaman jadwal
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Patients (Pasien)
- `GET /api/patients` - Ambil semua pasien
- `GET /api/patients/:id` - Ambil pasien berdasarkan ID
- `POST /api/patients` - Tambah pasien baru
- `PUT /api/patients/:id` - Update data pasien
- `DELETE /api/patients/:id` - Hapus pasien
- `GET /api/patients/export/csv` - Download data pasien ke CSV

### Schedules (Jadwal)
- `GET /api/schedules` - Ambil semua jadwal
- `GET /api/schedules/:id` - Ambil jadwal berdasarkan ID
- `GET /api/patients/:id/schedules` - Ambil jadwal berdasarkan pasien
- `POST /api/schedules` - Tambah jadwal baru
- `PUT /api/schedules/:id` - Update jadwal
- `DELETE /api/schedules/:id` - Hapus jadwal
- `GET /api/schedules/export/csv` - Download jadwal ke CSV

## 💡 Cara Menggunakan

### Menambah Pasien Baru
1. Klik menu **"Data Pasien"**
2. Klik tombol **"+ Tambah Pasien"**
3. Isi form dengan data pasien
4. Klik **"Simpan"**

### Membuat Jadwal Cuci Darah
1. Klik menu **"Jadwal Cuci Darah"**
2. Klik tombol **"+ Tambah Jadwal"**
3. Pilih pasien dari dropdown
4. Isi tanggal, waktu, dan detail lainnya
5. Klik **"Simpan"**

### Mengedit Data
- Klik tombol **"Edit"** pada baris data yang ingin diubah
- Ubah data yang diperlukan
- Klik **"Update"**

### Menghapus Data
- Klik tombol **"Hapus"** pada baris data yang ingin dihapus
- Konfirmasi penghapusan

### Download Data ke Excel/CSV
1. **Data Pasien**: Klik tombol **"📥 Download Data"** di halaman Data Pasien
2. **Jadwal**: Klik tombol **"📥 Download"** di halaman Jadwal Cuci Darah
3. File CSV akan otomatis terdownload dan bisa dibuka di Microsoft Excel
4. Format file: `data-pasien-[timestamp].csv` atau `jadwal-cuci-darah-[timestamp].csv`

## 🎨 Fitur UI/UX

- **Desain Modern**: Interface yang bersih dan profesional
- **Responsive**: Dapat diakses dari berbagai ukuran layar
- **Animasi Smooth**: Transisi dan animasi yang halus
- **Color Coding**: Status ditampilkan dengan warna yang berbeda
- **Modal Forms**: Form input menggunakan modal untuk UX yang lebih baik
- **Filter & Search**: Filter jadwal berdasarkan tanggal
- **Export Data**: Download data pasien dan jadwal ke CSV/Excel dengan satu klik

## 🔐 Database Schema

### Table: patients
```sql
- id (INTEGER, PRIMARY KEY)
- nama (TEXT)
- no_rekam_medis (TEXT, UNIQUE)
- tanggal_lahir (TEXT)
- jenis_kelamin (TEXT)
- alamat (TEXT)
- telepon (TEXT)
- diagnosa (TEXT)
- golongan_darah (TEXT)
- created_at (DATETIME)
- updated_at (DATETIME)
```

### Table: schedules
```sql
- id (INTEGER, PRIMARY KEY)
- patient_id (INTEGER, FOREIGN KEY)
- tanggal (TEXT)
- waktu_mulai (TEXT)
- waktu_selesai (TEXT)
- ruangan (TEXT)
- mesin_dialisis (TEXT)
- perawat (TEXT)
- catatan (TEXT)
- status (TEXT)
- created_at (DATETIME)
- updated_at (DATETIME)
```

## 🐛 Troubleshooting

### Port sudah digunakan
Jika port 3000 atau 5173 sudah digunakan, ubah di:
- Backend: `backend/server.js` (ubah variabel PORT)
- Frontend: `frontend/vite.config.js` (ubah server.port)

### Database error
Hapus file `backend/hospital.db` dan restart backend untuk membuat database baru.

## 📝 Lisensi

ISC License

## 🎁 Keuntungan Desktop App

✅ **Offline First** - Tidak perlu internet  
✅ **Fast Performance** - Akses database lokal sangat cepat  
✅ **Easy Distribution** - Installer untuk Windows/Mac/Linux  
✅ **Data Security** - Data tersimpan lokal di komputer user  
✅ **No Hosting Cost** - Tidak perlu bayar hosting atau cloud  
✅ **Cross Platform** - Support Windows, macOS, dan Linux  

## 👨‍💻 Pengembangan Lebih Lanjut

Fitur yang bisa ditambahkan:
- [x] Desktop Application dengan Electron ✅
- [ ] Autentikasi dan authorization
- [x] Export data ke CSV/Excel ✅
- [ ] Export data ke PDF
- [ ] Notifikasi jadwal (desktop notifications)
- [ ] History medical records
- [ ] Multi-user dengan role management
- [ ] Backup dan restore database (auto backup)
- [ ] Print jadwal harian/mingguan
- [ ] Auto-update untuk desktop app

---

Dibuat dengan ❤️ untuk meningkatkan efisiensi manajemen pasien cuci darah di rumah sakit.

