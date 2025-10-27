import React, { useState, useEffect } from 'react';
import './BedManager.css';

function BedManager() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedShift, setSelectedShift] = useState('pagi');
  const [beds, setBeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedBed, setSelectedBed] = useState(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Schedule form states
  const [scheduleForm, setScheduleForm] = useState({
    patient_id: '',
    tanggal: '',
    status: 'scheduled',
    waktu_mulai: '',
    waktu_selesai: '',
    ruangan: '',
    mesin_dialisis: '',
    perawat: '',
    catatan: ''
  });

  const shifts = [
    { id: 'pagi', name: 'Pagi', time: '07:00-11:00', color: '#FF69B4' },
    { id: 'siang', name: 'Siang', time: '11:00-15:00', color: '#9b59b6' },
    { id: 'sore', name: 'Sore', time: '15:00-19:00', color: '#3498db' },
    { id: 'malam', name: 'Malam', time: '19:00-23:00', color: '#1abc9c' }
  ];

  // Floor system: Floor 1 = 22 beds, Floor 2 = 10 beds
  const [selectedFloor, setSelectedFloor] = useState(1);
  const floor1Beds = 22;
  const floor2Beds = 10;
  const totalBeds = floor1Beds + floor2Beds;

  useEffect(() => {
    fetchPatients();
    fetchBedStatus();
  }, [selectedDate, selectedShift, selectedFloor]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBedStatus();
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedDate, selectedShift, selectedFloor]);

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
      const response = await fetch(`/api/beds/status?date=${selectedDate}&shift=${selectedShift}&floor=${selectedFloor}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch bed status');
      
      const data = await response.json();
      setBeds(data.beds || []);
    } catch (error) {
      console.error('Error fetching bed status:', error);
      // Initialize empty beds for current floor
      const currentFloorBeds = selectedFloor === 1 ? floor1Beds : floor2Beds;
      const startBedNumber = selectedFloor === 1 ? 1 : floor1Beds + 1;
      
      const emptyBeds = Array.from({ length: currentFloorBeds }, (_, i) => ({
        bedNumber: startBedNumber + i,
        floor: selectedFloor,
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
      // Pre-fill form dengan data bed yang dipilih
      setScheduleForm({
        patient_id: '',
        tanggal: selectedDate,
        status: 'scheduled',
        waktu_mulai: getShiftStartTime(selectedShift),
        waktu_selesai: getShiftEndTime(selectedShift),
        ruangan: `Lantai ${bed.floor || selectedFloor}`,
        mesin_dialisis: `Bed ${bed.bedNumber}`,
        perawat: '',
        catatan: ''
      });
      setShowScheduleForm(true);
    } else {
      // Show options for occupied bed
      const action = confirm(
        `Bed ${bed.bedNumber} - Lantai ${bed.floor || selectedFloor}\n` +
        `Pasien: ${bed.patient?.nama || 'Unknown'}\n` +
        `No. RM: ${bed.patient?.no_rekam_medis || '-'}\n\n` +
        `Klik OK untuk SELESAI (complete), atau CANCEL untuk tutup.`
      );
      
      if (action && bed.schedule?.id) {
        handleCompleteSchedule(bed.schedule.id);
      }
    }
  };

  const getShiftStartTime = (shift) => {
    switch(shift) {
      case 'pagi': return '07:00';
      case 'siang': return '11:00';
      case 'sore': return '15:00';
      case 'malam': return '19:00';
      default: return '07:00';
    }
  };

  const getShiftEndTime = (shift) => {
    switch(shift) {
      case 'pagi': return '11:00';
      case 'siang': return '15:00';
      case 'sore': return '19:00';
      case 'malam': return '23:00';
      default: return '11:00';
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

  const handleSaveSchedule = async () => {
    if (!scheduleForm.patient_id) {
      alert('Pilih pasien terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(scheduleForm)
      });

      if (!response.ok) throw new Error('Gagal membuat jadwal');

      alert(`✅ Jadwal berhasil dibuat untuk Bed ${selectedBed.bedNumber}!`);
      setShowScheduleForm(false);
      setSelectedBed(null);
      await fetchBedStatus();
    } catch (error) {
      console.error('Error creating schedule:', error);
      alert('Gagal membuat jadwal: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSchedule = () => {
    setShowScheduleForm(false);
    setSelectedBed(null);
    setScheduleForm({
      patient_id: '',
      tanggal: '',
      status: 'scheduled',
      waktu_mulai: '',
      waktu_selesai: '',
      ruangan: '',
      mesin_dialisis: '',
      perawat: '',
      catatan: ''
    });
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

      {/* Floor Selector */}
      <div className="controls-panel">
        <div className="control-group">
          <label>🏢 Lantai</label>
          <div className="floor-selector">
            <button
              className={`floor-btn ${selectedFloor === 1 ? 'active' : ''}`}
              onClick={() => setSelectedFloor(1)}
            >
              Lantai 1 (22 Bed)
            </button>
            <button
              className={`floor-btn ${selectedFloor === 2 ? 'active' : ''}`}
              onClick={() => setSelectedFloor(2)}
            >
              Lantai 2 (10 Bed)
            </button>
          </div>
        </div>

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

      {/* Bed Grid - Floor Layout */}
      <div className="cinema-screen">
        <div className="screen-label">🏥 Lantai {selectedFloor} - Hemodialisis</div>
      </div>

      <div className="beds-grid">
        <div className="floor-section">
          <div className="beds-row">
            {beds.map(bed => (
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
      </div>

      {/* Stats */}
      <div className="bed-stats">
        <div className="stat-card">
          <span className="stat-label">Bed Lantai {selectedFloor}</span>
          <span className="stat-value">{selectedFloor === 1 ? floor1Beds : floor2Beds}</span>
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

      {/* Schedule Form Modal */}
      {showScheduleForm && selectedBed && (
        <div className="schedule-modal-overlay" onClick={handleCancelSchedule}>
          <div className="schedule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><strong>Tambah Jadwal Baru</strong></h3>
              <button className="close-btn" onClick={handleCancelSchedule}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="patient_id"><strong>Pasien *</strong></label>
                  <select
                    id="patient_id"
                    value={scheduleForm.patient_id}
                    onChange={(e) => setScheduleForm({...scheduleForm, patient_id: e.target.value})}
                    className="form-select"
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

                <div className="form-group">
                  <label htmlFor="tanggal"><strong>Tanggal *</strong></label>
                  <input
                    type="date"
                    id="tanggal"
                    value={scheduleForm.tanggal}
                    onChange={(e) => setScheduleForm({...scheduleForm, tanggal: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="status"><strong>Status *</strong></label>
                  <select
                    id="status"
                    value={scheduleForm.status}
                    onChange={(e) => setScheduleForm({...scheduleForm, status: e.target.value})}
                    className="form-select"
                    required
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="waktu_mulai"><strong>Waktu Mulai *</strong></label>
                  <input
                    type="time"
                    id="waktu_mulai"
                    value={scheduleForm.waktu_mulai}
                    onChange={(e) => setScheduleForm({...scheduleForm, waktu_mulai: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="waktu_selesai"><strong>Waktu Selesai *</strong></label>
                  <input
                    type="time"
                    id="waktu_selesai"
                    value={scheduleForm.waktu_selesai}
                    onChange={(e) => setScheduleForm({...scheduleForm, waktu_selesai: e.target.value})}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ruangan"><strong>Ruangan</strong></label>
                  <input
                    type="text"
                    id="ruangan"
                    value={scheduleForm.ruangan}
                    onChange={(e) => setScheduleForm({...scheduleForm, ruangan: e.target.value})}
                    className="form-input"
                    placeholder="Contoh: Ruang Hemodialisis 1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="mesin_dialisis"><strong>Mesin Dialisis</strong></label>
                  <input
                    type="text"
                    id="mesin_dialisis"
                    value={scheduleForm.mesin_dialisis}
                    onChange={(e) => setScheduleForm({...scheduleForm, mesin_dialisis: e.target.value})}
                    className="form-input"
                    placeholder="Contoh: Mesin HD_01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="perawat"><strong>Perawat</strong></label>
                  <input
                    type="text"
                    id="perawat"
                    value={scheduleForm.perawat}
                    onChange={(e) => setScheduleForm({...scheduleForm, perawat: e.target.value})}
                    className="form-input"
                    placeholder="Nama perawat"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="catatan"><strong>Catatan</strong></label>
                <textarea
                  id="catatan"
                  value={scheduleForm.catatan}
                  onChange={(e) => setScheduleForm({...scheduleForm, catatan: e.target.value})}
                  className="form-textarea"
                  placeholder="Catatan tambahan..."
                  rows="3"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={handleCancelSchedule}
                disabled={loading}
              >
                Batal
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSaveSchedule}
                disabled={!scheduleForm.patient_id || loading}
              >
                {loading ? 'Menyimpan...' : '✓ Simpan Jadwal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BedManager;

