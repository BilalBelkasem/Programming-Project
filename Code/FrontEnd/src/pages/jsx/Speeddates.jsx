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
  const [availableSlots, setAvailableSlots] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch companies
    axios.get('/api/companies')
      .then(res => setCompanies(res.data))
      .catch(err => console.error(err));

    // Fetch user reservations
    axios.get('/api/reservations/user/me')
      .then(res => setMyReservations(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleNewReservationClick = (company) => {
  setSelectedCompany(company);
  axios.get(`/api/companies/${company._id}/slots`)
    .then(res => {
      const available = res.data.filter(slot => {
        // Filter out slots that are already reserved
        const isAvailable = !myReservations.some(r => r.slot._id === slot._id);
        // Filter for fixed date (March 13, 2026)
        const slotDate = new Date(slot.datetime).toISOString().split('T')[0];
        return isAvailable && slotDate === '2026-03-13';
      });
      setAvailableSlots(available);
    })
    .catch(err => console.error(err));
};

  const handleReservation = (slot) => {
    axios.post('/api/reservations', {
      slotId: slot._id,
      companyId: selectedCompany._id,
    }).then(res => {
      setMyReservations(prev => [...prev, res.data]);
      setAvailableSlots(prev => prev.filter(s => s._id !== slot._id));
    }).catch(err => {
      console.error('Error creating reservation:', err);
      alert('Er is een fout opgetreden bij het maken van de reservatie');
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

const formatDateTime = (datetime) => {
  const d = new Date(datetime);
  return {
    date: d.toLocaleDateString('nl-NL', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    }),
    time: d.getHours().toString().padStart(2, '0') + ':' + 
          d.getMinutes().toString().padStart(2, '0')
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

  // Filter companies based on search query
  const filteredCompanies = companies.filter(c =>
    [c.name, c.description, c.industry, c.location].some(field =>
      field?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="speeddates-container">
      {/* Header */}
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
          <Link to="/dashboard" className="navLink">Info</Link>
          <Link to="/bedrijven" className="navLink">Bedrijven</Link>
          <Link to="/speeddates" className="navLink">Speeddates</Link>
          <Link to="/plattegrond" className="navLink">Plattegrond</Link>
          <Link to="/UFavorietenBedrijven" className="navLink">Favorieten</Link>
          <Link to="/mijn-profiel" className="navLink">Mijn Profiel</Link>
        </nav>
        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
      </header>

      {/* Title and search */}
      <h1 className="speeddates-title">Speeddate Reservaties</h1>
      <p className="speeddates-subtitle">Reserveer je speeddate met innovatieve bedrijven</p>
      <input
        className="speeddates-search"
        type="text"
        value={searchQuery}
        placeholder="Zoek bedrijf, locatie, of industrie..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Companies grid */}
      <div className="speeddates-grid">
        {filteredCompanies.map(c => (
          <div key={c._id} className="company-card">
            <div className="company-card-header">
              <div className='company-header'>
              <h3 className="company-name">{c.name}</h3>
              <button 
                className="new-reservation-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNewReservationClick(c);
                }}
              >
                +
              </button>
              </div>
            </div>
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

      {/* Timeslot modal for new reservation */}
      {selectedCompany && (
        <div className="slot-modal">
          <div className="slot-modal-content">
            <button className="close-btn" onClick={() => setSelectedCompany(null)}>×</button>
            <h2>Reserveer bij {selectedCompany.name}</h2>
            
            {availableSlots.length > 0 ? (
              Object.entries(groupSlotsByDate(availableSlots)).map(([date, slots]) => (
                <div key={date} className="slot-group">
                  <h4 className="slot-date">{formatDateTime(slots[0].datetime).date}</h4>
                  <div className="slot-list">
                    {slots.map(slot => {
                      const { time } = formatDateTime(slot.datetime);
                      return (
                        <button
                          key={slot._id}
                          className="slot-button"
                          onClick={() => handleReservation(slot)}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-slots">Geen beschikbare slots voor dit bedrijf</p>
            )}
          </div>
        </div>
      )}

      {/* Reservations section */}
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
    </div>
  );
};

export default Speeddates;