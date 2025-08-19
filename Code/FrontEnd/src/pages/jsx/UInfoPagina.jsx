import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/logoerasmus.png';
import banner from '../../assets/Banner C.png';
import '../Css/UInfoPagina.css';
import SharedFooter from '../../components/SharedFooter';

export default function UInfoPagina({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="pagina-wrapper">
      {/* Header met logout */}
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
          <Link to="/dashboard" className="nav-btn active">Info</Link>
          <Link to="/bedrijven" className="nav-btn">Bedrijven</Link>
          <Link to="/speeddates" className="nav-btn">Speeddates</Link>
          <Link to="/plattegrond" className="nav-btn">Plattegrond</Link>
          <Link to="/favorieten" className="nav-btn">Favorieten</Link>
          <Link to="/mijn-profiel" className="nav-btn">Mijn Profiel</Link>
        </nav>
        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
      </header>

      {/* Main banner + info */}
      <main className="main-content">
        <div className="info-banner">
          <img src={banner} alt="CareerLaunch banner" className="banner-image" />
        </div>

        <div className="info-lines">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>

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

          <section className="auth-guide">
            <h2 className="auth-title">👤 Hoe registreren / inloggen?</h2>
            <p className="auth-intro">Volg deze eenvoudige stappen om toegang te krijgen tot het platform.</p>

            <h3 className="auth-subtitle">🔐 Inloggen (voor bestaande gebruikers)</h3>
            <ol className="auth-steps">
              <li>Navigeer naar de <strong>login/registeren</strong> knop in het hoofdmenu.</li>
              <li>Selecteer <strong>"Inloggen"</strong> als je al een account hebt.</li>
              <li>Vul je <strong>e-mailadres</strong> en <strong>wachtwoord</strong> in.</li>
              <li>Klik op <strong>"Inloggen"</strong> om toegang te krijgen tot je persoonlijke omgeving.</li>
            </ol>

            <h3 className="auth-subtitle">🆕 Registreren (voor nieuwe gebruikers)</h3>
            <ol className="auth-steps">
              <li>Klik op de <strong>login/registeren</strong> knop in het hoofdmenu.</li>
              <li>Selecteer <strong>"Registreren"</strong> voor een nieuw account.</li>
              <li>Vul je gegevens in:
                <ul>
                  <li>Naam</li>
                  <li>E-mailadres</li>
                  <li>Wachtwoord & bevestiging</li>
                </ul>
              </li>
              <li>Vink het vakje aan om de <strong>gebruikersvoorwaarden te accepteren</strong>.</li>
              <li>Klik op <strong>"Account aanmaken"</strong> om je registratie te voltooien.</li>
              <li>Eventueel ontvang je een <strong>bevestigingsmail</strong> met activatielink.</li>
            </ol>

            <h3 className="auth-subtitle">❓ Wachtwoord vergeten?</h3>
            <ol className="auth-steps">
              <li>Klik op <strong>"Wachtwoord vergeten?"</strong> op het inlogscherm.</li>
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
        </div>
      </main>
      <SharedFooter />
    </div>
  );
}
