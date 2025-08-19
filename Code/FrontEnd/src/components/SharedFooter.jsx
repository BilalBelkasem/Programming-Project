import React from 'react';
import { Link } from 'react-router-dom';
import './SharedFooter.css';

const SharedFooter = () => {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-column">
          <h4>Over ons</h4>
          <ul>
            <li><Link to="/">Info</Link></li>
            <li><Link to="/bedrijven">Bedrijven</Link></li>
            <li><Link to="/g-plattegrond">Plattegrond</Link></li>
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
            <a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">📘</a>
            <a href="https://instagram.com" className="social-icon" target="_blank" rel="noopener noreferrer">📷</a>
            <a href="https://linkedin.com" className="social-icon" target="_blank" rel="noopener noreferrer">💼</a>
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
    </footer>
  );
};

export default SharedFooter; 