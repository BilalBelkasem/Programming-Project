
import React, { useState } from 'react';
import logo from '../../assets/logo Erasmus.png';
import '../../pages/Css/AdminBadge.css';
import { FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const badgeData = [
  { id: 1, naam: 'Colruyt group' },
  { id: 2, naam: 'Decathlon' },
  { id: 3, naam: 'Action' },
  { id: 4, naam: 'DELL' },
  { id: 5, naam: 'Marwan Amakran' },
  { id: 6, naam: 'Denis Bujorean' }
];

export default function AdminBadge() {
  const [zoekterm, setZoekterm] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => navigate('/');
  const handleBack = () => navigate('/admin');

  const gefilterdeItems = badgeData.filter(item =>
    item.naam.toLowerCase().includes(zoekterm.toLowerCase())
  );

  const handlePrint = (naam) => {
    alert(`Badge printen voor: ${naam}`);
  };

  return (
    <div className="admin-badge-container">
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

      {/* Lijst */}
      <div className="badge-lijst">
        {gefilterdeItems.map(item => (
          <div key={item.id} className="badge-kaart">
            <p className="badge-naam">{item.naam}</p>
            <button className="badge-knop" onClick={() => handlePrint(item.naam)}>
              print badge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
