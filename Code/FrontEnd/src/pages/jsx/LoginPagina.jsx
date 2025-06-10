import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/LoginPagina.css';
import { Link } from 'react-router-dom';
import GHeader from '../../components/SharedHeader.jsx';

export default function LoginPagina({ onLogin }) {
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Ingelogd als:', email);
    onLogin();
    navigate('/dashboard');
  };

  return (
    <>
      <GHeader />
      <div className="page">
        <main className="login-container">
          <h2 className="section-title">Welkom terug!</h2>
          <p className="login-text">Log in om toegang te krijgen tot je dashboard.</p>
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Wachtwoord:</label>
              <input
                type="password"
                value={wachtwoord}
                onChange={(e) => setWachtwoord(e.target.value)}
                required
              />
            </div>
            <button type="submit">Inloggen</button>
          </form>

          <div className="link-section">
            <p>Heb je nog geen account?</p>
            <Link to="/bedrijf-registratie" className="register-link">
              Registreer je bedrijf
            </Link>
            <Link to="/registreer" className="client-registration-button">
              Registreer als gebruiker
            </Link>
          </div>

          <div className="admin-login-container">
            <p><strong>Ben je een admin?</strong></p>
            <Link to="/admin" className="admin-login-button">
              Ga naar Admin Dashboard
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
