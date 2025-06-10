import React from 'react';
import '../Css/Profielstudent';
import IngelogdHeader from '../../components/SharedHeaderIngelogd';


export default function StudentProfilePage() {
  const student = {
    name: 'Marwan',
    lastname: 'Amakran',
    school: '',
    direction: 'Toegepaste informatica',
    year: 'Eerste jaar',
    linkedin: '',
    email: 'Marwan.Amakran@student.ehb.Be',
    about: 'Ik ben Marwan, een eerste jaar student in toegepaste informatica. Ik ben een geïnteresseerd student in programmeren.',
    lookingFor: ['jobstudent', 'connecties', 'stage', 'job'],
    domains: ['Data', 'software', 'netwerking', 'robotica / AI'],
    feedback: ''
  };

  return (
    <div className="student-profile-wrapper">

      <IngelogdHeader/>

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