import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../Css/StudentProfiel.css';

export default function ProfielStudent() {
  // State voor student info (initieel met lege velden)
  const [student, setStudent] = useState({
    name: 'Jan Jansen', // voorbeeldnaam
    school: '',
    Richting: '',
    year: '',
    linkedin: '',
    email: '',
    about: '',
    lookingFor: [],
    domain: [],
    profilePicture: '',
  });

  // State voor fouten (validatie)
  const [errors, setErrors] = useState({});

  // Handler voor input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Simpele validatie email verplicht
    const newErrors = {};
    if (!student.email) {
      newErrors.email = 'Email is verplicht';
    } else if (!/\S+@\S+\.\S+/.test(student.email)) {
      newErrors.email = 'Ongeldig emailadres';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // stop opslaan
    }

    setErrors({});
    alert('Studentgegevens opgeslagen!');
    console.log('Opslaan:', student);
    // Hier kun je evt. een API call doen om te saven
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
        <div className="profile-row">
          <div className="profile-picture">
            {student.profilePicture ? (
              <img src={student.profilePicture} alt="Profiel" className="circle" />
            ) : (
              <div className="circle">[Foto]</div>
            )}
          </div>
          <button className="like-button" title="Like ♥">♥</button>
        </div>

        <div className="profile-grid">
          {/* Naam als read-only input */}
          <div className="field">
            <label><strong>Voornaam + Achternaam:</strong></label><br />
            <div className="readonly-input">{student.name}</div>
          </div>


          <div className="field">
            <label><strong>School:</strong></label><br />
            <input
              type="text"
              name="school"
              value={student.school}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label><strong>Richting:</strong></label><br />
            <input
              type="text"
              name="Richting"
              value={student.Richting}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label><strong>Jaar:</strong></label><br />
            <input
              type="text"
              name="year"
              value={student.year}
              onChange={handleChange}
            />
          </div>

          {/* Email verplicht veld */}
          <div className="field full">
            <label><strong>Email:</strong></label><br />
            <input
              type="email"
              name="email"
              value={student.email}
              onChange={handleChange}
              required
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          {student.linkedin && (
            <div className="field full">
              <strong>LinkedIn:</strong>{" "}
              <a href={student.linkedin} target="_blank" rel="noreferrer">{student.linkedin}</a>
            </div>
          )}
        </div>

        <div className="section">
          <h2>Over mezelf</h2>
          <textarea
            name="about"
            value={student.about}
            onChange={handleChange}
            rows={5}
            placeholder="Vertel iets over jezelf..."
          />
        </div>

        {/* ... overige secties ... */}

        <button onClick={handleSave} className="save-button">
          Opslaan
        </button>
      </main>
    </div>
  );
}
