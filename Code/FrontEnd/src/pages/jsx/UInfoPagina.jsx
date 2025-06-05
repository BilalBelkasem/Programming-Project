import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import careerBanner from '../../assets/Banner C.png';

export default function UInfoPagina({ onLogout }) {
  return (
    <div style={styles.pageWrapper}>
      {/* Header */}
      <header style={styles.header}>
        <img src={logo} alt="Erasmus Logo" style={styles.logo} />
        <nav style={styles.nav}>
          <Link to="/dashboard" style={styles.navLink}>info</Link>
          <Link to="/bedrijven" style={styles.navLink}>bedrijven</Link>
          <Link to="/plattegrond" style={styles.navLink}>plattegrond</Link>
          <Link to="/favorieten" style={styles.navLink}>favorieten</Link>
          <Link to="/dashboard" style={styles.navLink}>mijn profiel</Link>
        </nav>
        <div onClick={onLogout} style={styles.logoutIcon} title="Uitloggen">⇦</div>
      </header>

      {/* Info Content */}
      <main style={styles.main}>
        <h2 style={styles.title}>Info</h2>
        <img src={careerBanner} alt="CareerLaunch banner" style={styles.banner} />
        <div style={styles.textBlock}>
          <p style={styles.text}>
            Ben je op zoek naar nieuw talent om jouw technische en IT-teams te versterken? Wil je jouw bedrijf in de schijnwerpers zetten en de volgende generatie experts ontmoeten?
          </p>
          <p style={styles.text}>
            Zet dan alvast de Career Launch op donderdag 13 maart 2026 in je agenda of schrijf je hieronder in om op de hoogte te blijven!
          </p>
          <p style={styles.text}>
            Het departement Design & Technologie van de Erasmushogeschool Brussel nodigt je uit voor hét ultieme netwerkevent van de design & technologie opleidingen. Deze jaarlijkse jobbeurs is dé brug tussen onze innovatieve opleidingen en het dynamische werkveld.
          </p>
          <p style={styles.subtitle}>Waarom je bij de Career Launch '26 wilt zijn:</p>
          <ul style={styles.list}>
            <li>Ontmoet studenten uit zes topopleidingen, waaronder Bachelor in de Multimedia & Creatieve Technologie, Bachelor in de Toegepaste Informatica, Graduaat Elektromechanische Systemen, Graduaat Internet of Things, Graduaat Programmeren en Graduaat Systeem- & Netwerkbeheer.</li>
            <li>Presenteer je bedrijf aan een breed scala aan potentiële stagiairs, bachelorproefpartners en toekomstige werknemers.</li>
            <li>Breid je netwerk uit en bouw waardevolle relaties op met toekomstige werknemers in de technische en IT-sector.</li>
            <li>Dit is je kans om de perfecte match voor jouw bedrijf te vinden.</li>
          </ul>
          <p style={styles.contact}>
            <strong>Meer info of vragen?</strong><br />
            carlijn.fronik@ehb.be
          </p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: '10px 20px',
  },
  logo: {
    height: '40px',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexGrow: 1,
    margin: '0 40px',
  },
  navLink: {
    textDecoration: 'none',
    color: '#000000',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '8px 12px',
  },
  logoutIcon: {
    fontSize: '24px',
    color: '#000000',
    cursor: 'pointer'
  },
  main: {
    padding: '30px 40px',
    backgroundColor: '#ffffff'
  },
  title: {
    marginBottom: '20px',
    color: '#d63031'
  },
  banner: {
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
    marginBottom: '30px',
  },
  textBlock: {
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#ffffff'
  },
  text: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#2d3436',
    marginBottom: '16px'
  },
  subtitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginTop: '20px',
    marginBottom: '10px',
    color: '#2d3436'
  },
  list: {
    paddingLeft: '20px',
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#2d3436'
  },
  contact: {
    marginTop: '30px',
    fontSize: '16px',
    color: '#2d3436'
  }
};