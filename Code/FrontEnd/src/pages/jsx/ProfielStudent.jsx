import React from 'react';
import '../Css/Profielstudent';
import { Link } from 'react-router-dom';

export default function StudentProfilePage() {
  const student = {
    name: '',
    lastname: '',
    school: '',
    direction: '',
    year: '',
    linkedin: '',
    email: 'µ',
    about: '',
    lookingFor: [''],
    domains: [''],
    feedback: ''
  };

  return (
    <div className="student-profile-wrapper">
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
        <div className="profile-picture">
          <img src="/profile.jpg" alt="Profile" />
          <p>(optional)</p>
        </div>
        <p className="note">alles wat je hier invult is zichtbaar voor bedrijven die je QR-Code scannen</p>

        <div className="profile-grid">
          <div className="field">
            <label>Name</label>
            <div className="value">{student.name}</div>
          </div>
          <div className="field">
            <label>Lastname</label>
            <div className="value">{student.lastname}</div>
          </div>
          <div className="field">
            <label>School ( optional )</label>
            <div className="value">{student.school}</div>
          </div>
          <div className="field">
            <label>Richting ( optional )</label>
            <div className="value">{student.direction}</div>
          </div>
          <div className="field">
            <label>Jaar ( optional )</label>
            <div className="value">{student.year}</div>
          </div>
          <div className="full-width-field">
            <label>linkedin-url (optional)</label>
            <div className="value">{student.linkedin}</div>
          </div>
          <div className="full-width-field">
            <label>EMAIL</label>
            <div className="value">{student.email}</div>
          </div>
        </div>
      </div>

      <div className="student-info">
        <div className="section">
          <label>About</label>
          <div className="textarea">{student.about}</div>
        </div>

        <div className="section">
          <label>wat zoekt u ?</label>
          <div className="checkbox-group">
            {student.lookingFor.map((item, i) => (
              <label key={i}><input type="checkbox" checked readOnly /> {item}</label>
            ))}
          </div>
        </div>

        <div className="section">
          <label>feedback van Bedrijven</label>
          <div className="textarea">{student.feedback || '...'}</div>
        </div>

        <div className="section">
          <label>tot welke van de 4 IT domeinen behoort u?</label>
          <div className="checkbox-group">
            {student.domains.map((item, i) => (
              <label key={i}><input type="checkbox" checked readOnly /> {item}</label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}