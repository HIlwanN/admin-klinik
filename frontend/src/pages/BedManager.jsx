import React, { useState, useEffect } from 'react';
import './BedManager.css';

function BedManager() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedShift, setSelectedShift] = useState('pagi');
  const [beds, setBeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedBed, setSelectedBed] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [loading, setLoading] = useState(false);

  const shifts = [
    { id: 'pagi', name: 'Pagi', time: '07:00-11:00', color: '#FF69B4' },
    { id: 'siang', name: 'Siang', time: '11:00-15:00', color: '#9b59b6' },
    { id: 'sore', name: 'Sore', time: '15:00-19:00', color: '#3498db' },
    { id: 'malam', name: 'Malam', time: '19:00-23:00', color: '#1abc9c' }
  ];

  // Total beds: 3 rooms x 4 beds each = 12 beds
  const totalBeds = 12;
  const bedsPerRoom = 4;
  const totalRooms = 3;

  useEffect(() => {
    fetchPatients();
    fetchBedStatus();
  }, [selectedDate, selectedShift]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBedStatus();
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedDate, selectedShift]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/patients', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch patients');
      
      const data = await response.json();
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    }
  };

  const fetchBedStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/beds/status?date=${selectedDate}&shift=${selectedShift}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch bed status');
      
      const data = await response.json();
      setBeds(data.beds || []);
    } catch (error) {
      console.error('Error fetching bed status:', error);
      // Initialize empty beds
      const emptyBeds = Array.from({ length: totalBeds }, (_, i) => ({
        bedNumber: i + 1,
        room: Math.floor(i / bedsPerRoom) + 1,
        status: 'available',
        patient: null,
        schedule: null
      }));
      setBeds(emptyBeds);
    }
  };

  const handleBedClick = (bed) => {
    if (bed.status === 'available') {
      setSelectedBed(bed);
      setSelectedPatient('');
    } else {
      // Show options for occupied bed
      const action = confirm(
        `Bed ${bed.bedNumber} - Ruang ${bed.room}\n` +
        `Pasien: ${bed.patient?.nama || 'Unknown'}\n` +
        `No. RM: ${bed.patient?.no_rekam_medis || '-'}\n\n` +
        `Klik OK untuk SELESAI (complete), atau CANCEL untuk tutup.`
      );
      
      if (action && bed.schedule?.id) {
        handleCompleteSchedule(bed.schedule.id);
      }
    }
  };

  const handleCompleteSchedule = async (scheduleId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/schedules/${scheduleId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'completed' })
      });

      if (!response.ok) throw new Error('Gagal update status');

      alert('✅ Jadwal selesai! Bed sekarang tersedia.');
      await fetchBedStatus();
    } catch (error) {
      console.error('Error completing schedule:', error);
      alert('Gagal menyelesaikan jadwal: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPatient = async () => {
    if (!selectedBed || !selectedPatient) {
      alert('Pilih bed dan pasien terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const shift = shifts.find(s => s.id === selectedShift);
      
      const scheduleData = {
        patient_id: selectedPatient,
        tanggal: selectedDate,
        waktu_mulai: shift.id === 'pagi' ? '07:00' : 
                      shift.id === 'siang' ? '11:00' : 
                      shift.id === 'sore' ? '15:00' : '19:00',
        waktu_selesai: shift.id === 'pagi' ? '11:00' : 
                        shift.id === 'siang' ? '15:00' : 
                        shift.id === 'sore' ? '19:00' : '23:00',
        ruangan: `Ruang ${selectedBed.room}`,
        mesin_dialisis: `Bed ${selectedBed.bedNumber}`,
        perawat: 'Akan ditentukan',
        status: 'scheduled',
        catatan: `Bed ${selectedBed.bedNumber} - Ruang ${selectedBed.room}`
      };

      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(scheduleData)
      });

      if (!response.ok) throw new Error('Gagal membuat jadwal');

      alert(`Berhasil assign pasien ke Bed ${selectedBed.bedNumber}!`);
      setSelectedBed(null);
      setSelectedPatient('');
      await fetchBedStatus();
    } catch (error) {
      console.error('Error assigning patient:', error);
      alert('Gagal assign pasien: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAssignment = () => {
    setSelectedBed(null);
    setSelectedPatient('');
  };

  const getBedStatus = (bed) => {
    if (bed.status === 'occupied') return 'occupied';
    if (selectedBed && selectedBed.bedNumber === bed.bedNumber) return 'selected';
    return 'available';
  };

  const currentShift = shifts.find(s => s.id === selectedShift);

  return (
    <div className="bed-manager-container">
      <div className="page-header">
        <h2>🛏️ Manajemen Bed Hemodialisis</h2>
      </div>

      {/* Date and Shift Selector */}
      <div className="controls-panel">
        <div className="control-group">
          <label>📅 Tanggal</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
          />
        </div>

        <div className="shift-selector">
          {shifts.map(shift => (
            <button
              key={shift.id}
              className={`shift-btn ${selectedShift === shift.id ? 'active' : ''}`}
              onClick={() => setSelectedShift(shift.id)}
              style={{
                borderColor: selectedShift === shift.id ? shift.color : '#ddd',
                backgroundColor: selectedShift === shift.id ? shift.color : 'white',
                color: selectedShift === shift.id ? 'white' : '#333'
              }}
            >
              <strong>{shift.name}</strong>
              <small>{shift.time}</small>
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bed-legend">
        <div className="legend-item">
          <div className="legend-box available"></div>
          <span>Tersedia</span>
        </div>
        <div className="legend-item">
          <div className="legend-box occupied"></div>
          <span>Terisi</span>
        </div>
        <div className="legend-item">
          <div className="legend-box selected"></div>
          <span>Dipilih</span>
        </div>
      </div>

      {/* Bed Grid - Cinema Style */}
      <div className="cinema-screen">
        <div className="screen-label">🏥 AREA HEMODIALISIS</div>
      </div>

      <div className="beds-grid">
        {Array.from({ length: totalRooms }).map((_, roomIdx) => (
          <div key={roomIdx} className="room-section">
            <div className="room-label">Ruang {roomIdx + 1}</div>
            <div className="beds-row">
              {beds
                .filter(bed => bed.room === roomIdx + 1)
                .map(bed => (
                  <div
                    key={bed.bedNumber}
                    className={`bed-seat ${getBedStatus(bed)}`}
                    onClick={() => handleBedClick(bed)}
                  >
                    <div className="bed-number">{bed.bedNumber}</div>
                    {bed.status === 'occupied' && (
                      <div className="patient-initial">
                        {bed.patient?.nama?.charAt(0).toUpperCase() || 'P'}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bed-stats">
        <div className="stat-card">
          <span className="stat-label">Total Bed</span>
          <span className="stat-value">{totalBeds}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Tersedia</span>
          <span className="stat-value available-color">
            {beds.filter(b => b.status === 'available').length}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Terisi</span>
          <span className="stat-value occupied-color">
            {beds.filter(b => b.status === 'occupied').length}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Shift</span>
          <span className="stat-value" style={{ color: currentShift?.color }}>
            {currentShift?.name}
          </span>
        </div>
      </div>

      {/* Assignment Modal */}
      {selectedBed && (
        <div className="assignment-modal-overlay" onClick={handleCancelAssignment}>
          <div className="assignment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign Pasien ke Bed {selectedBed.bedNumber}</h3>
              <button className="close-btn" onClick={handleCancelAssignment}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="bed-info">
                <p><strong>Ruang:</strong> {selectedBed.room}</p>
                <p><strong>Tanggal:</strong> {new Date(selectedDate).toLocaleDateString('id-ID')}</p>
                <p><strong>Shift:</strong> {currentShift?.name} ({currentShift?.time})</p>
              </div>

              <div className="patient-select-group">
                <label>Pilih Pasien:</label>
                <select
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="patient-select"
                >
                  <option value="">-- Pilih Pasien --</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.nama} - {patient.no_rekam_medis}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={handleCancelAssignment}
                disabled={loading}
              >
                Batal
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAssignPatient}
                disabled={!selectedPatient || loading}
              >
                {loading ? 'Menyimpan...' : '✓ Assign Pasien'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BedManager;

