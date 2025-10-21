# 🚀 Panduan Deployment ke Railway

Panduan lengkap untuk hosting aplikasi **Admin Klinik** ke Railway dengan menggunakan GitHub.

## 📋 Prasyarat

Sebelum memulai, pastikan Anda memiliki:
- ✅ Akun [GitHub](https://github.com) (gratis)
- ✅ Akun [Railway](https://railway.app) (gratis)
- ✅ Git terinstall di komputer Anda

## 🔧 Langkah 1: Push ke GitHub

### 1.1 Inisialisasi Git Repository

Buka PowerShell/Command Prompt di folder `D:\AdminKlinik`, lalu jalankan:

```bash
# Inisialisasi git
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial commit - Admin Klinik Cuci Darah"
```

### 1.2 Buat Repository di GitHub

1. Buka [github.com](https://github.com) dan login
2. Klik tombol **"+"** di pojok kanan atas → **"New repository"**
3. Isi detail repository:
   - **Repository name**: `admin-klinik` (atau nama lain)
   - **Description**: "Sistem Manajemen Pasien Cuci Darah"
   - Pilih **Public** atau **Private**
   - **JANGAN** centang "Add README" (karena sudah ada)
4. Klik **"Create repository"**

### 1.3 Push ke GitHub

Setelah repository dibuat, jalankan perintah berikut (ganti `USERNAME` dengan username GitHub Anda):

```bash
# Tambahkan remote repository
git remote add origin https://github.com/USERNAME/admin-klinik.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

Jika diminta login, masukkan username dan **Personal Access Token** GitHub Anda.

> **Catatan**: Untuk membuat Personal Access Token:
> 1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
> 2. Generate new token → Centang "repo" → Generate
> 3. Copy token dan gunakan sebagai password saat push

## 🚂 Langkah 2: Deploy ke Railway

### 2.1 Login ke Railway

1. Buka [railway.app](https://railway.app)
2. Klik **"Login"** atau **"Start a New Project"**
3. Login dengan akun **GitHub** Anda (recommended)

### 2.2 Create New Project

1. Setelah login, klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Jika pertama kali, Railway akan meminta akses ke GitHub:
   - Klik **"Configure GitHub App"**
   - Pilih repository **admin-klinik**
   - Klik **"Install & Authorize"**

### 2.3 Deploy Project

1. Pilih repository **admin-klinik** dari list
2. Railway akan otomatis:
   - Detect Node.js project
   - Install dependencies
   - Build frontend
   - Start backend server
3. Tunggu hingga deployment selesai (3-5 menit)

### 2.4 Setup Domain

1. Setelah deploy berhasil, klik pada **service** yang sudah dibuat
2. Klik tab **"Settings"**
3. Scroll ke bagian **"Networking"**
4. Klik **"Generate Domain"**
5. Railway akan memberikan URL seperti: `https://admin-klinik-production.up.railway.app`

**Aplikasi Anda sudah online!** 🎉

## 🌐 Akses Aplikasi

Setelah deployment selesai, Anda bisa akses aplikasi di:
```
https://your-project-name.up.railway.app
```

## 🔄 Update Aplikasi (Setelah Ada Perubahan Code)

Jika Anda melakukan perubahan pada code, untuk update aplikasi:

```bash
# Tambahkan perubahan
git add .

# Commit perubahan
git commit -m "Deskripsi perubahan"

# Push ke GitHub
git push
```

Railway akan **otomatis** re-deploy aplikasi Anda! 🚀

## ⚙️ Environment Variables (Opsional)

Jika nanti ingin menambahkan environment variables:

1. Di Railway dashboard, pilih project Anda
2. Klik tab **"Variables"**
3. Tambahkan variable baru, contoh:
   - `NODE_ENV` = `production`
   - `PORT` = `3000` (Railway akan override ini secara otomatis)

## 💾 Database di Production

SQLite database akan tersimpan di Railway. Namun perlu diingat:

⚠️ **PENTING**: 
- Railway menggunakan **ephemeral storage** untuk free tier
- Data bisa hilang saat restart/redeploy
- Untuk production serius, pertimbangkan upgrade atau gunakan external database

### Solusi Database Permanen:

**Option 1: Railway PostgreSQL (Recommended untuk production)**
1. Di Railway project, klik **"+ New"**
2. Pilih **"Database" → "PostgreSQL"**
3. Update code untuk koneksi PostgreSQL

**Option 2: Backup Manual**
- Download database secara berkala via fitur download yang sudah ada

**Option 3: External Database**
- Gunakan services seperti:
  - [Supabase](https://supabase.com) (PostgreSQL gratis)
  - [PlanetScale](https://planetscale.com) (MySQL gratis)
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (MongoDB gratis)

## 🎯 Railway Free Tier

Railway menyediakan free tier dengan:
- ✅ $5 credit per bulan (sekitar 500 jam uptime)
- ✅ Auto-deploy dari GitHub
- ✅ Custom domains
- ✅ HTTPS otomatis
- ⚠️ Ephemeral storage (data bisa hilang)

Untuk aplikasi kecil/testing, ini **lebih dari cukup**! 👍

## 🐛 Troubleshooting

### Build Failed
- Check logs di Railway dashboard
- Pastikan semua dependencies tercantum di `package.json`

### App Crashes
- Check runtime logs di Railway
- Pastikan PORT menggunakan `process.env.PORT`

### Database Empty
- Download backup sebelum redeploy
- Atau gunakan database eksternal

## 📱 Custom Domain (Opsional)

Jika punya domain sendiri:

1. Railway Settings → Networking → Custom Domain
2. Masukkan domain Anda (contoh: `admin.rumahsakit.com`)
3. Update DNS settings di provider domain:
   - Tambahkan CNAME record yang diberikan Railway

## 🎓 Tips

1. **Always backup** database sebelum redeploy
2. **Monitor usage** di Railway dashboard untuk free tier
3. **Test locally** sebelum push ke production
4. **Use environment variables** untuk sensitive data

## 📚 Resources

- [Railway Documentation](https://docs.railway.app)
- [GitHub Documentation](https://docs.github.com)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

Selamat! Aplikasi Anda sudah online dan bisa diakses dari mana saja! 🎉

