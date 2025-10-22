# 🖥️ Setup 2 Devices untuk Real-Time Collaboration

## 📋 Overview

Sistem ini dirancang untuk **hanya 2 device** yang dapat bekerja secara bersamaan dengan real-time sync. Perubahan di satu device akan langsung terlihat di device lainnya dalam waktu 10 detik.

## 🎯 Skenario Penggunaan

### Use Case
- **Device 1 (Ruang Admin Utama)**: Admin utama yang membuat dan mengelola jadwal
- **Device 2 (Ruang Perawat/Pendukung)**: Staff pendukung yang memonitor dan melakukan update

## 🔧 Setup Development (Local Network)

### Option 1: Kedua Device di Komputer yang Sama

#### Device 1 (Tab/Window Pertama)
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start
# Backend running di http://localhost:3000

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
# Frontend running di http://localhost:5173
```

#### Device 2 (Tab/Window Kedua)
1. Buka browser window/tab baru
2. Akses `http://localhost:5173`
3. Login dengan akun admin berbeda (atau sama)
4. Kedua tab akan sync otomatis

**Testing Real-Time:**
- Di tab 1: Buat jadwal otomatis
- Di tab 2: Tunggu ~10 detik, jadwal akan muncul otomatis
- Di tab 2: Edit data pasien
- Di tab 1: Tunggu ~10 detik, perubahan akan muncul

### Option 2: Kedua Device di Komputer Berbeda (Same Network)

#### Server (Komputer dengan Backend)
```bash
# Cari IP address komputer
ipconfig  # Windows
ifconfig  # Linux/Mac
# Misalnya: 192.168.1.100

# Jalankan backend
cd backend
npm start
# Backend di http://192.168.1.100:3000

# Jalankan frontend
cd frontend
npm run dev -- --host
# Frontend di http://192.168.1.100:5173
```

#### Client 1 (Komputer Pertama)
1. Buka browser
2. Akses `http://192.168.1.100:5173`
3. Login

#### Client 2 (Komputer Kedua)
1. Buka browser
2. Akses `http://192.168.1.100:5173`
3. Login dengan akun berbeda

**Catatan:** Pastikan kedua komputer di network yang sama (WiFi/LAN yang sama)

## 🚀 Setup Production (Internet)

### Backend Deployment (Pilih Salah Satu)

#### Option A: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway init
railway up

# Get URL: https://adminklinik-backend.railway.app
```

#### Option B: Render
1. Buat akun di render.com
2. Create New > Web Service
3. Connect GitHub repo
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `npm start`

#### Option C: VPS (Digital Ocean, AWS, dll)
```bash
# SSH ke server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repo
git clone <your-repo>
cd AdminKlinik/backend

# Install dependencies
npm install

# Install PM2
npm install -g pm2

# Start server
pm2 start server.js
pm2 save
pm2 startup
```

### Frontend Deployment

#### Option A: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Get URL: https://adminklinik.vercel.app
```

#### Option B: Netlify
1. Buat akun di netlify.com
2. Import dari GitHub
3. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

### Akses Production
- **Device 1**: `https://adminklinik.vercel.app`
- **Device 2**: `https://adminklinik.vercel.app`
- Keduanya akses URL yang sama
- Login dengan akun masing-masing
- Real-time sync otomatis berjalan

## 🔄 Cara Kerja Real-Time Sync

### Architecture
```
Device 1                Backend               Device 2
   |                      |                      |
   |-- Create Schedule -->|                      |
   |                      |-- Save to DB         |
   |<-- Success ----------|                      |
   |                      |                      |
   |                      |<-- Auto Refresh -----|
   |                      |                      |
   |                      |-- Return Latest ---->|
   |                      |                      |
```

### Polling Mechanism
```javascript
// Auto-refresh setiap 10 detik
useEffect(() => {
  fetchScheduleGrid();
  
  const interval = setInterval(() => {
    fetchScheduleGrid();
  }, 10000);
  
  return () => clearInterval(interval);
}, []);
```

### Kenapa 10 Detik?
- Balance antara real-time dan performance
- Tidak overload server
- Cukup responsif untuk use case klinik
- Bisa diubah jika diperlukan (5 detik, 15 detik, dll)

## 👥 User Management untuk 2 Devices

### Recommended Setup

#### Device 1 - Admin Utama
```
Username: admin_utama
Full Name: Admin Utama
Role: Super Admin
Permissions: Full Access
```

#### Device 2 - Admin Pendukung
```
Username: admin_pendukung
Full Name: Admin Pendukung
Role: Admin
Permissions: Full Access (atau limited jika perlu)
```

### Membuat 2 User
1. Login sebagai admin pertama
2. Buka menu "User Management"
3. Tambah user baru untuk device kedua
4. Set username dan password
5. Device kedua login dengan kredensial tersebut

## 🔐 Security Best Practices

### 1. Authentication
- Setiap device harus login dengan kredensial masing-masing
- Token disimpan di localStorage
- Auto-logout setelah idle

### 2. Authorization
- Cek token di setiap API request
- Validasi user role
- Audit log untuk tracking aktivitas

### 3. Network Security (Production)
- Gunakan HTTPS (SSL/TLS)
- Set CORS dengan benar
- Firewall rules di server
- Rate limiting untuk API

## 📊 Monitoring 2 Devices

### Dashboard View
- Total users online (max 2)
- Last activity timestamp
- Current active sessions
- Sync status indicator

### Indicators
- 🟢 **Both Devices Connected**: 2 active sessions
- 🟡 **One Device Connected**: 1 active session
- 🔴 **No Devices Connected**: 0 active sessions

## 🚨 Troubleshooting

### Device tidak bisa connect
**Problem**: Device kedua tidak bisa akses aplikasi

**Solution**:
1. Pastikan backend running
2. Cek firewall (allow port 3000 dan 5173)
3. Cek network connectivity
4. Pastikan URL correct

### Sync tidak berjalan
**Problem**: Perubahan di device 1 tidak muncul di device 2

**Solution**:
1. Cek console browser untuk error
2. Pastikan auto-refresh aktif
3. Hard refresh (Ctrl+F5)
4. Cek backend logs
5. Pastikan database connection OK

### Conflict saat edit bersamaan
**Problem**: Kedua device edit data yang sama secara bersamaan

**Solution**:
1. Last write wins (data terakhir yang disimpan)
2. Refresh untuk lihat perubahan terbaru
3. Koordinasi manual untuk avoid conflict
4. Implementasi lock mechanism (future improvement)

## 🎯 Workflow Recommendations

### Pembagian Tugas

#### Device 1 (Admin Utama)
- Membuat jadwal otomatis
- Mengelola data pasien (CRUD)
- Konfigurasi sistem
- Generate laporan

#### Device 2 (Admin Pendukung)
- Monitor jadwal real-time
- Update status pasien
- Edit catatan
- Print jadwal

### Best Practices
1. **Komunikasi**: Koordinasi saat akan edit data yang sama
2. **Refresh Regular**: Refresh halaman setiap beberapa menit
3. **Check Sync**: Perhatikan indikator sync aktif
4. **Backup Data**: Export data secara berkala

## 📈 Performance Optimization

### Frontend
```javascript
// Debounce refresh
const debouncedRefresh = debounce(fetchScheduleGrid, 10000);

// Only fetch when visible
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    fetchScheduleGrid();
  }
});
```

### Backend
```javascript
// Cache frequently accessed data
const cache = new Map();

// Connection pooling
const pool = {
  max: 10,
  min: 2
};
```

## 🔮 Future Enhancements

### Potential Improvements
1. **WebSocket untuk instant sync** (instead of polling)
2. **Optimistic UI updates**
3. **Conflict resolution UI**
4. **Offline mode dengan sync**
5. **Push notifications**
6. **Collaborative editing indicators** (show who's editing what)

## ✅ Checklist Setup

### Development
- [ ] Backend running
- [ ] Frontend running
- [ ] Database initialized
- [ ] 2 users created
- [ ] Both devices can login
- [ ] Sync tested and working

### Production
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Database migrated
- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Users created
- [ ] Both devices tested

## 📞 Support

Jika ada masalah:
1. Cek dokumentasi ini
2. Cek `TROUBLESHOOTING.md`
3. Cek `AUTO_SCHEDULING_GUIDE.md`
4. Lihat console browser untuk error
5. Lihat backend logs

---

**Catatan**: Sistem ini dioptimalkan untuk **maksimal 2 concurrent devices**. Jika butuh lebih dari 2, perlu architectural changes (WebSocket, Redis, dll).

