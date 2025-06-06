import React from "react";
import { Link } from "react-router-dom";
import plattegrondImg from "../../assets/plattegrond.png";
import logo from "../../assets/logo Erasmus.png";
import "../css/UPlatteGrond.css";

export default function UPlatteGrond({ onLogout }) {
  const bedrijven = [
    { id: 1, naam: "TechNova" },
    { id: 2, naam: "WebFlex" },
    { id: 3, naam: "DataCore" },
    { id: 4, naam: "Colruyt" },
  ];

  return (
    <div className="pageWrapper">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
          <Link to="/dashboard" className="navLink">
            info
          </Link>
          <Link to="/bedrijven" className="navLink">
            bedrijven
          </Link>
          <Link to="/plattegrond" className="navLink">
            plattegrond
          </Link>
          <Link to="/favorieten" className="navLink">
            favorieten
          </Link>
          <Link to="/dashboard" className="navLink">
            mijn profiel
          </Link>
        </nav>
        <div onClick={onLogout} className="logoutIcon" title="Uitloggen">
          ⇦
        </div>
      </header>

      <main className="main">
        <div className="contentWrapper">
          <h1 className="title">Plattegrond</h1>

          <div className="contentContainer">
            <img
              src={plattegrondImg}
              alt="Plattegrond van de Career Launch"
              className="plattegrond-image"
            />
            <aside className="legend">
              <h3>Legende</h3>
              <ul>
                {bedrijven.map((bedrijf) => (
                  <li key={bedrijf.id}>
                    {bedrijf.id}. {bedrijf.naam}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
