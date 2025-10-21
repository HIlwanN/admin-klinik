import { useState, useEffect } from 'react';

function PatientModal({ patient, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nama: '',
    no_rekam_medis: '',
    tanggal_lahir: '',
    jenis_kelamin: 'Laki-laki',
    alamat: '',
    telepon: '',
    diagnosa: '',
    golongan_darah: 'A'
  });

  useEffect(() => {
    if (patient) {
      setFormData(patient);
    }
  }, [patient]);

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
          <h3>{patient ? 'Edit Pasien' : 'Tambah Pasien Baru'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label>Nama Lengkap *</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>No. Rekam Medis *</label>
              <input
                type="text"
                name="no_rekam_medis"
                value={formData.no_rekam_medis}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tanggal Lahir *</label>
              <input
                type="date"
                name="tanggal_lahir"
                value={formData.tanggal_lahir}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Jenis Kelamin *</label>
              <select
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleChange}
                required
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Telepon</label>
              <input
                type="tel"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Golongan Darah</label>
              <select
                name="golongan_darah"
                value={formData.golongan_darah}
                onChange={handleChange}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Alamat</label>
            <textarea
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Diagnosa</label>
            <textarea
              name="diagnosa"
              value={formData.diagnosa}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              {patient ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Patients() {
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleAdd = () => {
    setEditingPatient(null);
    setShowModal(true);
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pasien ini?')) {
      return;
    }

    try {
      await fetch(`/api/patients/${id}`, {
        method: 'DELETE'
      });
      fetchPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const handleSave = async (formData) => {
    try {
      const url = editingPatient 
        ? `/api/patients/${editingPatient.id}`
        : '/api/patients';
      
      const method = editingPatient ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      setShowModal(false);
      fetchPatients();
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleDownload = () => {
    window.open('/api/patients/export/csv', '_blank');
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>Data Pasien</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={handleDownload}>
            📥 Download Data
          </button>
          <button className="btn btn-primary" onClick={handleAdd}>
            + Tambah Pasien
          </button>
        </div>
      </div>

      {patients.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>No. RM</th>
                <th>Nama Pasien</th>
                <th>Umur</th>
                <th>Jenis Kelamin</th>
                <th>Telepon</th>
                <th>Gol. Darah</th>
                <th>Diagnosa</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id}>
                  <td><strong>{patient.no_rekam_medis}</strong></td>
                  <td>{patient.nama}</td>
                  <td>{calculateAge(patient.tanggal_lahir)} tahun</td>
                  <td>{patient.jenis_kelamin}</td>
                  <td>{patient.telepon || '-'}</td>
                  <td>{patient.golongan_darah || '-'}</td>
                  <td>{patient.diagnosa || '-'}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="btn btn-small btn-secondary"
                        onClick={() => handleEdit(patient)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-small btn-danger"
                        onClick={() => handleDelete(patient.id)}
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
            <h3>Belum ada data pasien</h3>
            <p>Klik tombol "Tambah Pasien" untuk menambahkan pasien baru</p>
          </div>
        </div>
      )}

      {showModal && (
        <PatientModal
          patient={editingPatient}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Patients;

