import React, { useState } from 'react';
import logo from '../../assets/logo Erasmus.png';
import '../../pages/Css/AdminBedrijf.css';
import { FaSignOutAlt, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AdminBedrijf() {
  const [zoekterm, setZoekterm] = useState('');
  const [bedrijven, setBedrijven] = useState([
    { id: 1, naam: 'Colruyt group' },
    { id: 2, naam: 'Decathlon' },
    { id: 3, naam: 'Action' },
    { id: 4, naam: 'DELL' }
  ]);

  const navigate = useNavigate();

  const handleLogout = () => navigate('/');
  const handleBack = () => navigate('/admin');

  const handleVerwijder = (id, naam) => {
    const bevestiging = window.confirm(`Ben je zeker dat je ${naam} wilt verwijderen?`);
    if (bevestiging) {
      setBedrijven(prev => prev.filter(b => b.id !== id));
    }
  };

  const gefilterdeBedrijven = bedrijven.filter(bedrijf =>
    bedrijf.naam.toLowerCase().includes(zoekterm.toLowerCase())
  );

  return (
    <div className="admin-bedrijf-container">
      <header className="admin-header">
        <div className="admin-logo-block">
          <img src={logo} alt="logo" className="admin-logo" />
          <span className="admin-title">admin</span>
        </div>
        <div className="admin-buttons">
          <button className="terug-knop" onClick={handleBack}>
            <FaArrowLeft className="back-icon" />
            Terug
          </button>
          <button className="logout-knop" onClick={handleLogout}>
            <FaSignOutAlt />
          </button>
        </div>
      </header>

      <div className="zoekbalk-wrapper">
        <input
          type="text"
          placeholder="zoekopdracht"
          value={zoekterm}
          onChange={(e) => setZoekterm(e.target.value)}
          className="zoek-input"
        />
      </div>

      <div className="bedrijvenlijst">
        {gefilterdeBedrijven.map(bedrijf => (
          <div key={bedrijf.id} className="bedrijf-kaart">
            <p className="bedrijf-naam">{bedrijf.naam}</p>
            <FaTrash
              className="verwijder-icon"
              onClick={() => handleVerwijder(bedrijf.id, bedrijf.naam)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
