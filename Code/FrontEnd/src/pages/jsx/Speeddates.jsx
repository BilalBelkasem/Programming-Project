import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../Css/Speeddates.css';

const Speeddates = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [myReservations, setMyReservations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');

        // Get available slots from backend API
        const slotsRes = await axios.get(`${API_BASE_URL}/speeddates`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // Extract companies from slots data
        const companies = slotsRes.data.reduce((acc, slot) => {
          if (!acc.some(c => c.id === slot.company_id)) {
            acc.push({
              id: slot.company_id,
              name: slot.company_name,
              description: slot.sector,
              industry: slot.sector,
              location: ''
            });
          }
          return acc;
        }, []);

        setCompanies(companies);
        setAvailableSlots(slotsRes.data);

        // Get user's reservations
        const reservationsRes = await axios.get(`${API_BASE_URL}/reservations/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setMyReservations(reservationsRes.data);

      } catch (err) {
        console.error('Initial load error:', err);
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [navigate]);

  const handleNewReservationClick = (company) => {
    const companyId = company.id || company._id || company.user_id;
    if (!companyId) {
      console.error('Invalid company object:', company);
      alert('Cannot load slots - missing company ID');
      return;
    }

    setSelectedCompany(company);
    axios.get('/timeslots')
      .then(res => {
        const available = res.data.filter(slot => {
          const isAvailable = !myReservations.some(r =>
            (r.slot?.id === slot.id) || (r.slot?._id === slot._id)
          );
          const slotDate = new Date(slot.datetime).toISOString().split('T')[0];
          return isAvailable && slotDate === '2026-03-13';
        });
        setAvailableSlots(available);
      })
      .catch(err => {
        console.error('Error fetching slots:', err);
        alert('Error loading available time slots');
      });
  };

  // For creating reservations
  const handleReservation = async (slot) => {
    try {
      const res = await axios.post('/api/reservations', {
        slotId: slot.id,
        companyId: selectedCompany.id // Add company ID
      });

      setMyReservations(prev => [...prev, {
        id: res.data.id,
        slot: {  // Changed from slot_id to match your formatDateTime usage
          id: slot.id,
          datetime: slot.datetime,
          start_time: slot.start_time,
          end_time: slot.end_time
        },
        company: selectedCompany // Use the full company object
      }]);
    } catch (err) {
      console.error('Error creating reservation:', err);
      alert(err.response?.data?.error || 'Reservation failed');
    }
  };

  const handleCancelReservation = async (id) => {
    try {
      await axios.delete(`/api/reservations/${id}`);
      setMyReservations(prev => prev.filter(r => r.id !== id));

      // Refresh slots if modal is open
      if (selectedCompany) {
        const companyId = selectedCompany.id;
        const res = await axios.get(`/api/companies/${companyId}/speeddates`)
        setAvailableSlots(res.data);
      }
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      alert('Annuleren mislukt');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const formatDateTime = (datetime) => {
    // If datetime is already in "HH:mm" format (from backend)
    if (typeof datetime === 'string' && datetime.match(/^\d{2}:\d{2}$/)) {
      return {
        time: datetime,
        date: '13 maart 2026' // Hardcoded date
      };
    }

    // If it's a Date object
    const d = new Date(datetime);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');

    return {
      date: '13 maart 2026', // Hardcoded date
      time: `${hours}:${minutes}`
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
          <div key={c.id} className="company-card">
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