import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../css/Gbedrijveninfopagina.css';
import axios from 'axios';

export default function GBedrijven({ onLogout }) {
  const navigate = useNavigate();
  const [bedrijven, setBedrijven] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/open-bedrijven');
        setBedrijven(res.data);
      } catch (err) {
        console.error('Fout bij ophalen bedrijven:', err);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <div className="pageWrapper">
     <header className="header">
      <div className="header-section left">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav spaced">
          <Link to="/" className="nav-link active">info</Link>
          <Link to="/GBedrijven" className="nav-link">bedrijven</Link>
          <Link to="/g-plattegrond" className="nav-link">plattegrond</Link>
          <Link to="/login" className="nav-link highlight">login/registeren</Link>
        </nav>
      </div>

      <div className="header-section right">{/* lege ruimte voor balans */}</div>
    </header>

      <main className="main">
        <h2 className="title">Ontdek bedrijven</h2>
        <div className="bedrijvenContainer">
          {bedrijven.length === 0 ? (
            <p style={{ color: 'gray' }}>Geen bedrijven gevonden...</p>
          ) : (
            bedrijven.map((bedrijf) => (
              <div key={bedrijf.id} className="bedrijfCard">
                <h3 className="bedrijfNaam">{bedrijf.company_name}</h3>
                <p className="bedrijfBeschrijving">{bedrijf.sector}</p>
                <div className="tagContainer">
                  {bedrijf.tags?.split(',').map((tag, index) => (
                    <span key={index} className="tag">{tag.trim()}</span>
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
