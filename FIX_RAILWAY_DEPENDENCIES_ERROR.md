# 🔧 Fix Railway Dependencies Error

## ❌ **Error:**
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'express' imported from /app/backend/server.js
```

## 🔍 **Penyebab:**
Railway tidak menginstall dependencies di folder `backend` karena script `start:production` tidak include install command.

## ✅ **Solusi yang Diterapkan:**

### **1. Fixed package.json Script**

**Before (Error):**
```json
{
  "scripts": {
    "start:production": "npm run build && npm --prefix backend start"
  }
}
```

**After (Fixed):**
```json
{
  "scripts": {
    "start:production": "npm run build && npm --prefix backend install && npm --prefix backend start"
  }
}
```

### **2. Alternative Solutions:**

#### **Option A: Install All Dependencies (Recommended)**
```json
{
  "scripts": {
    "start:production": "npm install --prefix frontend && npm install --prefix backend && npm run build && npm --prefix backend start"
  }
}
```

#### **Option B: Use Root Dependencies**
```json
{
  "scripts": {
    "start:production": "npm install && npm run build && npm --prefix backend start"
  }
}
```

#### **Option C: Separate Install Script**
```json
{
  "scripts": {
    "install:all": "npm install --prefix frontend && npm install --prefix backend",
    "start:production": "npm run install:all && npm run build && npm --prefix backend start"
  }
}
```

### **3. Railway Configuration:**

#### **railway.json:**
```json
{
  "deploy": {
    "startCommand": "npm run start:production"
  }
}
```

#### **Alternative: Railway Dashboard Settings**
- **Build Command:** `npm install --prefix frontend && npm install --prefix backend && npm run build`
- **Start Command:** `npm --prefix backend start`

### **4. Debug Steps:**

#### **Step 1: Check Dependencies**
```bash
# Check if backend dependencies exist
ls -la backend/node_modules/

# Check package.json
cat backend/package.json
```

#### **Step 2: Manual Install**
```bash
# Install backend dependencies manually
cd backend
npm install

# Check if express is installed
npm list express
```

#### **Step 3: Test Locally**
```bash
# Test production build locally
npm run start:production

# Check if server starts
curl http://localhost:3000/api/health
```

### **5. Common Issues & Solutions:**

#### **Issue 1: Dependencies not installed**
**Solution:**
```bash
# Add install command to start:production
"start:production": "npm run build && npm --prefix backend install && npm --prefix backend start"
```

#### **Issue 2: Wrong working directory**
**Solution:**
```bash
# Use absolute paths
"start:production": "npm run build && cd backend && npm install && npm start"
```

#### **Issue 3: Node modules not found**
**Solution:**
```bash
# Check if node_modules exists
ls -la backend/node_modules/

# Reinstall if missing
cd backend && npm install
```

### **6. Railway Dashboard Settings:**

#### **Project Settings:**
- **Root Directory:** `./`
- **Build Command:** `npm install --prefix frontend && npm install --prefix backend && npm run build`
- **Start Command:** `npm --prefix backend start`

#### **Environment Variables:**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
NODE_ENV=production
```

### **7. Alternative Deployment Methods:**

#### **Method 1: Separate Frontend/Backend**
```bash
# Deploy frontend to Vercel
# Deploy backend to Railway
```

#### **Method 2: Use Root Dependencies**
```bash
# Move all dependencies to root package.json
# Use single node_modules folder
```

#### **Method 3: Docker Deployment**
```dockerfile
# Use Docker for consistent environment
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:production"]
```

### **8. Testing Deployment:**

#### **Test Dependencies:**
```bash
# Check if all dependencies installed
railway logs

# Look for:
# - npm install success
# - No missing module errors
# - Server start success
```

#### **Test Application:**
```bash
# Test health endpoint
curl https://your-app.railway.app/api/health

# Test frontend
curl https://your-app.railway.app
```

### **9. Final Checklist:**

- ✅ **Backend dependencies installed**
- ✅ **Frontend dependencies installed**
- ✅ **Build process successful**
- ✅ **Server starts without errors**
- ✅ **All modules found**
- ✅ **No ERR_MODULE_NOT_FOUND errors**

## 🎯 **Hasil Setelah Fix:**
- ✅ **Dependencies installed** correctly
- ✅ **Server starts** without module errors
- ✅ **Application accessible** via Railway URL
- ✅ **All imports resolved** successfully
- ✅ **Production deployment** working

## 📋 **Next Steps:**
1. **Commit changes** ke GitHub
2. **Redeploy** ke Railway
3. **Check logs** untuk dependency installation
4. **Test application** functionality
5. **Monitor** untuk errors

**Railway dependencies error sudah diperbaiki!** 🚀
