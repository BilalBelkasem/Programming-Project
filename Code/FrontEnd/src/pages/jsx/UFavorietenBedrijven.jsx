import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../Css/UFavorietenBedrijven.css';
import axios from 'axios';

export default function UFavorietenBedrijven({ onLogout }) {
  const navigate = useNavigate();
  const [favorieten, setFavorieten] = useState([]);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  const verwijderFavoriet = async (bedrijfId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.delete(`http://localhost:5000/api/favorieten/${bedrijfId}?student_id=${user.id}`);
      const res = await axios.get(`http://localhost:5000/api/favorieten/${user.id}`);
      setFavorieten(res.data);
    } catch (err) {
      console.error('Fout bij verwijderen:', err);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    axios.get(`http://localhost:5000/api/favorieten/${user.id}`)
      .then(res => setFavorieten(res.data))
      .catch(err => console.error('Fout bij ophalen favorieten:', err));
  }, []);

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
        <h2 className="title">Mijn favorieten</h2>
        <div className="bedrijvenContainer">
          {favorieten.length === 0 ? (
            <p>Je hebt nog geen favoriete bedrijven.</p>
          ) : (
            favorieten.map((bedrijf) => (
              <div key={bedrijf.id} className="bedrijfCard">
                <h3 className="bedrijfNaam">{bedrijf.naam}</h3>
                <p className="bedrijfBeschrijving">{bedrijf.beschrijving}</p>
                <button
                  onClick={() => verwijderFavoriet(bedrijf.id)}
                  className="actionButton"
                >
                  Verwijder
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
