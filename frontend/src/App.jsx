import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Schedules from './pages/Schedules';

function Navigation() {
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
            Jadwal Cuci Darah
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>Sistem Manajemen Pasien Cuci Darah</h1>
          <p>Rumah Sakit - Admin Panel</p>
        </header>
        
        <Navigation />
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/schedules" element={<Schedules />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

