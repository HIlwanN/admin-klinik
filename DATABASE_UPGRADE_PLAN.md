# 🗄️ Database Upgrade Plan untuk Multi-User

Panduan upgrade database untuk support 25 admin dengan 2 shared workstation.

## 📊 Current vs Target

### Current (Single User):
```
💻 Desktop App → 📁 Local SQLite (hospital.db)
```

### Target (25 Users, 2 PCs):
```
💻 PC-A (25 users) ↘
                    📁 Network SQLite (hospital.db)
💻 PC-B (25 users) ↗
```

---

## 🛠️ Option 1: SQLite Network (Recommended)

### Why SQLite Network?

1. **✅ Minimal Code Changes**
   - Keep existing better-sqlite3 
   - Same SQL queries
   - Just change database path

2. **✅ Performance for Your Use Case**
   - SQLite handles 25 concurrent users well
   - 2 PCs = max 2 simultaneous writes (manageable)
   - Read operations unlimited

3. **✅ Easy Setup**
   - Network drive or shared folder
   - No database server installation
   - No DBA expertise required

### Implementation Steps

#### Step 1: Enhanced Database Configuration

```javascript
// backend/database.js - Updated version
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database path resolution with fallback
function getDatabasePath() {
  // Priority 1: Environment variable (for network path)
  if (process.env.DB_PATH) {
    return process.env.DB_PATH;
  }
  
  // Priority 2: Network drive (if mapped)
  const networkPaths = [
    'Z:\\AdminKlinik\\hospital.db',           // Mapped drive
    '\\\\SERVER\\SharedData\\hospital.db',    // UNC path
    '\\\\192.168.1.100\\Shared\\hospital.db' // IP-based path
  ];
  
  for (const path of networkPaths) {
    try {
      if (fs.existsSync(path) || fs.existsSync(dirname(path))) {
        return path;
      }
    } catch (error) {
      // Continue to next path
    }
  }
  
  // Priority 3: Local fallback (development)
  return join(__dirname, 'hospital.db');
}

const dbPath = getDatabasePath();
console.log('Database path:', dbPath);

// Enhanced SQLite configuration for concurrent access
const db = new Database(dbPath, {
  // Enable WAL mode for better concurrent access
  // WAL = Write-Ahead Logging
});

// Configure for multi-user access
db.pragma('journal_mode = WAL');           // Better concurrency
db.pragma('synchronous = NORMAL');         // Good balance of safety/speed  
db.pragma('cache_size = 10000');          // 10MB cache
db.pragma('temp_store = memory');         // Faster temporary operations
db.pragma('foreign_keys = ON');           // Maintain referential integrity

// Connection timeout for network delays
db.pragma('busy_timeout = 30000');        // 30 seconds timeout

// Test database connection
try {
  const testQuery = db.prepare('SELECT 1 as test').get();
  console.log('✅ Database connection successful:', testQuery);
} catch (error) {
  console.error('❌ Database connection failed:', error);
  process.exit(1);
}

// Enhanced table creation with user management
db.exec(`
  -- Existing tables (unchanged)
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    no_rekam_medis TEXT UNIQUE NOT NULL,
    tanggal_lahir TEXT NOT NULL,
    jenis_kelamin TEXT NOT NULL,
    alamat TEXT,
    telepon TEXT,
    diagnosa TEXT,
    golongan_darah TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    tanggal TEXT NOT NULL,
    waktu_mulai TEXT NOT NULL,
    waktu_selesai TEXT NOT NULL,
    ruangan TEXT,
    mesin_dialisis TEXT,
    perawat TEXT,
    catatan TEXT,
    status TEXT DEFAULT 'scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
  );

  -- NEW: Users management table
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'nurse', 'supervisor', 'staff')),
    shift TEXT CHECK (shift IN ('pagi', 'siang', 'malam', 'all')),
    phone TEXT,
    email TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    login_count INTEGER DEFAULT 0,
    preferred_station TEXT
  );

  -- NEW: Active sessions for multi-user
  CREATE TABLE IF NOT EXISTS active_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    station_id TEXT NOT NULL,
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    session_token TEXT UNIQUE,
    ip_address TEXT,
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- NEW: Audit log for accountability
  CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    station_id TEXT NOT NULL,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id INTEGER,
    old_values TEXT, -- JSON
    new_values TEXT, -- JSON
    description TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- NEW: Stations management
  CREATE TABLE IF NOT EXISTS stations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    is_online BOOLEAN DEFAULT 1,
    last_heartbeat DATETIME DEFAULT CURRENT_TIMESTAMP,
    current_user_id INTEGER,
    FOREIGN KEY (current_user_id) REFERENCES users(id)
  );

  -- Enhanced indexes for performance
  CREATE INDEX IF NOT EXISTS idx_patients_created_by ON patients(created_by);
  CREATE INDEX IF NOT EXISTS idx_schedules_patient_date ON schedules(patient_id, tanggal);
  CREATE INDEX IF NOT EXISTS idx_sessions_user_active ON active_sessions(user_id, is_active);
  CREATE INDEX IF NOT EXISTS idx_audit_user_time ON audit_log(user_id, timestamp);
  CREATE INDEX IF NOT EXISTS idx_audit_table_record ON audit_log(table_name, record_id);
`);

// Insert default data if tables are empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

if (userCount === 0) {
  console.log('📝 Creating default admin user...');
  
  // Create default admin (password: admin123)
  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  db.prepare(`
    INSERT INTO users (username, password_hash, full_name, role, shift)
    VALUES ('admin', ?, 'System Administrator', 'supervisor', 'all')
  `).run(hashedPassword);
  
  // Create default stations
  db.prepare(`
    INSERT OR REPLACE INTO stations (id, name, location) VALUES 
    ('pc-a', 'Komputer A - Resepsionis', 'Ruang Resepsionis'),
    ('pc-b', 'Komputer B - Administrasi', 'Ruang Administrasi')
  `);
  
  console.log('✅ Default data created');
}

console.log('🗄️ Database initialized successfully');

export default db;
```

#### Step 2: Enhanced Database Helper Functions

```javascript
// backend/db-helpers.js - New utility functions
import db from './database.js';

// Transaction wrapper for atomic operations
export function withTransaction(callback) {
  const transaction = db.transaction(callback);
  return transaction;
}

// User context for audit logging
export function withUserContext(userId, stationId) {
  return {
    // Enhanced insert with user tracking
    insertPatient: withTransaction((patientData) => {
      const stmt = db.prepare(`
        INSERT INTO patients (nama, no_rekam_medis, tanggal_lahir, jenis_kelamin, 
                             alamat, telepon, diagnosa, golongan_darah, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(...Object.values(patientData), userId);
      
      // Log the action
      logAudit(userId, stationId, 'create', 'patients', result.lastInsertRowid, 
              null, patientData, `Added patient: ${patientData.nama}`);
      
      return result;
    }),

    // Enhanced update with user tracking
    updatePatient: withTransaction((patientId, patientData) => {
      // Get old values for audit
      const oldPatient = db.prepare('SELECT * FROM patients WHERE id = ?').get(patientId);
      
      const stmt = db.prepare(`
        UPDATE patients 
        SET nama = ?, no_rekam_medis = ?, tanggal_lahir = ?, jenis_kelamin = ?,
            alamat = ?, telepon = ?, diagnosa = ?, golongan_darah = ?, 
            updated_at = CURRENT_TIMESTAMP, updated_by = ?
        WHERE id = ?
      `);
      
      const result = stmt.run(...Object.values(patientData), userId, patientId);
      
      if (result.changes > 0) {
        logAudit(userId, stationId, 'update', 'patients', patientId,
                oldPatient, patientData, `Updated patient: ${patientData.nama}`);
      }
      
      return result;
    }),

    // Enhanced delete with user tracking  
    deletePatient: withTransaction((patientId) => {
      const oldPatient = db.prepare('SELECT * FROM patients WHERE id = ?').get(patientId);
      
      if (oldPatient) {
        const result = db.prepare('DELETE FROM patients WHERE id = ?').run(patientId);
        
        if (result.changes > 0) {
          logAudit(userId, stationId, 'delete', 'patients', patientId,
                  oldPatient, null, `Deleted patient: ${oldPatient.nama}`);
        }
        
        return result;
      }
    })
  };
}

// Audit logging function
function logAudit(userId, stationId, action, tableName, recordId, oldValues, newValues, description) {
  const stmt = db.prepare(`
    INSERT INTO audit_log (user_id, station_id, action, table_name, record_id, 
                          old_values, new_values, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    userId, 
    stationId, 
    action, 
    tableName, 
    recordId,
    oldValues ? JSON.stringify(oldValues) : null,
    newValues ? JSON.stringify(newValues) : null,
    description
  );
}

// Connection health check
export function checkDatabaseHealth() {
  try {
    const result = db.prepare('SELECT datetime() as current_time').get();
    return { healthy: true, timestamp: result.current_time };
  } catch (error) {
    return { healthy: false, error: error.message };
  }
}

// Get database statistics
export function getDatabaseStats() {
  const stats = db.prepare(`
    SELECT 
      (SELECT COUNT(*) FROM patients) as total_patients,
      (SELECT COUNT(*) FROM schedules) as total_schedules,
      (SELECT COUNT(*) FROM users WHERE is_active = 1) as active_users,
      (SELECT COUNT(*) FROM active_sessions WHERE is_active = 1) as active_sessions
  `).get();
  
  return stats;
}
```

#### Step 3: Network Setup Requirements

**For System Administrator:**

1. **Create Shared Network Location**
   ```
   Option A: Windows File Share
   \\SERVER\SharedData\AdminKlinik\
   
   Option B: Mapped Network Drive  
   Z:\ → \\SERVER\SharedData\AdminKlinik\
   
   Option C: NAS Device
   \\NAS-IP\SharedVolume\AdminKlinik\
   ```

2. **Set Permissions**
   ```
   - Read/Write access for all admin users
   - Full control for IT admin
   - Network backup enabled
   ```

3. **Environment Configuration**
   ```bash
   # Set environment variable on both PCs:
   set DB_PATH=Z:\AdminKlinik\hospital.db
   
   # Or in Windows:
   System Properties → Advanced → Environment Variables
   Variable: DB_PATH
   Value: \\SERVER\SharedData\AdminKlinik\hospital.db
   ```

---

## 🛠️ Option 2: PostgreSQL Server (Enterprise)

### When to Choose PostgreSQL?

- **Large scale:** 50+ concurrent users
- **Complex queries:** Advanced reporting needs
- **High availability:** 24/7 critical operations  
- **Multiple locations:** Branch offices
- **Advanced features:** Triggers, stored procedures

### PostgreSQL Setup

#### Step 1: Database Migration Script

```javascript
// scripts/migrate-to-postgresql.js
import pkg from 'pg';
import Database from 'better-sqlite3';

const { Pool } = pkg;

// PostgreSQL connection
const pgPool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'hospital_db',
  user: 'admin',
  password: 'secure_password',
  max: 25,
});

// SQLite source
const sqliteDb = new Database('./hospital.db');

async function migrateSQLiteToPostgreSQL() {
  console.log('🔄 Starting migration...');
  
  // 1. Create PostgreSQL schema
  await pgPool.query(`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      nama VARCHAR(255) NOT NULL,
      no_rekam_medis VARCHAR(50) UNIQUE NOT NULL,
      tanggal_lahir DATE NOT NULL,
      jenis_kelamin VARCHAR(20) NOT NULL,
      alamat TEXT,
      telepon VARCHAR(20),
      diagnosa TEXT,
      golongan_darah VARCHAR(5),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER REFERENCES users(id),
      updated_by INTEGER REFERENCES users(id)
    );
  `);
  
  // 2. Migrate data
  const patients = sqliteDb.prepare('SELECT * FROM patients').all();
  
  for (const patient of patients) {
    await pgPool.query(`
      INSERT INTO patients (nama, no_rekam_medis, tanggal_lahir, jenis_kelamin, alamat, telepon, diagnosa, golongan_darah)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [patient.nama, patient.no_rekam_medis, patient.tanggal_lahir, patient.jenis_kelamin, 
        patient.alamat, patient.telepon, patient.diagnosa, patient.golongan_darah]);
  }
  
  console.log(`✅ Migrated ${patients.length} patients`);
  
  // Continue with schedules, etc...
}
```

#### Step 2: PostgreSQL Database Module

```javascript
// backend/database-pg.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'hospital_db',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASS || 'password',
  max: 25, // Connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Query helper with error handling
export async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Transaction helper
export async function withTransaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export default { query, withTransaction, pool };
```

---

## 📊 Performance Comparison

### SQLite Network vs PostgreSQL

| Metric | SQLite Network | PostgreSQL |
|--------|----------------|------------|
| **Setup Time** | 1 hour | 1-2 days |
| **Concurrent Reads** | Unlimited | Unlimited |
| **Concurrent Writes** | 1 (with WAL: ~10) | 25+ |
| **Query Performance** | Excellent | Excellent |
| **Backup** | File copy | pg_dump |
| **Monitoring** | Basic | Advanced |
| **Maintenance** | Minimal | Moderate |

### For Your Use Case (25 users, 2 PCs):

**SQLite Network is optimal because:**
- ✅ Max 2 simultaneous writes (1 per PC)
- ✅ 25 users but not all active simultaneously  
- ✅ Minimal infrastructure changes
- ✅ Existing code works with minor changes

---

## 🚀 Implementation Recommendation

### Phase 1: SQLite Network (Immediate - 1-2 days)
1. ✅ Setup network shared folder
2. ✅ Update database path configuration
3. ✅ Add user management tables
4. ✅ Implement multi-user login
5. ✅ Test with 2-3 users

### Phase 2: Enhanced Features (1-2 days)  
1. ✅ Audit logging system
2. ✅ Session management
3. ✅ Role-based access control
4. ✅ Real-time activity feed

### Phase 3: Optimization (1 day)
1. ✅ Performance tuning
2. ✅ Backup automation
3. ✅ Monitoring dashboard
4. ✅ Error handling

### Future: PostgreSQL Migration (Optional)
- Only if you need 50+ concurrent users
- Or multiple clinic locations
- Or advanced analytics/reporting

---

## 💾 Data Migration Plan

### Current → Network SQLite:
```bash
# 1. Stop application on both PCs
# 2. Copy database to network
copy "D:\AdminKlinik\backend\hospital.db" "Z:\AdminKlinik\hospital.db"

# 3. Update configuration
set DB_PATH=Z:\AdminKlinik\hospital.db

# 4. Start application
# Both PCs now use same database!
```

### Rollback Plan:
```bash
# If network issues, fallback to local:
copy "Z:\AdminKlinik\hospital.db" "D:\AdminKlinik\backend\hospital.db"
unset DB_PATH
# App uses local database again
```

---

## 🔐 Security Considerations

### SQLite Network:
- ✅ File-level permissions
- ✅ User authentication in app
- ✅ Audit logging
- ⚠️ Network security dependent

### PostgreSQL:
- ✅ Database-level security
- ✅ Encrypted connections (SSL)
- ✅ Role-based database permissions  
- ✅ Advanced authentication methods

---

## 📈 Scalability Path

```
Current: 1 User, 1 PC, Local SQLite
    ↓
Phase 1: 25 Users, 2 PCs, Network SQLite  ← YOUR TARGET
    ↓
Phase 2: 50+ Users, Multiple PCs, PostgreSQL
    ↓  
Phase 3: Multiple Locations, Cloud Database
```

---

## 🎯 Final Recommendation

**For your scenario (25 admin, 2 PCs):**

**✅ Go with SQLite Network** because:

1. **Fastest to implement** (1-2 days vs weeks)
2. **Minimal code changes** (just path update)  
3. **Sufficient performance** (handles your load easily)
4. **Cost effective** (no server costs)
5. **Easy maintenance** (familiar SQLite)
6. **Proven reliability** (SQLite is rock-solid)

**When to migrate to PostgreSQL:**
- User count > 50  
- Multiple locations
- 24/7 operations
- Advanced analytics needs
- Budget for DBA/server

---

**Ready to implement SQLite Network solution?** 

I can start with the database upgrade immediately! 🚀
