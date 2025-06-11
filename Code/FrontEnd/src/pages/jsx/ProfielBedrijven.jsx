import React from 'react';
import '../Css/ProfielBedrijven.css';
import { Link } from 'react-router-dom';
export default function CompanyProfilePage() {

  const company = {
    name: '',
    lastname: '',
    companyName: '',
    function: '',
    email: '',
    linkedin: '',
    about: '',
    lookingFor: [''],
    domains: ['']
  };

  return (
    <div className="company-profile-wrapper">
     <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
          <Link to="/dashboard" className="nav-link">info</Link>
          <Link to="/bedrijven" className="nav-link">bedrijven</Link>
          <Link to="/plattegrond" className="nav-link">plattegrond</Link>
          <Link to="/favorieten" className="nav-link">favorieten</Link>
          <Link to="/dashboard" className="nav-link">mijn profiel</Link>
        </nav>
        <div onClick={onLogout} className="logout-icon" title="Uitloggen">⇦</div>
      </header>

      <div className="profile-section">
        <div className="profile-picture">PROFILE PICTURE</div>
        <div className="profile-grid">
          <div className="field">
            <label>Name</label>
            <div className="value">{company.name}</div>
          </div>
          <div className="field">
            <label>Lastname</label>
            <div className="value">{company.lastname}</div>
          </div>
          <div className="field">
            <label>Company Name</label>
            <div className="value">{company.companyName}</div>
          </div>
          <div className="field">
            <label>Function</label>
            <div className="value">{company.function}</div>
          </div>
          <div className="full-width-field">
            <label>e-mail</label>
            <div className="value">{company.email}</div>
          </div>
          <div className="full-width-field">
            <label>linkedin</label>
            <div className="value">{company.linkedin}</div>
          </div>
        </div>
      </div>

      <div className="company-info">
        <div className="section">
          <label>about</label>
          <div className="textarea">{company.about}</div>
        </div>

        <div className="section">
          <label>wat zoekt u bedrijf?</label>
          <div className="checkbox-group">
            {company.lookingFor.map((item, index) => (
              <label key={index}><input type="checkbox" checked readOnly /> {item}</label>
            ))}
          </div>
        </div>

        <div className="section">
          <label>tot welke van de 4 IT domeinen behoort uw bedrijf</label>
          <div className="checkbox-group">
            {company.domains.map((item, index) => (
              <label key={index}><input type="checkbox" checked readOnly /> {item}</label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}