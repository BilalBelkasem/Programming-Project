// Bestand: components/GHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../Css/SharedHeader.css';

export default function GHeader() {
  return (
    <header className="header">
      <img src={logo} alt="Erasmus Logo" className="logo" />
      <nav className="nav spaced">
        <Link to="/" className="nav-link">info</Link>
        <Link to="/bedrijven" className="nav-link">bedrijven</Link>
        <Link to="/plattegrond" className="nav-link">plattegrond</Link>
        <Link to="/login" className="nav-link highlight">login/registeren</Link>
      </nav>
    </header>
  );
}

// Bestand: components/IngelogdHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../Css/SharedHeader.css';

export default function IngelogdHeader({ onLogout }) {
  return (
    <header className="header">
      <img src={logo} alt="Erasmus Logo" className="logo" />
      <nav className="nav spaced">
        <Link to="/dashboard" className="nav-link">info</Link>
        <Link to="/bedrijven" className="nav-link">bedrijven</Link>
        <Link to="/plattegrond" className="nav-link">plattegrond</Link>
        <Link to="/favorieten" className="nav-link">favorieten</Link>
        <Link to="/profiel-bedrijf" className="nav-link">mijn profiel</Link>
      </nav>
      <div onClick={onLogout} className="logout-icon" title="Uitloggen">⇦</div>
    </header>
  );
}