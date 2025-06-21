import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  const [timeSlots, setTimeSlots] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
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

    axios.get('/api/reservations/user/me')
      .then(res => setMyReservations(res.data))
      .catch(err => console.error('Error fetching reservations:', err));
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
    axios.get(`/api/companies/${company.id}/slots`)
      .then(res => setTimeSlots(res.data))
      .catch(err => console.error(err));
  };

  const handleReservation = (slot) => {
    axios.post('/api/reservations', {
      slotId: slot._id,
      companyId: selectedCompany.id,
    }).then(res => {
      setMyReservations(prev => [...prev, res.data]);
      setTimeSlots(prev => prev.map(s => s._id === slot._id ? { ...s, available: false } : s));
    });
  };

  const handleCancelReservation = (id) => {
    axios.delete(`/api/reservations/${id}`)
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

  const formatDateTime = (datetime) => {
    const d = new Date(datetime);
    return {
      date: d.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
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
    <div className="speeddates-container">
      <SharedHeaderIngelogd onLogout={handleLogout} />

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
    </div>
  );
};

export default Speeddates;