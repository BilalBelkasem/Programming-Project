import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import './SharedHeader.css';

export default function SharedHeader({ active }) {
  return (
    <header className="header">
      <img src={logo} alt="Erasmus Logo" className="logo" />
      <nav className="nav spaced">
        <Link to="/dashboard" className={`nav-link ${active === 'info' ? 'active' : ''}`}>info</Link>
        <Link to="/bedrijven" className={`nav-link ${active === 'bedrijven' ? 'active' : ''}`}>bedrijven</Link>
        <Link to="/plattegrond" className={`nav-link ${active === 'plattegrond' ? 'active' : ''}`}>plattegrond</Link>
        <Link to="/login" className={`nav-link ${active === 'login' ? 'highlight' : ''}`}>login/registeren</Link>
      </nav>
    </header>
  );
}