import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
import '../Css/BedrijfProfiel.css';

export default function BedrijfProfiel() {
  const bedrijf = {
    name: '',
    companyName: '',
    function: '',
    email: '',
    linkedin: '',
    about: '',
    lookingFor: [],
    domains: [],
    profilePicture: null,
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="page-wrapper">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
          <Link to="/dashboard" className="nav-btn active">Info</Link>
          <Link to="/bedrijven" className="nav-btn">Bedrijven</Link>
          <Link to="/speeddates" className="nav-btn">Speeddates</Link>
          <Link to="/plattegrond" className="nav-btn">Plattegrond</Link>
          <Link to="/favorieten" className="nav-btn">Favorieten</Link>
          <Link to="/mijn-profiel" className="nav-btn">Mijn Profiel</Link>
        </nav>
        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
      </header>

      <main className="container">
        <div className="profile-row">
          <div className="profile-picture">
            {bedrijf.profilePicture ? (
              <img src={bedrijf.profilePicture} alt="Bedrijfsfoto" className="circle" />
            ) : (
              <div className="circle">[Foto]</div>
            )}
          </div>
          <button className="like-button small" title="Like ♥">♥</button>
        </div>

        <div className="profile-grid">
          <div className="field"><strong>Bedrijfsnaam:</strong> {bedrijf.companyName || <em>–</em>}</div>
          <div className="field"><strong>Functie:</strong> {bedrijf.function || <em>–</em>}</div>
          <div className="field"><strong>E-mail:</strong> {bedrijf.email || <em>–</em>}</div>
          {bedrijf.linkedin && (
            <div className="field full">
              <strong>LinkedIn:</strong>{" "}
              <a href={bedrijf.linkedin} target="_blank" rel="noreferrer">{bedrijf.linkedin}</a>
            </div>
          )}
        </div>

        <div className="section">
          <h2>Over het bedrijf</h2>
          <div className="textarea">
            {bedrijf.about ? bedrijf.about : <em>Geen beschrijving opgegeven</em>}
          </div>
        </div>

        <div className="section">
          <h3>Wat zoekt dit bedrijf?</h3>
          <div className="checkbox-group">
            {bedrijf.lookingFor.length === 0 ? (
              <p><em>Geen selectie opgegeven</em></p>
            ) : (
              bedrijf.lookingFor.map((item, i) => (
                <div key={i}>✔ {item}</div>
              ))
            )}
          </div>
        </div>

        <div className="section">
          <h3>IT-domeinen</h3>
          <div className="checkbox-group">
            {bedrijf.domains.length === 0 ? (
              <p><em>Geen selectie opgegeven</em></p>
            ) : (
              bedrijf.domains.map((item, i) => (
                <div key={i}>✔ {item}</div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
