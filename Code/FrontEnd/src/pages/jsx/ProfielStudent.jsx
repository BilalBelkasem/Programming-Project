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
    profilePicture: null,
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
  if (!user || !user.id) {
    alert('Geen gebruiker ingelogd!');
    return;
  }

  // Zorg dat je de correcte property names gebruikt
  const updatedData = {
    name: formData.name,
    email: formData.email,
    school: formData.school,
    direction: formData.direction,
    year: formData.year,
    about: formData.about,
    linkedin: formData.linkedin,
    lookingFor: formData.lookingFor,  // array, bv ["Jobstudent", "Stage"]
    domain: formData.domain,          // array, bv ["Data", "Software"]
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
