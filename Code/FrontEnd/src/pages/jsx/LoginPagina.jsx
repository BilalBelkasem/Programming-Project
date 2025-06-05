import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/LoginPagina.css';
import { Link } from 'react-router-dom';

export default function LoginPagina({ onLogin }) {
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Ingelogd als:', email);
    onLogin(); // zet isLoggedIn op true in App.jsx
    navigate('/dashboard'); // navigeer naar de gebruikerspagina
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
</p>
    </div>
    
  );
}
