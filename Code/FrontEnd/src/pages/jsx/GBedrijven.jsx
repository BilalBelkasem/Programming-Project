import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
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
    <div className="pagina-wrapper">
      <header className="header">
        <div className="header-section left">
          <img src={logo} alt="Erasmus Logo" className="logo" />
        </div>
        <div className="header-section center">
          <nav className="nav-center">
            <Link to="/" className="nav-btn">info</Link>
            <Link to="/GBedrijven" className="nav-btn active">bedrijven</Link>
            <Link to="/g-plattegrond" className="nav-btn">plattegrond</Link>
            <Link to="/login" className="nav-btn">login/registeren</Link>
          </nav>
        </div>
        <div className="header-section right"></div>
      </header>

      <main className="main-content">
        <h2 className="page-title">Ontdek bedrijven</h2>
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