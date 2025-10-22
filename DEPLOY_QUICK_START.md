# 🚀 Quick Start: Deploy ke Vercel

Panduan singkat untuk deploy dalam 10 menit!

---

## ✅ Checklist Sebelum Deploy

- [ ] Update users di Supabase (jalankan `update-users-2-admin-fixed.sql`)
- [ ] Punya akun GitHub
- [ ] Punya akun Vercel
- [ ] Database Supabase sudah setup

---

## 📝 Step-by-Step

### 1️⃣ Push ke GitHub (5 menit)

```bash
# Di terminal, dari folder D:\AdminKlinik

# Initialize git (jika belum)
git init

# Add semua file
git add .

# Commit
git commit -m "Ready for deployment"

# Create repository di GitHub lalu:
git remote add origin https://github.com/USERNAME/admin-klinik.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ Deploy ke Vercel (3 menit)

1. **Login Vercel**
   - https://vercel.com
   - Login dengan GitHub

2. **Import Project**
   - Klik **Add New...** → **Project**
   - Pilih repository `admin-klinik`
   - Klik **Import**

3. **Configure**
   - Framework: **Other** (atau Vite)
   - Root Directory: `.` (blank)
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`

4. **Klik Deploy**

---

### 3️⃣ Set Environment Variables (2 menit)

Buka file `ENV_TEMPLATE_VERCEL.txt`, copy semua variables.

Di Vercel Dashboard:
1. Settings → Environment Variables
2. Paste dan isi values:

**Wajib diisi:**
```
VITE_SUPABASE_URL = [dari Supabase Dashboard]
VITE_SUPABASE_ANON_KEY = [dari Supabase]
SUPABASE_URL = [sama seperti di atas]
SUPABASE_ANON_KEY = [sama seperti di atas]  
SUPABASE_SERVICE_KEY = [dari Supabase - service_role]
JWT_SECRET = [random string 32+ karakter]
NODE_ENV = production
```

**Opsional (isi nanti):**
```
VITE_API_URL = [URL Vercel setelah deploy]
```

3. **Klik Save**
4. **Redeploy** (Deployments → ... → Redeploy)

---

## 🎯 Test Website

Setelah deploy selesai:

1. **Buka URL** (contoh: `https://admin-klinik-xxx.vercel.app`)

2. **Login:**
   - Email: `admin1@hemodialisa.com`
   - Password: `admin123`

3. **Test Features:**
   - ✅ Dashboard
   - ✅ Data Pasien
   - ✅ Bed Manager
   - ✅ Jadwal

---

## 🐛 Jika Ada Error

### Build Failed

```bash
# Test build lokal dulu:
cd frontend
npm install
npm run build

# Jika berhasil, push lagi ke GitHub
```

### 500 Error saat Login

**Check:**
1. Environment variables sudah benar?
2. Users sudah ada di Supabase?
3. CORS di Supabase sudah allow Vercel URL?

**Fix:**
1. Vercel → Settings → Environment Variables
2. Supabase → Settings → API → CORS
3. Add: `https://your-app.vercel.app`

---

## 📞 Butuh Bantuan?

1. Check `VERCEL_DEPLOYMENT_GUIDE.md` untuk detail lengkap
2. Check Vercel logs: Deployments → klik deployment → Logs
3. Check browser console (F12)

---

## ✅ Success!

Website live di: `https://your-app.vercel.app` 🎉

**Auto-deploy:** Setiap `git push` akan otomatis deploy!

---

**Total Time:** ~10 menit
**Difficulty:** ⭐⭐☆☆☆ (Easy)

