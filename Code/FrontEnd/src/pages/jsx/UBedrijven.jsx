import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../css/UBedrijven.css';

export default function UBedrijven({ bedrijven, likedCompanies, toggleLike, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
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
        <h2 className="title">Ontdek bedrijven</h2>
        <div className="bedrijvenContainer">
          {bedrijven.map((bedrijf) => (
            <div key={bedrijf.id} className="bedrijfCard">
              <h3 className="bedrijfNaam">{bedrijf.naam}</h3>
              <p className="bedrijfBeschrijving">{bedrijf.beschrijving}</p>
              <div className="tagContainer">
                {bedrijf.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              <button
                onClick={() => toggleLike(bedrijf.id)}
                className={`likeButton ${likedCompanies.some((b) => b.id === bedrijf.id) ? 'liked' : ''}`}
              >
                ♥
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
