import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../Css/StudentProfiel.css';

export default function ProfielStudent() {
  const student = {
    name: 'Jan Jansen',
    school: 'Erasmushogeschool Brussel',
    direction: 'Toegepaste Informatica',
    year: '3de Bachelor',
    linkedin: 'https://linkedin.com/in/jan-jansen',
    email: 'jan.jansen@student.ehb.be',
    about: 'Passionate developer specializing in frontend technologies. Currently exploring React ecosystem and looking for internship opportunities.',
    profilePicture: '',
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
          <NavLink to="/dashboard" className="navLink">Info</NavLink>
          <NavLink to="/bedrijven" className="navLink">Bedrijven</NavLink>
          <NavLink to="/plattegrond" className="navLink">Plattegrond</NavLink>
          <NavLink to="/favorieten" className="navLink">Favorieten</NavLink>
          <NavLink to="/mijn-profiel" className="navLink active">Mijn profiel</NavLink>
        </nav>
        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
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
          <div className="field"><strong>Voornaam + Achternaam:</strong> {student.name}</div>
          <div className="field"><strong>School:</strong> {student.school}</div>
          <div className="field"><strong>Richting:</strong> {student.direction}</div>
          <div className="field"><strong>Jaar:</strong> {student.year}</div>
          <div className="field full"><strong>Email:</strong> {student.email}</div>
          {student.linkedin && (
            <div className="field full">
              <strong>LinkedIn:</strong>{" "}
              <a href={student.linkedin} target="_blank" rel="noreferrer" className="link">
                {student.linkedin}
              </a>
            </div>
          )}
        </div>

        <div className="section">
          <h2>Over mezelf</h2>
          <p className="textarea">{student.about || <em>Geen informatie opgegeven</em>}</p>
        </div>
      </main>
    </div>
  );
}