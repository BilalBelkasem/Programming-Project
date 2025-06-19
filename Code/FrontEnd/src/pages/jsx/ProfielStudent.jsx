import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
import '../Css/ProfielStudent.css';
import axios from 'axios';

export default function ProfielStudent({ user }) {
  const [formData, setFormData] = useState({
    name: '',
    school: '',
    direction: '',
    year: '',
    linkedin: '',
    email: '',
    about: '',
    lookingFor: [],
    domains: [],
    profilePicture: null,
  });

  useEffect(() => {
    if (user && user.id) {
      const token = localStorage.getItem('token');
      axios.get('/api/mijnprofiel', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          const data = res.data;
          const domains = [];
          if (data.domain_data) domains.push("Data");
          if (data.domain_networking) domains.push("Netwerking");
          if (data.domain_ai) domains.push("AI / Robotica");
          if (data.domain_software) domains.push("Software");

          const lookingFor = [];
          if (data.interest_jobstudent) lookingFor.push("Jobstudent");
          if (data.interest_connect) lookingFor.push("Connecties");
          if (data.interest_stage) lookingFor.push("Stage");
          if (data.interest_job) lookingFor.push("Job");

          setFormData({
            name: data.name || '',
            school: data.school || '',
            direction: data.education || '',
            year: data.year || '',
            linkedin: data.linkedin_url || '',
            email: data.email || '',
            about: data.about || '',
            lookingFor,
            domains,
            profilePicture: null,
          });
        })
        .catch(err => {
          console.error(err);
          alert('Kon profiel niet laden.');
        });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: URL.createObjectURL(file) }));
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
    if (!user || !user.id) {
      alert('Geen gebruiker ingelogd!');
      return;
    }

    const updatedData = {
      name: formData.name,
      email: formData.email,
      school: formData.school,
      direction: formData.direction,
      year: formData.year,
      about: formData.about,
      linkedin: formData.linkedin,
      lookingFor: formData.lookingFor,
      domains: formData.domains,
    };

    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/mijnprofiel', updatedData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      alert('Wijzigingen succesvol bevestigd!');
    } catch (err) {
      console.error(err);
      alert('Fout bij opslaan van profielgegevens');
    }
  };

  const handleLogout = () => {
    alert('Uitgelogd');
    localStorage.clear();
    window.location.href = '/login';
  };

  if (!user || user.role !== 'student') {
    return <p>Je bent niet ingelogd als student.</p>;
  }

  return (
    <div className="pagina-wrapper">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
          <Link to="/dashboard" className="nav-btn">Info</Link>
          <Link to="/bedrijven" className="nav-btn">Bedrijven</Link>
          <Link to="/speeddates" className="nav-btn">Speeddates</Link>
          <Link to="/plattegrond" className="nav-btn">Plattegrond</Link>
          <Link to="/favorieten" className="nav-btn">Favorieten</Link>
          <Link to="/mijn-profiel" className="nav-btn active">Mijn Profiel</Link>
        </nav>
        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="profile-picture">
            <img
              src={formData.profilePicture || '/profile.jpg'}
              alt="Profile"
              className="circle"
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="upload-btn" />
          </div>

          <div className="form-grid">
            <div className="left">
              <label>Voornaam + Achternaam</label>
              <input name="name" value={formData.name} onChange={handleChange} />

              <label>School (optioneel)</label>
              <input name="school" value={formData.school} onChange={handleChange} />

              <label>Jaar (optioneel)</label>
              <select name="year" value={formData.year} onChange={handleChange}>
                <option value="">-- selecteer --</option>
                <option value="Eerste jaar">Eerste jaar</option>
                <option value="Tweede jaar">Tweede jaar</option>
                <option value="Derde jaar">Derde jaar</option>
              </select>

              <label>LinkedIn (optioneel)</label>
              <input name="linkedin" value={formData.linkedin} onChange={handleChange} />

              <label>Email</label>
              <input name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="right">
              <label>Richting (optioneel)</label>
              <input name="direction" value={formData.direction} onChange={handleChange} />

              <label>Tot welke van de 4 IT domeinen behoort u?</label>
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

              <div className="section">
                <label>Wat zoekt u?</label>
                <div className="checkbox-group">
                  {["Jobstudent", "Connecties", "Stage", "Job"].map(option => (
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
            </div>
          </div>

          <div className="section">
            <label>About</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Schrijf iets over jezelf..."
            ></textarea>
          </div>

          <button className="confirm-btn" onClick={handleSubmit}>Bevestig wijzigingen</button>
        </div>
      </main>
    </div>
  );
}