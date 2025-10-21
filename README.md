# Sistem Manajemen Pasien Cuci Darah

Website admin untuk mengelola data dan jadwal pasien cuci darah (hemodialisis) di rumah sakit. Sistem ini dilengkapi dengan fitur CRUD (Create, Read, Update, Delete) lengkap untuk manajemen pasien dan jadwal dialisis.

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

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Web framework
- **Better-SQLite3** - Database SQLite
- **CORS** - Cross-Origin Resource Sharing

### Frontend
- **React 18** - UI Library
- **React Router** - Routing
- **Vite** - Build tool
- **Modern CSS** - Styling dengan gradient dan animasi

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:
- **Node.js** (versi 16 atau lebih baru)
- **npm** atau **yarn**

## 🚀 Instalasi dan Menjalankan Aplikasi

### 1. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Menjalankan Aplikasi

#### Jalankan Backend (Terminal 1)
```bash
cd backend
npm start
```
Backend akan berjalan di `http://localhost:3000`

#### Jalankan Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend akan berjalan di `http://localhost:5173`

### 3. Akses Aplikasi

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

## 👨‍💻 Pengembangan Lebih Lanjut

Fitur yang bisa ditambahkan:
- [ ] Autentikasi dan authorization
- [x] Export data ke CSV/Excel ✅
- [ ] Export data ke PDF
- [ ] Notifikasi jadwal
- [ ] History medical records
- [ ] Multi-user dengan role management
- [ ] Backup dan restore database
- [ ] Print jadwal harian/mingguan

---

Dibuat dengan ❤️ untuk meningkatkan efisiensi manajemen pasien cuci darah di rumah sakit.

