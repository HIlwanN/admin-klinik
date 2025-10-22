import React, { useState, useEffect } from 'react';

const SessionManager = ({ currentUser, onLogout }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heartbeatInterval, setHeartbeatInterval] = useState(null);

  useEffect(() => {
    loadSessions();
    startHeartbeat();
    
    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    };
  }, []);

  const loadSessions = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const startHeartbeat = () => {
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('authToken');
        await fetch('/api/session/heartbeat', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Heartbeat failed:', error);
      }
    }, 30000); // Every 30 seconds

    setHeartbeatInterval(interval);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          station_id: 'pc-a' // Will be dynamic
        })
      });

      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('sessionToken');

      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Still logout locally
      localStorage.clear();
      onLogout();
    }
  };

  const handleEndSession = async (sessionId) => {
    if (!confirm('Are you sure you want to end this session?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        loadSessions();
      }
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const getSessionDuration = (loginTime) => {
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

  const getLastActivity = (lastActivity) => {
    const now = new Date();
    const activity = new Date(lastActivity);
    const diff = now - activity;
    
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(diff / 3600000);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  };

  const isSessionActive = (lastActivity) => {
    const now = new Date();
    const activity = new Date(lastActivity);
    const diff = now - activity;
    return diff < 300000; // 5 minutes
  };

  if (loading) {
    return (
      <div className="session-manager">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="session-manager">
      <div className="session-header">
        <div className="current-user">
          <div className="user-avatar">
            {currentUser.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h3>{currentUser.full_name}</h3>
            <p>{currentUser.role} • Station: pc-a</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>

      <div className="session-stats">
        <div className="stat-card">
          <div className="stat-number">{sessions.length}</div>
          <div className="stat-label">Active Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {sessions.filter(s => isSessionActive(s.last_activity)).length}
          </div>
          <div className="stat-label">Online Now</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {sessions.filter(s => s.station_id === 'pc-a').length}
          </div>
          <div className="stat-label">This Station</div>
        </div>
      </div>

      <div className="sessions-list">
        <h3>Active Sessions</h3>
        {sessions.map((session) => (
          <div key={session.id} className="session-item">
            <div className="session-info">
              <div className="user-avatar">
                {session.user.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="session-details">
                <div className="user-name">{session.user.full_name}</div>
                <div className="session-meta">
                  <span className="station">Station: {session.station_id}</span>
                  <span className="role">{session.user.role}</span>
                </div>
                <div className="session-time">
                  <span>Started: {new Date(session.login_time).toLocaleString()}</span>
                  <span>Duration: {getSessionDuration(session.login_time)}</span>
                </div>
                <div className="session-activity">
                  <span className={`activity-status ${isSessionActive(session.last_activity) ? 'active' : 'inactive'}`}>
                    {isSessionActive(session.last_activity) ? '🟢 Active' : '🔴 Inactive'}
                  </span>
                  <span>Last activity: {getLastActivity(session.last_activity)}</span>
                </div>
              </div>
            </div>
            
            <div className="session-actions">
              {session.user.id !== currentUser.id && (
                <button
                  onClick={() => handleEndSession(session.id)}
                  className="end-session-btn"
                  title="End this session"
                >
                  🚫 End Session
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {sessions.length === 0 && (
        <div className="no-sessions">
          <p>No active sessions found.</p>
        </div>
      )}

      <div className="session-footer">
        <div className="heartbeat-status">
          <div className="pulse-dot"></div>
          <span>Heartbeat active (every 30s)</span>
        </div>
        <div className="session-info">
          <span>Your session: {getSessionDuration(sessions.find(s => s.user.id === currentUser.id)?.login_time)}</span>
        </div>
      </div>
    </div>
  );
};

export default SessionManager;
