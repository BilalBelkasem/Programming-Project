import React, { useState, useEffect } from 'react';
import logo from '/logoerasmus.png';
import '../../pages/Css/AdminBedrijf.css';
import { FaSignOutAlt, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminBedrijf() {
  const [zoekterm, setZoekterm] = useState('');
  const [bedrijven, setBedrijven] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  const handleBack = () => navigate('/admin');

  // ✅ Laad bedrijven van backend bij mount
  useEffect(() => {
    axios.get('/api/bedrijven', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        setBedrijven(res.data);
      })
      .catch(err => {
        console.error('Fout bij ophalen bedrijven:', err);
      });
  }, []);

  // ✅ Verwijder bedrijf via API en update lijst
  const handleVerwijder = (id, naam) => {
    const bevestiging = window.confirm(`Ben je zeker dat je ${naam} wilt verwijderen?`);
    if (bevestiging) {
      axios.delete(`/api/bedrijven/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(() => {
        setBedrijven(prev => prev.filter(b => b.id !== id));
      })
      .catch(err => {
        console.error('Fout bij verwijderen bedrijf:', err);
        alert('Verwijderen is mislukt. Probeer later opnieuw.');
      });
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
