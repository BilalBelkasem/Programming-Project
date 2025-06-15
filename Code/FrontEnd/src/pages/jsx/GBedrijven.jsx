import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../css/UBedrijven.css';

export default function UBedrijven({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  const bedrijven = [
    {
      id: 1,
      naam: 'TechNova',
      beschrijving: 'Wij zijn gespecialiseerd in AI-oplossingen voor de zorgsector.',
      tags: ['AI', 'Healthcare', 'Backend'],
    },
    {
      id: 2,
      naam: 'WebFlex',
      beschrijving: 'Frontend development agency met focus op React en UX design.',
      tags: ['Frontend', 'React', 'UX/UI'],
    },
    {
      id: 3,
      naam: 'DataCore',
      beschrijving: 'Big Data platformen en analyses voor de retailsector.',
      tags: ['Data', 'Backend', 'Retail'],
    },
    {
      id: 4,
      naam: 'colruyt',
      beschrijving: 'onderhoud van alle sysemen',
      tags: ['Data', 'Retail'],
    }
  ];

  return (
    <div className="pageWrapper">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav spaced">
        <Link to="/" className="nav-link active">info</Link>
        <Link to="/bedrijven" className="nav-link">bedrijven</Link>
        <Link to="/g-plattegrond" className="nav-link">plattegrond</Link>
        <Link to="/login" className="nav-link highlight">login/registeren</Link>
        </nav>
      </header>

      <main className="main">
        <h2 className="title">Ontdek bedrijven</h2>
        <div className="bedrijvenContainer">
          {bedrijven.map((bedrijf) => (
            <div key={bedrijf.id} className="bedrijfCard">
              <h3 className="bedrijfNaam">{bedrijf.naam}</h3>
              <p className="bedrijfBeschrijving">{bedrijf.beschrijving}</p>
              <div className="tagContainer">
                {bedrijf.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              {/* Like knop verwijderd */}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
