import React from "react";
import { Link, useNavigate } from "react-router-dom";
import plattegrondImg from "../../assets/plattegrond.png";
import logo from "/logoerasmus.png";
import "../css/GPlatteGrond.css";
import SharedFooter from "../../components/SharedFooter";

const legendItems = [
  { id: 1, naam: "TechNova" },
  { id: 2, naam: "WebFlex" },
  { id: 3, naam: "DataCore" },
  { id: 4, naam: "Colruyt" },
];

export default function UPlatteGrond({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  return (
    <div className="uplattegrond-wrapper">
      {/* Nieuwe gestylede header */}
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
          <Link to="/dashboard" className="nav-btn ">Info</Link>
          <Link to="/bedrijven" className="nav-btn">Bedrijven</Link>
          <Link to="/speeddates" className="nav-btn ">Speeddates</Link>
          <Link to="/plattegrond" className="nav-btn active">Plattegrond</Link>
          <Link to="/favorieten" className="nav-btn">Favorieten</Link>
          <Link to="/mijn-profiel" className="nav-btn">Mijn Profiel</Link>
        </nav>
        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
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
      <SharedFooter />
    </div>
  );
}
