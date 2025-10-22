# 🚀 Panduan Hosting ke Vercel

Panduan lengkap untuk deploy **Sistem Manajemen Pasien Cuci Darah** ke Vercel.

---

## 📋 Prerequisites

### 1. **Akun yang Diperlukan**
- ✅ Akun GitHub (untuk connect repository)
- ✅ Akun Vercel (gratis) - https://vercel.com
- ✅ Akun Supabase (sudah ada)

### 2. **Software yang Diperlukan**
- ✅ Git installed
- ✅ Node.js 18+ installed
- ✅ NPM atau Yarn

---

## 🎯 Architecture Overview

```
┌──────────────────────────────────────────────┐
│           Vercel Hosting                     │
│  ┌────────────────┐  ┌──────────────────┐   │
│  │   Frontend     │  │  API Functions   │   │
│  │  (Static Site) │  │  (Serverless)    │   │
│  └────────────────┘  └──────────────────┘   │
└──────────────────┬───────────────────────────┘
                   │
                   ▼
        ┌──────────────────┐
        │    Supabase      │
        │   (Database)     │
        └──────────────────┘
```

---

## 📂 Step 1: Persiapan Project

### 1.1 Initialize Git Repository

```bash
# Di root project (D:\AdminKlinik)
git init
git add .
git commit -m "Initial commit - Sistem Manajemen Pasien Cuci Darah"
```

### 1.2 Create GitHub Repository

1. Buka https://github.com/new
2. Create repository baru: `admin-klinik-hemodialisa`
3. **JANGAN** centang "Initialize with README"
4. Klik **Create repository**

### 1.3 Push ke GitHub

```bash
git remote add origin https://github.com/USERNAME/admin-klinik-hemodialisa.git
git branch -M main
git push -u origin main
```

> ⚠️ Ganti `USERNAME` dengan username GitHub Anda

---

## 📁 Step 2: Struktur Project untuk Vercel

### 2.1 Create Vercel Configuration

Buat file `vercel.json` di root project:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 2.2 Update Frontend Build Script

Edit `frontend/package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "vercel-build": "npm run build"
  }
}
```

### 2.3 Update Backend untuk Serverless

Create `backend/api/index.js`:

```javascript
// Export Express app untuk Vercel Serverless
import app from '../server.js';

export default app;
```

---

## 🔐 Step 3: Environment Variables

### 3.1 Frontend Environment Variables

Create `frontend/.env.production`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://your-vercel-app.vercel.app
```

### 3.2 Backend Environment Variables

**JANGAN** commit `.env` file!

Tambahkan ke `.gitignore`:
```
# Environment variables
.env
.env.local
.env.production
backend/.env
frontend/.env
frontend/.env.production
```

Environment variables akan diset di Vercel Dashboard nanti.

---

## 🚀 Step 4: Deploy ke Vercel

### 4.1 Connect GitHub Repository

1. **Login ke Vercel**
   - Buka https://vercel.com
   - Klik **Sign Up** atau **Login**
   - Login dengan GitHub

2. **Import Project**
   - Klik **Add New...** → **Project**
   - Pilih repository `admin-klinik-hemodialisa`
   - Klik **Import**

### 4.2 Configure Project Settings

**Framework Preset:** Vite

**Build Settings:**
- Build Command: `cd frontend && npm install && npm run build`
- Output Directory: `frontend/dist`
- Install Command: `npm install`

**Root Directory:** Leave blank (or `.`)

### 4.3 Environment Variables di Vercel

Klik **Environment Variables**, tambahkan:

**Frontend Variables:**
```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key
VITE_API_URL = https://your-vercel-app.vercel.app
```

**Backend Variables:**
```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_ANON_KEY = your-anon-key
SUPABASE_SERVICE_KEY = your-service-role-key
JWT_SECRET = your-super-secret-jwt-key-here
NODE_ENV = production
```

> 🔑 **Cara Dapatkan Supabase Keys:**
> 1. Buka Supabase Dashboard
> 2. Settings → API
> 3. Copy URL, anon key, dan service_role key

### 4.4 Deploy!

Klik **Deploy** dan tunggu...

⏳ Building... (3-5 menit)
✅ **Deployment Complete!**

---

## 🌐 Step 5: Custom Domain (Optional)

### 5.1 Gunakan Domain Vercel (Gratis)

Vercel akan memberikan domain gratis:
```
https://admin-klinik-hemodialisa.vercel.app
```

### 5.2 Gunakan Custom Domain

1. Klik **Settings** → **Domains**
2. Add domain: `yourdomain.com`
3. Update DNS di domain provider:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (5-60 menit)

---

## ✅ Step 6: Verifikasi Deployment

### 6.1 Test Website

1. Buka URL Vercel Anda
2. Test login dengan:
   - Email: `admin1@hemodialisa.com`
   - Password: `admin123`

### 6.2 Check API

Test API endpoint:
```
https://your-app.vercel.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

### 6.3 Test Features

- ✅ Login/Logout
- ✅ Dashboard
- ✅ Data Pasien (CRUD)
- ✅ Jadwal Manual
- ✅ Jadwal Otomatis
- ✅ Bed Manager

---

## 🔧 Step 7: Update Supabase Settings

### 7.1 Update CORS di Supabase

1. Buka Supabase Dashboard
2. Settings → API → **CORS**
3. Add allowed origins:
   ```
   https://your-app.vercel.app
   https://www.your-domain.com
   ```

### 7.2 Update RLS Policies (Jika Perlu)

Pastikan RLS policies allow dari Vercel domain.

---

## 🔄 Step 8: Continuous Deployment

### Auto-Deploy on Git Push

Setiap kali push ke GitHub:
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel akan **otomatis deploy** dalam 2-3 menit! 🚀

---

## 📊 Step 9: Monitoring

### 9.1 Vercel Analytics

1. Buka Vercel Dashboard
2. Klik project Anda
3. Tab **Analytics**

Lihat:
- Visitor count
- Page views
- Performance metrics

### 9.2 Deployment Logs

Tab **Deployments** → Klik deployment → **Logs**

Check errors atau warnings.

---

## 🐛 Troubleshooting

### Error: "Build Failed"

**Solution:**
1. Check build logs di Vercel
2. Pastikan `frontend/package.json` benar
3. Test build lokal:
   ```bash
   cd frontend
   npm run build
   ```

### Error: "API 500 Internal Server Error"

**Solution:**
1. Check Function Logs di Vercel
2. Verify environment variables
3. Check Supabase connection

### Error: "Login Failed"

**Solution:**
1. Check `VITE_API_URL` di frontend env
2. Verify users di Supabase database
3. Test API endpoint manually

### Error: "CORS Policy"

**Solution:**
1. Update CORS di Supabase
2. Add Vercel URL ke allowed origins
3. Redeploy

---

## 📝 Best Practices

### 1. Environment Variables

✅ **DO:**
- Use different keys for production
- Store secrets in Vercel dashboard
- Never commit `.env` to Git

❌ **DON'T:**
- Hardcode API keys
- Share production keys
- Use development keys in production

### 2. Database

✅ **DO:**
- Use Supabase RLS policies
- Regular backups
- Monitor usage

❌ **DON'T:**
- Expose service_role key
- Disable RLS in production
- Ignore security warnings

### 3. Deployment

✅ **DO:**
- Test locally first
- Use staging environment
- Monitor deployment logs

❌ **DON'T:**
- Deploy untested code
- Skip error checks
- Ignore build warnings

---

## 🎯 Performance Optimization

### 1. Frontend Optimization

```javascript
// vite.config.js
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true // Remove console.log in production
      }
    }
  }
}
```

### 2. Backend Optimization

```javascript
// Enable compression
import compression from 'compression';
app.use(compression());

// Cache static assets
app.use(express.static('public', {
  maxAge: '1d'
}));
```

### 3. Database Optimization

- Use database indexes
- Optimize queries
- Implement caching

---

## 💰 Pricing

### Vercel Free Tier

✅ **Included:**
- Unlimited deployments
- Automatic HTTPS
- Custom domain
- 100GB bandwidth/month
- Serverless Functions

⚠️ **Limits:**
- 100 deploys/day
- 10 second function timeout
- 50MB function size

### Upgrade to Pro ($20/month)

- Unlimited bandwidth
- Advanced analytics
- Team collaboration
- Priority support

---

## 📚 Resources

### Documentation
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Vite Docs: https://vitejs.dev

### Support
- Vercel Community: https://github.com/vercel/vercel/discussions
- Supabase Discord: https://discord.supabase.com

---

## ✅ Deployment Checklist

Before going live:

- [ ] Test all features locally
- [ ] Update users di Supabase (gunakan `update-users-2-admin-fixed.sql`)
- [ ] Set environment variables di Vercel
- [ ] Configure CORS di Supabase
- [ ] Test login flow
- [ ] Test CRUD operations
- [ ] Test Bed Manager
- [ ] Check mobile responsiveness
- [ ] Monitor for errors
- [ ] Create backups

---

## 🎉 Selamat!

Website Anda sekarang **LIVE** di internet! 🌍

URL: `https://your-app.vercel.app`

**Share dengan tim Anda dan mulai gunakan!** 🚀

---

**Last Updated:** 22 Oktober 2025
**Version:** 1.0.0

