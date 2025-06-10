import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Css/LoginPagina.css';
import { Link } from 'react-router-dom';

export default function LoginPagina({ onLogin }) {
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password: wachtwoord,
      });

      // Save the token to localStorage
      localStorage.setItem('token', response.data.token);

      // Call the onLogin function and navigate to the dashboard
      onLogin();
      navigate('/dashboard');
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Something went wrong');
      } else {
        setError('Failed to connect to the server');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', textAlign: 'center' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label>Wachtwoord:</label><br />
          <input
            type="password"
            value={wachtwoord}
            onChange={(e) => setWachtwoord(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px 20px' }}>Inloggen</button>
      </form>
      <p style={{ marginTop: '20px' }}>
  Nog geen account?{" "}
  <Link to="/bedrijf-registratie" style={{ color: '#d63031', fontWeight: 'bold' }}>
    Registreer je bedrijf
  </Link>
  <div className="admin-login-container">
  <p><strong>Ben je een admin?</strong></p>
  <Link to="/admin" className="admin-login-button">
    Ga naar Admin Dashboard
  </Link>
</div>
<div className="client-registration-container">
  <p><strong>Nog geen account als student?</strong></p>
  <Link to="/registreer" className="client-registration-button">
    Registreer als gebruiker
  </Link>
</div>
</p>
    </div>
    
  );
}
