import React from 'react';
import logo from '../../assets/logo Erasmus.png';
import '../../pages/Css/AdminDashboard.css';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/'); 
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
          onClick={() => navigate('/admin/badges')}
        >
          badge
        </div>
      </main>
    </div>
  );
}
