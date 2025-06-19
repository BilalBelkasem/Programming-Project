import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
import '../Css/Speeddates.css';

const Speeddates = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/companies')
      .then(res => setCompanies(res.data))
      .catch(err => console.error(err));

    axios.get('/api/reservations/user/me')
      .then(res => setMyReservations(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    axios.get(`/api/companies/${company._id}/slots`)
      .then(res => setTimeSlots(res.data))
      .catch(err => console.error(err));
  };

  const handleReservation = (slot) => {
    axios.post('/api/reservations', {
      slotId: slot._id,
      companyId: selectedCompany._id,
    }).then(res => {
      setMyReservations(prev => [...prev, res.data]);
      setTimeSlots(prev => prev.map(s => s._id === slot._id ? { ...s, available: false } : s));
    });
  };

  const handleCancelReservation = (id) => {
    axios.delete(`/api/reservations/${id}`)
      .then(() => setMyReservations(prev => prev.filter(r => r._id !== id)));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const filteredCompanies = companies.filter(c =>
    [c.name, c.description, c.industry, c.location].some(field =>
      field?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDateTime = (datetime) => {
    const d = new Date(datetime);
    return {
      date: d.toLocaleDateString('nl-NL', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
      }),
      time: d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const groupSlotsByDate = (slots) => {
    return slots.reduce((acc, slot) => {
      const key = new Date(slot.datetime).toDateString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(slot);
      return acc;
    }, {});
  };

  return (
    <div className="pagina-wrapper">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
          <Link to="/dashboard" className="nav-btn">Info</Link>
          <Link to="/bedrijven" className="nav-btn">Bedrijven</Link>
          <Link to="/speeddates" className="nav-btn active">Speeddates</Link>
          <Link to="/plattegrond" className="nav-btn">Plattegrond</Link>
          <Link to="/favorieten" className="nav-btn">Favorieten</Link>
          <Link to="/mijn-profiel" className="nav-btn">Mijn Profiel</Link>
        </nav>
        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
      </header>

      <main className="main-content">
        <h1 className="speeddates-title">Speeddate Reservaties</h1>
        <p className="speeddates-subtitle">Reserveer je speeddate met innovatieve bedrijven</p>
        <input
          className="speeddates-search"
          type="text"
          value={searchQuery}
          placeholder="Zoek bedrijf, locatie, of industrie..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="speeddates-grid">
          {filteredCompanies.map(c => (
            <div key={c._id} className="company-card" onClick={() => handleCompanyClick(c)}>
              <h3 className="company-name">{c.name}</h3>
              <p className="company-description">{c.description}</p>
              <div className="company-meta">
                <span>{c.industry}</span>
                <span>{c.location}</span>
                <span>{c.contact}</span>
              </div>
              <span className="session-badge">5 min sessies</span>
            </div>
          ))}
        </div>

        {selectedCompany && (
          <div className="slot-modal">
            <div className="slot-modal-content">
              <button className="close-btn" onClick={() => setSelectedCompany(null)}>×</button>
              <h2>{selectedCompany.name}</h2>
              {Object.entries(groupSlotsByDate(timeSlots)).map(([date, slots]) => (
                <div key={date} className="slot-group">
                  <h4 className="slot-date">{formatDateTime(slots[0].datetime).date}</h4>
                  <div className="slot-list">
                    {slots.map(slot => {
                      const { time } = formatDateTime(slot.datetime);
                      return (
                        <button
                          key={slot._id}
                          disabled={!slot.available}
                          className={`slot-button ${slot.available ? '' : 'disabled'}`}
                          onClick={() => handleReservation(slot)}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="reservations-section">
          <div className="reservations-header">
            <h2 className="reservations-title">📅 Mijn Reservaties</h2>
            <button className="mini-refresh-btn" onClick={() => window.location.reload()}>↻</button>
          </div>

          {myReservations.length === 0 ? (
            <p className="no-reservations">Je hebt nog geen reservaties gemaakt.</p>
          ) : (
            <div className="reservations-list">
              {myReservations.map(r => {
                const { date, time } = formatDateTime(r.slot.datetime);
                return (
                  <div key={r._id} className="reservation-card">
                    <h4>{r.company.name}</h4>
                    <p>{date} om {time}</p>
                    <button onClick={() => handleCancelReservation(r._id)}>Annuleren</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Speeddates;
