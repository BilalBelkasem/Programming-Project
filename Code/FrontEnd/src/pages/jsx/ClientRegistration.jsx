import React, { useState } from 'react';
import '../Css/ClientRegistration.css';


const Register = () => {
  const [form, setForm] = useState({
    voornaam: '',
    naam: '',
    email: '',
    wachtwoord: '',
    herhaalWachtwoord: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.wachtwoord !== form.herhaalWachtwoord) {
      alert('Wachtwoorden komen niet overeen.');
      return;
    }
    console.log('Registratiegegevens:', form);
  };

  return (
    <div className="register-container">
      <img src="../assets/logo Erasmus.png" alt="Erasmus Hogeschool Brussel" className="logo" />
      <h2 className="title">registreren</h2>
      <h3 className="subtitle">student</h3>
      <form onSubmit={handleSubmit} className="register-form">
        <label className="form-label">voornaam*</label>
        <input type="text" name="voornaam" value={form.voornaam} onChange={handleChange} className="form-input" required />

        <label className="form-label">naam*</label>
        <input type="text" name="naam" value={form.naam} onChange={handleChange} className="form-input" required />

        <label className="form-label">email*</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} className="form-input" required />

        <label className="form-label">wachtwoord*</label>
        <input type="password" name="wachtwoord" value={form.wachtwoord} onChange={handleChange} className="form-input" required />

        <label className="form-label">wachtwoord herhalen*</label>
        <input type="password" name="herhaalWachtwoord" value={form.herhaalWachtwoord} onChange={handleChange} className="form-input" required />

        <button type="submit" className="register-button">registreren</button>
        <div className="back-text">terug</div>
      </form>
    </div>
  );
};

export default Register;