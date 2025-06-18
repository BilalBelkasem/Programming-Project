import React, { useState } from 'react';
import '../Css/CompanyRegistrationForm.css';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react'; // 👁️ iconen

export default function CompanyRegistrationForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    company_name: '',
    website: '',
    sector: '',
    booth_contact_name: '',
    street: '',
    city: '',
    postal_code: '',
    booth_contact_email: '',
    invoice_contact_name: '',
    invoice_contact_email: '',
    vat_number: '',
    logo: null,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, files, value } = e.target;

    if (name === 'logo') {
      const file = files[0];
      if (file) {
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
          alert('Het logo mag maximaal 2MB zijn.');
          return;
        }
        setFormData({ ...formData, logo: file });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Wachtwoorden komen niet overeen.');
      return;
    }

    const legeVelden = Object.entries(formData).filter(
      ([key, value]) => {
        if (key === 'logo') return false;
        return value === '' || value === null;
      }
    );

    if (legeVelden.length > 0) {
      alert('Vul alle verplichte velden in voordat je registreert.');
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await axios.post(
        'http://localhost:5000/api/register-company',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      alert('Bedrijf succesvol geregistreerd!');
      navigate('/profiel-bedrijf');
    } catch (error) {
      console.error('Registratie mislukt:', error.response?.data || error);
      alert('Registratie mislukt: ' + (error.response?.data?.error || 'Onbekende fout'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="logo-container">
        <img src={logo} alt="Erasmus Logo" className="form-logo" />
      </div>

      <h2 className="form-title">Registreren bedrijf</h2>

      {[
        { label: 'E-mailadres', name: 'email' },
        { label: 'Telefoonnummer', name: 'phone_number' },
        { label: 'Bedrijfsnaam', name: 'company_name' },
        { label: 'Website of LinkedIn pagina van uw bedrijf', name: 'website' },
        { label: 'Naam Contactpersoon vertegenwoordigers beurs', name: 'booth_contact_name' },
        { label: 'Straat', name: 'street' },
        { label: 'Gemeente', name: 'city' },
        { label: 'Postcode', name: 'postal_code' },
        { label: 'Email Contactpersoon vertegenwoordigers beurs', name: 'booth_contact_email' },
        { label: 'Naam Contactpersoon facturatie', name: 'invoice_contact_name' },
        { label: 'E-mailadres Contactpersoon facturatie', name: 'invoice_contact_email' },
        { label: 'BTW-nummer', name: 'vat_number' },
      ].map((field) => (
        <div key={field.name} className="form-group">
          <label htmlFor={field.name}>{field.label} <span style={{ color: 'red' }}>*</span></label>
          <input
            type={
              field.name.includes('email') ? 'email' :
              field.name === 'phone_number' ? 'tel' :
              'text'
            }
            id={field.name}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
          />
        </div>
      ))}

      {/* Wachtwoord met oogje 👁️ */}
      <div className="form-group">
        <label htmlFor="password">Wachtwoord <span style={{ color: 'red' }}>*</span></label>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <div className="pass-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </div>
        </div>
      </div>

      {/* Herhaal wachtwoord (zonder oogje) */}
      <div className="form-group">
        <label htmlFor="confirmPassword">Wachtwoord herhalen <span style={{ color: 'red' }}>*</span></label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="sector">Sector waarbinnen het bedrijf actief is:<span style={{ color: 'red' }}>*</span></label>
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
      <Link to="/login" className="form-back">← Terug</Link>
    </form>
  );
}
