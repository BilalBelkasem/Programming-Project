import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../Css/UFavorietenBedrijven.css';

export default function UFavorietenBedrijven({ favorieten = [], onUnsave, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
  };

  return (
    <div className="pageWrapper">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />

        <nav className="nav">
          <Link to="/dashboard" className="navLink">Info</Link>
          <Link to="/bedrijven" className="navLink">Bedrijven</Link>
          <Link to="/plattegrond" className="navLink">Plattegrond</Link>
          <Link to="/UFavorietenBedrijven" className="navLink">Favorieten</Link>
          <Link to="/mijn-profiel" className="navLink">mijn profiel</Link>
        </nav>

        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
      </header>

      <main className="main">
        <h2 className="title">Mijn favorieten</h2>

        <div className="bedrijvenContainer">
          {Array.isArray(favorieten) && favorieten.length === 0 ? (
            <p>Je hebt nog geen favoriete bedrijven.</p>
          ) : (
            Array.isArray(favorieten) && favorieten.map((bedrijf) => (
              <div key={bedrijf.id} className="bedrijfCard">
                <h3 className="bedrijfNaam">{bedrijf.naam}</h3>
                <p className="bedrijfBeschrijving">{bedrijf.beschrijving}</p>
                <button
                  onClick={() => onUnsave(bedrijf.id)}
                  className="actionButton"
                >
                  Verwijder
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
