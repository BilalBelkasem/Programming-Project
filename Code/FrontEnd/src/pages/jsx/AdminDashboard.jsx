import React from 'react';
import logo from '../../assets/logo Erasmus.png';
import '../../pages/Css/AdminDashboard.css';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

const handleLogout = () => {
  navigate('/'); // Stuur naar GInfoPagina (homepage)
};

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-logo-block">
          <img src={logo} alt="Erasmus logo" className="admin-logo" />
          <span className="admin-title">admin</span>
        </div>
        <FaSignOutAlt className="logout-icon" onClick={handleLogout} />
      </header>

      {/* Main Grid */}
      <main className="admin-grid">
        <div className="admin-tile studenten">studenten</div>
        <div className="admin-tile bedrijf">bedrijf</div>
        <div className="admin-tile badge">badge</div>
      </main>
    </div>
  );
}
