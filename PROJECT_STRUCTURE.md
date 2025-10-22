# 📂 Struktur Project - Admin Klinik Desktop

Visualisasi lengkap struktur project setelah konversi ke Desktop App.

## 🌳 File Tree

```
D:\AdminKlinik\
│
├── 📁 electron/                        ← BARU - Electron Configuration
│   ├── main.js                         (Main process - window & backend)
│   └── preload.js                      (Security bridge)
│
├── 📁 backend/                         ← UPDATED - Backend API
│   ├── database.js                     (Database config - support Electron)
│   ├── server.js                       (Express API - Electron aware)
│   ├── hospital.db                     (SQLite database - auto generated)
│   ├── package.json
│   └── node_modules/
│
├── 📁 frontend/                        ← TETAP SAMA - React UI
│   ├── 📁 src/
│   │   ├── 📁 pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Patients.jsx
│   │   │   └── Schedules.jsx
│   │   ├── 📁 config/
│   │   │   └── api.js                  (API config helper)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── dist/                           (Build output)
│   └── node_modules/
│
├── 📁 build/                           ← BARU - Icon Files
│   └── README.md                       (Icon guidelines)
│   └── icon.ico                        (Windows icon - optional)
│   └── icon.icns                       (macOS icon - optional)
│   └── icon.png                        (Linux icon - optional)
│
├── 📁 dist-electron/                   ← BUILD OUTPUT (auto generated)
│   ├── Admin Klinik Setup 1.0.0.exe   (Windows installer)
│   ├── Admin Klinik-1.0.0.dmg         (macOS installer)
│   └── Admin Klinik-1.0.0.AppImage    (Linux executable)
│
├── 📄 package.json                     ← UPDATED - Root config dengan Electron
├── 📄 .gitignore                       ← UPDATED - Ignore Electron builds
├── 📄 .electronrc                      ← BARU - Electron version config
│
├── 🚀 Helper Scripts:
│   ├── install.bat                     (Install dependencies - Windows)
│   ├── install.sh                      (Install dependencies - Mac/Linux)
│   ├── run-dev.bat                     (Run development - Windows)
│   ├── run-dev.sh                      (Run development - Mac/Linux)
│   └── build-windows.bat               (Build installer - Windows)
│
└── 📚 Dokumentasi:
    ├── MULAI_DISINI.md                 ⭐ START HERE!
    ├── QUICK_START.md                  (Quick start 5 menit)
    ├── DESKTOP_APP.md                  (Panduan lengkap)
    ├── CHANGES_SUMMARY.md              (Technical details)
    ├── PROJECT_STRUCTURE.md            (File ini)
    └── README.md                       (Overview)
```

## 📊 File Count Summary

| Kategori | Count | Status |
|----------|-------|--------|
| **Baru** | 15+ | ✅ Created |
| **Diupdate** | 5 | ✅ Modified |
| **Dihapus** | 6 | ✅ Removed |
| **Tetap** | All Frontend | ✅ Unchanged |

## 🔍 Detail per Folder

### `/electron/` - Electron Core ⚡

```
electron/
├── main.js       (300+ lines)
│   ├── Create BrowserWindow
│   ├── Start backend server
│   ├── Handle app lifecycle
│   └── IPC communication
│
└── preload.js    (15 lines)
    └── Expose safe APIs to renderer
```

**Fungsi**: Mengelola aplikasi desktop, window, dan backend server.

---

### `/backend/` - API Server 🔧

```
backend/
├── database.js   ← Modified
│   ├── Dynamic DB path (Electron support)
│   └── Create tables if not exists
│
├── server.js     ← Modified
│   ├── Express API
│   ├── Electron mode detection
│   └── Conditional CORS
│
└── hospital.db   (Auto generated)
    ├── patients table
    └── schedules table
```

**Changes**:
- ✅ Support database path dari Electron
- ✅ Disable CORS untuk desktop mode
- ✅ Log Electron/Web mode

---

### `/frontend/` - React UI 🎨

```
frontend/src/
├── pages/
│   ├── Dashboard.jsx    (120 lines) - Statistik & overview
│   ├── Patients.jsx     (315 lines) - CRUD pasien
│   └── Schedules.jsx    (365 lines) - CRUD jadwal
│
├── config/
│   └── api.js           ← NEW - API config helper
│
├── App.jsx              (Router & navigation)
├── main.jsx             (React entry point)
└── index.css            (Global styles)
```

**Status**: ✅ Tetap sama, tidak perlu perubahan!

---

### `/build/` - Assets 🎨

```
build/
├── README.md        (Icon guidelines)
├── icon.ico         (Windows - optional)
├── icon.icns        (macOS - optional)
└── icon.png         (Linux - optional)
```

**Fungsi**: Menyimpan icon aplikasi untuk berbagai platform.

---

### Root Files 📄

| File | Status | Deskripsi |
|------|--------|-----------|
| `package.json` | ✅ Updated | Electron deps & scripts |
| `.gitignore` | ✅ Updated | Ignore build outputs |
| `.electronrc` | ✅ New | Electron version |
| `install.bat` | ✅ New | Install helper (Win) |
| `install.sh` | ✅ New | Install helper (Unix) |
| `run-dev.bat` | ✅ New | Dev mode (Win) |
| `run-dev.sh` | ✅ New | Dev mode (Unix) |
| `build-windows.bat` | ✅ New | Build helper (Win) |

---

## 🗺️ Application Flow

```
┌─────────────────────────────────────────────────┐
│  User Double-clicks Installer                   │
│  → Install to Program Files                     │
│  → Create Desktop Shortcut                      │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  User Launches Application                      │
│  → electron/main.js starts                      │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Electron Main Process                          │
│  1. Start backend server (port 3000)            │
│  2. Create BrowserWindow                        │
│  3. Load frontend from dist/                    │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Backend Server (Express)                       │
│  • Load database from AppData                   │
│  • Create tables if needed                      │
│  • Listen on localhost:3000                     │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Frontend (React)                               │
│  • Fetch data from localhost:3000               │
│  • Display Dashboard/Patients/Schedules         │
│  • User interacts with UI                       │
└─────────────────────────────────────────────────┘
```

## 💾 Data Flow

```
User Input (React Form)
    │
    ▼
Frontend sends HTTP request
    │
    ▼
Backend API (Express) receives request
    │
    ▼
Database Query (SQLite via better-sqlite3)
    │
    ▼
Database File (AppData/hospital.db)
    │
    ▼
Response back through the chain
    │
    ▼
UI Updates (React state)
```

## 📍 Database Locations

```
Windows:
C:\Users\<Username>\AppData\Roaming\Admin Klinik\hospital.db

macOS:
/Users/<Username>/Library/Application Support/Admin Klinik/hospital.db

Linux:
/home/<username>/.config/Admin Klinik/hospital.db
```

## 🔄 Development vs Production

### Development Mode (`npm run dev`)

```
Terminal 1: Backend (port 3000)
    ↓
Terminal 2: Frontend Vite Server (port 5173)
    ↓
Terminal 3: Electron Window
    ↓
Electron loads from http://localhost:5173
• Hot reload enabled
• DevTools open
• Fast development
```

### Production Build (`npm run electron:build`)

```
1. Build frontend → frontend/dist/
2. Package everything → dist-electron/
3. Create installer (NSIS/DMG/AppImage)
4. Single .exe/.dmg/.AppImage file

User installs:
• Backend bundled inside
• Frontend bundled inside
• Database created on first run
• No internet needed
```

## 📦 What Gets Bundled?

### Included in Installer:
✅ Electron runtime  
✅ Node.js runtime  
✅ Backend code (Express + routes)  
✅ Frontend code (React built)  
✅ node_modules (dependencies)  
✅ SQLite library (better-sqlite3)  

### NOT Included:
❌ Database file (created on first run)  
❌ Development dependencies  
❌ Source maps  
❌ Documentation files  

## 🎯 Entry Points

| Mode | Entry Point | Loads From |
|------|-------------|------------|
| **Development** | `electron/main.js` | `http://localhost:5173` |
| **Production** | `electron/main.js` | `frontend/dist/index.html` |
| **Web Fallback** | N/A | `backend/server.js` + Vite |

## 🔐 Security Architecture

```
┌─────────────────────────────────────┐
│  Main Process (Node.js)             │
│  • Full access to system            │
│  • Start backend                    │
│  • File system access               │
└──────────────┬──────────────────────┘
               │
          IPC Bridge
          (preload.js)
               │
┌──────────────▼──────────────────────┐
│  Renderer Process (Browser)         │
│  • Sandboxed                        │
│  • Limited access                   │
│  • Only approved APIs               │
└─────────────────────────────────────┘
```

## 📊 Size Estimates

| Component | Size |
|-----------|------|
| Electron Runtime | ~100 MB |
| Node.js Runtime | ~15 MB |
| Dependencies | ~50 MB |
| Your Code | ~5 MB |
| **Total Installer** | **~170 MB** |

(Compressed installer akan lebih kecil, ~100 MB)

## 🎨 Customization Points

| What | Where | How |
|------|-------|-----|
| **App Name** | `package.json` | Edit `productName` |
| **Version** | `package.json` | Edit `version` |
| **Icon** | `build/` folder | Add icon files |
| **Window Size** | `electron/main.js` | Edit `width/height` |
| **Port** | `electron/main.js` | Edit `PORT` constant |
| **Menu** | `electron/main.js` | Add Menu.setApplicationMenu |

## 🚀 Quick Reference

### Start Development
```bash
npm run dev
```

### Build Production
```bash
npm run electron:build:win      # Windows
npm run electron:build:mac      # macOS
npm run electron:build:linux    # Linux
```

### Output Location
```
dist-electron/Admin Klinik Setup 1.0.0.exe
```

---

**For more details, see:**
- [MULAI_DISINI.md](./MULAI_DISINI.md) - Start here!
- [DESKTOP_APP.md](./DESKTOP_APP.md) - Full documentation
- [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md) - Technical changes

