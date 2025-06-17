import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../css/UBedrijven.css';

export default function UBedrijven({ onLogout }) {
  const navigate = useNavigate();
  const [bedrijven, setBedrijven] = useState([]);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/bedrijven');
        const data = await response.json();
        setBedrijven(data);
      } catch (error) {
        console.error("Fout bij ophalen bedrijven:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="pageWrapper">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav-links">
          <Link to="/" className="nav-btn">info</Link>
          <Link to="/GBedrijven" className="nav-btn active">bedrijven</Link>
          <Link to="/g-plattegrond" className="nav-btn">plattegrond</Link>
          <Link to="/login" className="nav-btn">login/registeren</Link>
        </nav>
      </header>

      <main className="main">
        <h2 className="title">Ontdek bedrijven</h2>
        <div className="bedrijvenContainer">
          {bedrijven.length === 0 ? (
            <p>Bedrijven worden geladen...</p>
          ) : (
            bedrijven.map((bedrijf) => (
              <div key={bedrijf.id} className="bedrijfCard">
                <h3 className="bedrijfNaam">{bedrijf.naam}</h3>
                <p className="bedrijfBeschrijving">{bedrijf.beschrijving}</p>
                <div className="tagContainer">
                  {bedrijf.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}