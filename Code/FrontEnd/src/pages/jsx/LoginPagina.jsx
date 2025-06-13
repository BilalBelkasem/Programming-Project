import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import '../Css/LoginPagina.css';

export default function LoginPagina({ onLogin }) {
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password: wachtwoord
      });

      if (response.data?.token && response.data?.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        if (onLogin) onLogin(response.data.user); // Geef user object door
        navigate('/dashboard');
      } else {
        setError('Er ging iets mis bij het inloggen. Probeer het opnieuw.');
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setError('Ongeldige e-mail of wachtwoord.');
        } else if (err.response.data?.error) {
          setError(err.response.data.error);
        } else {
          setError('Er ging iets mis bij het inloggen. Probeer het opnieuw.');
        }
      } else {
        setError('Kan geen verbinding maken met de server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="login-container">
        <h2 className="login-title">Inloggen</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Voer je e-mailadres in"
            />
          </div>

          <div className="form-group password-field">
            <label htmlFor="password">Wachtwoord</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={wachtwoord}
                onChange={(e) => setWachtwoord(e.target.value)}
                required
                placeholder="Voer je wachtwoord in"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pass-icon"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}

              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Bezig...' : 'Inloggen'}
          </button>
        </form>

        <div className="register-links">
          <p>Nog geen account?</p>
          <div className="register-options">
            <Link to="/registreer" className="register-link">Registreer als student</Link>
            <Link to="/bedrijf-registratie" className="register-link company">Registreer je bedrijf</Link>
            <Link to="/" className="back-button">← Terug naar startpagina</Link>
            <Link to="/admin" className="admin-button">Admin login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
