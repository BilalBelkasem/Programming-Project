import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
import '../Css/ProfielStudent.css';

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
    domain: [],
  });

  useEffect(() => {
    if (user && user.id) {
      fetch(`/api/mijnprofiel/${user.id}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch profile');
          return res.json();
        })
        .then(data => {
          setFormData({
            name: data.name || '',
            school: data.school || '',
            direction: data.education || '',
            year: data.year || '',
            linkedin: data.linkedin_url || '',
            email: data.email || '',
            about: data.about || '',
            lookingFor: data.lookingFor || [],
            domain: data.domain || [],
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
      domain: formData.domain,
    };

    try {
      const res = await fetch(`/api/mijnprofiel/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server response:", errorText);
        throw new Error('Update mislukt');
      }

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
    <div className="page-wrapper">
      <header className="header">
        <div className="header-section left">
          <img src={logo} alt="Erasmus Logo" className="logo" />
        </div>

        <div className="header-section center">
          <nav className="nav-center">
            <Link to="/dashboard" className="nav-btn">Info</Link>
            <Link to="/bedrijven" className="nav-btn">Bedrijven</Link>
            <Link to="/plattegrond" className="nav-btn">Plattegrond</Link>
            <Link to="/favorieten" className="nav-btn">Favorieten</Link>
            <Link to="/mijn-profiel" className="nav-btn active">Mijn profiel</Link>
          </nav>
        </div>

        <div className="header-section right">
          <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
        </div>
      </header>

      <div className="container">
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
                    checked={formData.domain.includes(option)}
                    onChange={(e) => handleCheckboxChange(e, "domain")}
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
    </div>
  );
}
