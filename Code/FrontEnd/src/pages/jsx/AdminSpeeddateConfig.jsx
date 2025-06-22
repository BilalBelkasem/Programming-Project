import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logoerasmus.png';
import '../Css/AdminSpeeddateConfig.css';

const AdminSpeeddateConfig = () => {
  const navigate = useNavigate();
  const [currentConfig, setCurrentConfig] = useState(null);
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [affectedReservations, setAffectedReservations] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate time options for dropdowns (8:00 to 20:00)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  useEffect(() => {
    fetchCurrentConfig();
  }, []);

  const fetchCurrentConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/reservations/config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentConfig(response.data);
      setNewStartTime(response.data.start);
      setNewEndTime(response.data.end);
    } catch (err) {
      setError('Kon huidige configuratie niet ophalen');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handlePreviewChanges = async () => {
    if (!newStartTime || !newEndTime) {
      setError('Vul beide tijden in');
      return;
    }

    if (newStartTime >= newEndTime) {
      setError('Eindtijd moet na starttijd liggen');
      return;
    }

    if (!adminPassword) {
      setError('Voer je admin wachtwoord in');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/admin/speeddate-config/preview', {
        startTime: newStartTime,
        endTime: newEndTime,
        adminPassword: adminPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAffectedReservations(response.data.affectedReservations);
      setShowConfirmation(true);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Onjuist admin wachtwoord');
      } else {
        setError('Fout bij het controleren van wijzigingen');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmChanges = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/speeddate-config/update', {
        startTime: newStartTime,
        endTime: newEndTime,
        adminPassword: adminPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowConfirmation(false);
      setAdminPassword('');
      setError('');
      fetchCurrentConfig(); // Refresh current config
      alert('Speeddate tijden succesvol bijgewerkt!');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Onjuist admin wachtwoord');
      } else {
        setError('Fout bij het bijwerken van configuratie');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setAdminPassword('');
    setError('');
    fetchCurrentConfig(); // Reset to current values
  };

  return (
    <div className="admin-speeddate-container">
      <header className="admin-header">
        <div className="admin-logo-block">
          <img src={logo} alt="Erasmus logo" className="admin-logo" />
          <span className="admin-title">admin - speeddate configuratie</span>
        </div>
        <button className="back-btn" onClick={() => navigate('/admin')}>
          ← Terug naar Dashboard
        </button>
      </header>

      <main className="config-main">
        <div className="config-card">
          <h2>Speeddate Tijden Configuratie</h2>
          
          {currentConfig && (
            <div className="current-config">
              <h3>Huidige Configuratie</h3>
              <p>Starttijd: <strong>{currentConfig.start}</strong></p>
              <p>Eindtijd: <strong>{currentConfig.end}</strong></p>
            </div>
          )}

          <div className="config-form">
            <h3>Nieuwe Configuratie</h3>
            
            <div className="time-inputs">
              <div className="time-input-group">
                <label htmlFor="startTime">Starttijd:</label>
                <select
                  id="startTime"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Selecteer starttijd</option>
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div className="time-input-group">
                <label htmlFor="endTime">Eindtijd:</label>
                <select
                  id="endTime"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  disabled={loading}
                >
                  <option value="">Selecteer eindtijd</option>
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="password-input">
              <label htmlFor="adminPassword">Admin Wachtwoord:</label>
              <input
                type="password"
                id="adminPassword"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Voer je admin wachtwoord in"
                disabled={loading}
                autoComplete="off"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="action-buttons">
              <button
                className="preview-btn"
                onClick={handlePreviewChanges}
                disabled={loading}
              >
                {loading ? 'Bezig...' : 'Bekijk Wijzigingen'}
              </button>
            </div>
          </div>
        </div>

        {showConfirmation && (
          <div className="confirmation-modal">
            <div className="confirmation-content">
              <h3>Bevestig Wijzigingen</h3>
              
              <div className="changes-summary">
                <h4>Samenvatting van wijzigingen:</h4>
                <p><strong>Nieuwe starttijd:</strong> {newStartTime}</p>
                <p><strong>Nieuwe eindtijd:</strong> {newEndTime}</p>
                
                {affectedReservations > 0 && (
                  <div className="warning-box">
                    <p>⚠️ <strong>Let op:</strong> {affectedReservations} bestaande reservering{affectedReservations > 1 ? 'en' : ''} {affectedReservations > 1 ? 'worden' : 'wordt'} geannuleerd door deze wijziging.</p>
                  </div>
                )}
              </div>

              <div className="confirmation-buttons">
                <button
                  className="confirm-btn"
                  onClick={handleConfirmChanges}
                  disabled={loading}
                >
                  {loading ? 'Bezig...' : 'Bevestig Wijzigingen'}
                </button>
                <button
                  className="cancel-btn"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Annuleren
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminSpeeddateConfig; 