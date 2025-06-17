// GBedrijven.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../Css/Gbedrijveninfopagina.css';

export default function GBedrijven({ onLogout }) {
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
    <>
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

          <div className="header-section right">{/* lege ruimte voor balans */}</div>
        </header>

        <main className="main-content">
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

      <footer className="site-footer">
        <div className="footer-columns">
          <div className="footer-column">
            <h4>Contacteer ons</h4>
            <p>Email: <a href="mailto:info@ehb.be">info@ehb.be</a></p>
            <p>Tel: 02 523 37 37</p>
          </div>

          <div className="footer-column">
            <h4>Meer info</h4>
            <ul>
              <li><a href="#">Over de jobbeurs</a></li>
              <li><a href="#">Praktische info</a></li>
              <li><a href="#">Voor bedrijven</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Sociale media</h4>
            <ul>
              <li><a href="https://www.linkedin.com/school/erasmushogeschool-brussel/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://www.instagram.com/erasmushogeschool/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://www.facebook.com/erasmushogeschool" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://x.com/ehbrussel" target="_blank" rel="noopener noreferrer">X (Twitter)</a></li>
              <li><a href="https://www.tiktok.com/@erasmushogeschool" target="_blank" rel="noopener noreferrer">TikTok</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Erasmushogeschool Brussel – Design & Technologie</p>
        </div>

        <div className="easter-egg">
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
            rel="noopener noreferrer"
          >
            don't klik
          </a>
        </div>
      </footer>
    </>
  );
}