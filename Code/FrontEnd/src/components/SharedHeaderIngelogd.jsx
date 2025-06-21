import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo Erasmus.png';
import './SharedHeader.css';

export default function IngelogdHeader({ onLogout }) {
  return (
    <header className="headerIngelogd">
      <img src={logo} alt="Erasmus Logo" className="logo" />
      <nav className="nav spaced">
        <Link to="/dashboard" className="nav-link">Info</Link>
        <Link to="/bedrijven" className="nav-link">Bedrijven</Link>
        <Link to="/speeddates" className="nav-link">Speeddates</Link>
        <Link to="/plattegrond" className="nav-link">Plattegrond</Link>
        <Link to="/favorieten" className="nav-link">Favorieten</Link>
        <Link to="/profiel-bedrijf" className="nav-link">Mijn profiel</Link>
      </nav>
      <div className="logout" title="Uitloggen" onClick={onLogout}>⇦</div>
    </header>
  );
} 
