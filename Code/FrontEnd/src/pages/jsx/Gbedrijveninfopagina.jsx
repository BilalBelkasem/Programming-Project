import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';
import '../Css/Gbedrijveninfopagina.css';

export default function UBedrijven({ onLogout }) {
  const navigate = useNavigate();

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
      beschrijving: 'onderhoud van alle systemen',
      tags: ['Data', 'Retail'],
    }
  ];

  return (
    <div className="pageWrapper">
      <header className="header">
  <img src={logo} alt="Erasmus Logo" className="logo" />
  <nav className="nav-links">
  <Link to="/" className="nav-btn">info</Link>
  <Link to="/Gbedrijveninfo" className="nav-btn active">bedrijven</Link>
  <Link to="/g-plattegrond" className="nav-btn">plattegrond</Link>
  <Link to="/login" className="nav-btn">login/registeren</Link>
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
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
