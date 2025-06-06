import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pagina-imports
import GInfoPagina from './pages/jsx/GInfoPagina.jsx';
import UInfoPagina from './pages/jsx/UInfoPagina.jsx';
import LoginPagina from './pages/jsx/LoginPagina.jsx';
import UBedrijven from './pages/jsx/UBedrijven.jsx';
import AdminDashboard from './pages/jsx/AdminDashboard.jsx';
import CompanyRegistrationForm from './pages/jsx/CompanyRegistrationForm.jsx';
import ClientRegistration from './pages/jsx/ClientRegistration.jsx';
import ProfielBedrijven from './pages/jsx/ProfielBedrijven.jsx';
import UPlatteGrond from "./pages/jsx/UPlatteGrond.jsx";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      {/* Publieke startpagina */}
      <Route path="/" element={<GInfoPagina />} />

      {/* Loginpagina */}
      <Route
        path="/login"
        element={<LoginPagina onLogin={() => setIsLoggedIn(true)} />}
      />

      {/* Publieke registratiepagina's */}
      <Route path="/bedrijf-registratie" element={<CompanyRegistrationForm />} />
      <Route path="/registreer" element={<ClientRegistration />} />

      {/* Profielpagina voor geregistreerd bedrijf (geen bescherming nodig tenzij gewenst) */}
      <Route path="/profiel-bedrijf" element={<ProfielBedrijven />} />

      {/* Gebruikersdashboard (alleen toegankelijk als ingelogd) */}
      <Route
        path="/dashboard"
        element={isLoggedIn ? <UInfoPagina onLogout={() => setIsLoggedIn(false)} /> : <Navigate to="/login" />}
      />

      {/* Bedrijvenpagina (alleen toegankelijk als ingelogd) */}
      <Route
        path="/bedrijven"
        element={isLoggedIn ? <UBedrijven /> : <Navigate to="/login" />}
      />

      {/* Admin dashboard */}
      <Route path="/admin" element={<AdminDashboard />} />

      {/* U PlatteGrond */}
      <Route path="/plattegrond" element={<UPlatteGrond onLogout={() => setIsLoggedIn(false)} />} />

      {/*U Bedrijven */}
      <Route path="/bedrijven" element={<UBedrijven onLogout={() => setIsLoggedIn(false)} />} />

    </Routes>
  );
}