import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import '../Css/ProfielStudent.css';

export default function ProfielStudent() {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    school: '',
    direction: '',
    year: '',
    linkedin: '',
    email: '',
    about: '',
    lookingFor: '',
    domain: '',
    profilePicture: null
  });

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

  const handleSubmit = () => {
    alert('Wijzigingen bevestigd!');
    // Hier zou je eventueel een API-call doen naar een backend.
  };

  return (
    <div className="student-profile">
      <nav className="navbar">
        <img src="/logo.png" alt="Erasmus Logo" className="logo" />
        <ul className="nav-links">
          <li>info</li>
          <li>bedrijven</li>
          <li>plattegrond</li>
          <li>Mijn profiel</li>
        </ul>
      </nav>

      <div className="container">
        <div className="profile-picture">
          <img
            src={formData.profilePicture || '/profile.jpg'}
            alt="Profile"
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <p>(optioneel)</p>
        </div>

        <p className="note">alles wat je hier invult is zichtbaar voor bedrijven die je QR Code scannen</p>

        <div className="form-grid">
          <div className="left">
            <label>Naam</label>
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
            <label>Achternaam</label>
            <input name="lastname" value={formData.lastname} onChange={handleChange} />

            <label>Richting (optioneel)</label>
            <select name="direction" value={formData.direction} onChange={handleChange}>
              <option value="">-- selecteer --</option>
              <option value="Toegepaste Informatica">Toegepaste Informatica</option>
              <option value="Bedrijf & Management">Bedrijf & Management</option>
              <option value="Media">Media</option>
            </select>

            <label>Tot welke van de 4 IT domeinen behoort u?</label>
            <select name="domain" value={formData.domain} onChange={handleChange}>
              <option value="">-- selecteer --</option>
              <option value="data">Data</option>
              <option value="netwerking">Netwerking</option>
              <option value="ai">AI / Robotica</option>
              <option value="software">Software</option>
            </select>
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

        <div className="section">
          <label>Wat zoekt u?</label>
          <select name="lookingFor" value={formData.lookingFor} onChange={handleChange}>
            <option value="">-- selecteer --</option>
            <option value="jobstudent">Jobstudent</option>
            <option value="connecties">Connecties</option>
            <option value="stage">Stage</option>
            <option value="job">Job</option>
          </select>
        </div>

        <button className="confirm-btn" onClick={handleSubmit}>Bevestig wijzigingen</button>
      </div>
    </div>
  );
}