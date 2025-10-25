import React, { useState, useEffect } from 'react';
import DateFilter from '../components/DateFilter';

function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalSchedules: 0,
    todaySchedules: 0,
    upcomingSchedules: 0
  });
  const [recentSchedules, setRecentSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    
    // Auto refresh setiap 30 detik
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.error('No auth token found');
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [patientsRes, schedulesRes] = await Promise.all([
        fetch('/api/patients', { headers }),
        fetch('/api/schedules', { headers })
      ]);

      if (!patientsRes.ok || !schedulesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const patients = await patientsRes.json();
      const schedules = await schedulesRes.json();

      const today = new Date().toISOString().split('T')[0];
      const todaySchedules = schedules.filter(s => s.tanggal === today && s.status === 'scheduled');
      const upcomingSchedules = schedules.filter(s => s.tanggal > today && s.status === 'scheduled');

      setStats({
        totalPatients: patients.length,
        totalSchedules: schedules.length,
        todaySchedules: todaySchedules.length,
        upcomingSchedules: upcomingSchedules.length
      });

      // Sort jadwal berdasarkan tanggal terbaru dan ambil 5 teratas
      const sortedSchedules = schedules
        .sort((a, b) => new Date(b.created_at || b.tanggal) - new Date(a.created_at || a.tanggal))
        .slice(0, 5);

      console.log('Processed schedules for dashboard:', sortedSchedules); // Debug log
      setRecentSchedules(sortedSchedules);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleDownloadReport = async (filters) => {
    try {
      setDownloadLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        alert('Token tidak ditemukan. Silakan login ulang.');
        return;
      }

      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('reportType', 'comprehensive');

      const response = await fetch(`/api/reports/export/csv?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Gagal mengunduh laporan');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `laporan-dashboard-${filters.startDate || 'all'}-${filters.endDate || 'all'}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('Laporan berhasil diunduh!');
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Gagal mengunduh laporan: ' + error.message);
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleFilter = (filters) => {
    // For dashboard, we can implement filtering logic here
    console.log('Dashboard filter applied:', filters);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="page-header">
          <h2>Dashboard</h2>
        </div>
        <div className="loading-dashboard">
          <div className="loading-spinner"></div>
          <p>Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Dashboard</h2>
        <div className="dashboard-controls">
          {lastUpdated && (
            <span className="last-updated">
              Terakhir diperbarui: {lastUpdated.toLocaleTimeString('id-ID')}
            </span>
          )}
          <button className="btn btn-secondary" onClick={fetchDashboardData}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <DateFilter 
        onFilter={handleFilter}
        onDownload={handleDownloadReport}
        reportType="comprehensive"
        loading={downloadLoading}
      />

      <div className="stats-grid">
        <div className="stat-card stat-purple">
          <div className="stat-number">{stats.totalPatients}</div>
          <div className="stat-label">Total Pasien</div>
        </div>
        
        <div className="stat-card stat-pink">
          <div className="stat-number">{stats.todaySchedules}</div>
          <div className="stat-label">Jadwal Hari Ini</div>
        </div>
        
        <div className="stat-card stat-blue">
          <div className="stat-number">{stats.upcomingSchedules}</div>
          <div className="stat-label">Jadwal Mendatang</div>
        </div>
        
        <div className="stat-card stat-green">
          <div className="stat-number">{stats.totalSchedules}</div>
          <div className="stat-label">Total Jadwal</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Jadwal Terbaru</h3>
          <span className="schedules-count">{recentSchedules.length} jadwal</span>
        </div>
        
        {recentSchedules.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Pasien</th>
                  <th>Tanggal</th>
                  <th>Waktu</th>
                  <th>Ruangan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSchedules.map(schedule => (
                  <tr key={schedule.id}>
                    <td>
                      <div className="patient-info">
                        <strong>{schedule.patient?.nama || schedule.patient_name || 'Nama tidak tersedia'}</strong>
                        <div className="patient-rm">RM: {schedule.patient?.no_rekam_medis || schedule.no_rekam_medis || 'RM tidak tersedia'}</div>
                      </div>
                    </td>
                    <td>{new Date(schedule.tanggal).toLocaleDateString('id-ID')}</td>
                    <td>
                      <span className="time-range">
                        {schedule.waktu_mulai} - {schedule.waktu_selesai}
                      </span>
                    </td>
                    <td>
                      <span className="room-info">
                        {schedule.ruangan || '-'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${schedule.status}`}>
                        {schedule.status === 'scheduled' ? 'Terjadwal' : 
                         schedule.status === 'completed' ? 'Selesai' : 
                         schedule.status === 'cancelled' ? 'Dibatalkan' : schedule.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h4>Belum ada jadwal</h4>
            <p>Jadwal yang ditambahkan akan muncul di sini</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

