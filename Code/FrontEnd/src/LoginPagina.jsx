import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPagina() {
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', email, wachtwoord);
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label><br />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <label>Wachtwoord:</label><br />
        <input type="password" value={wachtwoord} onChange={(e) => setWachtwoord(e.target.value)} /><br /><br />
        <button type="submit">Inloggen</button>
      </form>
    </div>
  );
}