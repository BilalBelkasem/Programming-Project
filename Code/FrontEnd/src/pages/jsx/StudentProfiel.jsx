import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
import '../Css/StudentProfiel.css';

export default function ProfielStudent() {
  const student = {
    name: '',
    school: '',
    direction: '',
    year: '',
    linkedin: '',
    email: '',
    about: '',
    lookingFor: [],
    domain: [],
    profilePicture: '', // evt. base64 of URL
  };

  const handleSave = () => {
    alert('Studentgegevens opgeslagen!');
    console.log('Opslaan:', student);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="page-wrapper">
      {/* Nieuwe headerstructuur */}
      <header className="header">
        <div className="header-section left">
          <img src={logo} alt="Erasmus Logo" className="logo" />
        </div>

        <div className="header-section center">
          <nav className="nav-center">
            <Link to="/dashboard" className="nav-btn">Info</Link>
            <Link to="/bedrijven" className="nav-btn">Bedrijven</Link>
            <Link to="/plattegrond" className="nav-btn">Plattegrond</Link>
            <Link to="/favorieten" className="nav-btn">Favorieten</Link>
            <Link to="/mijn-profiel" className="nav-btn active">Mijn profiel</Link>
          </nav>
        </div>

        <div className="header-section right">
          <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
        </div>
      </header>

      <main className="container">
        <div className="profile-row">
          <div className="profile-picture">
            {student.profilePicture ? (
              <img src={student.profilePicture} alt="Profiel" className="circle" />
            ) : (
              <div className="circle">[Foto]</div>
            )}
          </div>
          <button className="like-button" title="Like ♥">♥</button>
        </div>

        <div className="profile-grid">
          <div className="field">
            <div className="value-bar">
              {student.name || "Voornaam + Achternaam:"}
            </div>
          </div>
          <div className="field">
            <div className="value-bar">
              {student.school || "School:"}
            </div>
          </div>
          <div className="field">
            <div className="value-bar">
              {student.direction || "Richting:"}
            </div>
          </div>
          <div className="field">
            <div className="value-bar">
              {student.year || "Jaar:"}
            </div>
          </div>
          <div className="field full">
            <div className="value-bar">
              {student.email || "Email:"}
            </div>
          </div>
          {student.linkedin && (
            <div className="field full">
              <div className="value-bar">
                <a href={student.linkedin} target="_blank" rel="noreferrer">{student.linkedin}</a>
              </div>
            </div>
          )}
        </div>

        <div className="section">
          <h2>Over mezelf</h2>
          <p className="textarea">{student.about || <em>Geen informatie opgegeven</em>}</p>
        </div>

        <div className="section">
          <h3>Wat zoek ik?</h3>
          <div className="checkbox-group">
            {student.lookingFor.length === 0 ? (
              <p><em>Geen selectie opgegeven</em></p>
            ) : (
              student.lookingFor.map((item, index) => (
                <label key={index}>
                  <input type="checkbox" checked disabled />
                  {item}
                </label>
              ))
            )}
          </div>
        </div>

        <div className="section">
          <h3>IT-domeinen</h3>
          <div className="checkbox-group">
            {student.domain.length === 0 ? (
              <p><em>Geen selectie opgegeven</em></p>
            ) : (
              student.domain.map((item, index) => (
                <label key={index}>
                  <input type="checkbox" checked disabled />
                  {item}
                </label>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
