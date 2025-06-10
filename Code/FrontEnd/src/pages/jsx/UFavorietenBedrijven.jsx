import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../css/UFavorietenBedrijven.css';

export default function UFavorietenBedrijven({ favorieten, onUnsave }) {
  const navigate = useNavigate();

  return (
    <div className="pageWrapper">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />

        <nav className="nav">
          <a href="/dashboard" className="navLink">Info</a>
          <a href="/bedrijven" className="navLink">Bedrijven</a>
          <a href="/plattegrond" className="navLink">Plattegrond</a>
          <a href="/favorieten" className="navLink">Favorieten</a>
          <a href="/profiel-bedrijf" className="navLink">Mijn Profiel</a>
          <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
        </nav>
      </header>

      <main className="main">
        <h2 className="title">Mijn favorieten</h2>
        <div className="bedrijvenContainer">
          {favorieten.length === 0 ? (
            <p>Je hebt nog geen favoriete bedrijven.</p>
          ) : (
            favorieten.map((bedrijf) => (
              <div key={bedrijf.id} className="bedrijfCard">
                <h3 className="bedrijfNaam">{bedrijf.naam}</h3>
                <p className="bedrijfBeschrijving">{bedrijf.beschrijving}</p>
                <div className="actieKnoppen">
                  <button
                    onClick={() => onUnsave(bedrijf.id)}
                    className="actionButton"
                  >
                    Verwijder
                  </button>
                  <button
                    onClick={() => navigate(`/bedrijven/${bedrijf.id}`)}
                    className="actionButton secondary"
                  >
                    Ga naar pagina
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
