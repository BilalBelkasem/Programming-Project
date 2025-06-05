import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import careerBanner from '../../assets/Banner C.png';
import '../Css/GInfoPagina.css';

export default function GInfoPagina() {
  return (
    <div className="page">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
          <Link to="/" className="nav-link">info</Link>
          <Link to="/login" className="nav-link">Mijn profiel</Link>
        </nav>
        <div className="logout">➜</div>
      </header>

      <main className="main">
        <h2 className="title">Info</h2>
        <img src={careerBanner} alt="CareerLaunch banner" className="banner" />
        <div className="text-block">
          <p>Ben je op zoek naar nieuw talent om jouw technische en IT-teams te versterken? Wil je jouw bedrijf in de schijnwerpers zetten en de volgende generatie experts ontmoeten?</p>
          <p>Zet dan alvast de Career Launch op donderdag 13 maart 2026 in je agenda of schrijf je hieronder in om op de hoogte te blijven!</p>
          <p>Het departement Design & Technologie van de Erasmushogeschool Brussel nodigt je uit voor hét ultieme netwerkevent van de design & technologie opleidingen. Deze jaarlijkse jobbeurs is dé brug tussen onze innovatieve opleidingen en het dynamische werkveld.</p>
          <p><strong>Waarom je bij de Career Launch '26 wilt zijn:</strong></p>
          <ul>
            <li>Ontmoet studenten uit zes topopleidingen.</li>
            <li>Presenteer je bedrijf aan potentiële stagiairs en toekomstige werknemers.</li>
            <li>Breid je netwerk uit in de technische en IT-sector.</li>
            <li>Vind de perfecte match voor jouw bedrijf.</li>
          </ul>
          <p><strong>Meer info of vragen?</strong><br />carlijn.fronik@ehb.be</p>
        </div>
      </main>
    </div>
  );
}