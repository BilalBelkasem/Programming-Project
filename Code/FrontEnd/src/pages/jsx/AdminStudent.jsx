import React, { useState } from 'react';
import logo from '../../assets/logo Erasmus.png'; // Let op spatie in bestandsnaam
import '../../pages/Css/AdminStudent.css';
import { FaTrash, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AdminStudent() {
  const [zoekterm, setZoekterm] = useState('');
  const [studenten, setStudenten] = useState([
    { id: 1, naam: 'Marwan Amakran', school: 'EHB' },
    { id: 2, naam: 'Aymen Bounasnaa', school: 'EHB' },
    { id: 3, naam: 'Denis Bujorean', school: 'EHB' }
  ]);

  const navigate = useNavigate();

  const handleLogout = () => navigate('/');
  const handleBack = () => navigate('/admin');

  const handleVerwijder = (id, naam) => {
    if (window.confirm(`Ben je zeker dat je ${naam} wilt verwijderen?`)) {
      setStudenten(prev => prev.filter(student => student.id !== id));
    }
  };

  const gefilterdeStudenten = studenten.filter(student =>
    student.naam.toLowerCase().includes(zoekterm.toLowerCase())
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
