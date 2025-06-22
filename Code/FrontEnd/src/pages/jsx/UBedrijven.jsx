import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
import '../css/UBedrijven.css';
import axios from 'axios';
import SharedFooter from '../../components/SharedFooter';

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
  const [filters, setFilters] = useState({
    zoek_jobstudent: false,
    zoek_stage: false,
    zoek_job: false,
    zoek_connecties: false,
    domein_data: false,
    domein_netwerking: false,
    domein_ai: false,
    domein_software: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');

        if (!user || !token) {
          navigate('/login');
          return;
        }

        const bedrijvenRes = await axios.get('/api/open-bedrijven');
        setBedrijven(bedrijvenRes.data);

        const favorietenRes = await axios.get(`/api/favorieten/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const geliketeIds = favorietenRes.data.map((bedrijf) => bedrijf.id);
        setFavorieten(geliketeIds);
      } catch (err) {
        console.error('Fout bij ophalen:', err);
      }
    };
    fetchData();
  }, [navigate]);

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: checked
    }));
  };

  const filteredBedrijven = useMemo(() => {
    const actieveFilters = Object.keys(filters).filter(key => filters[key]);
    if (actieveFilters.length === 0) {
      return bedrijven;
    }
    return bedrijven.filter(bedrijf => {
      return actieveFilters.every(filterKey => bedrijf[filterKey] === 1);
    });
  }, [bedrijven, filters]);

  const toggleLike = async (bedrijfId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const isFavoriet = favorieten.includes(bedrijfId);

    try {
      if (isFavoriet) {
        await axios.delete(`/api/favorieten/${bedrijfId}?student_id=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorieten(prev => prev.filter(id => id !== bedrijfId));
      } else {
        await axios.post('/api/favorieten', {
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

  const renderZoekOpties = (bedrijf) => {
    const opties = {
      zoek_jobstudent: 'Jobstudent',
      zoek_stage: 'Stage',
      zoek_job: 'Job',
      zoek_connecties: 'Connecties',
    };
    const gevondenOpties = Object.entries(opties)
      .filter(([key]) => bedrijf[key])
      .map(([, label]) => label);
    
    return gevondenOpties.length > 0 ? gevondenOpties.map(label => <span key={label} className="tag zoek-tag">{label}</span>) : <span className="tag geen-info">N.v.t.</span>;
  };

  const renderDomeinen = (bedrijf) => {
    const domeinen = {
      domein_data: 'Data',
      domein_netwerking: 'Netwerken',
      domein_ai: 'AI',
      domein_software: 'Software',
    };
    const gevondenDomeinen = Object.entries(domeinen)
      .filter(([key]) => bedrijf[key])
      .map(([, label]) => label);

    return gevondenDomeinen.length > 0 ? gevondenDomeinen.map(label => <span key={label} className="tag domein-tag">{label}</span>) : <span className="tag geen-info">N.v.t.</span>;
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/");
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

        <div className="filterContainer">
          <div className="filterGroup">
            <h4>Bedrijf zoekt:</h4>
            {Object.entries({zoek_jobstudent: 'Jobstudent', zoek_stage: 'Stage', zoek_job: 'Job', zoek_connecties: 'Connecties'}).map(([key, label]) => (
              <label key={key}>
                <input type="checkbox" name={key} checked={filters[key]} onChange={handleFilterChange} />
                {label}
              </label>
            ))}
          </div>
          <div className="filterGroup">
            <h4>Domein:</h4>
            {Object.entries({domein_data: 'Data', domein_netwerking: 'Netwerken', domein_ai: 'AI', domein_software: 'Software'}).map(([key, label]) => (
              <label key={key}>
                <input type="checkbox" name={key} checked={filters[key]} onChange={handleFilterChange} />
                {label}
              </label>
            ))}
          </div>
        </div>
        
        <div className="bedrijvenContainer">
          {filteredBedrijven.length === 0 ? (
            <p style={{ color: 'gray', textAlign: 'center', width: '100%' }}>Geen bedrijven gevonden die aan uw criteria voldoen.</p>
          ) : (
            filteredBedrijven.map((bedrijf) => (
              <div 
                key={bedrijf.id} 
                className="bedrijfCard" 
                onClick={() => navigate(`/bedrijfprofiel/${bedrijf.id}`)}
                style={{ cursor: 'pointer' }}
              >
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
                <h3 className="bedrijfNaam">{bedrijf.company_name}</h3>
                <p className="bedrijfBeschrijving">{bedrijf.sector}</p>
                <div className="tagSectie">
                  <h5>Zoekt:</h5>
                  <div className="tagContainer">
                    {renderZoekOpties(bedrijf)}
                  </div>
                </div>
                <div className="tagSectie">
                  <h5>Domein:</h5>
                  <div className="tagContainer">
                    {renderDomeinen(bedrijf)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <SharedFooter />
    </div>
  );
}
