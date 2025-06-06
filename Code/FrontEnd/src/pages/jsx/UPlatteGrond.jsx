import React from "react";
import { Link } from "react-router-dom";
import plattegrondImg from "../../assets/plattegrond.png";
import logo from "../../assets/logo Erasmus.png";
import "../css/UPlatteGrond.css";

const legendItems = [
  { id: 1, naam: "TechNova" },
  { id: 2, naam: "WebFlex" },
  { id: 3, naam: "DataCore" },
  { id: 4, naam: "Colruyt" },
];

export default function UPlatteGrond() {
  return (
    <div className="uplattegrond-wrapper">
      {/* Header */}
      <header style={styles.header}>
              <img src={logo} alt="Erasmus Logo" style={styles.logo} />
              <nav style={styles.nav}>
                <Link to="/dashboard" style={styles.navLink}>info</Link>
                <Link to="/bedrijven" style={styles.navLink}>bedrijven</Link>
                <Link to="/plattegrond" style={styles.navLink}>Plattegrond</Link>
                <Link to="/favorieten" style={styles.navLink}>favorieten</Link>
                <Link to="/dashboard" style={styles.navLink}>mijn profiel</Link>
              </nav>
              <div onClick={onLogout} style={styles.logoutIcon} title="Uitloggen">⇦</div>
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
    </div>
  );
}
