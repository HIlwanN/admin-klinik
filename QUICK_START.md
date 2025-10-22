# 🚀 Quick Start - Admin Klinik Desktop

Panduan cepat untuk memulai menggunakan aplikasi desktop.

## Instalasi Cepat (5 Menit)

### 1️⃣ Install Dependencies

```bash
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 2️⃣ Jalankan Aplikasi (Development)

```bash
npm run dev
```

Tunggu beberapa detik, aplikasi akan terbuka otomatis! 🎉

### 3️⃣ Build Aplikasi Desktop

**Windows:**
```bash
npm run electron:build:win
```

**macOS:**
```bash
npm run electron:build:mac
```

**Linux:**
```bash
npm run electron:build:linux
```

File installer ada di folder `dist-electron/`

## ✅ Checklist

- [ ] Node.js v18+ terinstall
- [ ] Run `npm install` di root, frontend, dan backend
- [ ] Run `npm run dev` untuk development
- [ ] Run `npm run electron:build:win` untuk build
- [ ] File installer ada di `dist-electron/`

## 🎯 Hasil Akhir

Anda akan mendapatkan:
- ✅ Aplikasi desktop yang bisa jalan offline
- ✅ Database SQLite lokal
- ✅ Installer untuk distribusi (.exe untuk Windows)
- ✅ Tidak perlu web server atau hosting

## 📞 Butuh Bantuan?

Baca dokumentasi lengkap di [DESKTOP_APP.md](./DESKTOP_APP.md)

