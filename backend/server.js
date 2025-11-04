import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import db from './config/supabase.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file in backend directory
// This ensures it works in both development and Electron packaged app
dotenv.config({ path: join(__dirname, '.env') });

console.log('🔍 Environment check:');
console.log('   SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'NOT SET');
console.log('   SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'NOT SET');

// Create Supabase client
// Use service role key for backend operations to bypass RLS
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);
import { 
  authenticateToken, 
  loginUser, 
  logoutUser, 
  sessionHeartbeat, 
  getCurrentUser,
  getRecentUsers,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getClientIP,
  getUserAgent
} from './auth.js';

const app = express();
const PORT = process.env.PORT || 3000;
const isElectron = process.env.ELECTRON_APP === 'true';

console.log('📁 Current __dirname:', __dirname);
console.log('💻 Is Electron:', isElectron);
console.log('🔧 Node environment:', process.env.NODE_ENV);

// Middleware
// CORS only needed for web deployment, not for Electron
if (!isElectron) {
  app.use(cors());
}
app.use(express.json());

// Helper function to update timestamp
const updateTimestamp = () => new Date().toISOString();

// ==================== AUTHENTICATION ROUTES ====================

// Login
app.post('/api/auth/login', async (req, res) => {
  const ip_address = getClientIP(req);
  const user_agent = getUserAgent(req);
  
  req.body.ip_address = ip_address;
  req.body.user_agent = user_agent;
  
  await loginUser(req, res);
});

// Logout
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  await logoutUser(req, res);
});

// Session heartbeat
app.post('/api/session/heartbeat', authenticateToken, async (req, res) => {
  await sessionHeartbeat(req, res);
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  await getCurrentUser(req, res);
});

// Get recent users for quick login
app.get('/api/auth/recent-users', async (req, res) => {
  await getRecentUsers(req, res);
});

// ==================== USER MANAGEMENT ROUTES ====================

// Get all users
app.get('/api/users', authenticateToken, async (req, res) => {
  await getAllUsers(req, res);
});

// Create user
app.post('/api/users', authenticateToken, async (req, res) => {
  await createUser(req, res);
});

// Update user
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  await updateUser(req, res);
});

// Delete user
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  await deleteUser(req, res);
});

// ==================== PATIENT ROUTES ====================

// Get all patients with optional date filter
app.get('/api/patients', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    console.log('Patients API called with filters:', { startDate, endDate });
    
    let patients;
    if (startDate && endDate) {
      console.log('Filtering patients by date range:', startDate, 'to', endDate);
      patients = await db.getPatientsByDateRange(startDate, endDate);
      console.log('Filtered patients count:', patients.length);
    } else {
      console.log('Getting all patients (no filter)');
      patients = await db.getPatients();
      console.log('All patients count:', patients.length);
    }
    
    res.json(patients);
  } catch (error) {
    console.error('Error in patients API:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single patient
app.get('/api/patients/:id', authenticateToken, async (req, res) => {
  try {
    const patient = await db.getPatient(req.params.id);
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create patient
app.post('/api/patients', authenticateToken, async (req, res) => {
  try {
    const patientData = req.body;
    const userId = req.user.userId;
    const stationId = req.body.station_id || 'unknown';
    
    const newPatient = await db.createPatient(patientData, userId);
    
    // Log the creation
    await db.logAudit(
      userId,
      stationId,
      'create',
      'patients',
      newPatient.id,
      null,
      newPatient,
      `Added patient: ${newPatient.nama}`
    );
    
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update patient
app.put('/api/patients/:id', authenticateToken, async (req, res) => {
  try {
    const patientId = req.params.id;
    const patientData = req.body;
    const userId = req.user.userId;
    const stationId = req.body.station_id || 'unknown';
    
    // Get old patient data for audit
    const oldPatient = await db.getPatient(patientId);
    
    const updatedPatient = await db.updatePatient(patientId, patientData, userId);
    
    // Log the update
    await db.logAudit(
      userId,
      stationId,
      'update',
      'patients',
      patientId,
      oldPatient,
      updatedPatient,
      `Updated patient: ${updatedPatient.nama}`
    );
    
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete patient
app.delete('/api/patients/:id', authenticateToken, async (req, res) => {
  try {
    const patientId = req.params.id;
    const userId = req.user.userId;
    const stationId = req.body.station_id || 'unknown';
    
    // Get patient data for audit
    const patient = await db.getPatient(patientId);
    
    await db.deletePatient(patientId);
    
    // Log the deletion
    await db.logAudit(
      userId,
      stationId,
      'delete',
      'patients',
      patientId,
      patient,
      null,
      `Deleted patient: ${patient.nama}`
    );
    
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export patients to CSV with date filter
app.get('/api/patients/export/csv', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Validate required date parameters
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Tanggal mulai dan tanggal selesai harus diisi untuk download data' 
      });
    }
    
    // Filter by date range
    const patients = await db.getPatientsByDateRange(startDate, endDate);
    
    // CSV Header
    const headers = ['No. RM', 'Nama', 'Tanggal Lahir', 'Jenis Kelamin', 'Alamat', 'Telepon', 'Diagnosa', 'Golongan Darah', 'Dibuat'];
    
    // CSV Rows
    const rows = patients.map(p => [
      p.no_rekam_medis,
      p.nama,
      p.tanggal_lahir,
      p.jenis_kelamin,
      p.alamat || '',
      p.telepon || '',
      p.diagnosa || '',
      p.golongan_darah || '',
      new Date(p.created_at).toLocaleString('id-ID')
    ]);
    
    // Generate CSV
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    // Set headers for download
    const filename = startDate && endDate 
      ? `data-pasien-${startDate}-to-${endDate}.csv`
      : `data-pasien-${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv); // BOM for Excel UTF-8 support
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== DECEASED PATIENTS ROUTES ====================

// Get all deceased patients with optional date filter
app.get('/api/deceased-patients', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let deceasedPatients;
    if (startDate && endDate) {
      deceasedPatients = await db.getDeceasedPatientsByDateRange(startDate, endDate);
    } else {
      deceasedPatients = await db.getDeceasedPatients();
    }
    
    res.json(deceasedPatients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single deceased patient
app.get('/api/deceased-patients/:id', authenticateToken, async (req, res) => {
  try {
    const deceasedPatient = await db.getDeceasedPatient(req.params.id);
    res.json(deceasedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create deceased patient
app.post('/api/deceased-patients', authenticateToken, async (req, res) => {
  try {
    const deceasedData = req.body;
    const userId = req.user.userId;
    const stationId = req.body.station_id || 'unknown';
    
    const deceasedPatient = await db.createDeceasedPatient(deceasedData);
    
    // Log the creation
    await db.logAudit(
      userId,
      stationId,
      'create',
      'deceased_patients',
      deceasedPatient.id,
      null,
      deceasedPatient,
      `Created deceased patient record: ${deceasedPatient.nama_pasien}`
    );
    
    res.status(201).json(deceasedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update deceased patient
app.put('/api/deceased-patients/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deceasedData = req.body;
    const userId = req.user.userId;
    const stationId = req.body.station_id || 'unknown';
    
    // Get old data for audit
    const oldDeceasedPatient = await db.getDeceasedPatient(id);
    
    const deceasedPatient = await db.updateDeceasedPatient(id, deceasedData);
    
    // Log the update
    await db.logAudit(
      userId,
      stationId,
      'update',
      'deceased_patients',
      id,
      oldDeceasedPatient,
      deceasedPatient,
      `Updated deceased patient record: ${deceasedPatient.nama_pasien}`
    );
    
    res.json(deceasedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete deceased patient
app.delete('/api/deceased-patients/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const stationId = req.body.station_id || 'unknown';
    
    // Get old data for audit
    const deceasedPatient = await db.getDeceasedPatient(id);
    
    await db.deleteDeceasedPatient(id);
    
    // Log the deletion
    await db.logAudit(
      userId,
      stationId,
      'delete',
      'deceased_patients',
      id,
      deceasedPatient,
      null,
      `Deleted deceased patient record: ${deceasedPatient.nama_pasien}`
    );
    
    res.json({ message: 'Deceased patient record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SCHEDULE ROUTES ====================

// Get all schedules with patient info
app.get('/api/schedules', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    console.log('Schedules API called with filters:', { startDate, endDate });
    
    let schedules;
    if (startDate && endDate) {
      console.log('Filtering schedules by date range:', startDate, 'to', endDate);
      schedules = await db.getSchedulesByDateRange(startDate, endDate);
      console.log('Filtered schedules count:', schedules.length);
    } else {
      console.log('Getting all schedules (no filter)');
      schedules = await db.getSchedules();
      console.log('All schedules count:', schedules.length);
    }
    
    res.json(schedules);
  } catch (error) {
    console.error('Error in schedules API:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== SPECIFIC ROUTES MUST COME BEFORE /:id =====

// Get schedule grid (for auto-scheduler view)
app.get('/api/schedules/grid', authenticateToken, async (req, res) => {
  try {
    const grid = await db.getScheduleGrid();
    res.json(grid);
  } catch (error) {
    console.error('Error in /api/schedules/grid:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export schedules to CSV with date filter
app.get('/api/schedules/export/csv', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Validate required date parameters
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Tanggal mulai dan tanggal selesai harus diisi untuk download data' 
      });
    }
    
    // Filter by date range
    const schedules = await db.getSchedulesByDateRange(startDate, endDate);
    
    // CSV Header
    const headers = ['No. RM', 'Nama Pasien', 'Tanggal', 'Waktu Mulai', 'Waktu Selesai', 'Ruangan', 'Mesin Dialisis', 'Perawat', 'Status', 'Catatan'];
    
    // CSV Rows
    const rows = schedules.map(s => [
      s.patient?.no_rekam_medis || '',
      s.patient?.nama || '',
      s.tanggal,
      s.waktu_mulai,
      s.waktu_selesai,
      s.ruangan,
      s.mesin_dialisis,
      s.perawat,
      s.status,
      s.catatan
    ]);
    
    // Generate CSV
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    // Set headers for download
    const filename = startDate && endDate 
      ? `jadwal-${startDate}-to-${endDate}.csv`
      : `jadwal-${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv); // BOM for Excel UTF-8 support
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export comprehensive report with date filter
app.get('/api/reports/export/csv', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate, reportType } = req.query;
    
    // Validate required date parameters
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Tanggal mulai dan tanggal selesai harus diisi untuk download data' 
      });
    }
    
    let data = [];
    let headers = [];
    let filename = '';
    
    switch (reportType) {
      case 'patients':
        data = await db.getPatientsByDateRange(startDate, endDate);
        headers = ['No. RM', 'Nama', 'Tanggal Lahir', 'Jenis Kelamin', 'Alamat', 'Telepon', 'Diagnosa', 'Golongan Darah', 'Dibuat'];
        filename = `laporan-pasien-${startDate}-to-${endDate}.csv`;
        break;
        
      case 'schedules':
        data = await db.getSchedulesByDateRange(startDate, endDate);
        headers = ['No. RM', 'Nama Pasien', 'Tanggal', 'Waktu Mulai', 'Waktu Selesai', 'Ruangan', 'Mesin Dialisis', 'Perawat', 'Status', 'Catatan'];
        filename = `laporan-jadwal-${startDate}-to-${endDate}.csv`;
        break;
        
      case 'deceased':
        data = await db.getDeceasedPatientsByDateRange(startDate, endDate);
        headers = ['Nama Pasien', 'Tanggal Meninggal', 'No. Handphone', 'Alamat', 'Dibuat'];
        filename = `laporan-meninggal-${startDate}-to-${endDate}.csv`;
        break;
        
      case 'comprehensive':
        // Comprehensive report with all data
        const patients = await db.getPatientsByDateRange(startDate, endDate);
        const schedules = await db.getSchedulesByDateRange(startDate, endDate);
        const deceased = await db.getDeceasedPatientsByDateRange(startDate, endDate);
          
        // Create comprehensive data
        data = [
          ...patients.map(p => ({ type: 'Patient', ...p })),
          ...schedules.map(s => ({ type: 'Schedule', ...s })),
          ...deceased.map(d => ({ type: 'Deceased', ...d }))
        ];
        headers = ['Type', 'No. RM', 'Nama', 'Tanggal', 'Status', 'Details'];
        filename = `laporan-lengkap-${startDate}-to-${endDate}.csv`;
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }
    
    // Generate CSV rows based on report type
    let rows = [];
    if (reportType === 'comprehensive') {
      rows = data.map(item => [
        item.type,
        item.no_rekam_medis || '',
        item.nama || item.nama_pasien || '',
        item.tanggal || item.tanggal_meninggal || item.created_at,
        item.status || 'Active',
        JSON.stringify(item)
      ]);
    } else if (reportType === 'patients') {
      rows = data.map(p => [
        p.no_rekam_medis,
        p.nama,
        p.tanggal_lahir,
        p.jenis_kelamin,
        p.alamat || '',
        p.telepon || '',
        p.diagnosa || '',
        p.golongan_darah || '',
        new Date(p.created_at).toLocaleString('id-ID')
      ]);
    } else if (reportType === 'schedules') {
      rows = data.map(s => [
        s.patient?.no_rekam_medis || '',
        s.patient?.nama || '',
        s.tanggal,
        s.waktu_mulai,
        s.waktu_selesai,
        s.ruangan,
        s.mesin_dialisis,
        s.perawat,
        s.status,
        s.catatan
      ]);
    } else if (reportType === 'deceased') {
      rows = data.map(d => [
        d.nama_pasien,
        d.tanggal_meninggal,
        d.no_handphone || '',
        d.alamat || '',
        new Date(d.created_at).toLocaleString('id-ID')
      ]);
    }
    
    // Generate CSV
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    // Set headers for download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv); // BOM for Excel UTF-8 support
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==================== BED MANAGEMENT ROUTES ====================

// Get bed status for a specific date and shift
app.get('/api/beds/status', authenticateToken, async (req, res) => {
  try {
    const { date, shift, floor } = req.query;
    
    if (!date || !shift) {
      return res.status(400).json({ error: 'Date and shift are required' });
    }
    
    const bedStatus = await db.getBedStatus(date, shift, floor);
    res.json(bedStatus);
  } catch (error) {
    console.error('Error getting bed status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update schedule status (e.g., mark as completed)
app.patch('/api/schedules/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    // Validate status
    const validStatuses = ['scheduled', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const updatedSchedule = await db.updateScheduleStatus(id, status);
    res.json(updatedSchedule);
  } catch (error) {
    console.error('Error updating schedule status:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===== GENERIC ROUTES MUST COME AFTER SPECIFIC ROUTES =====

// Get single schedule
app.get('/api/schedules/:id', authenticateToken, async (req, res) => {
  try {
    const schedule = await db.getSchedule(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get schedules by patient
app.get('/api/patients/:id/schedules', authenticateToken, async (req, res) => {
  try {
    const schedules = await db.getSchedulesByPatient(req.params.id);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create schedule
app.post('/api/schedules', authenticateToken, async (req, res) => {
  try {
    const scheduleData = req.body;
    const userId = req.user.userId;
    const stationId = req.body.station_id || 'unknown';
    
    const newSchedule = await db.createSchedule(scheduleData, userId);
    
    // Log the creation
    await db.logAudit(
      userId,
      stationId,
      'create',
      'schedules',
      newSchedule.id,
      null,
      newSchedule,
      `Added schedule for patient ID: ${newSchedule.patient_id}`
    );
    
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update schedule
app.put('/api/schedules/:id', authenticateToken, async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const scheduleData = req.body;
    const userId = req.user.userId;
    const stationId = req.body.station_id || 'unknown';
    
    // Get old schedule data for audit
    const oldSchedule = await db.getSchedule(scheduleId);
    
    const updatedSchedule = await db.updateSchedule(scheduleId, scheduleData, userId);
    
    // Log the update
    await db.logAudit(
      userId,
      stationId,
      'update',
      'schedules',
      scheduleId,
      oldSchedule,
      updatedSchedule,
      `Updated schedule for patient ID: ${updatedSchedule.patient_id}`
    );
    
    res.json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete schedule
app.delete('/api/schedules/:id', authenticateToken, async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const userId = req.user.userId;
    const stationId = req.body.station_id || 'unknown';
    
    // Get schedule data for audit
    const schedule = await db.getSchedule(scheduleId);
    
    await db.deleteSchedule(scheduleId);
    
    // Log the deletion
    await db.logAudit(
      userId,
      stationId,
      'delete',
      'schedules',
      scheduleId,
      schedule,
      null,
      `Deleted schedule for patient ID: ${schedule.patient_id}`
    );
    
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SESSIONS ROUTES ====================

// Get all active sessions
app.get('/api/sessions', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('active_sessions')
      .select(`
        *,
        user:users(id, username, full_name, role, shift)
      `)
      .eq('is_active', true)
      .order('login_time', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// End specific session
app.delete('/api/sessions/:id', authenticateToken, async (req, res) => {
  try {
    const { error } = await supabase
      .from('active_sessions')
      .update({ is_active: false })
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.json({ message: 'Session ended successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== STATIONS ROUTES ====================

// Get all stations
app.get('/api/stations', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('stations')
      .select(`
        *,
        current_user:users(id, username, full_name, role)
      `)
      .order('name');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== AUDIT LOG ROUTES ====================

// Get audit log
app.get('/api/audit', authenticateToken, async (req, res) => {
  try {
    const limit = req.query.limit || 50;
    const auditLog = await db.getAuditLog(parseInt(limit));
    res.json(auditLog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== STATS ROUTES ====================

// Get dashboard statistics
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const [usersResult, sessionsResult, activitiesResult] = await Promise.all([
      supabase.from('users').select('count', { count: 'exact' }).eq('is_active', true),
      supabase.from('active_sessions').select('count', { count: 'exact' }).eq('is_active', true),
      supabase.from('audit_log').select('count', { count: 'exact' }).gte('timestamp', new Date().toISOString().split('T')[0])
    ]);

    const stats = {
      totalUsers: usersResult.count || 0,
      activeUsers: sessionsResult.count || 0,
      totalSessions: sessionsResult.count || 0,
      todayActivities: activitiesResult.count || 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== HEALTH CHECK ====================

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const health = await db.healthCheck();
    res.json(health);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SERVER ====================

// Serve static files from frontend build
// Path structure in Electron: resources/app/frontend/dist
import fs from 'fs';

const tryStaticPath = (relativePath, label) => {
  const fullPath = join(__dirname, relativePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✓ Serving static files from ${label}:`, fullPath);
    app.use(express.static(fullPath));
    return fullPath;
  }
  console.log(`✗ Path not found (${label}):`, fullPath);
  return null;
};

// Try different paths
const staticPath = 
  tryStaticPath('../frontend/dist', 'Dev') ||
  tryStaticPath('../../resources/frontend-dist', 'Electron Resources (new)') ||
  tryStaticPath('../../../resources/frontend-dist', 'Electron Resources (alt)');

if (!staticPath) {
  console.log('⚠️ WARNING: Frontend static files not found!');
}

// Serve frontend for any other routes (SPA support)
app.get('*', (req, res) => {
  const indexPath = staticPath ? join(staticPath, 'index.html') : null;
  
  if (indexPath && fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  console.log('✗ index.html not found, sending error page');
  res.status(404).send(`
    <html>
      <head><title>Error</title></head>
      <body>
        <h1>Frontend not found</h1>
        <p>Expected path: ${indexPath || 'unknown'}</p>
        <p>Current __dirname: ${__dirname}</p>
        <p>Is Electron: ${isElectron}</p>
      </body>
    </html>
  `);
});

// Only start server if not in Vercel (serverless)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Mode: ${isElectron ? 'Electron Desktop App' : 'Web Application'}`);
  });
}

// Export for Vercel serverless
export default app;
