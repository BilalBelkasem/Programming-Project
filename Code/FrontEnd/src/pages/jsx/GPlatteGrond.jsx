import React from "react";
import { Link, useNavigate } from "react-router-dom";
import plattegrondImg from "../../assets/plattegrond.png";
import logo from "../../assets/logo Erasmus.png";
import "../Css/UPlatteGrond.css";

const legendItems = [
  { id: 1, naam: "TechNova" },
  { id: 2, naam: "WebFlex" },
  { id: 3, naam: "DataCore" },
  { id: 4, naam: "Colruyt" },
];

export default function GPlatteGrond({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout(); // roep App.jsx logout functie aan
    navigate("/login");
  };

  return (
    <div className="uplattegrond-wrapper">
      {/* Header */}
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />

        <nav className="nav">
          <Link to="/" className="navLinsk">Info</Link>
          <Link to="/bedrijven" className="navLink">Bedrijven</Link>
          <Link to="/g-plattegrond" className="navLink">Plattegrond</Link>
          <Link to="/login" className="nav-link highlight">login/registeren</Link>
        </nav>
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