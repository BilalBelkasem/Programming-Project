import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
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
      <footer className="site-footer">
  <div className="footer-columns">
    <div className="footer-column">
      <h4>Contacteer ons</h4>
      <p>Email: <a href="mailto:info@ehb.be">info@ehb.be</a></p>
      <p>Tel: 02 523 37 37</p>
    </div>

    <div className="footer-column">
      <h4>Meer info</h4>
      <ul>
        <li><a href="#">Over de jobbeurs</a></li>
        <li><a href="#">Praktische info</a></li>
        <li><a href="#">Voor bedrijven</a></li>
      </ul>
    </div>

    <div className="footer-column">
      <h4>Sociale media</h4>
      <ul>
        <li><a href="https://www.linkedin.com/school/erasmushogeschool-brussel/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        <li><a href="https://www.instagram.com/erasmushogeschool/?fbclid=IwY2xjawK-HAdleHRuA2FlbQIxMABicmlkETFheWJOUlp3ekNuR3NHQWQ5AR6muhnb3-EKLfxgldLA3M5PYGu338pYmf0X-jO39ePpgH7oI7kI8f9QeyEYnw_aem_GY2nRMYduK-7lR2uVMH-qQ" target="_blank" rel="noopener noreferrer">Instagram</a></li>
        <li><a href="https://www.facebook.com/erasmushogeschool" target="_blank" rel="noopener noreferrer">Facebook</a></li>
        <li><a href="https://x.com/ehbrussel?fbclid=IwY2xjawK-HCpleHRuA2FlbQIxMABicmlkETFheWJOUlp3ekNuR3NHQWQ5AR4Ut-kaTOjiO_fSCouBqQrdE7t-vI0RtLGCUmHg3jBXEzpltWJoCAjIDu2YZQ_aem_Fhsem9A0POhg9WZPKA64oQ" target="_blank" rel="noopener noreferrer">X (Twitter)</a></li>
        <li><a href="https://www.tiktok.com/@erasmushogeschool?fbclid=IwY2xjawK-HDxleHRuA2FlbQIxMABicmlkETFheWJOUlp3ekNuR3NHQWQ5AR4NB9ezdqahoKSvCTczK5AKHL5b4ge0QPkzxdZxjheXvXyMnPDmG6kVsQFbNw_aem_Z0IDfvat4bDQ9QvzXh5BcA" target="_blank" rel="noopener noreferrer">TikTok</a></li>
      </ul>
    </div>
  </div>

  <div className="footer-bottom">
    <p>© 2025 Erasmushogeschool Brussel – Design & Technologie</p>
  </div>
  <div className="easter-egg">
  <a
    href="https://youtu.be/dQw4w9WgXcQ?si=yB6y9GOBQG6o9nbo" // of jouw eigen video
    target="_blank"
    rel="noopener noreferrer"
  >
    don't klik
  </a>
</div>
</footer>
  
    </div>
    
  );
}
