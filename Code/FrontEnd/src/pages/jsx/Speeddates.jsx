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
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      try {
        // Fetch companies data
        const companiesRes = await axios.get(`${API_BASE_URL}/bedrijven`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setCompanies(companiesRes.data);

        // Fetch user's reservations
        const reservationsRes = await axios.get(`${API_BASE_URL}/reservations/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setMyReservations(reservationsRes.data);

      } catch (err) {
        console.error('Error:', err);
        setError(err.response?.data?.message || 'Failed to load data');
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate, API_BASE_URL]);

  const fetchAvailableSlots = async (companyId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/company/speeddates/companies/${companyId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      // Filter only available slots
      const available = response.data.filter(slot => slot.available);
      setAvailableSlots(available);
    } catch (err) {
      console.error('Error fetching available slots:', err);
      setAvailableSlots([]);
      setError('Failed to load available time slots');
    }
  };

  const handleNewReservationClick = async (company) => {
    setSelectedCompany(company);
    await fetchAvailableSlots(company.id);
  };

  const handleReservation = async (slot) => {
    if (!selectedCompany) return;

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/reservations`,
        { slot_id: slot.id },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      // Update local state
      setMyReservations(prev => [...prev, response.data]);
      setAvailableSlots(prev => prev.filter(s => s.id !== slot.id));
      setSelectedCompany(null);
    } catch (err) {
      console.error('Error making reservation:', err);
      setError(err.response?.data?.message || 'Failed to make reservation');
    }
  };

  const handleCancelReservation = async (reservationId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_BASE_URL}/reservations/${reservationId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Update local state
      setMyReservations(prev => prev.filter(r => r.id !== reservationId));
    } catch (err) {
      console.error('Error canceling reservation:', err);
      setError(err.response?.data?.message || 'Failed to cancel reservation');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const formatTimeDisplay = (time) => {
    return time; // Already in HH:mm format
  };

  const filteredCompanies = companies.filter(c =>
    [c.company_name, c.description, c.sector, c.city].some(field =>
      field?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

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

      {/* Main content */}
      <h1 className="speeddates-title">Speeddate Reservaties</h1>
      <p className="speeddates-subtitle">Reserveer je speeddate met innovatieve bedrijven</p>

      {error && <div className="error-message">{error}</div>}

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
                <h3 className="company-name">{c.company_name}</h3>
                <button
                  className="new-reservation-btn"
                  onClick={() => handleNewReservationClick(c)}
                >
                  +
                </button>
              </div>
            </div>
            <p className="company-description">{c.description}</p>
            <div className="company-meta">
              <span>{c.sector}</span>
              <span>{c.city}</span>
            </div>
            <span className="session-badge">5 min sessies</span>
          </div>
        ))}
      </div>

      {/* Timeslot modal */}
      {selectedCompany && (
        <div className="slot-modal">
          <div className="slot-modal-content">
            <button className="close-btn" onClick={() => setSelectedCompany(null)}>×</button>
            <h2>Reserveer bij {selectedCompany.company_name}</h2>

            {availableSlots.length > 0 ? (
              <div className="slot-list">
                {availableSlots.map(slot => (
                  <button
                    key={slot.id}
                    className="slot-button"
                    onClick={() => handleReservation(slot)}
                  >
                    {formatTimeDisplay(slot.start_time)} - {formatTimeDisplay(slot.end_time)}
                  </button>
                ))}
              </div>
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
          <button
            className="mini-refresh-btn"
            onClick={() => window.location.reload()}
          >
            ↻
          </button>
        </div>

        {myReservations.length === 0 ? (
          <p className="no-reservations">Je hebt nog geen reservaties gemaakt.</p>
        ) : (
          <div className="reservations-list">
            {myReservations.map(r => (
              <div key={r.id} className="reservation-card">
                <h4>{r.company_name || r.company?.company_name}</h4>
                <p>13 maart 2026 om {formatTimeDisplay(r.start_time || r.slot?.start_time)}</p>
                <button onClick={() => handleCancelReservation(r.id)}>
                  Annuleren
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Speeddates;