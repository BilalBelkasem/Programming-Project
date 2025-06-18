import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
import '../Css/StudentenLijst.css';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';

export default function StudentenLijst() {
  const [zoekterm, setZoekterm] = useState('');
  const [studenten, setStudenten] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/api/studenten', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => setStudenten(res.data))
      .catch(err => {
        console.error('Fout bij ophalen studenten:', err);
      });
  }, []);

  const handleVerwijder = (id, naam) => {
    const token = localStorage.getItem('token');

    if (window.confirm(`Ben je zeker dat je ${naam} wilt verwijderen?`)) {
      axios.delete(`http://localhost:5000/api/studenten/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          setStudenten(prev => prev.filter(student => student.id !== id));
        })
        .catch(err => {
          console.error('Fout bij verwijderen student:', err);
          alert('Verwijderen mislukt.');
        });
    }
  };

  const gefilterdeStudenten = studenten.filter(student =>
    (student.naam || '').toLowerCase().includes(zoekterm.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      {/* ✅ HEADER van 'mijn-profiel' */}
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
          <Link to="/dashboard" className="navLink">Info</Link>
          <Link to="/plattegrond" className="navLink">Plattegrond</Link>
          <Link to="/favorieten" className="navLink">Studenten</Link>
          <Link to="/mijn-profiel" className="navLink">Mijn profiel</Link>
        </nav>
        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
      </header>

      {/* REST blijft hetzelfde */}
      <main className="container">
        <input
          type="text"
          placeholder="Zoek op studentnaam"
          value={zoekterm}
          onChange={e => setZoekterm(e.target.value)}
          className="zoek-input"
        />

        <div className="studentenlijst">
          {gefilterdeStudenten.length > 0 ? (
            gefilterdeStudenten.map(student => (
              <div key={student.id} className="student-kaart">
                <div>
                  <p className="student-naam">{student.naam}</p>
                  <p className="student-school">{student.school}</p>
                </div>
                <FaTrash
                  className="verwijder-icon"
                  onClick={() => handleVerwijder(student.id, student.naam)}
                />
              </div>
            ))
          ) : (
            <p className="geen-resultaten">Geen resultaten gevonden.</p>
          )}
        </div>
      </main>
    </div>
  );
}
