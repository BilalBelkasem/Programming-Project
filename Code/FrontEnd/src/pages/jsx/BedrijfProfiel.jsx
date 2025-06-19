import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logoerasmus.png';
import '../Css/BedrijfProfiel.css';

export default function BedrijfProfiel() {
  const { id } = useParams();
  const [bedrijf, setBedrijf] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      alert('Geen bedrijf ID opgegeven');
      setError(true);
      return;
    }

    axios.get(`http://localhost:5000/api/bedrijfprofiel/${id}`)
      .then(response => {
        const raw = response.data;
        // Zet booleans om naar arrays voor weergave
        const lookingFor = [];
        if (raw.zoek_jobstudent) lookingFor.push('Jobstudent');
        if (raw.zoek_connecties) lookingFor.push('Connecties');
        if (raw.zoek_stage) lookingFor.push('Stage');
        if (raw.zoek_job) lookingFor.push('Job');

        const domains = [];
        if (raw.domein_data) domains.push('Data');
        if (raw.domein_netwerking) domains.push('Netwerking');
        if (raw.domein_ai) domains.push('AI / Robotica');
        if (raw.domein_software) domains.push('Software');

        setBedrijf({ ...raw, lookingFor, domains });
      })
      .catch(err => {
        console.error(err);
        setError(true);
        alert('Fout bij ophalen van de bedrijfsdata');
      });
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const displayValue = (value, fallback) => {
    return error || value === undefined || value === null ? fallback : value;
  };

  return (
    <div className="page-wrapper">
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

      <main className="container">
        <div className="profile-header" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="profile-picture" style={{ margin: "0 auto" }}>
            {bedrijf?.profilePicture ? (
              <img src={bedrijf.profilePicture} alt="Bedrijfsfoto" className="circle" />
            ) : (
              <div className="circle">[Foto]</div>
            )}
          </div>
          <h1 style={{ marginTop: "1rem" }}>
            {displayValue(bedrijf?.company_name, 'Bedrijfsnaam')}
          </h1>
        </div>

        <div className="profile-grid">
          <div className="field">
            <label>Sector:</label>
            <input type="text" readOnly value={displayValue(bedrijf?.sector, 'Sector')} />
          </div>
          <div className="field">
            <label>Website:</label>
            <input type="text" readOnly value={displayValue(bedrijf?.website, 'Website')} />
          </div>
          <div className="field">
            <label>E-mail:</label>
            <input type="text" readOnly value={displayValue(bedrijf?.email, 'E-mail')} />
          </div>
          <div className="field">
            <label>Adres:</label>
            <input type="text" readOnly value={displayValue(bedrijf ? `${bedrijf.street || ''} ${bedrijf.postal_code || ''}` : '', 'Adres')} />
          </div>
        </div>

        <div className="section">
          <h2>Over het bedrijf</h2>
          <div className="textarea">
            {displayValue(bedrijf?.about, <em>Geen beschrijving opgegeven</em>)}
          </div>
        </div>

        <div className="section">
          <h3>Wat zoekt dit bedrijf?</h3>
          <div className="checkbox-group">
            {bedrijf?.lookingFor?.length > 0 ? (
              bedrijf.lookingFor.map((item, i) => (
                <label key={i}>
                  <input type="checkbox" checked disabled />
                  {item}
                </label>
              ))
            ) : (
              <p><em>Geen selectie opgegeven</em></p>
            )}
          </div>
        </div>

        <div className="section">
          <h3>IT-domeinen</h3>
          <div className="checkbox-group">
            {bedrijf?.domains?.length > 0 ? (
              bedrijf.domains.map((item, i) => (
                <label key={i}>
                  <input type="checkbox" checked disabled />
                  {item}
                </label>
              ))
            ) : (
              <p><em>Geen selectie opgegeven</em></p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
