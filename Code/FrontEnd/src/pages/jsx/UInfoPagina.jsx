import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import careerBanner from '../../assets/Banner C.png';
import '../Css/UInfoPagina.css';

export default function UInfoPagina({ onLogout }) {
  const navigate = useNavigate(); // toegevoegd

  const handleLogout = () => {
    onLogout(); 
    navigate('/login'); // navigatie naar loginpagina
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />

        <nav className="nav">
          <Link to="/dashboard" className="navLink">Info</Link>
          <Link to="/bedrijven" className="navLink">Bedrijven</Link>
          <Link to="/plattegrond" className="navLink">Plattegrond</Link>
          <Link to="/favorieten" className="navLink">Favorieten</Link>
          <Link to="/mijn-profiel" className="nav-link">Mijn profiel</Link>
        </nav>
        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
      </header>

      {/* Info Content */}
      <main className="main">
        <h2 className="title">Info</h2>
        <img src={careerBanner} alt="CareerLaunch banner" className="banner" />
        <div className="text-block">
          <p className="text">
            Ben je op zoek naar nieuw talent om jouw technische en IT-teams te versterken? Wil je jouw bedrijf in de schijnwerpers zetten en de volgende generatie experts ontmoeten?
          </p>
          <p className="text">
            Zet dan alvast de Career Launch op vrijdag 13 maart 2026 in je agenda of schrijf je hieronder in om op de hoogte te blijven!
          </p>
          <p className="text">
            Het departement Design & Technologie van de Erasmushogeschool Brussel nodigt je uit voor hét ultieme netwerkevent van de design & technologie opleidingen. Deze jaarlijkse jobbeurs is dé brug tussen onze innovatieve opleidingen en het dynamische werkveld.
          </p>
          <p className="subtitle">Waarom je bij de Career Launch '26 wilt zijn:</p>
          <ul className="list">
            <li>Ontmoet studenten uit zes topopleidingen, waaronder Bachelor in de Multimedia & Creatieve Technologie, Bachelor in de Toegepaste Informatica, Graduaat Elektromechanische Systemen, Graduaat Internet of Things, Graduaat Programmeren en Graduaat Systeem- & Netwerkbeheer.</li>
            <li>Presenteer je bedrijf aan een breed scala aan potentiële stagiairs, bachelorproefpartners en toekomstige werknemers.</li>
            <li>Breid je netwerk uit en bouw waardevolle relaties op met toekomstige werknemers in de technische en IT-sector.</li>
            <li>Dit is je kans om de perfecte match voor jouw bedrijf te vinden.</li>
          </ul>
          <p className="contact">
            <strong>Meer info of vragen?</strong><br />
            carlijn.fronik@ehb.be
          </p>
        </div>
      </main>
    </div>
  );
}
