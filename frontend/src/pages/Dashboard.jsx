import { useState, useEffect } from 'react';

function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalSchedules: 0,
    todaySchedules: 0,
    upcomingSchedules: 0
  });
  const [recentSchedules, setRecentSchedules] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [patientsRes, schedulesRes] = await Promise.all([
        fetch('/api/patients'),
        fetch('/api/schedules')
      ]);

      const patients = await patientsRes.json();
      const schedules = await schedulesRes.json();

      const today = new Date().toISOString().split('T')[0];
      const todaySchedules = schedules.filter(s => s.tanggal === today);
      const upcomingSchedules = schedules.filter(s => s.tanggal > today && s.status === 'scheduled');

      setStats({
        totalPatients: patients.length,
        totalSchedules: schedules.length,
        todaySchedules: todaySchedules.length,
        upcomingSchedules: upcomingSchedules.length
      });

      setRecentSchedules(schedules.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{stats.totalPatients}</h3>
          <p style={{ opacity: 0.9 }}>Total Pasien</p>
        </div>
        
        <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{stats.todaySchedules}</h3>
          <p style={{ opacity: 0.9 }}>Jadwal Hari Ini</p>
        </div>
        
        <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{stats.upcomingSchedules}</h3>
          <p style={{ opacity: 0.9 }}>Jadwal Mendatang</p>
        </div>
        
        <div className="card" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>{stats.totalSchedules}</h3>
          <p style={{ opacity: 0.9 }}>Total Jadwal</p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>Jadwal Terbaru</h3>
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
                      <strong>{schedule.patient_name}</strong>
                      <br />
                      <span style={{ fontSize: '0.875rem', color: 'var(--gray)' }}>
                        {schedule.no_rekam_medis}
                      </span>
                    </td>
                    <td>{new Date(schedule.tanggal).toLocaleDateString('id-ID')}</td>
                    <td>{schedule.waktu_mulai} - {schedule.waktu_selesai}</td>
                    <td>{schedule.ruangan || '-'}</td>
                    <td>
                      <span className={`badge badge-${schedule.status}`}>
                        {schedule.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>Belum ada jadwal</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

