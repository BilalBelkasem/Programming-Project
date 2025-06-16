 import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
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
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="page-wrapper">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
          <Link to="/dashboard" className="navLink">Info</Link>
          <Link to="/plattegrond" className="navLink">Plattegrond</Link>
          <Link to="/favorieten" className="navLink">Studenten</Link>
          <Link to="/mijn-profiel" className="navLink">Mijn profiel</Link>
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
          <div className="field"><strong>Naam contactpersoon:</strong> {bedrijf.name || <em>–</em>}</div>
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
