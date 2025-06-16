import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
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
    // hier kun je eventueel opslaan naar API of localStorage
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
          <Link to="/bedrijven" className="navLink">Bedrijven</Link>
          <Link to="/plattegrond" className="navLink">Plattegrond</Link>
          <Link to="/favorieten" className="navLink">Favorieten</Link>
          <Link to="/mijn-profiel" className="navLink">Mijn profiel</Link>
        </nav>
        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
      </header>

      <main className="container">
        <div className="profile-picture">
          {student.profilePicture ? (
            <img src={student.profilePicture} alt="Profiel" className="circle" />
          ) : (
            <div className="circle">[Foto]</div>
          )}
        </div>

        <div className="profile-grid">
          <div className="field"><strong>Voornaam + Achternaam:</strong> {student.name}</div>
          <div className="field"><strong>School:</strong> {student.school}</div>
          <div className="field"><strong>Richting:</strong> {student.direction}</div>
          <div className="field"><strong>Jaar:</strong> {student.year}</div>
          <div className="field full"><strong>Email:</strong> {student.email}</div>
          {student.linkedin && (
            <div className="field full">
              <strong>LinkedIn:</strong>{" "}
              <a href={student.linkedin} target="_blank" rel="noreferrer">{student.linkedin}</a>
            </div>
          )}
        </div>

        <div className="section">
          <h2>Over mezelf</h2>
          <p className="textarea">{student.about}</p>
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

        <button className="confirm-btn" onClick={handleSave}>Opslaan</button>
      </main>
    </div>
  );
}
