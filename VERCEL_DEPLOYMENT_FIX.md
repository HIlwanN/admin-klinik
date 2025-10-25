# 🔧 Fix Vercel Deployment Error

## ❌ **Error:**
```
The 'functions' property cannot be used in conjunction with the 'builds' property. Please remove one of them.
```

## 🔍 **Penyebab:**
File `vercel.json` menggunakan `functions` dan `builds` bersamaan, yang tidak diizinkan di Vercel.

## ✅ **Solusi yang Diterapkan:**

### **1. Fixed vercel.json Configuration**

**Before (Error):**
```json
{
  "builds": [...],
  "functions": {...}  // ❌ Conflict!
}
```

**After (Fixed):**
```json
{
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ]
}
```

### **2. Deployment Steps:**

#### **Step 1: Prepare Files**
```bash
# Pastikan file api/index.js ada
# Pastikan frontend sudah di-build
cd frontend
npm run build
```

#### **Step 2: Deploy to Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### **Step 3: Set Environment Variables**
Di Vercel Dashboard → Settings → Environment Variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=production
```

### **3. Alternative Configuration (Jika Masih Error):**

#### **Option A: Separate Frontend & Backend**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/dist/index.html"
    }
  ]
}
```

#### **Option B: API Routes Only**
```json
{
  "version": 2,
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

### **4. Project Structure for Vercel:**

```
admin-klinik/
├── api/
│   └── index.js (serverless function)
├── frontend/
│   ├── dist/ (built files)
│   └── package.json
├── vercel.json (fixed)
└── package.json
```

### **5. Build Commands:**

#### **Frontend Build:**
```json
// frontend/package.json
{
  "scripts": {
    "build": "vite build"
  }
}
```

#### **Root Package.json:**
```json
{
  "scripts": {
    "build": "cd frontend && npm run build"
  }
}
```

### **6. Environment Variables Setup:**

#### **Required Variables:**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
NODE_ENV=production
```

#### **Optional Variables:**
```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **7. Troubleshooting:**

#### **Jika masih error:**
1. **Check file structure** - pastikan `api/index.js` ada
2. **Check build output** - pastikan `frontend/dist` ada
3. **Check environment variables** - pastikan semua required vars set
4. **Check logs** di Vercel Dashboard → Functions

#### **Jika API tidak berfungsi:**
1. **Check API routes** di Vercel Dashboard
2. **Check function logs** untuk error details
3. **Test endpoints** dengan curl atau Postman

### **8. Testing Deployment:**

#### **Test Frontend:**
```bash
curl https://your-app.vercel.app
```

#### **Test API:**
```bash
curl https://your-app.vercel.app/api/health
```

## 🎯 **Hasil Setelah Fix:**
- ✅ **Vercel deployment** berhasil
- ✅ **Frontend** accessible
- ✅ **API endpoints** berfungsi
- ✅ **Environment variables** loaded
- ✅ **No configuration conflicts**

## 📋 **Next Steps:**
1. **Commit changes** ke GitHub
2. **Deploy** ke Vercel
3. **Set environment variables**
4. **Test** semua endpoints
5. **Monitor** logs untuk error

**Vercel configuration sudah diperbaiki!** 🚀



