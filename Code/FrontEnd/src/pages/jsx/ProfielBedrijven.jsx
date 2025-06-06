import React from 'react';
import '../Css/ProfielBedrijven.css';

export default function CompanyProfilePage() {

  const company = {
    name: 'Gabriel',
    lastname: 'Tintas',
    companyName: 'colruyt',
    function: 'Administrateur',
    email: 'colruytBelgium@gmail.be',
    linkedin: 'https://www.linkedin.com/in/gabriel-tintas-299533281/',
    about: 'Een bedrijf gespecialiseerd in renovatie en restauratie van gebouwen.',
    lookingFor: ['jobstudent', 'connecties', 'stage', 'job'],
    domains: ['Data', 'software', 'netwerking', 'robotica / AI']
  };

  return (
    <div className="company-profile-wrapper">
      <nav className="navbar">
        <img src="/logo.png" alt="Erasmus Logo" className="logo" />
        <ul className="nav-links">
          <li>info</li>
          <li>bedrijven</li>
          <li>plattegrond</li>
          <li>Mijn profiel</li>
        </ul>
      </nav>

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