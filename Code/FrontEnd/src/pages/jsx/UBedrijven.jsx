import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../css/UBedrijven.css';
import axios from 'axios';

export default function UBedrijven({ onLogout }) {
  const navigate = useNavigate();
  const [bedrijven, setBedrijven] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/bedrijven')
      .then(res => setBedrijven(res.data))
      .catch(err => console.error('Fout bij ophalen bedrijven:', err));
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  const likeBedrijf = async (bedrijfId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      await axios.post('http://localhost:5000/api/favorieten', {
        student_id: user.id,
        company_id: bedrijfId
      });

      alert('Bedrijf toegevoegd aan favorieten');
    } catch (error) {
      console.error('Fout bij liken:', error);
    }
  };

  return (
    <div className="pageWrapper">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
          <Link to="/dashboard" className="navLink">Info</Link>
          <Link to="/bedrijven" className="navLink">Bedrijven</Link>
          <Link to="/plattegrond" className="navLink">Plattegrond</Link>
          <Link to="/UFavorietenBedrijven" className="navLink">Favorieten</Link>
          <Link to="/mijn-profiel" className="navLink">mijn profiel</Link>
        </nav>
        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
      </header>

      <main className="main">
        <h2 className="title">Ontdek bedrijven</h2>
        <div className="bedrijvenContainer">
          {bedrijven.map((bedrijf) => (
            <div key={bedrijf.id} className="bedrijfCard">
              <h3 className="bedrijfNaam">{bedrijf.company_name}</h3>
              <p className="bedrijfBeschrijving">{bedrijf.sector}</p>
              <div className="tagContainer">
                {bedrijf.tags?.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              <button
                onClick={() => likeBedrijf(bedrijf.id)}
                className="likeButton"
              >
                ♥
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
