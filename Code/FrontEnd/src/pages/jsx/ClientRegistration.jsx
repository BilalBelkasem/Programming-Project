import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import '../Css/ClientRegistration.css';
import logo from '../../assets/logoerasmus.png';
import SharedFooter from '../../components/SharedFooter';

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
  const [showPassword, setShowPassword] = useState(false);

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

      // Let op: hier de velden aangepast naar backend verwachte namen
      const userData = {
        firstName: form.voornaam,
        lastName: form.naam,
        email: form.email,
        password: form.wachtwoord,
        role: 'student'
      };


      const response = await axios.post('/api/register', userData);

      console.log('Registratie succesvol:', response.data);

      navigate('/login');
    } catch (err) {
      console.error('Registratiefout:', err);
      setError(
        err.response?.data?.error ||
        'Er is een fout opgetreden bij het registreren. Probeer het later opnieuw.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-box">
        <img src={logo} alt="Erasmus Logo" className="login-logo" />
        <h2 className="title">Registreren</h2>
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
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="wachtwoord"
              value={form.wachtwoord}
              onChange={handleChange}
              className="form-input"
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="pass-icon-btn"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
          </div>

          <label className="form-label">wachtwoord herhalen*</label>
          <input
            type="password"
            name="herhaalWachtwoord"
            value={form.herhaalWachtwoord}
            onChange={handleChange}
            className="form-input"
            required
          />

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Bezig...' : 'registreren'}
          </button>
          <Link to="/login" className="back-text">← terug</Link>
        </form>
      </div>
      <p className='registration-login-prompt'>
        Heb je al een account? <Link to='/login'>Log dan hier in</Link>
      </p>
      <SharedFooter />
    </div>
  );
};

export default Register;
