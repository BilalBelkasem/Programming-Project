
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pagina-imports
import GInfoPagina from './pages/jsx/GInfoPagina.jsx';
import UInfoPagina from './pages/jsx/UInfoPagina.jsx';
import LoginPagina from './pages/jsx/LoginPagina.jsx';
import UBedrijven from './pages/jsx/UBedrijven.jsx';
import AdminDashboard from './pages/jsx/AdminDashboard.jsx';
import CompanyRegistrationForm from './pages/jsx/CompanyRegistrationForm.jsx';
import AdminStudent from './pages/jsx/AdminStudent.jsx';
import AdminBedrijf from './pages/jsx/AdminBedrijf.jsx';
import AdminBadge from './pages/jsx/AdminBadge.jsx';

import ClientRegistration from './pages/jsx/ClientRegistration.jsx';
import ProfielBedrijven from './pages/jsx/ProfielBedrijven.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<GInfoPagina />} />

      {/* Loginpagina met login handler */}
      <Route
        path="/login"
        element={<LoginPagina onLogin={() => setIsLoggedIn(true)} />}
      />

      {/* Publieke registratiepagina's */}
      <Route path="/bedrijf-registratie" element={<CompanyRegistrationForm />} />
      <Route path="/registreer" element={<ClientRegistration />} />

      {/* Profielpagina voor geregistreerd bedrijf (geen bescherming nodig tenzij gewenst) */}
      <Route path="/profiel-bedrijf" element={<ProfielBedrijven />} />

      <Route
        path="/dashboard"
        element={isLoggedIn ? <UInfoPagina onLogout={() => setIsLoggedIn(false)} /> : <Navigate to="/login" />}
      />

      <Route
        path="/bedrijven"
        element={isLoggedIn ? <UBedrijven /> : <Navigate to="/login" />}
      />

  
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/studenten" element={<AdminStudent />} />
      <Route path="/admin/bedrijven" element={<AdminBedrijf />} />
      <Route path="/admin/badges" element={<AdminBadge />} />
    </Routes>
    
  );
  
}