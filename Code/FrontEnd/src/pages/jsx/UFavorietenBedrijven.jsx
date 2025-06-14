import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../css/UFavorietenBedrijven.css';

console.log("UFavorietenBedrijven geladen");


export default function UFavorietenBedrijven({ favorieten, onUnsave }) {
  const navigate = useNavigate();
console.log("UFavorietenBedrijven geladen");
  return (
    
    <div className="pageWrapper">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />

        <nav className="nav">
          <Link to="/dashboard" className="navLink">Info</Link>
          <Link to="/bedrijven" className="navLink">Bedrijven</Link>
          <Link to="/plattegrond" className="navLink">Plattegrond</Link>
          <Link to="/favorieten" className="navLink">Favorieten</Link>
          <Link to="/mijn-profiel" className="navLink">mijn profiel</Link>
        </nav>

        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
      </header>

      <main className="main">

<h2>Favoriete bedrijven</h2>


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
