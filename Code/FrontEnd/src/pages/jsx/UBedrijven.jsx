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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorieten(prev => prev.filter(id => id !== bedrijfId));
      } else {
        await axios.post('http://localhost:5000/api/favorieten', {
          student_id: user.id,
          company_id: bedrijfId
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorieten(prev => [...prev, bedrijfId]);
      }
    } catch (err) {
      console.error('Fout bij togglen van favoriet:', err);
    }
  };

  return (
    <div className="pageWrapper">
      <header className="header">
        <div className="header-section left">
          <img src={logo} alt="Erasmus Logo" className="logo" />
        </div>

        <div className="header-section center">
          <nav className="nav-center">
            <Link to="/dashboard" className="nav-btn">Info</Link>
            <Link to="/bedrijven" className="nav-btn active">Bedrijven</Link>
            <Link to="/plattegrond" className="nav-btn">Plattegrond</Link>
            <Link to="/favorieten" className="nav-btn">Favorieten</Link>
            <Link to="/mijn-profiel" className="nav-btn">Mijn profiel</Link>
          </nav>
        </div>

        <div className="header-section right">
          <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
        </div>
      </header>

      <main className="main">
        <h2 className="title">Ontdek bedrijven</h2>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
          <div className="custom-dropdown-filter" ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              className="dropdown-toggle"
              onClick={() => setDropdownOpen((open) => !open)}
              style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid #bbb', background: '#eee', fontWeight: 'bold', fontSize: 18, minWidth: 160, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 220 }}
            >
              Filter
              <span style={{ marginLeft: 8 }}>{dropdownOpen ? '\u25B2' : '\u25BC'}</span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-menu" style={{ position: 'absolute', top: '100%', left: 0, background: '#ddd', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: 18, zIndex: 10, minWidth: 220, textAlign: 'left' }}>
                <div style={{ marginBottom: 10, fontWeight: 'bold', fontSize: 15 }}>Type Kans</div>
                {TYPE_KANS.map((opt) => (
                  <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, textAlign: 'left', width: '100%' }}>
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
                  <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, textAlign: 'left', width: '100%' }}>
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
        </div>
        <div className="bedrijvenContainer">
          {filteredBedrijven.length === 0 ? (
            <p style={{ color: 'gray' }}>Geen bedrijven gevonden...</p>
          ) : (
            filteredBedrijven.map((bedrijf) => (
              <div key={bedrijf.id} className="bedrijfCard">
                <h3 className="bedrijfNaam">{bedrijf.company_name}</h3>
                <p className="bedrijfBeschrijving">{bedrijf.sector}</p>
                <button
                  onClick={() => toggleLike(bedrijf.id)}
                  className={`likeButton ${favorieten.includes(bedrijf.id) ? 'liked' : ''}`}
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
