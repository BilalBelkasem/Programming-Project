import React, { useState } from 'react';
import '../Css/ProfielBedrijven.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';

export default function ProfielBedrijven() {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    companyName: '',
    function: '',
    email: '',
    linkedin: '',
    about: '',
    lookingFor: [],
    domains: [],
    profilePicture: null,
  });

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
          <Link to="/bedrijven" className="navLink">Bedrijven</Link>
          <Link to="/plattegrond" className="navLink">Plattegrond</Link>
          <Link to="/favorieten" className="navLink">Favorieten</Link>
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
          <div className="field">
            <label><strong>Voornaam:</strong></label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder="Voornaam"
            />
          </div>
          <div className="field">
            <label><strong>Achternaam:</strong></label>
            <input 
              name="lastname" 
              value={formData.lastname} 
              onChange={handleChange}
              placeholder="Achternaam"
            />
          </div>
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
            <label><strong>Functie:</strong></label>
            <input 
              name="function" 
              value={formData.function} 
              onChange={handleChange}
              placeholder="Functie"
            />
          </div>
          <div className="field full">
            <label><strong>E-mail:</strong></label>
            <input 
              name="email" 
              type="email"
              value={formData.email} 
              onChange={handleChange}
              placeholder="E-mail adres"
            />
          </div>
          <div className="field full">
            <label><strong>LinkedIn (optioneel):</strong></label>
            <input 
              name="linkedin" 
              value={formData.linkedin} 
              onChange={handleChange}
              placeholder="LinkedIn profiel URL"
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