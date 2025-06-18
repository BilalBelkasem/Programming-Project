import React from "react";
import { Link, useNavigate } from "react-router-dom";
import plattegrondImg from "../../assets/plattegrond.png";
import logo from "../../assets/logoerasmus.png";
import "../Css/GPlatteGrond.css";

const legendItems = [
  { id: 1, naam: "TechNova" },
  { id: 2, naam: "WebFlex" },
  { id: 3, naam: "DataCore" },
  { id: 4, naam: "Colruyt" },
];

export default function GPlatteGrond({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <div className="uplattegrond-wrapper">
      {/* Header */}
      <header className="header">
        <div className="header-section left">
          <img src={logo} alt="Erasmus Logo" className="logo" />
        </div>

        <div className="header-section center">
          <nav className="nav-center">
            <Link to="/" className="nav-btn">info</Link>
            <Link to="/GBedrijven" className="nav-btn">bedrijven</Link>
            <Link to="/g-plattegrond" className="nav-btn active">plattegrond</Link>
            <Link to="/login" className="nav-btn">login/registeren</Link>
          </nav>
        </div>

        <div className="header-section right"></div>
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
      <footer className="site-footer">
  <div className="footer-columns">
    <div className="footer-column">
      <h4>Contacteer ons</h4>
      <p>Email: <a href="mailto:info@ehb.be">info@ehb.be</a></p>
      <p>Tel: 02 523 37 37</p>
    </div>

    <div className="footer-column">
      <h4>Meer info</h4>
      <ul>
        <li><a href="#">Over de jobbeurs</a></li>
        <li><a href="#">Praktische info</a></li>
        <li><a href="#">Voor bedrijven</a></li>
      </ul>
    </div>

    <div className="footer-column">
      <h4>Sociale media</h4>
      <ul>
        <li><a href="https://www.linkedin.com/school/erasmushogeschool-brussel/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        <li><a href="https://www.instagram.com/erasmushogeschool/?fbclid=IwY2xjawK-HAdleHRuA2FlbQIxMABicmlkETFheWJOUlp3ekNuR3NHQWQ5AR6muhnb3-EKLfxgldLA3M5PYGu338pYmf0X-jO39ePpgH7oI7kI8f9QeyEYnw_aem_GY2nRMYduK-7lR2uVMH-qQ" target="_blank" rel="noopener noreferrer">Instagram</a></li>
        <li><a href="https://www.facebook.com/erasmushogeschool" target="_blank" rel="noopener noreferrer">Facebook</a></li>
        <li><a href="https://x.com/ehbrussel?fbclid=IwY2xjawK-HCpleHRuA2FlbQIxMABicmlkETFheWJOUlp3ekNuR3NHQWQ5AR4Ut-kaTOjiO_fSCouBqQrdE7t-vI0RtLGCUmHg3jBXEzpltWJoCAjIDu2YZQ_aem_Fhsem9A0POhg9WZPKA64oQ" target="_blank" rel="noopener noreferrer">X (Twitter)</a></li>
        <li><a href="https://www.tiktok.com/@erasmushogeschool?fbclid=IwY2xjawK-HDxleHRuA2FlbQIxMABicmlkETFheWJOUlp3ekNuR3NHQWQ5AR4NB9ezdqahoKSvCTczK5AKHL5b4ge0QPkzxdZxjheXvXyMnPDmG6kVsQFbNw_aem_Z0IDfvat4bDQ9QvzXh5BcA" target="_blank" rel="noopener noreferrer">TikTok</a></li>
      </ul>
    </div>
  </div>

  <div className="footer-bottom">
    <p>© 2025 Erasmushogeschool Brussel – Design & Technologie</p>
  </div>
  <div className="easter-egg">
  <a
    href="https://youtu.be/dQw4w9WgXcQ?si=yB6y9GOBQG6o9nbo" // of jouw eigen video
    target="_blank"
    rel="noopener noreferrer"
  >
    don't klik
  </a>
</div>
</footer>
    
    </div>
    
  );
}
