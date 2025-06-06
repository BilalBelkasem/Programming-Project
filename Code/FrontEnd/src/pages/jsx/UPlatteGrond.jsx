import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo Erasmus.png";
import plattegrondImg from "../../assets/plattegrond.png";
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
          <Link to="/dashboard" className="navLink">info</Link>
          <Link to="/bedrijven" className="navLink">bedrijven</Link>
          <Link to="/Uplattegrond" className="navLink">plattegrond</Link>
          <Link to="/favorieten" className="navLink">favorieten</Link>
          <Link to="/dashboard" className="navLink">mijn profiel</Link>
        </nav>
        <div onClick={onLogout} className="logoutIcon" title="Uitloggen">⇦</div>
      </header>

      <main className="main">
        <div className="titleCard">Plattegrond</div>
        <div className="contentCard">
          <div className="plattegrond-left">
            <img
              src={plattegrondImg}
              alt="Plattegrond van de Career Launch"
              className="plattegrondImage"
            />
          </div>
          <div className="plattegrond-right">
            <div className="legendaBox">
              <div className="legendaTitle">Legenda</div>
              <ol className="legendaList">
                {bedrijven.map((bedrijf) => (
                  <li key={bedrijf.id}>{bedrijf.naam}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
