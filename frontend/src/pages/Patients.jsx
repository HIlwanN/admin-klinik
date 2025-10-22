import React, { useState, useEffect } from 'react';

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
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (patient) {
        console.log('Setting form data from patient:', patient); // Debug log
        setFormData({
          nama: patient.nama || '',
          no_rekam_medis: patient.no_rekam_medis || '',
          tanggal_lahir: patient.tanggal_lahir || '',
          jenis_kelamin: patient.jenis_kelamin || 'Laki-laki',
          alamat: patient.alamat || '',
          telepon: patient.telepon || '',
          diagnosa: patient.diagnosa || '',
          golongan_darah: patient.golongan_darah || 'A'
        });
      } else {
        console.log('No patient data, using default form data'); // Debug log
      }
    } catch (error) {
      console.error('Error setting form data:', error);
      setError('Error loading patient data');
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

  if (error) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Error</h3>
            <button className="modal-close" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            <p style={{ color: 'var(--danger)' }}>{error}</p>
            <button className="btn btn-primary" onClick={onClose}>
              Tutup
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await fetch('/api/patients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    }
  };

  const handleAdd = () => {
    setEditingPatient(null);
    setShowModal(true);
  };

  const handleEdit = (patient) => {
    console.log('Editing patient:', patient); // Debug log
    if (!patient) {
      console.error('No patient data provided for editing');
      return;
    }
    setEditingPatient(patient);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pasien ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await fetch(`/api/patients/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const handleSave = async (formData) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        alert('Sesi telah berakhir. Silakan login kembali.');
        return;
      }

      const url = editingPatient 
        ? `/api/patients/${editingPatient.id}`
        : '/api/patients';
      
      const method = editingPatient ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menyimpan data pasien');
      }

      const result = await response.json();
      console.log('Patient saved successfully:', result);

      setShowModal(false);
      fetchPatients();
      alert(editingPatient ? 'Data pasien berhasil diperbarui!' : 'Data pasien berhasil ditambahkan!');
    } catch (error) {
      console.error('Error saving patient:', error);
      alert('Gagal menyimpan data pasien: ' + error.message);
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

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        alert('Sesi telah berakhir. Silakan login kembali.');
        return;
      }

      const response = await fetch('/api/patients/export/csv', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Gagal mengunduh data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data-pasien-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading data:', error);
      alert('Gagal mengunduh data. Silakan coba lagi.');
    }
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
          onClose={() => {
            console.log('Closing patient modal'); // Debug log
            setShowModal(false);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default Patients;

