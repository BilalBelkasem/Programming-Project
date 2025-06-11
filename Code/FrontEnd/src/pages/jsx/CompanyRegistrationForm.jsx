import React, { useState } from 'react';
import '../Css/CompanyRegistrationForm.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


export default function CompanyRegistrationForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    companyName: '',
    website: '',
    sector: '',
    beursContactName: '',
    poNumber: '',
    street: '',
    city: '',
    postcode: '',
    beursContactEmail: '',
    invoiceContactName: '',
    invoiceContactEmail: '',
    vatNumber: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Controleer of er lege velden zijn
    const legeVelden = Object.entries(formData).filter(([key, value]) => value.trim() === '');
  
    if (legeVelden.length > 0) {
      alert('Vul alle verplichte velden in voordat je registreert.');
      return;
    }
  
    console.log("Bedrijf geregistreerd:", formData);
    navigate('/profiel-bedrijf');
  };
  

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2 className="form-title">Registreren bedrijf</h2>

      {[
        { label: 'E-mailadres', name: 'email' },
        { label: 'Telefoonnummer', name: 'phone' },
        { label: 'Bedrijfsnaam', name: 'companyName' },
        { label: 'Website of LinkedIn pagina van uw bedrijf', name: 'website' },
        { label: 'Sector waarin het bedrijf actief is', name: 'sector' },
        { label: 'Naam Contactpersoon vertegenwoordigers beurs', name: 'beursContactName' },
        { label: 'PO nummer', name: 'poNumber' },
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

<button type="submit" className="form-button">
  Registreren
</button>

<Link to="/login" className="form-back">Terug</Link>

    </form>
  );
}