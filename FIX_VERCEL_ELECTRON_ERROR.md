# 🔧 Fix Vercel Electron Builder Error

## ❌ **Error:**
```
npm error command sh -c electron-builder install-app-dep
npm error sh: line 1: electron-builder: command not found
Error: Command "npm install" exited with 127
```

## 🔍 **Penyebab:**
Vercel mencoba menginstall `electron-builder` dari root `package.json` yang tidak diperlukan untuk web deployment.

## ✅ **Solusi yang Diterapkan:**

### **1. Updated vercel.json Configuration**

**Added custom install and build commands:**
```json
{
  "installCommand": "npm install --prefix frontend && npm install --prefix backend",
  "buildCommand": "npm --prefix frontend run build"
}
```

### **2. Alternative Solutions:**

#### **Option A: Use .vercelignore (Recommended)**

Buat file `.vercelignore` di root directory:
```
# Ignore Electron files for web deployment
electron/
dist-electron/
build/
*.exe
*.dmg
*.AppImage
*.deb

# Ignore root package.json electron dependencies
package.json
package-lock.json
```

#### **Option B: Separate Web Package.json**

Gunakan `package-vercel.json` yang sudah dibuat:
```bash
# Rename files for Vercel deployment
mv package.json package-electron.json
mv package-vercel.json package.json
```

#### **Option C: Vercel Project Settings**

Di Vercel Dashboard → Project Settings → Build & Development Settings:

**Install Command:**
```bash
npm install --prefix frontend && npm install --prefix backend
```

**Build Command:**
```bash
npm --prefix frontend run build
```

**Output Directory:**
```
frontend/dist
```

### **3. Environment Variables Setup:**

Di Vercel Dashboard → Settings → Environment Variables:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
NODE_ENV=production
```

### **4. Project Structure for Vercel:**

```
admin-klinik/
├── api/
│   └── index.js (serverless function)
├── frontend/
│   ├── dist/ (built files)
│   └── package.json
├── backend/
│   └── package.json
├── vercel.json (updated)
├── .vercelignore (new)
└── package-vercel.json (alternative)
```

### **5. Deployment Steps:**

#### **Step 1: Prepare Files**
```bash
# Build frontend
cd frontend
npm install
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

#### **Step 3: Configure Settings**
- **Framework Preset:** Other
- **Root Directory:** ./
- **Build Command:** `npm --prefix frontend run build`
- **Output Directory:** `frontend/dist`
- **Install Command:** `npm install --prefix frontend && npm install --prefix backend`

### **6. Troubleshooting:**

#### **Jika masih error:**
1. **Check .vercelignore** - pastikan electron files di-ignore
2. **Check build logs** di Vercel Dashboard
3. **Check environment variables** - pastikan semua set
4. **Check API routes** - pastikan `api/index.js` ada

#### **Jika API tidak berfungsi:**
1. **Check function logs** di Vercel Dashboard
2. **Test endpoints** dengan curl
3. **Check Supabase connection** di logs

### **7. Testing Deployment:**

#### **Test Frontend:**
```bash
curl https://your-app.vercel.app
```

#### **Test API:**
```bash
curl https://your-app.vercel.app/api/health
```

### **8. Alternative: Separate Repositories**

Jika masih bermasalah, pertimbangkan:

#### **Frontend Repository:**
```
admin-klinik-frontend/
├── src/
├── dist/
├── package.json
└── vercel.json
```

#### **Backend Repository:**
```
admin-klinik-backend/
├── api/
├── package.json
└── vercel.json
```

## 🎯 **Hasil Setelah Fix:**
- ✅ **No electron-builder errors**
- ✅ **Frontend builds successfully**
- ✅ **API endpoints work**
- ✅ **Web deployment successful**
- ✅ **No desktop dependencies**

## 📋 **Next Steps:**
1. **Commit changes** ke GitHub
2. **Deploy** ke Vercel
3. **Test** semua endpoints
4. **Monitor** logs untuk error
5. **Configure** environment variables

**Vercel deployment error sudah diperbaiki!** 🚀
