import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
import '../css/UBedrijven.css';
import axios from 'axios';

const TYPE_KANS = [
  { key: 'zoek_jobstudent', label: 'Jobstudent' },
  { key: 'zoek_connecties', label: 'Connecties' },
  { key: 'zoek_stage', label: 'Stage' },
  { key: 'zoek_job', label: 'Job' },
];
const IT_DOMEIN = [
  { key: 'domein_data', label: 'Data' },
  { key: 'domein_software', label: 'Software' },
  { key: 'domein_netwerking', label: 'Netwerking' },
  { key: 'domein_ai', label: 'Robotica / AI' },
];

export default function UBedrijven({ onLogout }) {
  const navigate = useNavigate();
  const [bedrijven, setBedrijven] = useState([]);
  const [favorieten, setFavorieten] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        const bedrijvenRes = await axios.get('http://localhost:5000/api/open-bedrijven');
        setBedrijven(bedrijvenRes.data);

        const favorietenRes = await axios.get(`http://localhost:5000/api/favorieten/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const geliketeIds = favorietenRes.data.map((bedrijf) => bedrijf.id);
        setFavorieten(geliketeIds);
      } catch (err) {
        console.error('Fout bij ophalen:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleFilterChange = (key) => {
    setSelectedFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  const filteredBedrijven = selectedFilters.length === 0
    ? bedrijven
    : bedrijven.filter((bedrijf) =>
        selectedFilters.some((filter) => bedrijf[filter] === 1)
      );

  const toggleLike = async (bedrijfId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    const isFavoriet = favorieten.includes(bedrijfId);

    try {
      if (isFavoriet) {
        await axios.delete(`http://localhost:5000/api/favorieten/${bedrijfId}?student_id=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorieten(prev => prev.filter(id => id !== bedrijfId));
      } else {
        await axios.post('http://localhost:5000/api/favorieten', {
          student_id: user.id,
          company_id: bedrijfId
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorieten(prev => [...prev, bedrijfId]);
      }
    } catch (err) {
      console.error('Fout bij togglen van favoriet:', err);
    }
  };

  return (
    <div className="pagina-wrapper">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
          <Link to="/dashboard" className="nav-btn">Info</Link>
          <Link to="/bedrijven" className="nav-btn active">Bedrijven</Link>
          <Link to="/speeddates" className="nav-btn">Speeddates</Link>
          <Link to="/plattegrond" className="nav-btn">Plattegrond</Link>
          <Link to="/favorieten" className="nav-btn">Favorieten</Link>
          <Link to="/mijn-profiel" className="nav-btn">Mijn Profiel</Link>
        </nav>
        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
      </header>

      <main className="main-content">
        <h2 className="title">Ontdek bedrijven</h2>

        <div className="filter-wrapper" ref={dropdownRef}>
          <button className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
            Filter <span>{dropdownOpen ? '▲' : '▼'}</span>
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-group">
                <div className="group-title">Type Kans</div>
                {TYPE_KANS.map((opt) => (
                  <label key={opt.key} className="filter-label">
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(opt.key)}
                      onChange={() => handleFilterChange(opt.key)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              <div className="dropdown-group">
                <div className="group-title">IT Domein</div>
                {IT_DOMEIN.map((opt) => (
                  <label key={opt.key} className="filter-label">
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(opt.key)}
                      onChange={() => handleFilterChange(opt.key)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bedrijvenContainer">
          {filteredBedrijven.length === 0 ? (
            <p className="no-bedrijven">Geen bedrijven gevonden...</p>
          ) : (
            filteredBedrijven.map((bedrijf) => (
              <div
                key={bedrijf.id}
                className="bedrijfCard"
                onClick={() => navigate(`/bedrijfprofiel/${bedrijf.user_id}`)}
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <h3 className="bedrijfNaam">{bedrijf.company_name}</h3>
                <p className="bedrijfBeschrijving">{bedrijf.sector}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Zorgt ervoor dat klik op hartje NIET navigeert
                    toggleLike(bedrijf.id);
                  }}
                  className={`likeButton ${favorieten.includes(bedrijf.id) ? 'liked' : ''}`}
                  style={{ position: 'absolute', top: '10px', right: '10px' }}
                >
                  ♥
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
