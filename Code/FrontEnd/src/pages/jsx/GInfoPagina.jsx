// InfoPagina.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
import banner from '../../assets/Banner2.png';
import '../Css/GInfoPagina.css';

export default function InfoPagina() {
  return (
    <div className="pagina-wrapper">
      <header className="header">
        <div className="header-section left">
          <img src={logo} alt="Erasmus Logo" className="logo" />
        </div>

        <div className="header-section center">
          <nav className="nav-center">
            <Link to="/" className="nav-btn active">info</Link>
            <Link to="/GBedrijven" className="nav-btn">bedrijven</Link>
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

         
          <footer className="site-footer">
  

  <section className="auth-guide">
    <h2 className="auth-title">👤 Hoe registreren / inloggen?</h2>
    <p className="auth-intro">Volg deze eenvoudige stappen om toegang te krijgen tot het platform.</p>

    <h3 className="auth-subtitle">🔐 Inloggen (voor bestaande gebruikers)</h3>
    <ol className="auth-steps">
      <li>Navigeer naar de <strong>login/registeren</strong> knop in het hoofdmenu.</li>
      <li>Selecteer <strong>"Inloggen"</strong> als je al een account hebt.</li>
      <li>Vul je <strong>e-mailadres</strong> en <strong>wachtwoord</strong> in.</li>
      <li>Klik op <strong>“Inloggen”</strong> om toegang te krijgen tot je persoonlijke omgeving.</li>
    </ol>

    <h3 className="auth-subtitle">🆕 Registreren (voor nieuwe gebruikers)</h3>
    <ol className="auth-steps">
      <li>Klik op de <strong>login/registeren</strong> knop in het hoofdmenu.</li>
      <li>Selecteer <strong>“Registreren”</strong> voor een nieuw account.</li>
      <li>Vul je gegevens in:
        <ul>
          <li>Naam</li>
          <li>E-mailadres</li>
          <li>Wachtwoord & bevestiging</li>
        </ul>
      </li>
      <li>Vink het vakje aan om de <strong>gebruikersvoorwaarden te accepteren</strong>.</li>
      <li>Klik op <strong>“Account aanmaken”</strong> om je registratie te voltooien.</li>
      <li>Eventueel ontvang je een <strong>bevestigingsmail</strong> met activatielink.</li>
    </ol>

    <h3 className="auth-subtitle">❓ Wachtwoord vergeten?</h3>
    <ol className="auth-steps">
      <li>Klik op <strong>“Wachtwoord vergeten?”</strong> op het inlogscherm.</li>
      <li>Voer je geregistreerd e-mailadres in.</li>
      <li>Je ontvangt een e-mail met een link om een nieuw wachtwoord in te stellen.</li>
    </ol>
  </section>

  <section className="campus-map">
    <h2 className="map-title">📍 Locatie van de campus</h2>
    <p className="map-info">Bezoek ons op Campus Design & Technologie, Nijverheidskaai 170, 1070 Anderlecht.</p>
    <div className="map-container">
      <iframe
        title="Campuskaart"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2517.158241078615!2d4.322052415748294!3d50.830871279529794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c44c6fcf9475%3A0x60fc8653836bd118!2sNijverheidskaai%20170%2C%201070%20Anderlecht!5e0!3m2!1snl!2sbe!4v1718651234567"
        width="100%"
        height="400"
        style={{ border: 0, borderRadius: '12px' }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
    <div className="contact-box">
            <h3>Meer info of vragen?</h3>
            <p><a href="mailto:carlijn.fronik@ehb.be">carlijn.fronik@ehb.be</a></p>
          </div>
  </section>

 

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
        </div>
      </footer>
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
    </div>
  );
}

// Updated site-footer component only
<footer className="site-footer">
  <div className="footer-grid">
    <div className="footer-column contact-column">
      <h4>Contacteer ons</h4>
      <div className="contact-item">
        <svg className="icon" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
        <a href="mailto:info@ehb.be">info@ehb.be</a>
      </div>
      <div className="contact-item">
        <svg className="icon" viewBox="0 0 24 24">
          <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
        </svg>
        <span>02 523 37 37</span>
      </div>
    </div>

    <div className="footer-column links-column">
      <h4>Meer info</h4>
      <ul>
        <li><a href="#">Over de jobbeurs</a></li>
        <li><a href="#">Praktische info</a></li>
        <li><a href="#">Voor bedrijven</a></li>
        <li><a href="#">Privacybeleid</a></li>
      </ul>
    </div>

    <div className="footer-column social-column">
      <h4>Volg ons</h4>
      <div className="social-icons">
        <a href="https://linkedin.com" aria-label="LinkedIn">
          <svg className="social-icon" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </a>
        <a href="https://instagram.com" aria-label="Instagram">
          <svg className="social-icon" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <a href="https://facebook.com" aria-label="Facebook">
          <svg className="social-icon" viewBox="0 0 24 24">
            <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
          </svg>
        </a>
        <a href="https://twitter.com" aria-label="Twitter">
          <svg className="social-icon" viewBox="0 0 24 24">
            <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.193-7.715-2.157-10.141-5.126-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14v-.617c.961-.689 1.8-1.56 2.46-2.548z"/>
          </svg>
        </a>
        <a href="https://tiktok.com" aria-label="TikTok">
          <svg className="social-icon" viewBox="0 0 24 24">
            <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        </a>
      </div>
    </div>
  </div>

  <div className="footer-bottom">
    <p>© 2025 Erasmushogeschool Brussel – Design & Technologie</p>
    <div className="legal-links">
      <a href="#">Privacybeleid</a>
      <span>•</span>
      <a href="#">Algemene voorwaarden</a>
      <span>•</span>
      <a href="#">Cookieverklaring</a>
    </div>
  </div>

  <div className="easter-egg">
    <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer">
      🎓
    </a>
  </div>
</footer>