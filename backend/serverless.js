import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to update timestamp
const updateTimestamp = () => new Date().toISOString();

// ==================== PATIENT ROUTES ====================

// Get all patients
app.get('/api/patients', (req, res) => {
  try {
    const patients = db.prepare('SELECT * FROM patients ORDER BY created_at DESC').all();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single patient
app.get('/api/patients/:id', (req, res) => {
  try {
    const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create patient
app.post('/api/patients', (req, res) => {
  try {
    const { nama, no_rekam_medis, tanggal_lahir, jenis_kelamin, alamat, telepon, diagnosa, golongan_darah } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO patients (nama, no_rekam_medis, tanggal_lahir, jenis_kelamin, alamat, telepon, diagnosa, golongan_darah)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(nama, no_rekam_medis, tanggal_lahir, jenis_kelamin, alamat, telepon, diagnosa, golongan_darah);
    const newPatient = db.prepare('SELECT * FROM patients WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update patient
app.put('/api/patients/:id', (req, res) => {
  try {
    const { nama, no_rekam_medis, tanggal_lahir, jenis_kelamin, alamat, telepon, diagnosa, golongan_darah } = req.body;
    
    const stmt = db.prepare(`
      UPDATE patients 
      SET nama = ?, no_rekam_medis = ?, tanggal_lahir = ?, jenis_kelamin = ?, 
          alamat = ?, telepon = ?, diagnosa = ?, golongan_darah = ?, updated_at = ?
      WHERE id = ?
    `);
    
    const result = stmt.run(nama, no_rekam_medis, tanggal_lahir, jenis_kelamin, alamat, telepon, diagnosa, golongan_darah, updateTimestamp(), req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    const updatedPatient = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete patient
app.delete('/api/patients/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM patients WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export patients to CSV
app.get('/api/patients/export/csv', (req, res) => {
  try {
    const patients = db.prepare('SELECT * FROM patients ORDER BY created_at DESC').all();
    
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
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="data-pasien-${Date.now()}.csv"`);
    res.send('\uFEFF' + csv); // BOM for Excel UTF-8 support
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SCHEDULE ROUTES ====================

// Get all schedules with patient info
app.get('/api/schedules', (req, res) => {
  try {
    const schedules = db.prepare(`
      SELECT s.*, p.nama as patient_name, p.no_rekam_medis
      FROM schedules s
      JOIN patients p ON s.patient_id = p.id
      ORDER BY s.tanggal DESC, s.waktu_mulai DESC
    `).all();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single schedule
app.get('/api/schedules/:id', (req, res) => {
  try {
    const schedule = db.prepare(`
      SELECT s.*, p.nama as patient_name, p.no_rekam_medis
      FROM schedules s
      JOIN patients p ON s.patient_id = p.id
      WHERE s.id = ?
    `).get(req.params.id);
    
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get schedules by patient
app.get('/api/patients/:id/schedules', (req, res) => {
  try {
    const schedules = db.prepare(`
      SELECT * FROM schedules 
      WHERE patient_id = ? 
      ORDER BY tanggal DESC, waktu_mulai DESC
    `).all(req.params.id);
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create schedule
app.post('/api/schedules', (req, res) => {
  try {
    const { patient_id, tanggal, waktu_mulai, waktu_selesai, ruangan, mesin_dialisis, perawat, catatan, status } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO schedules (patient_id, tanggal, waktu_mulai, waktu_selesai, ruangan, mesin_dialisis, perawat, catatan, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(patient_id, tanggal, waktu_mulai, waktu_selesai, ruangan, mesin_dialisis, perawat, catatan, status || 'scheduled');
    const newSchedule = db.prepare(`
      SELECT s.*, p.nama as patient_name, p.no_rekam_medis
      FROM schedules s
      JOIN patients p ON s.patient_id = p.id
      WHERE s.id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update schedule
app.put('/api/schedules/:id', (req, res) => {
  try {
    const { patient_id, tanggal, waktu_mulai, waktu_selesai, ruangan, mesin_dialisis, perawat, catatan, status } = req.body;
    
    const stmt = db.prepare(`
      UPDATE schedules 
      SET patient_id = ?, tanggal = ?, waktu_mulai = ?, waktu_selesai = ?, 
          ruangan = ?, mesin_dialisis = ?, perawat = ?, catatan = ?, status = ?, updated_at = ?
      WHERE id = ?
    `);
    
    const result = stmt.run(patient_id, tanggal, waktu_mulai, waktu_selesai, ruangan, mesin_dialisis, perawat, catatan, status, updateTimestamp(), req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    const updatedSchedule = db.prepare(`
      SELECT s.*, p.nama as patient_name, p.no_rekam_medis
      FROM schedules s
      JOIN patients p ON s.patient_id = p.id
      WHERE s.id = ?
    `).get(req.params.id);
    
    res.json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete schedule
app.delete('/api/schedules/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM schedules WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export schedules to CSV
app.get('/api/schedules/export/csv', (req, res) => {
  try {
    const schedules = db.prepare(`
      SELECT s.*, p.nama as patient_name, p.no_rekam_medis
      FROM schedules s
      JOIN patients p ON s.patient_id = p.id
      ORDER BY s.tanggal DESC, s.waktu_mulai DESC
    `).all();
    
    // CSV Header
    const headers = ['No. RM', 'Nama Pasien', 'Tanggal', 'Waktu Mulai', 'Waktu Selesai', 'Ruangan', 'Mesin Dialisis', 'Perawat', 'Status', 'Catatan'];
    
    // CSV Rows
    const rows = schedules.map(s => [
      s.no_rekam_medis,
      s.patient_name,
      new Date(s.tanggal).toLocaleDateString('id-ID'),
      s.waktu_mulai,
      s.waktu_selesai,
      s.ruangan || '',
      s.mesin_dialisis || '',
      s.perawat || '',
      s.status,
      s.catatan || ''
    ]);
    
    // Generate CSV
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    // Set headers for download
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="jadwal-cuci-darah-${Date.now()}.csv"`);
    res.send('\uFEFF' + csv); // BOM for Excel UTF-8 support
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

export default app;

