import logo from '../../assets/logo Erasmus.png';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Css/Speeddates.css';

const Speeddates = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredCompanies = companies.filter(c =>
    [c.name, c.description, c.industry, c.location].some(field =>
      field?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDateTime = (datetime) => {
    const d = new Date(datetime);
    return {
      date: d.toLocaleDateString(),
      time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
    <div className="speeddates-container">
      <h1 className="speeddates-title">Speeddate Reservaties</h1>
      <input
        className="speeddates-search"
        type="text"
        value={searchQuery}
        placeholder="Zoek bedrijf..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="speeddates-companies">
        {filteredCompanies.map(c => (
          <div key={c._id} className="company-card" onClick={() => handleCompanyClick(c)}>
            <h3>{c.name}</h3>
            <p>{c.description}</p>
            <small>{c.industry} | {c.location}</small>
          </div>
        ))}
      </div>

      {selectedCompany && (
        <div className="slot-modal">
          <div className="slot-modal-content">
            <button className="close-btn" onClick={() => setSelectedCompany(null)}>×</button>
            <h2>{selectedCompany.name}</h2>
            {Object.entries(groupSlotsByDate(timeSlots)).map(([date, slots]) => (
              <div key={date}>
                <h4>{date}</h4>
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
        <h2>Mijn Reservaties</h2>
        {myReservations.length === 0 ? (
          <p>Je hebt nog geen reservaties.</p>
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