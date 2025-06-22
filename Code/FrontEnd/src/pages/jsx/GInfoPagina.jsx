// InfoPagina.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
import banner from '../../assets/Banner2.png';
import '../Css/GInfoPagina.css';

export default function GInfoPagina() {
  return (
    <div className="pagina-wrapper">
      <header className="header">
        <div className="header-section left">
          <img src={logo} alt="Erasmus Logo" className="logo" />
        </div>

        <div className="header-section center">
          <nav className="nav-center">
            <Link to="/" className="nav-btn active">info</Link>
            <Link to="/bedrijven" className="nav-btn">Bedrijven</Link>
            <Link to="/g-plattegrond" className="nav-btn">plattegrond</Link>
            <Link to="/login" className="nav-btn">login/registeren</Link>
          </nav>
        </div>

        <div className="header-section right">{/* lege ruimte voor balans */}</div>
      </header>

      <main className="main-content">
        <div className="info-banner">
          <img src={banner} alt="Banner" className="banner-image" />
        </div>
        <div className="info-lines">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </main>

      <footer className="info-footer">
        <div className="footer-content">
          <p>
            Ben je op zoek naar nieuw talent om jouw technische en IT-teams te versterken? Wil je jouw bedrijf in de
            schijnwerpers zetten en de volgende generatie experts ontmoeten?
          </p>

          <div className="highlight-box">
            Zet dan alvast de <strong>Career Launch op donderdag 13 maart 2026</strong> in je agenda of schrijf je hieronder in om op de hoogte te blijven!
          </div>

          <p>
            Het departement Design & Technologie van de Erasmushogeschool Brussel nodigt je uit voor hét ultieme
            netwerkevent van de design & technologie opleidingen. Deze jaarlijkse jobbeurs is dé brug tussen onze
            innovatieve opleidingen en het dynamische werkveld.
          </p>

          <h2 className="why-title">Waarom je bij de Career Launch '26 wilt zijn:</h2>
          <ul className="why-list">
            <li>Ontmoet studenten uit zes topleidingen</li>
            <li>Presenteer je bedrijf aan potentiële stagiairs en toekomstige werknemers</li>
            <li>Breid je netwerk uit in de technische en IT-sector</li>
            <li>Vind de perfecte match voor jouw bedrijf</li>
          </ul>
        </div>
      </footer>
      <footer className="site-footer">
  <div className="footer-grid">
    <div className="footer-column">
      <h4>Over ons</h4>
      <ul>
        <li><a href="/">Info</a></li>
        <li><a href="/gbedrijven">Bedrijven</a></li>
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
    <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">don't klik</a>
  </div>
</footer>
    </div>
  );
}