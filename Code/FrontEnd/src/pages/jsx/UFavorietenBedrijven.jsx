import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
import '../css/UBedrijven.css';
import axios from 'axios';

export default function UFavorietenBedrijven({ onLogout }) {
  const navigate = useNavigate();
  const [bedrijven, setBedrijven] = useState([]);
  const [favorieten, setFavorieten] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bedrijvenRes = await axios.get('http://localhost:5000/api/open-bedrijven');
        setBedrijven(bedrijvenRes.data);

        const user = JSON.parse(localStorage.getItem('user'));
        const favorietenRes = await axios.get(`http://localhost:5000/api/favorieten/${user.id}`);
        const geliketeIds = favorietenRes.data.map((bedrijf) => bedrijf.id);
        setFavorieten(geliketeIds);
      } catch (err) {
        console.error('Fout bij ophalen:', err);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  const toggleLike = async (bedrijfId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isFavoriet = favorieten.includes(bedrijfId);

    try {
      if (isFavoriet) {
        await axios.delete(`http://localhost:5000/api/favorieten/${bedrijfId}?student_id=${user.id}`);
        setFavorieten(prev => prev.filter(id => id !== bedrijfId));
      } else {
        await axios.post('http://localhost:5000/api/favorieten', {
          student_id: user.id,
          company_id: bedrijfId
        });
        setFavorieten(prev => [...prev, bedrijfId]);
      }
    } catch (err) {
      console.error('Fout bij togglen van favoriet:', err);
    }
  };

  return (
    <div className="pageWrapper">
      {/* Nieuwe headerstructuur zoals GBedrijven */}
      <header className="header">
        <div className="header-section left">
          <img src={logo} alt="Erasmus Logo" className="logo" />
        </div>

        <div className="header-section center">
          <nav className="nav-center">
            <Link to="/dashboard" className="nav-btn">Info</Link>
            <Link to="/bedrijven" className="nav-btn">Bedrijven</Link>
            <Link to="/plattegrond" className="nav-btn">Plattegrond</Link>
            <Link to="/favorieten" className="nav-btn active">Favorieten</Link>
            <Link to="/mijn-profiel" className="nav-btn">Mijn profiel</Link>
          </nav>
        </div>

        <div className="header-section right">
          <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
        </div>
      </header>

      <main className="main">
        <h2 className="title">Mijn favorieten</h2>
        <div className="bedrijvenContainer">
          {bedrijven.length === 0 ? (
            <p style={{ color: 'gray' }}>Geen bedrijven gevonden...</p>
          ) : (
            bedrijven
              .filter((bedrijf) => favorieten.includes(bedrijf.id))
              .map((bedrijf) => (
                <div key={bedrijf.id} className="bedrijfCard">
                  <h3 className="bedrijfNaam">{bedrijf.company_name}</h3>
                  <p className="bedrijfBeschrijving">{bedrijf.sector}</p>
                  <button
                    onClick={() => toggleLike(bedrijf.id)}
                    className={`likeButton ${favorieten.includes(bedrijf.id) ? 'liked' : ''}`}
                  >
                    ♥
                  </button>
                </div>
              ))
          )}
        </div>
      </main>
    </div>
  );
}
