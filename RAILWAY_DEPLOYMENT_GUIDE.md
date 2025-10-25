# 🚀 Railway Deployment Guide

## ✅ **Railway vs Vercel:**
- ✅ **Full-stack support** - Frontend + Backend dalam satu deployment
- ✅ **No routing issues** - Railway handle routing otomatis
- ✅ **Environment variables** - Easy setup
- ✅ **Database support** - Built-in PostgreSQL
- ✅ **No build conflicts** - Tidak ada masalah dengan Electron

## 📋 **Deployment Steps:**

### **1. Install Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login
```

### **2. Initialize Project**
```bash
# Initialize Railway project
railway init

# Link to existing project (optional)
railway link
```

### **3. Set Environment Variables**
```bash
# Set Supabase variables
railway variables set SUPABASE_URL=your_supabase_url
railway variables set SUPABASE_ANON_KEY=your_supabase_anon_key
railway variables set NODE_ENV=production
```

### **4. Deploy**
```bash
# Deploy to Railway
railway up
```

## 🔧 **Railway Configuration:**

### **railway.json:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:production",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **package.json Scripts:**
```json
{
  "scripts": {
    "start:production": "npm run build && npm --prefix backend start"
  }
}
```

## 🌐 **Environment Variables:**

### **Required Variables:**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
NODE_ENV=production
```

### **Optional Variables:**
```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3000
```

## 📁 **Project Structure:**
```
admin-klinik/
├── frontend/
│   ├── dist/ (built files)
│   └── package.json
├── backend/
│   ├── server.js
│   └── package.json
├── railway.json
└── package.json
```

## 🔧 **Railway Dashboard Setup:**

### **1. Create New Project:**
1. **Buka** https://railway.app
2. **Login** dengan GitHub
3. **Click** "New Project"
4. **Select** "Deploy from GitHub repo"
5. **Choose** repository `admin-klinik`

### **2. Configure Settings:**
- **Root Directory:** `./`
- **Build Command:** `npm run build`
- **Start Command:** `npm run start:production`
- **Port:** `3000` (auto-detected)

### **3. Set Environment Variables:**
Di Railway Dashboard → Variables:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
NODE_ENV=production
```

## 🚀 **Deployment Commands:**

### **Quick Deploy:**
```bash
# One-time setup
railway login
railway init

# Deploy
railway up
```

### **With Environment Variables:**
```bash
# Set variables and deploy
railway variables set SUPABASE_URL=your_url
railway variables set SUPABASE_ANON_KEY=your_key
railway up
```

### **Check Deployment:**
```bash
# Check logs
railway logs

# Check status
railway status
```

## 🔍 **Troubleshooting:**

### **Common Issues:**

#### **1. Build Fails:**
```bash
# Check build logs
railway logs

# Common fixes:
# - Check Node.js version
# - Check package.json scripts
# - Check environment variables
```

#### **2. Port Issues:**
```bash
# Railway auto-detects port from process.env.PORT
# Make sure backend uses PORT environment variable
```

#### **3. Environment Variables:**
```bash
# Check variables
railway variables

# Set missing variables
railway variables set KEY=value
```

### **Debug Commands:**
```bash
# View logs
railway logs

# Connect to service
railway connect

# Check status
railway status
```

## 📊 **Monitoring:**

### **Railway Dashboard:**
- **Metrics** - CPU, Memory, Network
- **Logs** - Real-time application logs
- **Deployments** - Deployment history
- **Variables** - Environment variables

### **Health Check:**
```bash
# Test health endpoint
curl https://your-app.railway.app/api/health
```

## 🎯 **Advantages of Railway:**

### **vs Vercel:**
- ✅ **Full-stack support** - No routing issues
- ✅ **Database included** - PostgreSQL available
- ✅ **No build conflicts** - Handle complex dependencies
- ✅ **Persistent storage** - File uploads work
- ✅ **Background jobs** - Cron jobs supported

### **vs Heroku:**
- ✅ **Free tier** - No credit card required
- ✅ **Faster deployment** - Modern infrastructure
- ✅ **Better DX** - Great developer experience
- ✅ **GitHub integration** - Auto-deploy from GitHub

## 📋 **Post-Deployment:**

### **1. Test Application:**
```bash
# Get deployment URL
railway domain

# Test frontend
curl https://your-app.railway.app

# Test API
curl https://your-app.railway.app/api/health
```

### **2. Set Custom Domain (Optional):**
```bash
# Add custom domain
railway domain add your-domain.com
```

### **3. Monitor Performance:**
- **Check Railway Dashboard** untuk metrics
- **Monitor logs** untuk errors
- **Test all features** secara manual

## 🎉 **Success Checklist:**

- ✅ **Railway project created**
- ✅ **Environment variables set**
- ✅ **Application deployed**
- ✅ **Frontend accessible**
- ✅ **API endpoints working**
- ✅ **Database connected**
- ✅ **No errors in logs**

## 📞 **Support:**

### **Railway Documentation:**
- **Docs:** https://docs.railway.app
- **Community:** https://discord.gg/railway
- **GitHub:** https://github.com/railwayapp

### **Common Commands:**
```bash
railway help
railway status
railway logs
railway variables
railway domain
```

**Railway deployment siap!** 🚀



