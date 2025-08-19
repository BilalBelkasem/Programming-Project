import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // 👁️ Toegevoegd
import '../Css/LoginPagina.css';
import logo from '/logoerasmus.png';

export default function LoginPagina({ onLogin }) {
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁️ Toggle state
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/login', {
        email,
        password: wachtwoord,
      });

      if (response.data?.token && response.data?.user) {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        if (typeof onLogin === 'function') {
          setTimeout(() => onLogin(user), 0);
        }

        const { role } = user;
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'student' || role === 'bedrijf') {
          navigate('/mijn-profiel');
        } else {
          navigate('/');
        }
      } else {
        setError('Er ging iets mis bij het inloggen. Probeer het opnieuw.');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Ongeldige e-mail of wachtwoord.');
      } else {
        setError(err.response?.data?.error || 'Serverfout. Probeer opnieuw.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="login-container">
        <div className="logo-container">
          <img src={logo} alt="Erasmus Logo" className="login-logo" />
        </div>
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

          <div className="form-group">
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
              <div
                className="pass-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </div>
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
            <Link to="/registreer" className="register-link">
              Registreer als student
            </Link>
            <Link to="/bedrijf-registratie" className="register-link company">
              Registreer je bedrijf
            </Link>
            <Link to="/" className="back-button">← Terug naar startpagina</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
