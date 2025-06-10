import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../Css/ClientRegistration.css';
import logo from '../../assets/logo Erasmus.png';

const Register = () => {
  const [form, setForm] = useState({
    voornaam: '',
    naam: '',
    email: '',
    wachtwoord: '',
    herhaalWachtwoord: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    
    if (form.wachtwoord !== form.herhaalWachtwoord) {
      setError('Wachtwoorden komen niet overeen.');
      return;
    }

    
    if (form.wachtwoord.length < 6) {
      setError('Wachtwoord moet minimaal 6 tekens bevatten.');
      return;
    }

    try {
      setLoading(true);
      // Transform data to match backend expectations
      const userData = {
        firstName: form.voornaam,
        lastName: form.naam,
        email: form.email,
        password: form.wachtwoord, 
        role: 'student' 
      };

      const response = await axios.post('http://localhost:5000/api/register', userData);
      
      console.log('Registratie succesvol:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // Navigate to login page or dashboard
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.error || 
        'Er is een fout opgetreden bij het registreren. Probeer het later opnieuw.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <img src={logo} alt="Erasmus Logo" className="logo" />
      <h2 className="title">registreren</h2>
      <h3 className="subtitle">student</h3>
      
      {error && <div className="error-message">{error}</div>}
      
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
        <Link to="/login" className="back-text">terug</Link>
      </form>
    </div>
  );
};

export default Register;