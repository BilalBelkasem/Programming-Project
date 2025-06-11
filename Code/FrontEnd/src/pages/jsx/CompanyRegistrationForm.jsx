import React, { useState } from 'react';
import '../Css/CompanyRegistrationForm.css';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logo Erasmus.png';

export default function CompanyRegistrationForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    companyName: '',
    website: '',
    sector: '',
    beursContactName: '',
    street: '',
    city: '',
    postcode: '',
    beursContactEmail: '',
    invoiceContactName: '',
    invoiceContactEmail: '',
    vatNumber: '',
    logo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo') {
      setFormData({ ...formData, [name]: files[0] }); 
    } else {
      setFormData({ ...formData, [name]: value }); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const legeVelden = Object.entries(formData).filter(
      ([_, value]) => value === '' || value === null
    );

    if (legeVelden.length > 0) {
      alert('Vul alle verplichte velden in voordat je registreert.');
      return;
    }

    console.log("Bedrijf geregistreerd:", formData);
    navigate('/profiel-bedrijf');
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="logo-container">
        <img src={logo} alt="Erasmus Logo" className="form-logo" />
      </div>

      <h2 className="form-title">Registreren bedrijf</h2>

      {[
        { label: 'E-mailadres', name: 'email' },
        { label: 'Telefoonnummer', name: 'phone' },
        { label: 'Bedrijfsnaam', name: 'companyName' },
        { label: 'Website of LinkedIn pagina van uw bedrijf', name: 'website' },
        { label: 'Naam Contactpersoon vertegenwoordigers beurs', name: 'beursContactName' },
        { label: 'Straat', name: 'street' },
        { label: 'Gemeente', name: 'city' },
        { label: 'Postcode', name: 'postcode' },
        { label: 'Email Contactpersoon vertegenwoordigers beurs', name: 'beursContactEmail' },
        { label: 'Naam Contactpersoon facturatie', name: 'invoiceContactName' },
        { label: 'E-mailadres Contactpersoon facturatie', name: 'invoiceContactEmail' },
        { label: 'BTW-nummer', name: 'vatNumber' },
      ].map((field) => (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name}>{field.label}</label>
          <input
            type="text"
            id={field.name}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
          />
        </div>
      ))}

      <div className="form-group">
        <label htmlFor="sector">Sector waarbinnen het bedrijf actief is:</label>
        <select
          id="sector"
          name="sector"
          value={formData.sector}
          onChange={handleChange}
        >
          <option value="">- Selecteren -</option>
          <option value="Software & webontwikkeling (focus op back-end)">Software & webontwikkeling (focus op back-end)</option>
          <option value="Hardware & embedded systemen">Hardware & embedded systemen</option>
          <option value="Dienstverlening & consultancy">Dienstverlening & consultancy</option>
          <option value="Telecom, security & infrastructuur">Telecom, security & infrastructuur</option>
          <option value="Creatief, artistiek">Creatief, artistiek</option>
          <option value="Web, mobile, UX (focus op front-end)">Web, mobile, UX (focus op front-end)</option>
          <option value="Broadcast, media">Broadcast, media</option>
          <option value="Marketing, full service">Marketing, full service</option>
          <option value="Andere">Andere</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="logo">Upload uw bedrijfslogo</label>
        <input
          type="file"
          id="logo"
          name="logo"
          accept="image/*"
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="form-button">Registreren</button>
      <Link to="/login" className="form-back">Terug</Link>
    </form>
  );
}
