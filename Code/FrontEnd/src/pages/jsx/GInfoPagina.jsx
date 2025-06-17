// InfoPagina.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import banner from '../../assets/Banner2.png';
import '../Css/GInfoPagina.css';

export default function InfoPagina() {
  return (
    <div className="pagina-wrapper">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav-links">
  <Link to="/" className="nav-btn active">info</Link>
  <Link to="/GBedrijven" className="nav-btn">bedrijven</Link>
  <Link to="/g-plattegrond" className="nav-btn">plattegrond</Link>
  <Link to="/login" className="nav-btn">login/registeren</Link>
</nav>
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

    <div className="contact-box">
      <h3>Meer info of vragen?</h3>
      <p><a href="mailto:carlijn.fronik@ehb.be">carlijn.fronik@ehb.be</a></p>
    </div>
  </div>
</footer>
    </div>
  );
}