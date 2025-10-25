# 🏥 Admin Klinik - Panduan Instalasi Desktop

## 📦 **Aplikasi Desktop Siap Install**

### **✅ Build Berhasil!**
Aplikasi desktop sudah berhasil dibuild dan siap untuk didistribusi ke device lain.

### **📁 File Installer:**
- **Lokasi**: `dist-electron/Admin Klinik Setup 1.0.0.exe`
- **Ukuran**: ~150MB (termasuk semua dependencies)
- **Platform**: Windows 64-bit
- **Format**: NSIS Installer

---

## 🚀 **Cara Instalasi di Device Lain**

### **1. Distribusi File:**
```
📁 Admin Klinik Setup 1.0.0.exe
```
- Copy file installer ke device target
- Atau upload ke cloud storage untuk download

### **2. Instalasi di Device Target:**

#### **Step 1: Jalankan Installer**
- Double-click `Admin Klinik Setup 1.0.0.exe`
- Windows mungkin menampilkan warning "Unknown Publisher"
- Klik "More info" → "Run anyway"

#### **Step 2: Setup Wizard**
- **Welcome**: Klik "Next"
- **Installation Directory**: Pilih folder instalasi (default: C:\Users\[User]\AppData\Local\Programs\admin-klinik)
- **Shortcuts**: 
  - ✅ Create desktop shortcut
  - ✅ Create start menu shortcut
- **Ready to Install**: Klik "Install"

#### **Step 3: Instalasi Selesai**
- ✅ Aplikasi terinstall
- ✅ Desktop shortcut dibuat
- ✅ Start menu shortcut dibuat
- ✅ Siap digunakan!

---

## 🖥️ **Cara Menjalankan Aplikasi**

### **Metode 1: Desktop Shortcut**
- Double-click shortcut "Admin Klinik" di desktop

### **Metode 2: Start Menu**
- Start Menu → "Admin Klinik"

### **Metode 3: File Explorer**
- Navigate ke folder instalasi
- Double-click "Admin Klinik.exe"

---

## ⚙️ **Konfigurasi Database**

### **Database Setup:**
Aplikasi menggunakan **Supabase** sebagai database cloud.

#### **Environment Variables:**
File `.env` akan dibuat otomatis di folder instalasi:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### **Setup Database:**
1. **Buat akun Supabase** di https://supabase.com
2. **Buat project baru**
3. **Import schema** dari `supabase-schema.sql`
4. **Update .env** dengan URL dan key Supabase

---

## 🔧 **Fitur Aplikasi Desktop**

### **✅ Fitur Lengkap:**
- **Dashboard** - Overview pasien dan jadwal
- **Data Pasien** - CRUD pasien aktif dan meninggal
- **Jadwal Manual** - Manajemen jadwal cuci darah
- **Bed Manager** - Visualisasi tempat tidur
- **Multi-User** - Support multiple admin
- **Export Reports** - Download laporan dengan filter
- **Date Filtering** - Filter data berdasarkan tanggal

### **✅ Keunggulan Desktop:**
- **Offline Ready** - Bekerja tanpa internet (kecuali database)
- **Native Performance** - Lebih cepat dari web browser
- **Auto Update** - Bisa dikonfigurasi untuk auto-update
- **System Integration** - Terintegrasi dengan Windows
- **Security** - Lebih aman dari web application

---

## 🛠️ **Troubleshooting**

### **Problem: Aplikasi tidak bisa dibuka**
**Solution:**
- Pastikan Windows Defender tidak memblokir
- Run as Administrator
- Check Windows version (minimal Windows 10)

### **Problem: Database connection error**
**Solution:**
- Check internet connection
- Verify Supabase credentials
- Check firewall settings

### **Problem: Aplikasi lambat**
**Solution:**
- Close aplikasi lain yang tidak perlu
- Restart aplikasi
- Check system resources

---

## 📋 **System Requirements**

### **Minimum Requirements:**
- **OS**: Windows 10 64-bit atau lebih baru
- **RAM**: 4GB (recommended 8GB)
- **Storage**: 500MB free space
- **Internet**: Untuk koneksi database

### **Recommended:**
- **OS**: Windows 11
- **RAM**: 8GB atau lebih
- **Storage**: 1GB free space
- **Internet**: Stable connection

---

## 🔄 **Update Aplikasi**

### **Manual Update:**
1. Download installer versi terbaru
2. Uninstall versi lama
3. Install versi baru

### **Auto Update (Future):**
- Aplikasi akan check update otomatis
- Notifikasi jika ada update tersedia
- One-click update process

---

## 📞 **Support & Contact**

### **Jika ada masalah:**
1. **Check log files** di folder instalasi
2. **Restart aplikasi**
3. **Contact administrator**

### **Log Files Location:**
```
C:\Users\[User]\AppData\Roaming\admin-klinik\logs\
```

---

## 🎉 **Selamat!**

Aplikasi **Admin Klinik** sudah siap digunakan sebagai aplikasi desktop yang professional dan mudah digunakan!

**File installer**: `dist-electron/Admin Klinik Setup 1.0.0.exe`
**Size**: ~150MB
**Ready for distribution**: ✅
