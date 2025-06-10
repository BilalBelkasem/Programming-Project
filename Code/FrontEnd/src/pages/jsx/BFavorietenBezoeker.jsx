import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../Css/BFavorietenBezoeker.css'

export default function BFavorietenStudenten({favorieten, onUnsave }){
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
              </nav>
        </header>

      <main className="main">
        <h2 className="title">Opgeslagen studenten</h2>
        <div className="studentenContainer">
          {studenten.length === 0 ? (
            <p>Je hebt nog geen studenten opgeslagen.</p>
          ) : (
            studenten.map((student) => (
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