import React, { useEffect, useState } from 'react';
import logo from '../../assets/logoerasmus.png';
import '../../pages/Css/AdminStudent.css';
import { FaTrash, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminStudent() {
  const [zoekterm, setZoekterm] = useState('');
  const [studenten, setStudenten] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  const handleBack = () => navigate('/admin');

  // Studenten ophalen van backend met auth header
  const laadStudenten = () => {
    const token = localStorage.getItem('token');

    axios.get('/api/studenten', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        setStudenten(res.data);
        console.log('Data van backend:', res.data);
      })
      .catch(err => {
        console.error('Fout bij ophalen studenten:', err);
      });
  };

  useEffect(() => {
    laadStudenten();
  }, []);

  const handleVerwijder = (id, naam) => {
    const token = localStorage.getItem('token');

    if (window.confirm(`Ben je zeker dat je ${naam} wilt verwijderen?`)) {
      axios.delete(`/api/studenten/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(() => {
          setStudenten(prev => prev.filter(student => student.id !== id));
        })
        .catch(err => {
          console.error('Fout bij verwijderen student:', err);
          alert('Verwijderen is mislukt. Probeer later opnieuw.');
        });
    }
  };

  const gefilterdeStudenten = studenten.filter(student =>
    (student.naam || '').toLowerCase().includes(zoekterm.toLowerCase())
  );

  return (
    <div className="admin-student-container">
      <header className="admin-header">
        <div className="admin-logo-block">
          <img src={logo} alt="logo" className="admin-logo" />
          <div className="admin-title-block">
            <span className="admin-title">admin</span>
            <span className="admin-subtitle">EHB</span>
          </div>
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
          onChange={e => setZoekterm(e.target.value)}
          className="zoek-input"
        />
      </div>

      <div className="studentenlijst">
        {gefilterdeStudenten.map(student => (
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
        ))}
      </div>
    </div>
  );
}
