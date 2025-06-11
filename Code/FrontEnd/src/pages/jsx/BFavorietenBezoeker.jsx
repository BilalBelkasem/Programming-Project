import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../Css/BFavorietenBezoeker.css'

export default function BFavorietenStudenten({ favorieten, onUnsave }) {
  const navigate = useNavigate();

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
        <h2 className="title">Opgeslagen studenten</h2>
        <div className="studentenContainer">
          {favorieten.length === 0 ? (
            <p>Je hebt nog geen studenten opgeslagen.</p>
          ) : (
            favorieten.map((student) => (
              <div key={student.id} className="studentCard">
                <h3 className="studentNaam">{student.naam}</h3>
                <p className="studentBeschrijving">{student.beschrijving}</p>
                <div className="actieKnoppen">
                  <button
                    onClick={() => onUnsave(student.id)}
                    className="actionButton"
                  >
                    Verwijder
                  </button>
                  <button
                    onClick={() => navigate(`/studenten/${student.id}`)}
                    className="actionButton secondary"
                  >
                    Bekijk profiel
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
