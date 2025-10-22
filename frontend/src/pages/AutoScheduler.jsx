import React, { useState, useEffect } from 'react';
import './AutoScheduler.css';

function AutoScheduler() {
  const [patients, setPatients] = useState([]);
  const [scheduleGrid, setScheduleGrid] = useState({});
  const [loading, setLoading] = useState(false);
  const [autoScheduleParams, setAutoScheduleParams] = useState({
    startDate: '',
    endDate: '',
    shift: 'all', // pagi, siang, malam, atau all
    maxPatientsPerShift: 3
  });

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const shifts = [
    { id: 'pagi', name: 'PAGI', time: '07:00-11:00', color: '#FFE5E5' },
    { id: 'siang', name: 'SIANG', time: '11:00-15:00', color: '#FFFF00' },
    { id: 'sore', name: 'SORE', time: '15:00-19:00', color: '#90EE90' },
    { id: 'malam', name: 'MALAM', time: '19:00-23:00', color: '#87CEEB' }
  ];

  useEffect(() => {
    fetchPatients();
    fetchScheduleGrid();
    
    // Auto refresh every 10 seconds for real-time sync
    const interval = setInterval(() => {
      fetchScheduleGrid();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

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

  const fetchScheduleGrid = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/schedules/grid', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch schedule grid');
      
      const data = await response.json();
      console.log('📊 Schedule Grid Data:', data);
      console.log('📋 Grid Keys:', Object.keys(data));
      console.log('📌 Total schedules:', Object.values(data).reduce((sum, arr) => sum + arr.length, 0));
      setScheduleGrid(data || {});
    } catch (error) {
      console.error('Error fetching schedule grid:', error);
      setScheduleGrid({});
    }
  };

  const handleAutoSchedule = async () => {
    if (!autoScheduleParams.startDate || !autoScheduleParams.endDate) {
      alert('Mohon pilih tanggal mulai dan tanggal selesai');
      return;
    }

    if (patients.length === 0) {
      alert('Tidak ada data pasien untuk dijadwalkan');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/schedules/auto-generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(autoScheduleParams)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal membuat jadwal otomatis');
      }

      const result = await response.json();
      alert(`Berhasil membuat ${result.totalSchedules} jadwal otomatis!`);
      
      // Refresh grid
      await fetchScheduleGrid();
    } catch (error) {
      console.error('Error auto-scheduling:', error);
      alert('Gagal membuat jadwal otomatis: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSchedules = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus semua jadwal?')) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/schedules/clear', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghapus jadwal');
      }

      alert(`Berhasil menghapus ${data.deletedCount || 0} jadwal`);
      await fetchScheduleGrid();
    } catch (error) {
      console.error('Error clearing schedules:', error);
      alert('Gagal menghapus jadwal: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getScheduleKey = (day, shift) => `${day}-${shift}`;

  const getScheduleForSlot = (day, shift) => {
    const key = getScheduleKey(day, shift);
    const schedules = scheduleGrid[key] || [];
    if (schedules.length > 0) {
      console.log(`🔍 Found ${schedules.length} schedule(s) for ${key}`);
    }
    return schedules;
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>📅 Penjadwalan Otomatis Hemodialisis</h2>
        <div className="header-actions">
          <span className="sync-indicator">🔄 Auto-sync aktif</span>
        </div>
      </div>

      {/* Auto Schedule Controls */}
      <div className="auto-schedule-controls">
        <div className="controls-grid">
          <div className="form-group">
            <label>Tanggal Mulai</label>
            <input
              type="date"
              value={autoScheduleParams.startDate}
              onChange={(e) => setAutoScheduleParams({
                ...autoScheduleParams,
                startDate: e.target.value
              })}
            />
          </div>

          <div className="form-group">
            <label>Tanggal Selesai</label>
            <input
              type="date"
              value={autoScheduleParams.endDate}
              onChange={(e) => setAutoScheduleParams({
                ...autoScheduleParams,
                endDate: e.target.value
              })}
            />
          </div>

          <div className="form-group">
            <label>Shift</label>
            <select
              value={autoScheduleParams.shift}
              onChange={(e) => setAutoScheduleParams({
                ...autoScheduleParams,
                shift: e.target.value
              })}
            >
              <option value="all">Semua Shift</option>
              <option value="pagi">Pagi</option>
              <option value="siang">Siang</option>
              <option value="sore">Sore</option>
              <option value="malam">Malam</option>
            </select>
          </div>

          <div className="form-group">
            <label>Max Pasien per Shift</label>
            <input
              type="number"
              min="1"
              max="10"
              value={autoScheduleParams.maxPatientsPerShift}
              onChange={(e) => setAutoScheduleParams({
                ...autoScheduleParams,
                maxPatientsPerShift: parseInt(e.target.value)
              })}
            />
          </div>
        </div>

        <div className="controls-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleAutoSchedule}
            disabled={loading}
          >
            {loading ? '⏳ Membuat Jadwal...' : '🤖 Buat Jadwal Otomatis'}
          </button>
          <button 
            className="btn btn-danger" 
            onClick={handleClearSchedules}
            disabled={loading}
          >
            🗑️ Hapus Semua Jadwal
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={fetchScheduleGrid}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Info Stats */}
      <div className="schedule-stats">
        <div className="stat-card">
          <span className="stat-label">Total Pasien</span>
          <span className="stat-value">{patients.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Jadwal Aktif</span>
          <span className="stat-value">
            {Object.values(scheduleGrid).reduce((sum, arr) => sum + arr.length, 0)}
          </span>
        </div>
      </div>

      {/* Schedule Grid - Like the image */}
      <div className="schedule-grid-container">
        <table className="schedule-table">
          <thead>
            <tr>
              <th className="shift-column">SHIFT</th>
              {days.map(day => (
                <th key={day} className="day-column">{day.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shifts.map(shift => (
              <tr key={shift.id}>
                <td 
                  className="shift-cell" 
                  style={{ backgroundColor: shift.color }}
                >
                  <div className="shift-info">
                    <strong>{shift.name}</strong>
                    <small>{shift.time}</small>
                  </div>
                </td>
                {days.map(day => {
                  const schedules = getScheduleForSlot(day, shift.id);
                  return (
                    <td key={`${day}-${shift.id}`} className="schedule-cell">
                      {schedules.length > 0 ? (
                        <div className="schedule-items">
                          {schedules.map((schedule, idx) => (
                            <div key={idx} className="schedule-item">
                              <span className="patient-name">
                                {schedule.patient_name}
                              </span>
                              <span className="patient-rm">
                                ({schedule.no_rekam_medis})
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="empty-slot">-</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="schedule-legend">
        <h4>Keterangan:</h4>
        <div className="legend-items">
          {shifts.map(shift => (
            <div key={shift.id} className="legend-item">
              <span 
                className="legend-color" 
                style={{ backgroundColor: shift.color }}
              ></span>
              <span>{shift.name} ({shift.time})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AutoScheduler;

