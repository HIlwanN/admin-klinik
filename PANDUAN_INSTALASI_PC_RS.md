# 📦 Panduan Instalasi Aplikasi Admin Klinik

## 🏥 Aplikasi Manajemen Pasien Hemodialisis - Desktop Version

---

## ✅ PERSYARATAN SISTEM

### Minimum Requirements:
- **OS**: Windows 10 atau Windows 11
- **RAM**: Minimum 4 GB (Rekomendasi 8 GB)
- **Storage**: 500 MB free space
- **Internet**: Koneksi internet stabil (untuk akses database Supabase)
- **Browser**: Tidak diperlukan (sudah built-in)

---

## 📥 CARA INSTALASI

### Langkah 1: Download Installer
1. Download file `Admin Klinik Setup 1.0.0.exe` dari folder `dist-electron`
2. Atau copy installer ke flashdisk/USB

### Langkah 2: Install Aplikasi
1. **Double-click** file `Admin Klinik Setup 1.0.0.exe`
2. Klik **"Allow"** jika Windows menanyakan permission
3. Pilih lokasi instalasi (default: `C:\Program Files\Admin Klinik`)
4. Klik **"Install"**
5. Tunggu proses instalasi selesai (sekitar 1-2 menit)
6. Klik **"Finish"**

### Langkah 3: Jalankan Aplikasi
1. Aplikasi akan otomatis muncul di **Desktop** dengan icon **Admin Klinik**
2. Double-click icon untuk membuka aplikasi
3. Aplikasi akan loading sebentar (5-10 detik) untuk start backend server
4. Login dengan kredensial berikut:
   - **Email**: `admin1@hemodialisa.com`
   - **Password**: `admin123`

---

## 🚀 CARA PENGGUNAAN

### Start Aplikasi
1. Klik **double-click** icon "Admin Klinik" di desktop
2. Tunggu 5-10 detik loading screen
3. Halaman login akan muncul
4. Login dengan username dan password

### Stop Aplikasi
1. Tutup aplikasi dengan klik **X** di pojok kanan atas
2. Aplikasi akan otomatis stop backend server
3. Tidak perlu task manager atau CMD

### Restart Aplikasi
1. Tutup aplikasi (klik X)
2. Tunggu 3 detik
3. Buka lagi dari desktop icon

---

## 🖥️ INSTAL DI MULTIPLE PC

### Opsi A: Setiap PC Install Sendiri (REKOMENDASI)
1. Install `Admin Klinik Setup 1.0.0.exe` di setiap PC
2. Semua PC akan terhubung ke database Supabase yang sama
3. Data real-time tersinkron di semua PC

**Pro:**
- ✅ Backend otomatis start di setiap PC
- ✅ Data tersinkron via Supabase
- ✅ Tidak perlu konfigurasi server

**Cons:**
- ❌ Backend berjalan di setiap PC (konsumsi resource sedikit)

### Opsi B: Satu Server + Browser Access
1. Install aplikasi di **satu PC Server** (Contoh: PC Resepsionis)
2. Buka aplikasi dan **biarkan running** terus
3. PC lain akses via browser:
   - Ketik di browser: `http://IP-ADDRESS-SERVER:3000`
   - Contoh: `http://192.168.1.100:3000`
4. Semua bisa login dan menggunakan aplikasi

**Pro:**
- ✅ Hanya satu backend running
- ✅ Efisien untuk banyak PC

**Cons:**
- ❌ Server harus selalu hidup
- ❌ Perlu cek IP address server

---

## 📊 FITUR APLIKASI

### 1. Dashboard
- Lihat jumlah pasien
- Lihat jadwal hari ini
- Quick stats

### 2. Data Pasien
- Tambah pasien baru
- Edit data pasien
- Lihat history
- Data pasien meninggal
- Download data filter tanggal

### 3. Jadwal
- Buat jadwal baru
- Lihat jadwal per periode
- Edit jadwal
- Mark as completed
- Download jadwal filter tanggal

### 4. Bed Manager
- Lihat status bed per lantai
- **Lantai 1**: 22 bed
- **Lantai 2**: 10 bed
- Assign pasien ke bed
- Mark bed as completed

---

## 🔧 TROUBLESHOOTING

### Masalah: Aplikasi tidak bisa dibuka
**Solusi:**
1. Cek antivirus - mungkin block aplikasi
2. Add `Admin Klinik.exe` ke Windows Defender exclusion
3. Run as Administrator: Klik kanan > Run as Administrator

### Masalah: Login error "Cannot connect to database"
**Solusi:**
1. Cek koneksi internet
2. Cek apakah backend server running
3. Restart aplikasi
4. Hubungi IT Support

### Masalah: Data tidak tersinkron
**Solusi:**
1. Restart aplikasi
2. Cek koneksi internet
3. Pastikan semua PC terhubung ke internet

### Masalah: Port 3000 already in use
**Solusi:**
1. Tutup aplikasi lain yang menggunakan port 3000
2. Atau restart PC

---

## 📞 SUPPORT

### Informasi Teknis
- **Nama Aplikasi**: Admin Klinik
- **Version**: 1.0.0
- **Database**: Supabase Cloud
- **Backend**: Node.js Express
- **Frontend**: React + Electron

### Login Credentials
- **Admin 1**: admin1@hemodialisa.com / admin123
- **Admin 2**: admin2@hemodialisa.com / admin123

---

## 📝 NOTES PENTING

1. **Database tersimpan di Supabase Cloud** - tidak perlu backup manual
2. **Backend auto-start** saat aplikasi dibuka
3. **Backend auto-stop** saat aplikasi ditutup
4. **Tidak perlu install Node.js** - sudah bundled
5. **Tidak perlu install database** - menggunakan Supabase
6. **Multi-user support** - semua PC akses database sama
7. **Real-time sync** - data update langsung di semua PC

---

## 🎯 RINGKASAN

### Install: ✅ Easy
- Download installer
- Double-click
- Done

### Running: ✅ Easy
- Klik icon desktop
- Wait 5-10 seconds
- Login

### Stop: ✅ Easy  
- Tutup aplikasi (klik X)
- Done

### Multi-PC: ✅ Easy
- Install di setiap PC
- Otomatis tersinkron via Supabase
- Tidak perlu konfigurasi

---

## ✅ READY TO USE!

Aplikasi sudah **100% ready** untuk digunakan di rumah sakit.

**Installer location:** `dist-electron/Admin Klinik Setup 1.0.0.exe`

**Copy file ini ke flashdisk dan install di PC rumah sakit!**

---

*Created with ❤️ for RSUD Umar Wirahadikusumah*

