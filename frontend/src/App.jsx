import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Schedules from './pages/Schedules';
import AutoScheduler from './pages/AutoScheduler';
import BedManager from './pages/BedManager';
import QuickLogin from './components/QuickLogin';
import UserManagement from './components/UserManagement';
import SessionManager from './components/SessionManager';
import MultiUserDashboard from './components/MultiUserDashboard';
import RSLogo from './RS.png';
import RHLogo from './RH.png';
import './multi-user.css';

function Navigation({ user, onLogout }) {
  const location = useLocation();
  
  return (
    <nav className="nav">
      <ul className="nav-list">
        <li className="nav-item">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/patients" 
            className={`nav-link ${location.pathname === '/patients' ? 'active' : ''}`}
          >
            Data Pasien
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/schedules" 
            className={`nav-link ${location.pathname === '/schedules' ? 'active' : ''}`}
          >
            Jadwal Manual
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/auto-scheduler" 
            className={`nav-link ${location.pathname === '/auto-scheduler' ? 'active' : ''}`}
          >
            🤖 Jadwal Otomatis
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/bed-manager" 
            className={`nav-link ${location.pathname === '/bed-manager' ? 'active' : ''}`}
          >
            🛏️ Bed Manager
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/multi-user" 
            className={`nav-link ${location.pathname === '/multi-user' ? 'active' : ''}`}
          >
            Multi-User
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/users" 
            className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`}
          >
            User Management
          </Link>
        </li>
      </ul>
      
      {user && (
        <div className="nav-user-section">
          <div className="nav-user-info">
            <div className="nav-user-avatar">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="nav-user-details">
              <div className="nav-user-name">{user.full_name || 'User'}</div>
              <div className="nav-user-role">{user.role || 'Admin'}</div>
            </div>
          </div>
          <button onClick={onLogout} className="nav-logout-btn">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [showQuickLogin, setShowQuickLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Direct login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setUser(user);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.clear();
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error in checkAuthStatus:', error);
      setError('Failed to initialize application');
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowQuickLogin(false);
  };

  const handleDirectLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          station_id: 'web-portal',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('sessionToken', data.session.token);
        
        setUser(data.user);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setLoginError(data.error || 'Email atau password salah');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Koneksi gagal. Pastikan backend berjalan.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error-screen">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app">
        <div className="login-screen">
          <div className="login-container">
            <div className="login-logos">
              <img src={RSLogo} alt="RSUD Logo" className="login-logo" />
              <img src={RHLogo} alt="Hemodialisa Logo" className="login-logo" />
            </div>
            <div className="login-header">
              <h1>Sistem Manajemen Pasien Cuci Darah</h1>
              <p className="login-subtitle">Rumah Sakit - Instalasi Hemodialisa</p>
            </div>
            <div className="login-info">
              <div className="info-card">
                <span className="info-icon">🛏️</span>
                <span>Bed Management</span>
              </div>
              <div className="info-card">
                <span className="info-icon">📅</span>
                <span>Scheduling System</span>
              </div>
              <div className="info-card">
                <span className="info-icon">👥</span>
                <span>Multi-User Access</span>
              </div>
            </div>
            
            <form onSubmit={handleDirectLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin1@hemodialisa.com"
                  required
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                />
              </div>

              {loginError && <div className="error-message">{loginError}</div>}

              <button 
                type="submit"
                className="login-btn"
                disabled={loginLoading}
              >
                {loginLoading ? '⏳ Loading...' : '🔐 Login ke Sistem'}
              </button>
            </form>
            
            <p className="login-footer">Admin Panel - Hemodialisis Unit</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="header-content">
            <div className="header-logo">
              <img src={RSLogo} alt="RSUD Umar Wirahadikusumah" className="logo-left" />
            </div>
            <div className="header-text">
              <h1>Sistem Manajemen Pasien Cuci Darah</h1>
              <p>Rumah Sakit - Multi-User Admin Panel</p>
            </div>
            <div className="header-logo">
              <img src={RHLogo} alt="Instalasi Rawat Jalan Ruang Hemodialisa" className="logo-right" />
            </div>
          </div>
        </header>
        
        <Navigation user={user} onLogout={handleLogout} />
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/schedules" element={<Schedules />} />
          <Route path="/auto-scheduler" element={<AutoScheduler />} />
          <Route path="/bed-manager" element={<BedManager />} />
          <Route path="/multi-user" element={<MultiUserDashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/session" element={<SessionManager currentUser={user} onLogout={handleLogout} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

