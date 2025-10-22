# Admin Klinik - Aplikasi Desktop

Panduan lengkap untuk menjalankan dan membangun aplikasi desktop **Sistem Manajemen Pasien Cuci Darah**.

## 📋 Persyaratan Sistem

- **Node.js**: v18.x atau lebih tinggi
- **npm**: v9.x atau lebih tinggi
- **OS**: Windows 10/11, macOS 10.13+, atau Linux (Ubuntu 18.04+)

## 🚀 Instalasi

### 1. Install Dependencies

```bash
# Install semua dependencies
npm install

# Install dependencies untuk frontend
cd frontend
npm install

# Install dependencies untuk backend
cd ../backend
npm install

# Kembali ke root folder
cd ..
```

### 2. Install Electron Dependencies

```bash
# Ini akan menginstall Electron dan electron-builder
npm install
```

## 💻 Development Mode

Untuk menjalankan aplikasi dalam mode development:

```bash
npm run dev
```

Atau jalankan secara manual:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Electron
npm run electron:dev
```

Mode development akan:
- ✅ Hot-reload frontend (Vite)
- ✅ Auto-restart backend saat ada perubahan
- ✅ Membuka DevTools untuk debugging
- ✅ Load frontend dari Vite dev server (port 5173)

## 🏗️ Build Aplikasi Desktop

### Build untuk Windows (dari Windows)

```bash
npm run electron:build:win
```

Ini akan menghasilkan:
- **Installer NSIS** (`.exe`): `dist-electron/Admin Klinik Setup 1.0.0.exe`
- User dapat install seperti aplikasi Windows pada umumnya
- Desktop shortcut otomatis dibuat

### Build untuk macOS (dari macOS)

```bash
npm run electron:build:mac
```

Ini akan menghasilkan:
- **DMG Image**: `dist-electron/Admin Klinik-1.0.0.dmg`
- **Application Bundle**: `dist-electron/mac/Admin Klinik.app`

### Build untuk Linux

```bash
npm run electron:build:linux
```

Ini akan menghasilkan:
- **AppImage**: `dist-electron/Admin Klinik-1.0.0.AppImage`
- **DEB Package**: `dist-electron/admin-klinik_1.0.0_amd64.deb`

### Build untuk Semua Platform

```bash
npm run electron:build
```

## 📁 Struktur File Setelah Build

```
dist-electron/
├── Admin Klinik Setup 1.0.0.exe    (Windows installer)
├── Admin Klinik-1.0.0.dmg          (macOS installer)
├── Admin Klinik-1.0.0.AppImage     (Linux executable)
└── admin-klinik_1.0.0_amd64.deb    (Debian/Ubuntu package)
```

## 🗄️ Database Location

Database SQLite akan disimpan di lokasi yang berbeda tergantung OS:

- **Windows**: `C:\Users\<Username>\AppData\Roaming\Admin Klinik\hospital.db`
- **macOS**: `~/Library/Application Support/Admin Klinik/hospital.db`
- **Linux**: `~/.config/Admin Klinik/hospital.db`

Ini memastikan data tetap aman dan tidak hilang saat aplikasi di-update.

## 🔧 Konfigurasi Build

Edit `package.json` di root folder untuk mengubah konfigurasi build:

```json
{
  "build": {
    "appId": "com.adminklinik.app",
    "productName": "Admin Klinik",
    "win": {
      "target": "nsis",
      "icon": "build/icon.ico"
    },
    "mac": {
      "target": "dmg",
      "icon": "build/icon.icns"
    },
    "linux": {
      "target": ["AppImage", "deb"],
      "icon": "build/icon.png"
    }
  }
}
```

## 🎨 Custom Icon

Untuk mengganti icon aplikasi, siapkan file icon:

1. Buat folder `build/` di root project
2. Tambahkan icon files:
   - **Windows**: `build/icon.ico` (256x256 pixels)
   - **macOS**: `build/icon.icns` (512x512 pixels)
   - **Linux**: `build/icon.png` (512x512 pixels)

Anda bisa generate icon menggunakan tools online seperti:
- https://icoconvert.com/
- https://cloudconvert.com/png-to-ico

## 🐛 Troubleshooting

### Port Already in Use

Jika port 3000 sudah digunakan, ubah di `electron/main.js`:

```javascript
const PORT = 3001; // Ganti ke port lain
```

### Database Lock Error

Tutup semua instance aplikasi sebelum menjalankan development mode.

### Build Failed

Pastikan semua dependencies terinstall:

```bash
npm run postinstall
```

### Windows Defender Warning

Saat pertama kali run installer, Windows mungkin warning. Ini normal untuk aplikasi yang tidak signed. Klik "More info" → "Run anyway".

Untuk production, Anda perlu **code signing certificate** untuk menghilangkan warning ini.

## 📦 Distribution

### Windows

Berikan file `.exe` installer kepada user. User tinggal double-click dan ikuti wizard instalasi.

### macOS

Berikan file `.dmg`. User drag aplikasi ke folder Applications.

### Linux

**AppImage**: User tinggal:
```bash
chmod +x Admin\ Klinik-1.0.0.AppImage
./Admin\ Klinik-1.0.0.AppImage
```

**DEB**: User install dengan:
```bash
sudo dpkg -i admin-klinik_1.0.0_amd64.deb
```

## 🔐 Security Notes

- Database disimpan secara lokal di user's AppData
- Tidak ada koneksi internet yang diperlukan
- Semua data tersimpan offline di komputer user
- Pastikan user melakukan backup database secara berkala

## 🔄 Auto Update (Optional)

Untuk mengaktifkan auto-update, Anda perlu:

1. Setup release server (GitHub Releases, atau custom server)
2. Enable `autoUpdater` di `electron/main.js`
3. Tambah code signing untuk aplikasi

## 📝 Scripts Tersedia

| Script | Deskripsi |
|--------|-----------|
| `npm run dev` | Jalankan semua (backend + frontend + electron) dalam mode development |
| `npm run electron:dev` | Jalankan Electron saja (untuk testing) |
| `npm run electron:build` | Build untuk platform saat ini |
| `npm run electron:build:win` | Build untuk Windows |
| `npm run electron:build:mac` | Build untuk macOS |
| `npm run electron:build:linux` | Build untuk Linux |

## 💡 Tips

1. **Development**: Gunakan `npm run dev` untuk development
2. **Testing**: Test build di platform yang sama dengan target deployment
3. **Performance**: SQLite database sangat cepat untuk desktop app
4. **Backup**: Implementasikan fitur backup/restore database
5. **Updates**: Siapkan changelog untuk setiap versi baru

## 🆘 Support

Jika ada masalah, check:
- Console logs di DevTools (Ctrl+Shift+I / Cmd+Option+I)
- Backend logs di terminal
- Database path yang benar

## 📄 License

ISC

---

**Dibuat dengan ❤️ menggunakan Electron + React + Node.js**

