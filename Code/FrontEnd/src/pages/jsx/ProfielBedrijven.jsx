import React, { useState, useEffect } from 'react';
import '../Css/ProfielBedrijven.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import axios from 'axios';

export default function ProfielBedrijven() {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    function: '',
    email: '',
    linkedin: '',
    about: '',
    lookingFor: [],
    domains: [],
    profilePicture: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/company-profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = res.data;
        setFormData(prev => ({
          ...prev,
          name: data.name || '',
          companyName: data.company_name || '',
          function: data.function || '',
          email: data.email || '',
          linkedin: data.linkedin_url || '',
          about: data.about || '',
          lookingFor: [
            ...(data.zoek_jobstudent ? ['Jobstudent'] : []),
            ...(data.zoek_connecties ? ['Connecties'] : []),
            ...(data.zoek_stage ? ['Stage'] : []),
            ...(data.zoek_voltijd ? ['Voltijds personeel'] : [])
          ],
          domains: [
            ...(data.domein_data ? ['Data'] : []),
            ...(data.domein_netwerking ? ['Netwerking'] : []),
            ...(data.domein_ai ? ['AI / Robotica'] : []),
            ...(data.domein_software ? ['Software'] : [])
          ],
          profilePicture: null
        }));
      } catch (err) {
        console.error('Profiel ophalen mislukt:', err);
      }
    };

    fetchProfile();
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

  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.name,
        company_name: formData.companyName,
        email: formData.email,
        linkedin: formData.linkedin,
        about: formData.about,
        lookingFor: formData.lookingFor, 
        domains: formData.domains        
      };

      await axios.put('http://localhost:5000/api/company-profile', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      alert('Profiel succesvol bijgewerkt!');
    } catch (error) {
      console.error('Update fout:', error);
      alert('Er ging iets mis bij het bijwerken.');
    }
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
          <Link to="/favorieten" className="navLink">studenten</Link>
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
            <label><strong>voornaamnaam + Achternaam:</strong></label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange}
              placeholder="name"
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
