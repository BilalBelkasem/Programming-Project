import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../Css/Speeddates.css';

const CompanySpeeddates = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

  // Haal gebruikersinfo op uit token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserInfo(payload);
      } catch (e) {
        console.error('Token decode error:', e);
        handleLogout();
      }
    }
  }, []);

  // Haal tijdsloten op
const fetchCompanySlots = async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/company/speeddates', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    setTimeSlots(response.data);
  } catch (error) {
    console.error('Full error response:', error.response); // Log entire response
    setError(
      error.response?.data?.error || 
      error.response?.data?.message || 
      'Server error - check console for details'
    );
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    if (userInfo) {
      fetchCompanySlots();
    }
  }, [userInfo]);

  const generateTimeSlots = async () => {
    if (!startTime || !endTime) {
      alert('Vul zowel start- als eindtijd in');
      return;
    }

    setIsGenerating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/company/speeddates', 
        { startTime, endTime },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      await fetchCompanySlots();
    } catch (error) {
      console.error('Error creating slots:', error);
      setError(error.response?.data?.error || 'Fout bij aanmaken tijdsloten');
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteSlot = async (slotId) => {
    if (!window.confirm('Weet u zeker dat u dit tijdslot wilt verwijderen?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/company/speeddates/${slotId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await fetchCompanySlots();
    } catch (error) {
      console.error('Error deleting slot:', error);
      setError('Fout bij verwijderen tijdslot');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!localStorage.getItem('token')) {
    return <div className="error">Niet ingelogd - wordt doorgestuurd...</div>;
  }

  if (isLoading) return <div className="loading">Laden...</div>;

  return (
    <div className="speeddates-container">
      {/* Header */}
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
          <Link to="/dashboard" className="navLink">Info</Link>
          <Link to="/bedrijven" className="navLink">Bedrijven</Link>
          <Link to="/bedrijf/speeddates" className="navLink active">Mijn Speeddates</Link>
          <Link to="/plattegrond" className="navLink">Plattegrond</Link>
          <Link to="/mijn-profiel" className="navLink">Mijn Profiel</Link>
        </nav>
        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
      </header>

      <main className="company-speeddates-content">
        <h1 className="speeddates-title">Mijn Speeddate Tijdsloten</h1>
        
        {error && <div className="error-message">{error}</div>}

        {/* Tijdslot generator */}
        <section className="timeslot-generator">
          <h2>Nieuwe tijdsloten aanmaken</h2>
          <div className="time-inputs">
            <div className="form-group">
              <label>Starttijd:</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="time-input-24h"
              />
            </div>
            <div className="form-group">
              <label>Eindtijd:</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="time-input-24h"
              />
            </div>
          </div>
          <button 
            onClick={generateTimeSlots}
            disabled={isGenerating}
            className="generate-btn"
          >
            {isGenerating ? 'Bezig...' : 'Genereer tijdsloten'}
          </button>
        </section>

        {/* Tijdsloten overzicht */}
        <section className="slots-section">
          <h2>Mijn tijdsloten (13 maart 2026)</h2>
          
          {timeSlots.length > 0 ? (
            <div className="slots-list">
              {timeSlots.map(slot => (
                <div key={slot.id} className={`slot-item ${slot.available ? '' : 'booked'}`}>
                  <span className="slot-time">
                    {slot.start_time} - {slot.end_time}
                  </span>
                  {slot.available ? (
                    <button 
                      onClick={() => deleteSlot(slot.id)}
                      className="delete-btn"
                    >
                      Verwijderen
                    </button>
                  ) : (
                    <span className="booked-label">Gereserveerd</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-slots">Geen tijdsloten gevonden</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default CompanySpeeddates;