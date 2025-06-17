import React, { useState, useEffect } from 'react';
import '../Css/ProfielBedrijven.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';

export default function ProfielBedrijven() {
  const [formData, setFormData] = useState({
    booth_contact_name: '',
    booth_contact_email: '',
    invoice_contact_name: '',
    invoice_contact_email: '',
    companyName: '',
    website: '',
    about: '',
    lookingFor: [],
    domains: [],
    profilePicture: null,
  });

  useEffect(() => {
    fetch('/api/company-details')
      .then(res => {
        if (!res.ok) throw new Error('Netwerk fout');
        return res.json();
      })
      .then(data => {
        setFormData(prev => ({
          ...prev,
          booth_contact_name: data.booth_contact_name || '',
          booth_contact_email: data.booth_contact_email || '',
          invoice_contact_name: data.invoice_contact_name || '',
          invoice_contact_email: data.invoice_contact_email || '',
          companyName: data.company_name || '',
          website: data.website || '',        // aangepast naar website ipv linkedin
          about: data.about || '',
          profilePicture: data.logo || null,
          lookingFor: Array.isArray(data.lookingFor) ? data.lookingFor : [],
          domains: Array.isArray(data.domains) ? data.domains : [],
        }));
      })
      .catch(err => {
        console.error('Fout bij ophalen company details:', err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePicture: URL.createObjectURL(file),
      }));
    }
  };

  const handleCheckboxChange = (e, field) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = () => {
    alert('Wijzigingen bevestigd!');
    console.log(formData);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = '/login';
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
        <div className="profile-picture">
          <img
            src={formData.profilePicture || '/company-placeholder.jpg'}
            alt="Bedrijfsfoto"
            className="circle"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="upload-btn"
          />
        </div>

        <div className="profile-grid">
          {/* Rij 1 */}
          <div className="field">
            <label><strong>Bedrijfsnaam:</strong></label>
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Bedrijfsnaam"
            />
          </div>
          <div className="field">
            <label><strong>Website / LinkedIn URL:</strong></label>
            <input
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Website of LinkedIn URL"
            />
          </div>

          {/* Rij 2 */}
          <div className="field">
            <label><strong>Algemene contactpersoon naam:</strong></label>
            <input
              name="booth_contact_name"
              value={formData.booth_contact_name}
              onChange={handleChange}
              placeholder="Naam contactpersoon"
            />
          </div>
          <div className="field">
            <label><strong>Algemene contactpersoon email:</strong></label>
            <input
              name="booth_contact_email"
              type="email"
              value={formData.booth_contact_email}
              onChange={handleChange}
              placeholder="Email contactpersoon"
            />
          </div>

          {/* Rij 3 */}
          <div className="field">
            <label><strong>Facturatie contactpersoon naam:</strong></label>
            <input
              name="invoice_contact_name"
              value={formData.invoice_contact_name}
              onChange={handleChange}
              placeholder="Naam facturatiecontact"
            />
          </div>
          <div className="field">
            <label><strong>Facturatie email:</strong></label>
            <input
              name="invoice_contact_email"
              type="email"
              value={formData.invoice_contact_email}
              onChange={handleChange}
              placeholder="Email facturatie"
            />
          </div>
        </div>

        <div className="section">
          <h2>Over het bedrijf</h2>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="Beschrijf je bedrijf..."
            className="textarea"
          />
        </div>

        <div className="section">
          <h3>Wat zoekt dit bedrijf?</h3>
          <div className="checkbox-group">
            {["Jobstudent", "Connecties", "Stage", "Voltijds personeel"].map(option => (
              <label key={option}>
                <input
                  type="checkbox"
                  value={option}
                  checked={formData.lookingFor.includes(option)}
                  onChange={(e) => handleCheckboxChange(e, "lookingFor")}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>IT-domeinen</h3>
          <div className="checkbox-group">
            {["Data", "Netwerking", "AI / Robotica", "Software"].map(option => (
              <label key={option}>
                <input
                  type="checkbox"
                  value={option}
                  checked={formData.domains.includes(option)}
                  onChange={(e) => handleCheckboxChange(e, "domains")}
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <button className="confirm-btn" onClick={handleSubmit}>
          Bevestig wijzigingen
        </button>
      </main>
    </div>
  );
}
