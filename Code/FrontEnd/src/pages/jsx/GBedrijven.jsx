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
      <footer className="site-footer">
  <div className="footer-grid">
    <div className="footer-column">
      <h4>Over ons</h4>
      <ul>
        <li><a href="/">Info</a></li>
        <li><a href="/GBedrijven">Bedrijven</a></li>
        <li><a href="/g-plattegrond">Plattegrond</a></li>
      </ul>
    </div>
    <div className="footer-column">
      <h4>Contact</h4>
      <div className="contact-item">
        <span className="icon">📍</span>
        Nijverheidskaai 170, 1070 Brussel
      </div>
      <div className="contact-item">
        <span className="icon">✉️</span>
        info@erasmushogeschool.be
      </div>
    </div>
    <div className="footer-column">
      <h4>Sociale media</h4>
      <div className="social-icons">
        <a href="https://facebook.com" className="social-icon">📘</a>
        <a href="https://instagram.com" className="social-icon">📷</a>
        <a href="https://linkedin.com" className="social-icon">💼</a>
      </div>
    </div>
  </div>

  <div className="footer-bottom">
    &copy; {new Date().getFullYear()} Erasmus Hogeschool Brussel. Alle rechten voorbehouden.
    <div className="legal-links">
      <a href="/privacy">Privacybeleid</a>
      <span>|</span>
      <a href="/terms">Gebruiksvoorwaarden</a>
    </div>
  </div>

  <div className="easter-egg">
    <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">don’t klik</a>
  </div>
</footer>
    </div>
  );
}