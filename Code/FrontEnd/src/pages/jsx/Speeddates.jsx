import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import SharedFooter from '../../components/SharedFooter';
import '../Css/Speeddates.css';

const Speeddates = () => {
  // Common state
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Student-specific state
  const [allCompanies, setAllCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [reservationError, setReservationError] = useState('');

  // Company-specific state
  const [companySchedule, setCompanySchedule] = useState([]);
  const [eventConfig, setEventConfig] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!loggedInUser || !token) {
      navigate('/login');
      return;
    }

    setUser(loggedInUser);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    if (loggedInUser.role === 'student') {
      // Fetch data for student view
      axios.get('/api/reservations/companies-details')
        .then(res => {
          setAllCompanies(res.data);
          setFilteredCompanies(res.data);
          const uniqueSectors = [...new Set(res.data.map(c => c.sector).filter(Boolean))];
          setSectors(uniqueSectors);
        })
        .catch(err => console.error('Error fetching companies:', err));

      axios.get('/api/reservations/user/me')
        .then(res => setMyReservations(res.data))
        .catch(err => console.error('Error fetching reservations:', err));

    } else if (loggedInUser.role === 'bedrijf') {
      // Fetch data for company view
      axios.get('/api/reservations/company/me')
        .then(res => setCompanySchedule(res.data))
        .catch(err => console.error('Error fetching company schedule:', err));

      axios.get('/api/reservations/config')
        .then(res => setEventConfig(res.data))
        .catch(err => console.error('Error fetching event config:', err));
    }
  }, [navigate]);

  useEffect(() => {
    // Apply search query filter whenever it changes
    const searchFiltered = allCompanies.filter(company => {
      const sectorMatch = selectedSectors.length === 0 || selectedSectors.includes(company.sector);
      const searchMatch = searchQuery.trim() === '' || [company.company_name, company.about, company.sector, company.location].some(field =>
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
      selectedSectors.length === 0 || selectedSectors.includes(company.sector)
    );
    setFilteredCompanies(sectorFiltered);
    setShowFilter(false);
  };

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setReservationError('');
    // company.user_id = users.id (pour récupérer les slots)
    axios.get(`/api/reservations/companies/${company.user_id}/slots`)
      .then(res => setTimeSlots(res.data))
      .catch(err => {
        console.error(`Fout bij ophalen slots voor bedrijf ${company.user_id}:`, err);
        setTimeSlots([]);
      });
  };

  // === RÉSERVATION IMMÉDIATE AU CLIC ===
  const reserveNow = async (slot) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to make a reservation.');
      return;
    }
    try {
      await axios.post('/api/reservations/by-time', {
        company_id: selectedCompany.company_id,   // companies_details.id
        begin_tijd: slot.begin_tijd               // "HH:MM:SS"
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Marquer le slot comme pris + recharger mes réservations
      setTimeSlots(prev => prev.map(s =>
        s.begin_tijd === slot.begin_tijd ? { ...s, status: 'booked' } : s
      ));
      const { data } = await axios.get('/api/reservations/user/me');
      setMyReservations(data);
      setReservationError('');
    } catch (err) {
      setReservationError(err.response?.data?.error || 'Kon de reservatie niet bevestigen.');
    }
  };

  const handleCancelReservation = (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to cancel a reservation.');
      return;
    }
    axios.delete(`/api/reservations/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(() => {
      setMyReservations(prev => prev.filter(r => r._id !== id));
      if (selectedCompany) {
        // Optionnel: recharger les slots de cette entreprise
        handleCompanyClick(selectedCompany);
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    navigate("/");
  };

  const renderStudentView = () => (
    <>
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
            <div key={c.user_id} className="company-card" onClick={() => handleCompanyClick(c)}>
              <h3 className="company-name">{c.company_name || 'Bedrijfsnaam niet beschikbaar'}</h3>
              <p className="company-description">{c.about || 'Geen beschrijving beschikbaar'}</p>
              <div className="company-meta">
                <span>{c.sector || 'Sector niet beschikbaar'}</span>
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
            <button className="close-btn" onClick={() => { setSelectedCompany(null); setReservationError(''); }}>×</button>
            <h2>{selectedCompany.company_name}</h2>
            <div className="slot-list">
              {timeSlots.length > 0 ? timeSlots.map(slot => (
                <button
                  key={`${slot._id}-${slot.begin_tijd || slot.time}`}
                  className={`slot-button ${slot.status !== 'available' ? 'disabled' : ''}`}
                  disabled={slot.status !== 'available'}
                  onClick={() => reserveNow(slot)}   // Réservation immédiate
                >
                  {slot.time} {slot.status !== 'available' ? '(bezet)' : ''}
                </button>
              )) : (
                <p>Geen beschikbare tijdslots voor dit bedrijf.</p>
              )}
            </div>
            {reservationError && <p className="reservation-error">{reservationError}</p>}
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
              <div key={r._id} className={`reservation-card ${r.status === 'cancelled_by_admin' ? 'cancelled' : ''}`}>
                <h4>{
                  allCompanies.find(c => c.company_id === r.company_id)?.company_name || 'Onbekend bedrijf'
                }</h4>
                <p>
                  Tijd: {(r.begin_tijd || r.time || r.startTime || 'onbekend')} - {(r.eind_tijd || r.endTime || 'onbekend')}
                </p>
                {r.status === 'cancelled_by_admin' && (
                  <div className="cancellation-info">
                    <p className="status-text">Geannuleerd door organisatie</p>
                    <p className="reason-text">{r.cancellationReason}</p>
                  </div>
                )}
                <button 
                  onClick={() => handleCancelReservation(r._id)}
                  className={r.status === 'cancelled_by_admin' ? 'confirm-cancellation' : ''}
                >
                  {r.status === 'cancelled_by_admin' ? 'Ok, verwijder' : 'Annuleer'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderCompanyView = () => (
    <>
      <h1 className="speeddates-title">Overzicht Speeddates</h1>
      {eventConfig && (
        <p className="speeddates-subtitle">
          De speeddates vinden plaats van {eventConfig.start} tot {eventConfig.end}.
        </p>
      )}
      <div className="reservations-section">
        <h2 className="reservations-title">Geboekte Tijdslots</h2>
        {companySchedule.length === 0 ? (
          <p className="no-reservations">Er zijn nog geen tijdslots voor uw bedrijf gereserveerd.</p>
        ) : (
          <div className="company-schedule-list">
            {companySchedule.map(item => (
              <div key={item._id} className="schedule-item">
                <div className="schedule-time-block">
                    <span className="schedule-time">{item.startTime} - {item.endTime}</span>
                </div>
                <div className="schedule-student-details">
                    <span className="schedule-student-name">{item.studentName}</span>
                    <span className="schedule-student-major">{item.studentSchool || 'School onbekend'} - {item.studentEducation || 'Richting onbekend'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

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
        {user?.role === 'student' && renderStudentView()}
        {user?.role === 'bedrijf' && renderCompanyView()}
      </main>
      <SharedFooter />
    </div>
  );
};

export default Speeddates;
