
import React, { useState } from 'react';
import logo from '../../assets/logo Erasmus.png';
import '../../pages/Css/AdminStudent.css';
import { FaSignOutAlt, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const studentenData = [
  { id: 1, naam: 'Marwan Amakran', school: 'EHB' },
  { id: 2, naam: 'Aymen Bounasnaa', school: 'EHB' },
  { id: 3, naam: 'Denis Bujorean', school: 'EHB' }
];

export default function AdminStudent() {
  const [zoekterm, setZoekterm] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => navigate('/');
  const handleBack = () => navigate('/admin');

  const gefilterdeStudenten = studentenData.filter(student =>
    student.naam.toLowerCase().includes(zoekterm.toLowerCase())
  );

  return (
    <div className="admin-student-container">
      <header className="admin-header">
        <div className="admin-logo-block">
          <img src={logo} alt="logo" className="admin-logo" />
          <span className="admin-title">admin</span>
        </div>
       <div className="admin-buttons">
        <div className="back-wrapper" onClick={handleBack}>
        <FaArrowLeft className="back-icon" />
        <span className="back-text">Terug</span>
        </div>
  <FaSignOutAlt className="logout-icon" onClick={handleLogout} />
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

      <div className="studentenlijst">
        {gefilterdeStudenten.map(student => (
          <div key={student.id} className="student-kaart">
            <div className="student-info">
              <p className="student-naam">{student.naam}</p>
              <p className="student-school">{student.school}</p>
            </div>
            <FaTrash className="verwijder-icon" />
          </div>
        ))}
      </div>
    </div>
  );
}
