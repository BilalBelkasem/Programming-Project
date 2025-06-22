import React from 'react';
import logo from '../../assets/logoerasmus.png';
import '../../pages/Css/AdminDashboard.css';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Open badge pagina (die public.html via Express backend)
  const openBadgePage = () => {
    window.open('http://localhost:5000', '_blank'); // open in nieuw tabblad
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-logo-block">
          <img src={logo} alt="Erasmus logo" className="admin-logo" />
          <span className="admin-title">admin</span>
        </div>
        <FaSignOutAlt className="logout-icon" onClick={handleLogout} />
      </header>

      <main className="admin-grid">
        <div
          className="admin-tile studenten"
          onClick={() => navigate('/admin/studenten')}
        >
          studenten
        </div>
        <div
          className="admin-tile bedrijf"
          onClick={() => navigate('/admin/bedrijven')}
        >
          bedrijf
        </div>
        <div
          className="admin-tile badge"
          onClick={openBadgePage}
        >
          badge
        </div>
        <div
          className="admin-tile speeddate-config"
          onClick={() => navigate('/admin/speeddate-config')}
        >
          speeddate configuratie
        </div>
      </main>
    </div>
  );
}
