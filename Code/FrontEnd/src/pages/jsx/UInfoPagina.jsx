import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
import banner from '../../assets/Banner C.png';
import '../Css/UInfoPagina.css';

export default function UInfoPagina({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="pagina-wrapper">
      {/* Header met logout */}
      <header className="header">
        <div className="header-section left">
          <img src={logo} alt="Erasmus Logo" className="logo" />
        </div>

        <div className="header-section center">
          <nav className="nav-center">
            <Link to="/dashboard" className="nav-btn active">info</Link>
            <Link to="/bedrijven" className="nav-btn">bedrijven</Link>
            <Link to="/plattegrond" className="nav-btn">plattegrond</Link>
            <Link to="/favorieten" className="nav-btn">favorieten</Link>
            <Link to="/mijn-profiel" className="nav-btn">Mijn profiel</Link>
          </nav>
        </div>

        <div className="header-section right">
          <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
        </div>
      </header>

      {/* Banner + overige content hier... */}
      <main className="main">
        <img src={banner} alt="CareerLaunch banner" className="banner" />
        {/* Je andere content blijft hier... */}
      </main>
    </div>
  );
}
