import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
import '../css/UBedrijven.css';
import axios from 'axios';

export default function UFavorietenBedrijven({ onLogout }) {
  const navigate = useNavigate();
  const [favorieten, setFavorieten] = useState([]);
  const [likedIds, setLikedIds] = useState([]); // ids van gelikete studenten voor bedrijf
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        if (user.role === 'bedrijf') {
          // Bedrijf: favoriete studenten ophalen
          const res = await axios.get(`http://localhost:5000/api/bedrijf-like-student/favorites/${user.id}`);
          setFavorieten(res.data.map(s => ({ ...s, type: 'student' })));
          setLikedIds(res.data.map(s => s.id));
        } else if (user.role === 'student') {
          // Student: favoriete bedrijven ophalen
          const res = await axios.get(`http://localhost:5000/api/favorieten/${user.id}`);
          setFavorieten(res.data.map(b => ({ ...b, type: 'bedrijf' })));
        }
      } catch (err) {
        console.error('Fout bij ophalen favorieten:', err);
      }
    };
    fetchData();
  }, [user]);

  // Like/unlike student (bedrijf)
  const handleLikeStudent = async (studentId) => {
    if (!user || user.role !== 'bedrijf') return;
    const alreadyLiked = likedIds.includes(studentId);
    if (alreadyLiked) {
      const confirmed = window.confirm('Weet je zeker dat je deze student uit je favorieten wilt verwijderen?');
      if (!confirmed) return;
      await axios.delete('http://localhost:5000/api/bedrijf-like-student/unlike', {
        data: { student_id: studentId, company_id: user.id }
      });
      setLikedIds(prev => prev.filter(id => id !== studentId));
      setFavorieten(prev => prev.filter(fav => fav.id !== studentId)); // optioneel: direct uit lijst
    } else {
      await axios.post('http://localhost:5000/api/bedrijf-like-student/like', {
        student_id: studentId,
        company_id: user.id
      });
      setLikedIds(prev => [...prev, studentId]);
    }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  return (
    <div className="pageWrapper">
      {/* Nieuwe headerstructuur zoals GBedrijven */}
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
          <Link to="/dashboard" className="nav-btn">Info</Link>
          <Link to="/bedrijven" className="nav-btn">Bedrijven</Link>
          <Link to="/speeddates" className="nav-btn">Speeddates</Link>
          <Link to="/plattegrond" className="nav-btn">Plattegrond</Link>
          <Link to="/favorieten" className="nav-btn active">Favorieten</Link>
          <Link to="/mijn-profiel" className="nav-btn">Mijn Profiel</Link>
        </nav>
        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
      </header>

      <main className="main">
        <h2 className="title">Mijn favorieten</h2>
        <div className="bedrijvenContainer">
          {favorieten.length === 0 ? (
            <p className="no-bedrijven">Geen favorieten gevonden...</p>
          ) : (
            favorieten.map((item) => (
              <div
                key={item.id}
                className="bedrijfCard"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: item.type === 'student' ? 'pointer' : 'default' }}
                onClick={item.type === 'student' ? () => navigate(`/studentprofiel/${item.id}`) : undefined}
                role={item.type === 'student' ? 'button' : undefined}
                tabIndex={item.type === 'student' ? 0 : undefined}
              >
                <div style={{ width: '100%' }}>
                  {item.type === 'student' ? (
                    <>
                      <h3 className="bedrijfNaam" style={{ fontWeight: 'bold', margin: 0 }}>{item.full_name}</h3>
                      <div>{item.school}</div>
                      <div>{item.year} jaar {item.education}</div>
                      {user && user.role === 'bedrijf' && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }} onClick={e => e.stopPropagation()}>
                          <button
                            className="like-button"
                            title="Like ♥"
                            style={{ color: likedIds.includes(item.id) ? 'red' : undefined, fontSize: '1.5rem' }}
                            onClick={() => handleLikeStudent(item.id)}
                          >
                            ♥
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <h3 className="bedrijfNaam">{item.naam}</h3>
                      <p className="bedrijfBeschrijving">{item.beschrijving}</p>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
