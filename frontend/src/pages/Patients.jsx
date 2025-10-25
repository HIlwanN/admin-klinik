import React, { useState, useEffect } from 'react';
import DateFilter from '../components/DateFilter';

function DeceasedPatientModal({ deceasedPatient, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nama_pasien: '',
    tanggal_meninggal: '',
    no_handphone: '',
    alamat: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (deceasedPatient) {
        console.log('Setting form data from deceased patient:', deceasedPatient);
        setFormData({
          nama_pasien: deceasedPatient.nama_pasien || '',
          tanggal_meninggal: deceasedPatient.tanggal_meninggal || '',
          no_handphone: deceasedPatient.no_handphone || '',
          alamat: deceasedPatient.alamat || ''
        });
      } else {
        console.log('No deceased patient data, using default form data');
      }
    } catch (error) {
      console.error('Error setting form data:', error);
      setError('Error loading deceased patient data');
    }
  }, [deceasedPatient]);

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
          <h3>{deceasedPatient ? 'Edit Data Pasien Meninggal' : 'Tambah Data Pasien Meninggal'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nama_pasien">Nama Pasien *</label>
              <input
                type="text"
                id="nama_pasien"
                name="nama_pasien"
                value={formData.nama_pasien}
                onChange={handleChange}
                required
                placeholder="Masukkan nama pasien"
              />
            </div>
            <div className="form-group">
              <label htmlFor="tanggal_meninggal">Tanggal Meninggal *</label>
              <input
                type="date"
                id="tanggal_meninggal"
                name="tanggal_meninggal"
                value={formData.tanggal_meninggal}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="no_handphone">No. Handphone</label>
              <input
                type="tel"
                id="no_handphone"
                name="no_handphone"
                value={formData.no_handphone}
                onChange={handleChange}
                placeholder="Masukkan nomor handphone"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="alamat">Alamat</label>
            <textarea
              id="alamat"
              name="alamat"
              value={formData.alamat}
              onChange={handleChange}
              rows="3"
              placeholder="Masukkan alamat"
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary">
              {deceasedPatient ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
  const [deceasedPatients, setDeceasedPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeceasedModal, setShowDeceasedModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingDeceasedPatient, setEditingDeceasedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'deceased'
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState({});

  useEffect(() => {
    fetchPatients();
    fetchDeceasedPatients();
  }, []);


  const handleAdd = () => {
    setEditingPatient(null);
    setShowModal(true);
  };

  const handleAddDeceased = () => {
    setEditingDeceasedPatient(null);
    setShowDeceasedModal(true);
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

  const handleEditDeceased = (deceasedPatient) => {
    console.log('Editing deceased patient:', deceasedPatient);
    if (!deceasedPatient) {
      console.error('No deceased patient data provided for editing');
      return;
    }
    setEditingDeceasedPatient(deceasedPatient);
    setShowDeceasedModal(true);
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

  const handleDeleteDeceased = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data pasien meninggal ini?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await fetch(`/api/deceased-patients/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchDeceasedPatients();
    } catch (error) {
      console.error('Error deleting deceased patient:', error);
      alert('Gagal menghapus data pasien meninggal');
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

  const handleSaveDeceased = async (formData) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        alert('Sesi telah berakhir. Silakan login kembali.');
        return;
      }

      const url = editingDeceasedPatient 
        ? `/api/deceased-patients/${editingDeceasedPatient.id}`
        : '/api/deceased-patients';
      
      const method = editingDeceasedPatient ? 'PUT' : 'POST';

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
        throw new Error(errorData.error || 'Gagal menyimpan data pasien meninggal');
      }

      const result = await response.json();
      console.log('Deceased patient saved successfully:', result);

      setShowDeceasedModal(false);
      fetchDeceasedPatients();
      alert(editingDeceasedPatient ? 'Data pasien meninggal berhasil diperbarui!' : 'Data pasien meninggal berhasil ditambahkan!');
    } catch (error) {
      console.error('Error saving deceased patient:', error);
      alert('Gagal menyimpan data pasien meninggal: ' + error.message);
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

  const handleDownload = async (filters = {}) => {
    try {
      setDownloadLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        alert('Sesi telah berakhir. Silakan login kembali.');
        return;
      }

      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/patients/export/csv?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengunduh data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data-pasien-${filters.startDate || 'all'}-${filters.endDate || 'all'}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('Data berhasil diunduh!');
    } catch (error) {
      console.error('Error downloading data:', error);
      alert('Gagal mengunduh data. Silakan coba lagi.');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleDownloadDeceased = async (filters = {}) => {
    try {
      setDownloadLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        alert('Sesi telah berakhir. Silakan login kembali.');
        return;
      }

      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('reportType', 'deceased');

      const response = await fetch(`/api/reports/export/csv?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengunduh data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data-meninggal-${filters.startDate || 'all'}-${filters.endDate || 'all'}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('Data berhasil diunduh!');
    } catch (error) {
      console.error('Error downloading data:', error);
      alert('Gagal mengunduh data. Silakan coba lagi.');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleFilter = (filters) => {
    setDateFilter(filters);
    fetchPatients(filters);
    fetchDeceasedPatients(filters);
  };

  const fetchPatients = async (filters = {}) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/patients?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDeceasedPatients = async (filters = {}) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/deceased-patients?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDeceasedPatients(data);
    } catch (error) {
      console.error('Error fetching deceased patients:', error);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>Data Pasien</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => handleDownload()}>
            📥 Download Data
          </button>
          <button className="btn btn-primary" onClick={activeTab === 'active' ? handleAdd : handleAddDeceased}>
            + {activeTab === 'active' ? 'Tambah Pasien' : 'Tambah Data Meninggal'}
          </button>
        </div>
      </div>

      <DateFilter 
        onFilter={handleFilter}
        onDownload={activeTab === 'active' ? handleDownload : handleDownloadDeceased}
        reportType={activeTab === 'active' ? 'patients' : 'deceased'}
        loading={downloadLoading}
      />

      {/* Tab Navigation */}
      <div className="tab-navigation" style={{ marginBottom: '2rem' }}>
        <button 
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          👥 Pasien Aktif ({patients.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'deceased' ? 'active' : ''}`}
          onClick={() => setActiveTab('deceased')}
        >
          🕊️ Data Meninggal ({deceasedPatients.length})
        </button>
      </div>

      {/* Active Patients Tab */}
      {activeTab === 'active' && (
        <>
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
        </>
      )}

      {/* Deceased Patients Tab */}
      {activeTab === 'deceased' && (
        <>
          {deceasedPatients.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Pasien</th>
                    <th>Tanggal Meninggal</th>
                    <th>No. Handphone</th>
                    <th>Alamat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {deceasedPatients.map((deceased, index) => (
                    <tr key={deceased.id}>
                      <td><strong>{index + 1}</strong></td>
                      <td>{deceased.nama_pasien}</td>
                      <td>{new Date(deceased.tanggal_meninggal).toLocaleDateString('id-ID')}</td>
                      <td>{deceased.no_handphone || '-'}</td>
                      <td>{deceased.alamat || '-'}</td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="btn btn-small btn-secondary"
                            onClick={() => handleEditDeceased(deceased)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-small btn-danger"
                            onClick={() => handleDeleteDeceased(deceased.id)}
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
                <h3>Belum ada data pasien meninggal</h3>
                <p>Klik tombol "Tambah Data Meninggal" untuk menambahkan data baru</p>
              </div>
            </div>
          )}
        </>
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

      {showDeceasedModal && (
        <DeceasedPatientModal
          deceasedPatient={editingDeceasedPatient}
          onClose={() => {
            console.log('Closing deceased patient modal');
            setShowDeceasedModal(false);
          }}
          onSave={handleSaveDeceased}
        />
      )}
    </div>
  );
}

export default Patients;

