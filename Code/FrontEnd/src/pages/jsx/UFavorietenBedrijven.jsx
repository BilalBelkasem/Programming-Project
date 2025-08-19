import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/logoerasmus.png';
import '../css/UBedrijven.css';
import axios from 'axios';
import SharedFooter from '../../components/SharedFooter';

export default function UFavorietenBedrijven({ onLogout }) {
  const navigate = useNavigate();
  const [favorieten, setFavorieten] = useState([]);
  const [likedIds, setLikedIds] = useState([]); // ids van gelikete studenten voor bedrijf
  const [notification, setNotification] = useState({ message: '', type: '' }); // State for notification
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null; // Haal de ID veilig op

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          return;
        }

        if (user.role === 'bedrijf') {
          // Bedrijf: favoriete studenten ophalen
          const res = await axios.get(`/api/bedrijf-like-student/favorites/${user.id}`);
          setFavorieten(res.data.map(s => ({ ...s, type: 'student' })));
          setLikedIds(res.data.map(s => s.id));
        } else if (user.role === 'student') {
          // Student: favoriete bedrijven ophalen
          const res = await axios.get(`/api/favorieten/${user.id}`);
          setFavorieten(res.data.map(b => ({ ...b, type: 'bedrijf' })));
        }
      } catch (err) {
        console.error('Fout bij ophalen favorieten:', err);
      }
    };
    fetchData();
  }, [userId]); // Gebruik userId als stabiele dependency

  // Like/unlike student (bedrijf)
  const handleLikeStudent = async (studentId) => {
    if (!user || user.role !== 'bedrijf') return;
    const alreadyLiked = likedIds.includes(studentId);
    if (alreadyLiked) {
      const confirmed = window.confirm('Weet je zeker dat je deze student uit je favorieten wilt verwijderen?');
      if (!confirmed) return;
      await axios.delete('/api/bedrijf-like-student/unlike', {
        data: { student_id: studentId, company_id: user.id }
      });
      setLikedIds(prev => prev.filter(id => id !== studentId));
      setFavorieten(prev => prev.filter(fav => fav.id !== studentId)); // optioneel: direct uit lijst
    } else {
      await axios.post('/api/bedrijf-like-student/like', {
        student_id: studentId,
        company_id: user.id
      });
      setLikedIds(prev => [...prev, studentId]);
    }
  };

  const handleUnlike = async (companyId) => {
    if (!user || user.role !== 'student') return;

    try {
      await axios.delete(`/api/favorieten/${companyId}?student_id=${user.id}`);
      setFavorieten(prev => prev.filter(fav => fav.id !== companyId));
      setNotification({ message: 'Bedrijf verwijderd uit favorieten.', type: 'success' });
    } catch (err) {
      console.error('Fout bij verwijderen favoriet:', err);
      setNotification({ message: 'Kon favoriet niet verwijderen.', type: 'error' });
    } finally {
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/");
  };

  const renderZoekOpties = (bedrijf) => {
    const opties = {
      zoek_jobstudent: 'Jobstudent',
      zoek_stage: 'Stage',
      zoek_job: 'Job',
      zoek_connecties: 'Connecties',
    };
    const gevondenOpties = Object.entries(opties)
      .filter(([key]) => bedrijf[key])
      .map(([, label]) => label);
    
    return gevondenOpties.length > 0 ? gevondenOpties.map(label => <span key={label} className="tag zoek-tag">{label}</span>) : <span className="tag geen-info">N.v.t.</span>;
  };

  const renderDomeinen = (bedrijf) => {
    const domeinen = {
      domein_data: 'Data',
      domein_netwerking: 'Netwerken',
      domein_ai: 'AI',
      domein_software: 'Software',
    };
    const gevondenDomeinen = Object.entries(domeinen)
      .filter(([key]) => bedrijf[key])
      .map(([, label]) => label);

    return gevondenDomeinen.length > 0 ? gevondenDomeinen.map(label => <span key={label} className="tag domein-tag">{label}</span>) : <span className="tag geen-info">N.v.t.</span>;
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
        {notification.message && (
          <div style={{
            padding: '1rem',
            margin: '0 auto 1.5rem auto',
            maxWidth: '600px',
            borderRadius: '8px',
            color: 'white',
            backgroundColor: notification.type === 'success' ? '#28a745' : '#dc3545',
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
            {notification.message}
          </div>
        )}
        <h2 className="title">Mijn favorieten</h2>
        <div className="bedrijvenContainer">
          {favorieten.length === 0 ? (
            <p className="no-bedrijven">Geen favorieten gevonden...</p>
          ) : (
            favorieten.map((item) => (
              <div
                key={item.id}
                className="bedrijfCard"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => {
                  if (item.type === 'student') {
                    navigate(`/studentprofiel/${item.id}`);
                  } else if (item.type === 'bedrijf') {
                    navigate(`/bedrijfprofiel/${item.id}`);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div style={{ width: '100%', position: 'relative' }}>
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
                      <button
                        onClick={() => handleUnlike(item.id)}
                        className="likeButton liked"
                        style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
                        title="Verwijder uit favorieten"
                      >
                        ♥
                      </button>
                      <h3 className="bedrijfNaam">{item.naam}</h3>
                      <p className="bedrijfBeschrijving">{item.beschrijving}</p>
                      <div className="tagSectie">
                        <h5>Zoekt:</h5>
                        <div className="tagContainer">
                          {renderZoekOpties(item)}
                        </div>
                      </div>
                      <div className="tagSectie">
                        <h5>Domein:</h5>
                        <div className="tagContainer">
                          {renderDomeinen(item)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <SharedFooter />
    </div>
  );
}
