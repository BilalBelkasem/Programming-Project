import React from 'react';
import '../../pages/Css/AdminDashboard.css';
import logo from '../../assets/logo Erasmus.png';

export default function AdminDashboard() {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <img src={logo} alt="Erasmus logo" className="admin-logo" />
        <h1 className="admin-title">Admin Dashboard</h1>
      </header>

      <main className="admin-main">
        <p>Welkom, Admin!</p>
        <p>Beheer bedrijven, studenten en inschrijvingen.</p>
        <div className="admin-boxes">
          <div className="admin-box">📋 Inschrijvingen</div>
          <div className="admin-box">🏢 Bedrijven</div>
          <div className="admin-box">👨‍🎓 Studenten</div>
        </div>
      </main>
    </div>
  );
}