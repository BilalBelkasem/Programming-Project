import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import GInfoPagina from './pages/jsx/GInfoPagina.jsx';
import UInfoPagina from './pages/jsx/UInfoPagina.jsx';
import LoginPagina from './pages/jsx/LoginPagina.jsx';
import UBedrijven from './pages/jsx/UBedrijven.jsx';
import AdminDashboard from './pages/jsx/AdminDashboard.jsx';
import CompanyRegistrationForm from './pages/jsx/CompanyRegistrationForm.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      {/* Publieke startpagina */}
      <Route path="/" element={<GInfoPagina />} />

      {/* Loginpagina met login handler */}
      <Route
        path="/login"
        element={<LoginPagina onLogin={() => setIsLoggedIn(true)} />}
      />

      {/* Bedrijven registratiepagina */}
      <Route
        path="/bedrijf-registratie"
        element={<CompanyRegistrationForm />}
      />

      {/* Gebruikersdashboard, enkel zichtbaar als ingelogd */}
      <Route
        path="/dashboard"
        element={
          isLoggedIn
            ? <UInfoPagina onLogout={() => setIsLoggedIn(false)} />
            : <GInfoPagina />
        }
      />

      {/* Bedrijvenpagina voor ingelogde gebruikers */}
      <Route
        path="/bedrijven"
        element={
          isLoggedIn
            ? <UBedrijven />
            : <GInfoPagina />
        }
      />

      {/* Admin dashboard – beveiliging optioneel */}
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
  import GInfoPagina from './pages/jsx/GInfoPagina.jsx';

<Routes>
  <Route path="/" element={<GInfoPagina />} />
  {/* andere routes */}
</Routes>

}
