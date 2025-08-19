import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/logoerasmus.png';
import '../css/Gbedrijveninfopagina.css';
import axios from 'axios';
import SharedFooter from '../../components/SharedFooter';

export default function GBedrijven({ onLogout }) {
  const navigate = useNavigate();
  const [bedrijven, setBedrijven] = useState([]);
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
        const res = await axios.get('/api/open-bedrijven');
        setBedrijven(res.data);
      } catch (err) {
        console.error('Fout bij ophalen bedrijven:', err);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: checked
    }));
  };

  const filteredBedrijven = useMemo(() => {
    const zoekFilters = Object.keys(filters).filter(key => key.startsWith('zoek_') && filters[key]);
    const domeinFilters = Object.keys(filters).filter(key => key.startsWith('domein_') && filters[key]);

    if (zoekFilters.length === 0 && domeinFilters.length === 0) {
      return bedrijven;
    }

    return bedrijven.filter(bedrijf => {
      const zoektMatch = zoekFilters.length === 0 || zoekFilters.some(filter => bedrijf[filter] === 1);
      const domeinMatch = domeinFilters.length === 0 || domeinFilters.some(filter => bedrijf[filter] === 1);
      return zoektMatch && domeinMatch;
    });
  }, [bedrijven, filters]);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
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
      domein_netwerking: 'Netwerking',
      domein_ai: 'AI',
      domein_software: 'Software',
    };
    const gevondenDomeinen = Object.entries(domeinen)
      .filter(([key]) => bedrijf[key])
      .map(([, label]) => label);

    return gevondenDomeinen.length > 0 ? gevondenDomeinen.map(label => <span key={label} className="tag domein-tag">{label}</span>) : <span className="tag geen-info">N.v.t.</span>;
  };

  return (
    <div className="pagina-wrapper">
      <header className="header">
        <div className="header-section left">
          <img src={logo} alt="Erasmus Logo" className="logo" />
        </div>
        <div className="header-section center">
          <nav className="nav-center">
            <Link to="/" className="nav-btn">info</Link>
            <Link to="/bedrijven" className="nav-btn active">bedrijven</Link>
            <Link to="/g-plattegrond" className="nav-btn">plattegrond</Link>
            <Link to="/login" className="nav-btn">login/registeren</Link>
          </nav>
        </div>
        <div className="header-section right"></div>
      </header>

      <main className="main-content">
        <h2 className="page-title">Ontdek bedrijven</h2>

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
              <div key={bedrijf.id} className="bedrijfCard">
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