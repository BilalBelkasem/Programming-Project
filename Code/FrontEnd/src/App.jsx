import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import GInfoPagina from './pages/jsx/GInfoPagina.jsx';
import UInfoPagina from './pages/jsx/UInfoPagina.jsx';
import LoginPagina from './pages/jsx/LoginPagina.jsx';
import UBedrijven from './pages/jsx/UBedrijven.jsx';
import AdminDashboard from './pages/jsx/AdminDashboard.jsx';
import CompanyRegistrationForm from './pages/jsx/CompanyRegistrationForm.jsx';
import ClientRegistration from './pages/jsx/ClientRegistration.jsx';
import Profielbedrijven from './pages/jsx/ProfielBedrijven.jsx';

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
      <Route path="/registreer" element={<ClientRegistration />} />

      <Route path="/Profielbedrijven" element={<Profielbedrijven />} />

      <Route path="/Profielstudent" element={<Profielstudent />} />

      {/* Admin dashboard – beveiliging optioneel */}
      <Route path="/admin" element={<AdminDashboard />} />


    </Routes>
  );
}
