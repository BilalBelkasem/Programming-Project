import React, { useState } from 'react';
import logo from '../../assets/logo Erasmus.png';
import '../../pages/Css/AdminBedrijf.css';
import { FaSignOutAlt, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const bedrijvenData = [
  { id: 1, naam: 'Colruyt group' },
  { id: 2, naam: 'Decathlon' },
  { id: 3, naam: 'Action' },
  { id: 4, naam: 'DELL' }
];

export default function AdminBedrijf() {
  const [zoekterm, setZoekterm] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => navigate('/');
  const handleBack = () => navigate('/admin');

  const gefilterdeBedrijven = bedrijvenData.filter(bedrijf =>
    bedrijf.naam.toLowerCase().includes(zoekterm.toLowerCase())
  );

  return (
    <div className="admin-bedrijf-container">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-logo-block">
          <img src={logo} alt="logo" className="admin-logo" />
          <span className="admin-title">admin</span>
        </div>
        <div className="admin-buttons">
          <div className="back-wrapper" onClick={handleBack}>
            <FaArrowLeft className="back-icon" />
            <span className="back-text">Terug</span>
          </div>
          <FaSignOutAlt className="logout-icon" onClick={handleLogout} />
        </div>
      </header>

      {/* Zoekveld */}
      <div className="zoekbalk-wrapper">
        <input
          type="text"
          placeholder="zoekopdracht"
          value={zoekterm}
          onChange={(e) => setZoekterm(e.target.value)}
          className="zoek-input"
        />
      </div>

      {/* Bedrijvenlijst */}
      <div className="bedrijvenlijst">
        {gefilterdeBedrijven.map(bedrijf => (
          <div key={bedrijf.id} className="bedrijf-kaart">
            <p className="bedrijf-naam">{bedrijf.naam}</p>
            <FaTrash className="verwijder-icon" />
          </div>
        ))}
      </div>
    </div>
  );
}

