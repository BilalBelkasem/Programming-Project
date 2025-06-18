import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../css/UBedrijven.css';
import axios from 'axios';

export default function UBedrijven({ onLogout }) {
  const navigate = useNavigate();
  const [bedrijven, setBedrijven] = useState([]);
  const [favorieten, setFavorieten] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        const bedrijvenRes = await axios.get('http://localhost:5000/api/open-bedrijven');
        setBedrijven(bedrijvenRes.data);

        const favorietenRes = await axios.get(`http://localhost:5000/api/favorieten/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
    const token = user?.token;
    const isFavoriet = favorieten.includes(bedrijfId);

    try {
      if (isFavoriet) {
        await axios.delete(`http://localhost:5000/api/favorieten/${bedrijfId}?student_id=${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorieten(prev => prev.filter(id => id !== bedrijfId));
      } else {
        await axios.post('http://localhost:5000/api/favorieten', {
          student_id: user.id,
          company_id: bedrijfId
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorieten(prev => [...prev, bedrijfId]);
      }
    } catch (err) {
      console.error('Fout bij togglen van favoriet:', err);
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
          <Link to="/favorieten" className="navLink">Favorieten</Link>
          <Link to="/mijn-profiel" className="navLink">mijn profiel</Link>
        </nav>
        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
      </header>

      <main className="main">
        <h2 className="title">Ontdek bedrijven</h2>
        <div className="bedrijvenContainer">
          {bedrijven.length === 0 ? (
            <p style={{ color: 'gray' }}>Geen bedrijven gevonden...</p>
          ) : (
            bedrijven.map((bedrijf) => (
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
