# 🔧 Troubleshooting - Admin Klinik Desktop

Panduan lengkap mengatasi masalah yang sering terjadi.

## 🔴 MASALAH #1: Aplikasi Blank Putih / Halaman Kosong

### Penyebab
Aplikasi Electron terbuka tapi tidak menampilkan apa-apa (hanya putih kosong).

### Solusi

#### **✅ Solusi Tercepat**

1. **Tutup** aplikasi yang putih
2. **Double-click** file `run-dev.bat`
3. **Tunggu** ~10-15 detik
4. Aplikasi akan terbuka dengan loading screen, lalu aplikasi lengkap

---

#### **✅ Solusi Manual (Jika script tidak jalan)**

Buka **3 terminal** terpisah di folder `D:\AdminKlinik`:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Tunggu sampai muncul:
```
Server running on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Tunggu sampai muncul:
```
Local: http://localhost:5173
```

**Terminal 3 - Electron:**
```bash
npm run electron:dev
```

Aplikasi akan terbuka dengan benar!

---

#### **✅ Mengapa Ini Terjadi?**

Development mode memerlukan:
- ✅ Backend server running (port 3000)
- ✅ Frontend Vite server running (port 5173)
- ✅ Electron window

Jika salah satu tidak running, muncul halaman putih.

**Solusi Permanen:** Gunakan `npm run dev` atau `run-dev.bat` yang menjalankan semua sekaligus.

---

## 🔴 MASALAH #2: Error "Dependencies not installed"

### Penyebab
Dependencies belum terinstall atau install tidak lengkap.

### Solusi

```bash
# Double-click file ini:
install.bat

# Atau manual:
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

Tunggu sampai selesai (~5-10 menit).

---

## 🔴 MASALAH #3: Error "Port already in use"

### Penyebab
Port 3000 atau 5173 sudah dipakai aplikasi lain.

### Solusi A: Close Aplikasi yang Pakai Port

**Cek port yang dipakai:**
```powershell
# Cek port 3000
netstat -ano | findstr :3000

# Cek port 5173
netstat -ano | findstr :5173
```

**Kill process:**
```powershell
# Ganti <PID> dengan Process ID dari command di atas
taskkill /PID <PID> /F
```

### Solusi B: Ubah Port

Edit `electron/main.js`:
```javascript
const PORT = 3001;  // Ubah dari 3000 ke 3001
const FRONTEND_PORT = 5174;  // Ubah dari 5173 ke 5174
```

---

## 🔴 MASALAH #4: Build Gagal

### Error: "npm not found"

**Solusi:**
```
1. Install Node.js dari https://nodejs.org/
2. Versi minimum: 16.x
3. Restart terminal/computer
4. Test: npm --version
```

### Error: "electron-builder failed"

**Solusi:**
```bash
# Clear cache
npm cache clean --force

# Reinstall dependencies
rmdir /s /q node_modules
npm install
```

### Error: "Out of memory"

**Solusi:**
```
1. Close aplikasi lain yang berat
2. Free up RAM (minimal 4GB free)
3. Restart computer
4. Build lagi
```

---

## 🔴 MASALAH #5: Aplikasi Terbuka Lalu Langsung Crash

### Check Console Output

Buka DevTools (Ctrl+Shift+I) dan cek Console untuk error.

### Common Errors

**1. Database Error**
```
Error: ENOENT: no such file or directory
```

**Solusi:**
```bash
# Database akan dibuat otomatis
# Pastikan folder writable
# Check permissions
```

**2. Backend Crash**
```
TypeError: Cannot read property 'prepare' of undefined
```

**Solusi:**
```bash
# Install ulang backend dependencies
cd backend
rmdir /s /q node_modules
npm install
```

---

## 🔴 MASALAH #6: Windows Defender Blokir File

### Saat Development

**Solusi:**
```
1. Windows Security
2. Virus & threat protection
3. Manage settings
4. Add or remove exclusions
5. Add folder: D:\AdminKlinik
```

### Saat Install .exe

User dapat pesan "Windows protected your PC"

**Instruksi untuk user:**
```
1. Klik "More info"
2. Klik "Run anyway"
```

---

## 🔴 MASALAH #7: Frontend Tidak Update Setelah Edit Code

### Penyebab
Hot reload tidak jalan atau cache browser.

### Solusi

```bash
# Hard refresh di Electron
Ctrl + Shift + R

# Atau restart dev server
# Tutup semua terminal
# Jalankan ulang: npm run dev
```

---

## 🔴 MASALAH #8: Database Kosong Setelah Restart

### Penyebab
Database di tempat berbeda antara dev dan production.

### Lokasi Database

**Development:**
```
D:\AdminKlinik\backend\hospital.db
```

**Production (setelah install):**
```
C:\Users\<Username>\AppData\Roaming\Admin Klinik\hospital.db
```

### Solusi

Database terpisah antara dev dan production. Ini normal!

---

## 🔴 MASALAH #9: Build .exe Berhasil Tapi Tidak Bisa Diinstall

### Error: "Setup file is corrupted"

**Solusi:**
```bash
# Build ulang dengan clean
rmdir /s /q dist-electron
npm run electron:build:win
```

### Error: "Cannot install to Program Files"

**Solusi:**
```
1. Run installer as Administrator
2. Right-click .exe → Run as administrator
```

---

## 🔴 MASALAH #10: Aplikasi Lambat / Lag

### Penyebab
1. Database terlalu besar
2. Memory leak
3. Too many processes

### Solusi

```bash
# 1. Check database size
dir backend\hospital.db

# 2. Optimize database (jika > 100MB)
sqlite3 hospital.db "VACUUM;"

# 3. Restart aplikasi
```

---

## 🆘 Still Not Working?

### Debug Mode

Enable debug logs:

**1. Edit `package.json`:**
```json
{
  "scripts": {
    "electron:dev": "cross-env NODE_ENV=development DEBUG=* electron ."
  }
}
```

**2. Run:**
```bash
npm run electron:dev
```

**3. Check logs** di terminal untuk error details.

---

### Clean Install

Jika semua solusi di atas tidak berhasil:

```bash
# 1. Backup database (jika ada data penting)
copy backend\hospital.db backup.db

# 2. Delete everything
rmdir /s /q node_modules
rmdir /s /q backend\node_modules
rmdir /s /q frontend\node_modules
rmdir /s /q dist-electron
rmdir /s /q frontend\dist

# 3. Reinstall
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 4. Test
npm run dev

# 5. Restore database
copy backup.db backend\hospital.db
```

---

## 📞 Get Help

Jika masih ada masalah:

1. ✅ Screenshot error message
2. ✅ Copy console output
3. ✅ Check DevTools (Ctrl+Shift+I) → Console tab
4. ✅ Check Terminal output semua 3 terminal

---

## 🎯 Checklist Debugging

Sebelum lapor error, pastikan:

- [ ] Node.js terinstall (v16+)
- [ ] Dependencies terinstall (`install.bat`)
- [ ] Backend running (port 3000)
- [ ] Frontend running (port 5173)
- [ ] No port conflicts
- [ ] No antivirus blocking
- [ ] Folder not read-only
- [ ] Sufficient disk space (> 1GB)
- [ ] Sufficient RAM (> 4GB)

---

## 💡 Tips Mencegah Masalah

### 1. Selalu Gunakan Script Helper

```bash
install.bat      # Install
run-dev.bat      # Development
build-windows.bat # Build
```

### 2. Jangan Edit File Konfigurasi Kecuali Tahu Apa yang Dilakukan

### 3. Backup Database Secara Berkala

```bash
# Backup manual
copy backend\hospital.db backup-YYYY-MM-DD.db
```

### 4. Update Dependencies Berkala

```bash
npm update
cd backend && npm update && cd ..
cd frontend && npm update && cd ..
```

### 5. Clean Build Sesekali

```bash
rmdir /s /q dist-electron
rmdir /s /q frontend\dist
npm run electron:build:win
```

---

## 🔗 Related Docs

- [MULAI_DISINI.md](./MULAI_DISINI.md) - Getting started
- [DESKTOP_APP.md](./DESKTOP_APP.md) - Full documentation
- [CARA_BUILD_EXE.md](./CARA_BUILD_EXE.md) - Building guide

---

**Good luck! 🚀**

