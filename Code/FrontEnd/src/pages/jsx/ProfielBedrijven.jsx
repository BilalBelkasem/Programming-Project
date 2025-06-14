import React from 'react';
import '../Css/UProfielBedrijfView.css'; // Zorg dat dit pad correct is
import { Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png'; // ✅ Check pad!
  
export default function ProfielBedrijven() {
  // Dummy bedrijf voor test — vervang met props of fetch later
  const company = {
    name: "Gabriel",
    lastname: "Tintas",
    companyName: "Colruyt",
    function: "Administrateur",
    email: "colruytBelgium@gmail.com",
    linkedin: "https://www.linkedin.com/in/gabriel-tintas-299533281/",
    about: "Een bedrijf gespecialiseerd in renovatie en restauratie van gebouwen.",
    lookingFor: ["jobstudent", "stage", "job", "connecties"],
    domains: ["Data", "netwerking", "robotica / AI", "software"]
  };

  const handleLogout = () => {
    // Hier zou je eventueel props.onLogout() kunnen aanroepen
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="public-profile-wrapper">
      <header className="header">
        <img src={logo} alt="Erasmus Logo" className="logo" />
        <nav className="nav">
          <Link to="/dashboard" className="nav-link">info</Link>
          <Link to="/bedrijven" className="nav-link">bedrijven</Link>
          <Link to="/plattegrond" className="nav-link">plattegrond</Link>
          <Link to="/favorieten" className="nav-link">favorieten</Link>
          <button className="nav-link" onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <section className="profile-section">
        <div className="profile-picture">[Bedrijfsfoto]</div>
        <div className="profile-grid">
          <div className="field"><strong>Voornaam:</strong> {company.name}</div>
          <div className="field"><strong>Achternaam:</strong> {company.lastname}</div>
          <div className="field"><strong>Bedrijfsnaam:</strong> {company.companyName}</div>
          <div className="field"><strong>Functie:</strong> {company.function}</div>
          <div className="field full"><strong>E-mail:</strong> {company.email}</div>
          {company.linkedin && (
            <div className="field full">
              <strong>LinkedIn:</strong> <a href={company.linkedin} target="_blank" rel="noopener noreferrer">{company.linkedin}</a>
            </div>
          )}
        </div>
      </section>

      <section className="company-info">
        <h2>Over het bedrijf</h2>
        <p>{company.about}</p>

        <h3>Wat zoekt dit bedrijf?</h3>
        <ul>
          {company.lookingFor.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h3>IT-domeinen</h3>
        <ul>
          {company.domains.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}