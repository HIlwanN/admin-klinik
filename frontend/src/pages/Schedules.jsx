import { useState, useEffect } from 'react';

function ScheduleModal({ schedule, onClose, onSave }) {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    tanggal: '',
    waktu_mulai: '',
    waktu_selesai: '',
    ruangan: '',
    mesin_dialisis: '',
    perawat: '',
    catatan: '',
    status: 'scheduled'
  });

  useEffect(() => {
    fetchPatients();
    if (schedule) {
      setFormData(schedule);
    }
  }, [schedule]);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{schedule ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Pasien *</label>
            <select
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              required
            >
              <option value="">Pilih Pasien</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.nama} - {patient.no_rekam_medis}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tanggal *</label>
              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Waktu Mulai *</label>
              <input
                type="time"
                name="waktu_mulai"
                value={formData.waktu_mulai}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Waktu Selesai *</label>
              <input
                type="time"
                name="waktu_selesai"
                value={formData.waktu_selesai}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ruangan</label>
              <input
                type="text"
                name="ruangan"
                value={formData.ruangan}
                onChange={handleChange}
                placeholder="Contoh: Ruang Hemodialisis 1"
              />
            </div>

            <div className="form-group">
              <label>Mesin Dialisis</label>
              <input
                type="text"
                name="mesin_dialisis"
                value={formData.mesin_dialisis}
                onChange={handleChange}
                placeholder="Contoh: Mesin HD-01"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Perawat</label>
            <input
              type="text"
              name="perawat"
              value={formData.perawat}
              onChange={handleChange}
              placeholder="Nama perawat yang bertugas"
            />
          </div>

          <div className="form-group">
            <label>Catatan</label>
            <textarea
              name="catatan"
              value={formData.catatan}
              onChange={handleChange}
              rows="3"
              placeholder="Catatan tambahan mengenai jadwal ini..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              {schedule ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules');
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleAdd = () => {
    setEditingSchedule(null);
    setShowModal(true);
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jadwal ini?')) {
      return;
    }

    try {
      await fetch(`/api/schedules/${id}`, {
        method: 'DELETE'
      });
      fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const handleSave = async (formData) => {
    try {
      const url = editingSchedule 
        ? `/api/schedules/${editingSchedule.id}`
        : '/api/schedules';
      
      const method = editingSchedule ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      setShowModal(false);
      fetchSchedules();
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const filteredSchedules = filterDate
    ? schedules.filter(s => s.tanggal === filterDate)
    : schedules;

  const handleDownload = () => {
    window.open('/api/schedules/export/csv', '_blank');
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>Jadwal Cuci Darah</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem' }}
          />
          {filterDate && (
            <button 
              className="btn btn-small"
              onClick={() => setFilterDate('')}
            >
              Reset Filter
            </button>
          )}
          <button className="btn btn-secondary" onClick={handleDownload}>
            📥 Download
          </button>
          <button className="btn btn-primary" onClick={handleAdd}>
            + Tambah Jadwal
          </button>
        </div>
      </div>

      {filteredSchedules.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Pasien</th>
                <th>Tanggal</th>
                <th>Waktu</th>
                <th>Ruangan</th>
                <th>Mesin</th>
                <th>Perawat</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.map(schedule => (
                <tr key={schedule.id}>
                  <td>
                    <strong>{schedule.patient_name}</strong>
                    <br />
                    <span style={{ fontSize: '0.875rem', color: 'var(--gray)' }}>
                      {schedule.no_rekam_medis}
                    </span>
                  </td>
                  <td>{new Date(schedule.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                  <td>{schedule.waktu_mulai} - {schedule.waktu_selesai}</td>
                  <td>{schedule.ruangan || '-'}</td>
                  <td>{schedule.mesin_dialisis || '-'}</td>
                  <td>{schedule.perawat || '-'}</td>
                  <td>
                    <span className={`badge badge-${schedule.status}`}>
                      {schedule.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="btn btn-small btn-secondary"
                        onClick={() => handleEdit(schedule)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-small btn-danger"
                        onClick={() => handleDelete(schedule.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <h3>Belum ada jadwal{filterDate && ' untuk tanggal yang dipilih'}</h3>
            <p>Klik tombol "Tambah Jadwal" untuk menambahkan jadwal baru</p>
          </div>
        </div>
      )}

      {showModal && (
        <ScheduleModal
          schedule={editingSchedule}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Schedules;

