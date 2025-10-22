import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const QuickLogin = ({ onLogin, onCancel }) => {
  const [users, setUsers] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Supabase client
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    loadUsers();
    loadRecentUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentUsers = async () => {
    try {
      const response = await fetch('/api/auth/recent-users');
      if (response.ok) {
        const data = await response.json();
        setRecentUsers(data);
      }
    } catch (error) {
      console.error('Error loading recent users:', error);
    }
  };

  const handleQuickLogin = async (user) => {
    setSelectedUser(user);
    setPassword('');
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: selectedUser.username,
          password: password,
          station_id: 'pc-a', // Will be dynamic based on station
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('sessionToken', data.session.token);
        
        onLogin(data.user);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="quick-login-overlay">
        <div className="quick-login-modal">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedUser) {
    return (
      <div className="quick-login-overlay">
        <div className="quick-login-modal">
          <div className="login-form">
            <div className="user-info">
              <div className="user-avatar">
                {selectedUser.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <h3>{selectedUser.full_name}</h3>
                <p>{selectedUser.username} • {selectedUser.role}</p>
              </div>
            </div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  autoFocus
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button type="button" onClick={() => setSelectedUser(null)} className="btn-secondary">
                  Back
                </button>
                <button type="submit" className="btn-primary">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="quick-login-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}
    >
      <div 
        className="quick-login-modal"
        style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          maxWidth: '800px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'hidden'
        }}
      >
        <div 
          className="quick-login-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            borderBottom: '1px solid #eee',
            background: '#f8f9fa'
          }}
        >
          <h2 style={{ margin: 0, color: '#2c3e50' }}>Quick Login</h2>
          <button 
            onClick={onCancel} 
            className="close-btn"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '5px',
              borderRadius: '4px',
              transition: 'background 0.2s'
            }}
          >
            &times;
          </button>
        </div>

        <div 
          className="search-section"
          style={{
            padding: '20px',
            borderBottom: '1px solid #eee'
          }}
        >
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.2s',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3498db'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>

        {recentUsers.length > 0 && (
          <div className="recent-users">
            <h3>Recent Users</h3>
            <div className="user-grid">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="user-card recent"
                  onClick={() => handleQuickLogin(user)}
                >
                  <div className="user-avatar">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <h4>{user.full_name}</h4>
                    <p>{user.role}</p>
                  </div>
                  <div className="quick-login-btn">→</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div 
          className="all-users"
          style={{
            padding: '20px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50', fontSize: '18px' }}>
            All Users ({filteredUsers.length})
          </h3>
          <div className="user-grid">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="user-card"
                onClick={() => handleQuickLogin(user)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px',
                  margin: '10px 0',
                  border: '2px solid #eee',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#3498db';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#eee';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                <div 
                  className="user-avatar"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#3498db',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    marginRight: '15px'
                  }}
                >
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info" style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50', fontSize: '16px' }}>
                    {user.full_name}
                  </h4>
                  <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                    {user.username} • {user.role}
                  </p>
                  {user.shift && (
                    <span 
                      className="shift-badge"
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '12px',
                        marginTop: '5px'
                      }}
                    >
                      {user.shift}
                    </span>
                  )}
                </div>
                <div 
                  className="quick-login-btn"
                  style={{
                    fontSize: '20px',
                    color: '#3498db',
                    fontWeight: 'bold'
                  }}
                >
                  →
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="no-users">
            <p>No users found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickLogin;
