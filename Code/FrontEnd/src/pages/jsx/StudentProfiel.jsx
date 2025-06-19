  import React, { useEffect, useState } from 'react';
  import { useParams, Link } from 'react-router-dom';
  import axios from 'axios';
  import logo from '../../assets/logo Erasmus.png';
  import '../Css/StudentProfiel.css';

  export default function StudentProfiel() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
      if (!id) {
        alert('Geen user ID opgegeven');
        setError(true);
        return;
      }

      axios.get(`http://localhost:5000/api/student_details/user/${id}`)
        .then(response => {
          
          console.log('Student data van API:', response.data);

          const raw = response.data;

          // Convert booleans to arrays
          const looking_for = [];
          if (raw.interest_jobstudent) looking_for.push('jobstudent');
          if (raw.interest_stage) looking_for.push('stage');
          if (raw.interest_job) looking_for.push('job');
          if (raw.interest_connect) looking_for.push('connect');

          const domains = [];
          if (raw.domain_data) domains.push('data');
          if (raw.domain_networking) domains.push('networking');
          if (raw.domain_ai) domains.push('ai');
          if (raw.domain_software) domains.push('software');

          setStudent({ ...raw, looking_for, domains });
        })
        .catch(err => {
          console.error(err);
          setError(true);
          alert('Fout bij ophalen van de data');
        });
    }, [id]);

    const handleLogout = () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      window.location.href = '/login';
    };

    const displayValue = (value, fallback) => {
      return error || value === undefined || value === null ? fallback : value;
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
              {student?.profile_picture ? (
                <img src={student.profile_picture} alt="Profiel" className="circle" />
              ) : (
                <div className="circle">[Foto]</div>
              )}
            </div>
            <div className="student-name-title">
              <h2>{displayValue(student?.full_name, 'Voornaam + Achternaam')}</h2>
            </div>
            <button className="like-button" title="Like ♥">♥</button>
          </div>

          <div className="profile-grid">
            <div className="field">
              <label>School:</label>
              <input type="text" readOnly value={displayValue(student?.school, 'School')} />
            </div>
            <div className="field">
              <label>Richting:</label>
              <input type="text" readOnly value={displayValue(student?.education, 'Richting')} />
            </div>
            <div className="field">
              <label>Jaar:</label>
              <input type="text" readOnly value={displayValue(student?.year, 'Jaar')} />
            </div>
            <div className="field">
              <label>Email:</label>
              <input type="text" readOnly value={displayValue(student?.email, 'Email')} />
            </div>
            <div className="field full">
              <label>LinkedIn:</label>
              <input 
                type="url" 
                readOnly 
                value={student?.linkedin_url || ''} 
                placeholder="LinkedIn URL niet ingevuld" 
              />
              {student?.linkedin_url && (
                <a href={student.linkedin_url} target="_blank" rel="noreferrer">{student.linkedin_url}</a>
              )}
            </div>

          </div>

          <div className="section">
            <h2>Over mezelf</h2>
            <p className="textarea">{displayValue(student?.about, <em>Geen informatie opgegeven</em>)}</p>
          </div>

          <div className="section">
            <h3>Wat zoek ik?</h3>
            <div className="checkbox-group">
              {student?.looking_for?.length > 0 ? (
                student.looking_for.map((item, index) => (
                  <label key={index}>
                    <input type="checkbox" checked disabled />
                    {item}
                  </label>
                ))
              ) : (
                <p><em>Geen selectie opgegeven</em></p>
              )}
            </div>
          </div>

          <div className="section">
            <h3>IT-domeinen</h3>
            <div className="checkbox-group">
              {student?.domains?.length > 0 ? (
                student.domains.map((item, index) => (
                  <label key={index}>
                    <input type="checkbox" checked disabled />
                    {item}
                  </label>
                ))
              ) : (
                <p><em>Geen selectie opgegeven</em></p>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }
