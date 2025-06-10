import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/logo Erasmus.png';
import careerBanner from '../../assets/Banner C.png';
import '../Css/GInfoPagina.css';

export default function GInfoPagina() {
  const scrollToContent = () => {
    const content = document.getElementById('main-content');
    if (content) {
      content.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="page">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav spaced">
          <Link to="/" className="nav-link active">info</Link>
          <Link to="/" className="nav-link">bedrijven</Link>
          <Link to="/plattegrond" className="nav-link">plattegrond</Link>
          <Link to="/login" className="nav-link highlight">login/registeren</Link>
        </nav>
      </header>

      <section className="banner-section" style={{ backgroundImage: `url(${careerBanner})` }}>
        <button 
          className="scroll-down-button" 
          onClick={scrollToContent}
          aria-label="Scroll naar content"
        >
          ⌄
        </button>
      </section>

      <main className="main" id="main-content">
        <article className="text-block">
          <p className="intro">Ben je op zoek naar nieuw talent om jouw technische en IT-teams te versterken? Wil je jouw bedrijf in de schijnwerpers zetten en de volgende generatie experts ontmoeten?</p>
          
          <p className="cta">Zet dan alvast de <strong>Career Launch op donderdag 13 maart 2026</strong> in je agenda of schrijf je hieronder in om op de hoogte te blijven!</p>
          
          <p>Het departement Design & Technologie van de Erasmushogeschool Brussel nodigt je uit voor hét ultieme netwerkevent van de design & technologie opleidingen. Deze jaarlijkse jobbeurs is dé brug tussen onze innovatieve opleidingen en het dynamische werkveld.</p>
          
          <h2 className="section-title">Waarom je bij de Career Launch '26 wilt zijn:</h2>
          <ul className="benefits-list">
            <li>Ontmoet studenten uit zes topopleidingen</li>
            <li>Presenteer je bedrijf aan potentiële stagiairs en toekomstige werknemers</li>
            <li>Breid je netwerk uit in de technische en IT-sector</li>
            <li>Vind de perfecte match voor jouw bedrijf</li>
          </ul>
          
          <div className="contact-info">
            <h2 className="section-title">Meer info of vragen?</h2>
            <a href="mailto:carlijn.fronik@ehb.be" className="email-link">carlijn.fronik@ehb.be</a>
          </div>
        </article>
      </main>
    </div>
  );
}