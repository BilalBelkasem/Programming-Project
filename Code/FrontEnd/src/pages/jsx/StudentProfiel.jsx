import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logo Erasmus.png';
import '../Css/StudentProfiel.css';

export default function StudentProfiel() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!id) {
      alert('Geen user ID opgegeven');
      setError(true);
      return;
    }

    axios.get(`http://localhost:5000/api/student_details/user/${id}`)
      .then(response => {
        const raw = response.data;
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
        setError(true);
        alert('Fout bij ophalen van de data');
      });
  }, [id]);

  useEffect(() => {
    if (!id || !user || user.role !== 'bedrijf') return;
    axios.get(`http://localhost:5000/api/bedrijf-like-student/check?student_id=${id}&company_id=${user.id}`)
      .then(res => {
        if (res.data && res.data.found) {
          setLiked(true);
          setFavoriteId(res.data.favoriteId);
        } else {
          setLiked(false);
          setFavoriteId(null);
        }
      })
      .catch(() => {
        setLiked(false);
        setFavoriteId(null);
      });
  }, [id, user]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleLike = async () => {
    if (!user || user.role !== 'bedrijf') {
      alert('Alleen bedrijven kunnen studenten liken.');
      return;
    }
    if (liked) {
      await axios.delete('http://localhost:5000/api/bedrijf-like-student/unlike', {
        data: { student_id: id, company_id: user.id }
      });
      setLiked(false);
      setFavoriteId(null);
    } else {
      const res = await axios.post('http://localhost:5000/api/bedrijf-like-student/like', {
        student_id: id,
        company_id: user.id
      });
      setLiked(true);
      setFavoriteId(res.data.id);
    }
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
          {user && user.role === 'bedrijf' && (
            <button
              className="like-button"
              title="Like ♥"
              style={{ color: liked ? 'red' : undefined }}
              onClick={handleLike}
            >
              ♥
            </button>
          )}
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
