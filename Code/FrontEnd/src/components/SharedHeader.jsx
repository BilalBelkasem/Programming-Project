// Bestand: components/GHeader.jsx

import { Link } from 'react-router-dom';
import logo from '../assets/logo Erasmus.png';
import '../components/SharedHeader.css';

export default function GHeader() {
  return (
    <header className="header">
      <img src={logo} alt="Erasmus Logo" className="logo" />
      <nav className="nav spaced">
        <Link to="/" className="nav-link">info</Link>
        <Link to="/bedrijven" className="nav-link">bedrijven</Link>
        <Link to="/g-plattegrond" className="nav-link">plattegrond</Link>
        <Link to="/login" className="nav-link highlight">login/registeren</Link>
      </nav>
    </header>
  );
}
