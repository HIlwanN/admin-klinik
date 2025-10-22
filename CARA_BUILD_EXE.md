# 🛠️ Cara Build File .exe untuk Instalasi

Panduan step-by-step untuk mengubah source code menjadi file `.exe` installer.

## 📍 Anda Di Sini

```
[1] Source Code (saat ini) 
      ↓
[2] Install Dependencies
      ↓
[3] Build .exe ← Anda perlu lakukan ini
      ↓
[4] File .exe siap distribusi
```

## ✅ LANGKAH 1: Install Dependencies

### Cara Otomatis (Recommended)

1. Buka folder `D:\AdminKlinik`
2. **Double-click** file `install.bat`
3. Tunggu sampai selesai (akan muncul "Installation Complete!")
4. Tekan tombol apapun untuk close

### Cara Manual

Buka PowerShell/Command Prompt di folder `D:\AdminKlinik`, lalu jalankan:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

**Waktu:** ~5-10 menit (tergantung koneksi internet)

## ✅ LANGKAH 2: Build File .exe

### Cara Otomatis (Recommended)

1. Pastikan langkah 1 sudah selesai
2. **Double-click** file `build-windows.bat`
3. Tunggu proses build (~5-10 menit)
4. Jika berhasil, akan muncul pesan "Build Complete!"

### Cara Manual

Buka PowerShell/Command Prompt di folder `D:\AdminKlinik`:

```bash
npm run electron:build:win
```

**Proses yang terjadi:**
```
[1/3] Building frontend...
      → Compile React
      → Output ke frontend/dist/

[2/3] Packaging Electron app...
      → Bundling Electron + Node.js
      → Bundling backend + frontend
      → Bundling dependencies

[3/3] Creating installer...
      → Create NSIS installer
      → Compress files
      → Generate .exe
```

**Waktu:** ~5-10 menit

## ✅ LANGKAH 3: Ambil File .exe

Setelah build selesai, cari file di:

```
D:\AdminKlinik\dist-electron\Admin Klinik Setup 1.0.0.exe
```

### Ukuran File

- **Installer (.exe)**: ~100-170 MB (compressed)
- **Installed app**: ~200-300 MB

### Isi File .exe

File `.exe` ini adalah INSTALLER yang berisi:
- ✅ Electron runtime
- ✅ Node.js runtime
- ✅ Backend (Express + API)
- ✅ Frontend (React UI)
- ✅ SQLite library
- ✅ Semua dependencies
- ✅ Application icon (jika ada)

## ✅ LANGKAH 4: Test Installer

### Test di Komputer yang Sama

1. Double-click file `.exe`
2. Ikuti wizard instalasi
3. Pilih lokasi install (default: `C:\Program Files\Admin Klinik`)
4. Klik Install
5. Setelah selesai, klik Finish
6. Aplikasi akan muncul di Desktop & Start Menu

### Test di Komputer Lain

1. Copy file `.exe` ke komputer lain (via USB/email/cloud)
2. Double-click untuk install
3. **PENTING**: Komputer lain **TIDAK PERLU** Node.js terinstall!
4. User tinggal install seperti aplikasi biasa

## 📦 Distribusi File .exe

### Cara Mengirim ke User

**Opsi 1: USB Flash Drive**
```
1. Copy file .exe ke flashdisk
2. Berikan ke user
3. User copy ke komputer mereka
4. Double-click untuk install
```

**Opsi 2: Email**
```
⚠️ File terlalu besar untuk email biasa (~100-170 MB)
Gunakan:
- Google Drive
- OneDrive
- Dropbox
- WeTransfer
```

**Opsi 3: Cloud Storage (Recommended)**
```
1. Upload .exe ke Google Drive/OneDrive
2. Set sharing ke "Anyone with link"
3. Copy link
4. Kirim link ke user
5. User download & install
```

**Opsi 4: Internal Server**
```
1. Upload ke company server
2. Share via network/intranet
3. User download dari server
```

## 🔍 Verifikasi Build Berhasil

### File yang Harus Ada

```
D:\AdminKlinik\
├── dist-electron/                              ← Folder ini ada?
│   ├── Admin Klinik Setup 1.0.0.exe           ✅ File utama
│   ├── win-unpacked/                           (folder temporary)
│   └── builder-effective-config.yaml          (config file)
│
└── frontend/
    └── dist/                                   ← Folder ini ada?
        ├── index.html
        ├── assets/
        └── ...
```

### Cek Ukuran File

```bash
# Cek ukuran file .exe (harus ~100-170 MB)
dir dist-electron\*.exe
```

Jika file terlalu kecil (< 50 MB), mungkin build gagal.

## 🐛 Troubleshooting

### Build Gagal - "npm not found"

**Solusi:**
```bash
# Install Node.js dari https://nodejs.org/
# Versi minimum: 16.x atau lebih baru
```

### Build Gagal - "Dependencies not installed"

**Solusi:**
```bash
# Install dependencies dulu
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### Build Gagal - "Out of memory"

**Solusi:**
```bash
# Close aplikasi lain yang berat
# Free up RAM
# Coba build lagi
```

### File .exe Ada tapi Tidak Bisa Jalan

**Solusi:**
```bash
# Build ulang dengan clean
rmdir /s /q dist-electron
rmdir /s /q frontend\dist
npm run electron:build:win
```

### Windows Defender Quarantine File

**Solusi:**
```
1. Buka Windows Security
2. Virus & threat protection
3. Protection history
4. Restore file
5. Add to exclusions
```

## 📊 Build untuk Platform Lain

### Build untuk macOS (dari Mac)

```bash
npm run electron:build:mac
```

Output: `dist-electron/Admin Klinik-1.0.0.dmg`

### Build untuk Linux

```bash
npm run electron:build:linux
```

Output: 
- `dist-electron/Admin Klinik-1.0.0.AppImage`
- `dist-electron/admin-klinik_1.0.0_amd64.deb`

### Cross-Platform Build (Advanced)

⚠️ **Tidak recommended**, tapi bisa dilakukan:

```bash
# Build semua platform dari Windows (butuh tools khusus)
npm install --save-dev electron-builder-linux
npm install --save-dev electron-builder-mac

npm run electron:build
```

**Note:** Build untuk Mac di Windows hasilnya tidak bisa di-sign, jadi mungkin bermasalah.

## 🎯 Checklist Sebelum Distribusi

- [ ] Dependencies sudah terinstall
- [ ] Build berhasil tanpa error
- [ ] File `.exe` ada di `dist-electron/`
- [ ] Ukuran file reasonable (~100-170 MB)
- [ ] Test install di komputer yang sama
- [ ] Test install di komputer lain (recommended)
- [ ] Test semua fitur bekerja
- [ ] Database bisa create/read/update/delete
- [ ] Export CSV berfungsi

## 🔐 Windows Defender Warning

### Saat Build

Windows Defender mungkin warning karena:
- Electron bundler membuat executable
- Ini normal, bukan virus

**Solusi:**
```
1. Windows Security
2. Add folder AdminKlinik to exclusions
```

### Saat Install (di komputer user)

User mungkin dapat pesan "Windows protected your PC"

**Instruksi untuk user:**
```
1. Klik "More info"
2. Klik "Run anyway"
3. Install normal
```

**Kenapa muncul warning?**
- Aplikasi tidak di-sign (code signing)
- Untuk production, perlu beli code signing certificate (~$200-400/tahun)
- Dengan code signing, warning tidak muncul

## 💰 Code Signing (Optional)

Untuk menghilangkan Windows warning:

### Cara Mendapatkan Certificate

1. **Beli dari CA (Certificate Authority):**
   - DigiCert (~$200/tahun)
   - Sectigo (~$150/tahun)
   - GlobalSign (~$250/tahun)

2. **Proses:**
   - Verifikasi identitas
   - Download certificate
   - Import ke Windows

3. **Sign aplikasi:**
   ```bash
   # Tambah di package.json
   "win": {
     "certificateFile": "path/to/cert.pfx",
     "certificatePassword": "password"
   }
   ```

**Note:** Untuk internal use atau small deployment, code signing tidak mandatory.

## 📝 Update Versi

Sebelum build versi baru:

### 1. Update Version Number

Edit `package.json`:
```json
{
  "version": "1.1.0"  ← Ubah ini
}
```

### 2. Create Release Notes

Buat file `CHANGELOG.md`:
```markdown
# v1.1.0 (2024-01-20)

## New Features
- Tambah fitur X
- Improve fitur Y

## Bug Fixes
- Fix masalah Z
```

### 3. Build

```bash
npm run electron:build:win
```

Output: `Admin Klinik Setup 1.1.0.exe` (version baru)

## 🎉 Selesai!

Setelah mengikuti panduan ini, Anda akan memiliki:

✅ File `Admin Klinik Setup 1.0.0.exe`  
✅ Bisa di-install di komputer Windows manapun  
✅ User tidak perlu install Node.js  
✅ Aplikasi berjalan offline  
✅ Database lokal di setiap komputer  

## 📞 Next Steps

1. **Test installer** di beberapa komputer
2. **Dokumentasi** cara install untuk user
3. **Distribusi** via cloud storage/USB/network
4. **Support** user jika ada masalah

## 🔗 Related Docs

- [MULAI_DISINI.md](./MULAI_DISINI.md) - Start here
- [DESKTOP_APP.md](./DESKTOP_APP.md) - Full documentation
- [QUICK_START.md](./QUICK_START.md) - Quick guide

---

**Good luck! 🚀**

