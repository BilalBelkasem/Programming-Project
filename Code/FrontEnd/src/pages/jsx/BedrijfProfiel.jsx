import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logoerasmus.png';
import '../Css/BedrijfProfiel.css';
import SharedFooter from '../../components/SharedFooter';

export default function BedrijfProfiel() {
  const { id } = useParams();
  const [bedrijf, setBedrijf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBedrijf = async () => {
      try {
        const response = await axios.get(`/api/company-profile/public/${id}`);
        setBedrijf(response.data);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Kon de bedrijfsgegevens niet ophalen.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBedrijf();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const renderLookingFor = () => {
    if (!bedrijf) return null;
    const lookingForOptions = [
      { key: 'zoek_jobstudent', label: 'Jobstudent' },
      { key: 'zoek_connecties', label: 'Connecties' },
      { key: 'zoek_stage', label: 'Stage' },
      { key: 'zoek_job', label: 'Voltijds personeel' },
    ];
    const lookingFor = lookingForOptions.filter(opt => bedrijf[opt.key]).map(opt => opt.label);
    return lookingFor.length > 0 ? lookingFor.join(', ') : 'Niet opgegeven';
  };

  const renderDomains = () => {
    if (!bedrijf) return null;
    const domainOptions = [
      { key: 'domein_data', label: 'Data' },
      { key: 'domein_netwerking', label: 'Netwerking' },
      { key: 'domein_ai', label: 'AI / Robotica' },
      { key: 'domein_software', label: 'Software' },
    ];
    const domains = domainOptions.filter(opt => bedrijf[opt.key]).map(opt => opt.label);
    return domains.length > 0 ? domains.join(', ') : 'Niet opgegeven';
  };

  if (loading) {
    return <div className="page-wrapper"><p>Laden...</p></div>;
  }

  return (
    <div className="page-wrapper">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
          <Link to="/dashboard" className="nav-btn">Info</Link>
          <Link to="/bedrijven" className="nav-btn">Bedrijven</Link>
          <Link to="/speeddates" className="nav-btn">Speeddates</Link>
          <Link to="/plattegrond" className="nav-btn">Plattegrond</Link>
          <Link to="/favorieten" className="nav-btn">Favorieten</Link>
          <Link to="/mijn-profiel" className="nav-btn">Mijn Profiel</Link>
        </nav>
        <div onClick={handleLogout} className="logoutIcon" title="Uitloggen">⇦</div>
      </header>

      <main className="container">
        {error ? (
          <p>{error}</p>
        ) : bedrijf ? (
          <>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>{bedrijf.company_name}</h1>
            <div className="profile-grid">
              <div className="field">
                <strong>Sector</strong>
                <div className="value-bar">{bedrijf.sector || <em>Niet opgegeven</em>}</div>
              </div>
              <div className="field">
                <strong>Adres</strong>
                <div className="value-bar">{`${bedrijf.street || ''} ${bedrijf.postal_code || ''} ${bedrijf.city || ''}`.trim() || <em>Niet opgegeven</em>}</div>
              </div>

              <div className="field full">
                <strong>Website</strong>
                <div className="value-bar">{bedrijf.website || <em>Niet opgegeven</em>}</div>
              </div>

              <div className="field full">
                <strong>Over ons</strong>
                <div className="textarea">
                    {bedrijf.about || <em>Niet opgegeven</em>}
                </div>
              </div>

              <div className="field full">
                <strong>Wat zoekt dit bedrijf?</strong>
                <div className="value-bar">{renderLookingFor()}</div>
              </div>

              <div className="field full">
                <strong>IT-domeinen</strong>
                <div className="value-bar">{renderDomains()}</div>
              </div>
            </div>
          </>
        ) : (
          <p>Bedrijf niet gevonden.</p>
        )}
      </main>
      <SharedFooter />
    </div>
  );
}
