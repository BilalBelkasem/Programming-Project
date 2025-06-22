import React from "react";
import { Link, useNavigate } from "react-router-dom";
import plattegrondImg from "../../assets/plattegrond.png";
import logo from "../../assets/logoerasmus.png";
import "../Css/GPlatteGrond.css";

const legendItems = [
  { id: 1, naam: "TechNova" },
  { id: 2, naam: "WebFlex" },
  { id: 3, naam: "DataCore" },
  { id: 4, naam: "Colruyt" },
];

export default function GPlatteGrond({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <div className="uplattegrond-wrapper">
      {/* Header */}
      <header className="header">
        <div className="header-section left">
          <img src={logo} alt="Erasmus Logo" className="logo" />
        </div>

        <div className="header-section center">
          <nav className="nav-center">
            <Link to="/" className="nav-btn">info</Link>
            <Link to="/bedrijven" className="nav-btn">Bedrijven</Link>
            <Link to="/g-plattegrond" className="nav-btn active">plattegrond</Link>
            <Link to="/login" className="nav-btn">login/registeren</Link>
          </nav>
        </div>

        <div className="header-section right"></div>
      </header>

      {/* Inhoud */}
      <div className="uplattegrond-kader">
        <div className="uplattegrond-title-box">
          <h1 className="uplattegrond-title">Plattegrond</h1>
        </div>
        <div className="uplattegrond-content-box">
          <img
            src={plattegrondImg}
            alt="Plattegrond van de Career Launch"
            className="uplattegrond-image"
          />
          <div className="uplattegrond-legend-box">
            <h2 className="legend-title">Legenda</h2>
            <ul className="legend-list">
              {legendItems.map((item) => (
                <li key={item.id} className="legend-item">
                  <span className="legend-number">{item.id}.</span> {item.naam}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
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
