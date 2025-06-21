import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import SharedHeaderIngelogd from '../../components/SharedHeaderIngelogd';
import '../Css/Speeddates.css';

const Speeddates = () => {
  const [allCompanies, setAllCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [reservationError, setReservationError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/companies')
      .then(res => {
        setAllCompanies(res.data);
        setFilteredCompanies(res.data);
      })
      .catch(err => console.error('Error fetching companies:', err));

    axios.get('/api/companies/sectors')
      .then(res => setSectors(res.data))
      .catch(err => console.error('Error fetching sectors:', err));

    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/reservations/user/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => setMyReservations(res.data))
      .catch(err => console.error('Error fetching reservations:', err));
    }
  }, []);

  useEffect(() => {
    // Apply search query filter whenever it changes
    const searchFiltered = allCompanies.filter(company => {
      const sectorMatch = selectedSectors.length === 0 || selectedSectors.includes(company.industry);
      const searchMatch = [company.name, company.description, company.industry, company.location].some(field =>
        field && typeof field === 'string' && field.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return sectorMatch && searchMatch;
    });
    setFilteredCompanies(searchFiltered);
  }, [searchQuery, allCompanies, selectedSectors]);

  const handleSectorChange = (sector) => {
    setSelectedSectors(prev =>
      prev.includes(sector)
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    );
  };

  const applySectorFilter = () => {
    const sectorFiltered = allCompanies.filter(company =>
      selectedSectors.length === 0 || selectedSectors.includes(company.industry)
    );
    setFilteredCompanies(sectorFiltered);
    setShowFilter(false);
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setSelectedSlot(null);
    setReservationError('');
    axios.get(`/api/companies/${company.id}/slots`)
      .then(res => setTimeSlots(res.data))
      .catch(err => console.error(err));
  };

  const handleConfirmReservation = () => {
    if (!selectedSlot) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (!user || !token) {
      alert('You must be logged in to make a reservation.');
      return;
    }

    axios.post('/api/reservations', {
      slotId: selectedSlot._id,
      companyId: selectedCompany.id,
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(res => {
      setMyReservations(prev => [...prev, res.data]);
      setTimeSlots(prev => prev.map(s => 
        s._id === selectedSlot._id ? { ...s, available: false } : s
      ));
      setSelectedCompany(null);
      setSelectedSlot(null);
      setReservationError('');
    }).catch(err => {
      if (err.response && err.response.status === 409) {
        setReservationError(err.response.data.error);
      } else {
        alert(err.response?.data?.error || 'Kon de reservatie niet bevestigen.');
      }
    });
  };

  const handleCancelReservation = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to cancel a reservation.');
      return;
    }
    axios.delete(`/api/reservations/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setMyReservations(prev => prev.filter(r => r._id !== id));
        if (selectedCompany) {
          const canceledReservation = myReservations.find(r => r._id === id);
          if (canceledReservation && canceledReservation.company._id === selectedCompany.id) {
            handleCompanyClick(selectedCompany);
          }
        }
      });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="pageWrapper">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
            <Link to="/dashboard" className="nav-btn">Info</Link>
            <Link to="/bedrijven" className="nav-btn">Bedrijven</Link>
            <Link to="/speeddates" className="nav-btn active">Speeddates</Link>
            <Link to="/plattegrond" className="nav-btn">Plattegrond</Link>
            <Link to="/favorieten" className="nav-btn">Favorieten</Link>
            <Link to="/profiel-bedrijf" className="nav-btn">Mijn profiel</Link>
        </nav>
        <div className="logoutIcon" title="Uitloggen" onClick={handleLogout}>⇦</div>
      </header>

      <main className="main">
        <h1 className="speeddates-title">Speeddate Reservaties</h1>
        <p className="speeddates-subtitle">Reserveer je speeddate met innovatieve bedrijven</p>
        
        <div className="search-and-filter-container">
          <input
            className="speeddates-search"
            type="text"
            value={searchQuery}
            placeholder="Zoek bedrijf, locatie, of industrie..."
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="filter-btn" onClick={() => setShowFilter(!showFilter)}>Filter</button>
        </div>

        {showFilter && (
          <div className="filter-modal">
              <div className="filter-modal-content">
                  <h3>Filter op Sector</h3>
                  <div className="sector-list">
                      {sectors.map(sector => (
                          <div key={sector} className="sector-checkbox">
                              <input
                                  type="checkbox"
                                  id={sector}
                                  value={sector}
                                  checked={selectedSectors.includes(sector)}
                                  onChange={() => handleSectorChange(sector)}
                              />
                              <label htmlFor={sector}>{sector}</label>
                          </div>
                      ))}
                  </div>
                  <button onClick={applySectorFilter}>Toepassen</button>
                  <button onClick={() => setShowFilter(false)}>Sluiten</button>
              </div>
          </div>
        )}

        <div className="speeddates-grid">
          {filteredCompanies.length === 0 ? (
            <div className="no-companies-message">
              {selectedSectors.length > 0 ? (
                <p>Geen bedrijven gevonden voor {selectedSectors.length === 1 ? selectedSectors[0] : selectedSectors.join(', ')}</p>
              ) : (
                <p>Geen bedrijven gevonden die overeenkomen met je zoekopdracht.</p>
              )}
            </div>
          ) : (
            filteredCompanies.map(c => (
              <div key={c.id} className="company-card" onClick={() => handleCompanyClick(c)}>
                <h3 className="company-name">{c.name || 'Bedrijfsnaam niet beschikbaar'}</h3>
                <p className="company-description">{c.description || 'Geen beschrijving beschikbaar'}</p>
                <div className="company-meta">
                  <span>{c.industry || 'Sector niet beschikbaar'}</span>
                  <span>{c.location || 'Locatie niet beschikbaar'}</span>
                </div>
                <span className="session-badge">5 min sessies</span>
              </div>
            ))
          )}
        </div>

        {selectedCompany && (
          <div className="slot-modal">
            <div className="slot-modal-content">
              <button className="close-btn" onClick={() => { setSelectedCompany(null); setSelectedSlot(null); setReservationError(''); }}>×</button>
              <h2>{selectedCompany.name}</h2>
              <div className="slot-list">
                {timeSlots.length > 0 ? timeSlots.map(slot => (
                  <button
                    key={slot._id}
                    className={`slot-button ${selectedSlot?._id === slot._id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedSlot(slot);
                      setReservationError('');
                    }}
                  >
                    {slot.time}
                  </button>
                )) : (
                  <p>Geen beschikbare tijdslots voor dit bedrijf.</p>
                )}
              </div>
              {reservationError && <p className="reservation-error">{reservationError}</p>}
              <button 
                className="confirm-btn"
                onClick={handleConfirmReservation}
                disabled={!selectedSlot}
              >
                Bevestig Reservatie
              </button>
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
              {myReservations.map(r => (
                <div key={r._id} className="reservation-card">
                  <h4>{r.company.name}</h4>
                  <p>Tijd: {r.time}</p>
                  <button onClick={() => handleCancelReservation(r._id)}>Annuleren</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Speeddates;