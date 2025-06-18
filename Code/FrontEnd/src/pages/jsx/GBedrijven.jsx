import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
import '../css/Gbedrijveninfopagina.css';
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

export default function GBedrijven({ onLogout }) {
  const navigate = useNavigate();
  const [bedrijven, setBedrijven] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/open-bedrijven');
        setBedrijven(res.data);
      } catch (err) {
        console.error('Fout bij ophalen bedrijven:', err);
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
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleFilterChange = (key) => {
    setSelectedFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const filteredBedrijven = selectedFilters.length === 0
    ? bedrijven
    : bedrijven.filter((bedrijf) =>
        selectedFilters.some((filter) => bedrijf[filter] === 1)
      );

  return (
    <div className="pagina-wrapper">
      <header className="header">
        <div className="header-section left">
          <img src={logo} alt="Erasmus Logo" className="logo" />
        </div>
        <div className="header-section center">
          <nav className="nav-center">
            <Link to="/" className="nav-btn">info</Link>
            <Link to="/GBedrijven" className="nav-btn active">bedrijven</Link>
            <Link to="/g-plattegrond" className="nav-btn">plattegrond</Link>
            <Link to="/login" className="nav-btn">login/registeren</Link>
          </nav>
        </div>
        <div className="header-section right"></div>
      </header>

      <main className="main-content">
        <h2 className="page-title">Ontdek bedrijven</h2>
        <div className="custom-dropdown-filter" ref={dropdownRef} style={{ position: 'relative', marginBottom: 24 }}>
          <button
            className="dropdown-toggle"
            onClick={() => setDropdownOpen((open) => !open)}
            style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid #bbb', background: '#eee', fontWeight: 'bold', fontSize: 18, minWidth: 160, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 220 }}
          >
            Filter
            <span style={{ marginLeft: 8 }}>{dropdownOpen ? '\u25B2' : '\u25BC'}</span>
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu" style={{ position: 'absolute', top: 48, left: 0, background: '#ddd', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 18, zIndex: 10, minWidth: 220 }}>
              <div style={{ marginBottom: 10, fontWeight: 'bold', fontSize: 15 }}>Type Kans</div>
              {TYPE_KANS.map((opt) => (
                <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(opt.key)}
                    onChange={() => handleFilterChange(opt.key)}
                  />
                  {opt.label}
                </label>
              ))}
              <div style={{ margin: '12px 0 6px 0', fontWeight: 'bold', fontSize: 15 }}>IT Domein</div>
              {IT_DOMEIN.map((opt) => (
                <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(opt.key)}
                    onChange={() => handleFilterChange(opt.key)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="bedrijvenContainer">
          {filteredBedrijven.length === 0 ? (
            <p style={{ color: 'gray' }}>Geen bedrijven gevonden...</p>
          ) : (
            filteredBedrijven.map((bedrijf) => (
              <div key={bedrijf.id} className="bedrijfCard">
                <h3 className="bedrijfNaam">{bedrijf.company_name}</h3>
                <p className="bedrijfBeschrijving">{bedrijf.sector}</p>
                <div className="tagContainer">
                  {bedrijf.tags?.split(',').map((tag, index) => (
                    <span key={index} className="tag">{tag.trim()}</span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}