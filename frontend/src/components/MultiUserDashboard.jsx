import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const MultiUserDashboard = () => {
  const [stations, setStations] = useState([]);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSessions: 0,
    todayActivities: 0
  });
  const [loading, setLoading] = useState(true);

  // Supabase client
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    loadDashboardData();
    setupRealtimeSubscriptions();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Load all data in parallel
      const [stationsRes, usersRes, sessionsRes, statsRes] = await Promise.all([
        fetch('/api/stations', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/sessions', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (stationsRes.ok) setStations(await stationsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (sessionsRes.ok) setSessions(await sessionsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    // Subscribe to sessions changes
    const sessionsChannel = supabase
      .channel('sessions-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'active_sessions' },
        (payload) => {
          console.log('Session change:', payload);
          loadDashboardData(); // Reload all data
        }
      )
      .subscribe();

    // Subscribe to stations changes
    const stationsChannel = supabase
      .channel('stations-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'stations' },
        (payload) => {
          console.log('Station change:', payload);
          loadDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(stationsChannel);
    };
  };

  const getStationStatus = (station) => {
    const activeSession = sessions.find(s => s.station_id === station.id && s.is_active);
    return {
      isOnline: station.is_online,
      currentUser: activeSession?.user,
      lastHeartbeat: station.last_heartbeat
    };
  };

  const getOnlineUsers = () => {
    return sessions.filter(session => {
      const now = new Date();
      const lastActivity = new Date(session.last_activity);
      const diff = now - lastActivity;
      return diff < 300000; // 5 minutes
    });
  };

  const getStationActivity = (stationId) => {
    return sessions.filter(s => s.station_id === stationId);
  };

  if (loading) {
    return (
      <div className="multi-user-dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="multi-user-dashboard">
      <div className="dashboard-header">
        <h1>Multi-User Dashboard</h1>
        <div className="dashboard-controls">
          <button onClick={loadDashboardData} className="refresh-btn">
            🔄 Refresh
          </button>
          <div className="live-indicator">
            <div className="pulse-dot"></div>
            <span>Live Updates</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🟢</div>
          <div className="stat-content">
            <div className="stat-number">{getOnlineUsers().length}</div>
            <div className="stat-label">Online Now</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💻</div>
          <div className="stat-content">
            <div className="stat-number">{stations.length}</div>
            <div className="stat-label">Workstations</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{stats.todayActivities}</div>
            <div className="stat-label">Today's Activities</div>
          </div>
        </div>
      </div>

      {/* Workstations Status */}
      <div className="workstations-section">
        <h2>Workstation Status</h2>
        <div className="stations-grid">
          {stations.map((station) => {
            const status = getStationStatus(station);
            const stationSessions = getStationActivity(station.id);
            
            return (
              <div key={station.id} className="station-card">
                <div className="station-header">
                  <div className="station-info">
                    <h3>{station.name}</h3>
                    <p>{station.location}</p>
                  </div>
                  <div className={`status-indicator ${status.isOnline ? 'online' : 'offline'}`}>
                    {status.isOnline ? '🟢 Online' : '🔴 Offline'}
                  </div>
                </div>

                <div className="station-details">
                  {status.currentUser ? (
                    <div className="current-user">
                      <div className="user-avatar">
                        {status.currentUser.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-info">
                        <div className="user-name">{status.currentUser.full_name}</div>
                        <div className="user-role">{status.currentUser.role}</div>
                        <div className="session-time">
                          Active for {getSessionDuration(stationSessions[0]?.login_time)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="no-user">
                      <p>No user currently logged in</p>
                    </div>
                  )}

                  <div className="station-stats">
                    <div className="stat">
                      <span className="label">Sessions Today:</span>
                      <span className="value">{stationSessions.length}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Last Heartbeat:</span>
                      <span className="value">
                        {status.lastHeartbeat ? 
                          new Date(status.lastHeartbeat).toLocaleTimeString() : 
                          'Never'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Online Users */}
      <div className="online-users-section">
        <h2>Currently Online</h2>
        <div className="users-grid">
          {getOnlineUsers().map((session) => (
            <div key={session.id} className="user-card">
              <div className="user-avatar">
                {session.user.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <div className="user-name">{session.user.full_name}</div>
                <div className="user-role">{session.user.role}</div>
                <div className="user-station">Station: {session.station_id}</div>
                <div className="session-duration">
                  Online for {getSessionDuration(session.login_time)}
                </div>
              </div>
              <div className="user-status">
                <div className="status-dot active"></div>
                <span>Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="recent-activities-section">
        <h2>Recent Activities</h2>
        <div className="activities-list">
          {sessions.slice(0, 10).map((session) => (
            <div key={session.id} className="activity-item">
              <div className="activity-icon">👤</div>
              <div className="activity-content">
                <div className="activity-text">
                  <strong>{session.user.full_name}</strong> logged in to{' '}
                  <strong>{session.station_id}</strong>
                </div>
                <div className="activity-time">
                  {new Date(session.login_time).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function
const getSessionDuration = (loginTime) => {
  if (!loginTime) return '0m';
  
  const now = new Date();
  const login = new Date(loginTime);
  const diff = now - login;
  
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export default MultiUserDashboard;
