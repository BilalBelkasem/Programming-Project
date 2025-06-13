import React from 'react';
import '../Css/StudentProfiel.css';
import { Link } from 'react-router-dom';

export default function StudentProfilePage() {
  const student = {
    name: 'Marwan',
    lastname: 'Amakran',
    school: '',
    direction: '',
    year: '',
    linkedin: '',
    email: 'Marwan.Amakran@student.ehb.Be',
    about: 'Ik ben Marwan, een eerste jaar student in toegepaste informatica. student in programmeren.',
    lookingFor: ['Webontwikkeling', 'Cybersecurity', 'Data-analyse'],
    domains: [],
    feedback: ''
  };

  return (
    <div className="student-profile-wrapper">
      <nav className="navbar">
        <img src="/logo.png" alt="Erasmus Logo" className="logo" />
        <ul className="nav-links">
          <li><Link to="/">info</Link></li>
          <li><Link to="/Gbedrijveninfo">bedrijven</Link></li>
          <li><Link to="/g-plattegrond">plattegrond</Link></li>
          <li><Link to="/favorieten">Favorieten</Link></li>
          <li><Link to="/profiel">Mijn profiel</Link></li>
        </ul>
        <div className="logout-icon">⇨</div>
      </nav>

      <div className="student-profile-grid">
        {/* Linkerkolom */}
        <div className="profile-left">
          <div className="profile-picture">
            <img src="/profile.jpg" alt="Profile" />
            <p className="note">#OPENTOWORK</p>
          </div>

          <div className="field">
            <label>Name</label>
            <div className="value">{student.name}</div>
          </div>

          <div className="field">
            <label>Lastname</label>
            <div className="value">{student.lastname}</div>
          </div>

          <div className="field">
            <label>School</label>
            <div className="value">{student.school}</div>
          </div>

          <div className="field">
            <label>Schooljaar</label>
            <div className="value">{student.year}</div>
          </div>

          <div className="field">
            <label>Richting</label>
            <div className="value">{student.direction}</div>
          </div>
        </div>

        {/* Rechterkolom */}
        <div className="profile-right">
          <div className="field">
            <label>LinkedIn-url (optional)</label>
            <div className="value">{student.linkedin}</div>
          </div>

          <div className="field">
            <label>EMAIL</label>
            <div className="value">{student.email}</div>
          </div>

          <div className="section">
            <label>About</label>
            <div className="textarea">{student.about}</div>
          </div>

          <div className="section">
            <label>Interesses</label>
            <ul className="checkbox-group">
              {student.lookingFor.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}