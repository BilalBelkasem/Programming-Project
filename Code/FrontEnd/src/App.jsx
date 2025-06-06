
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import GInfoPagina from './pages/jsx/GInfoPagina.jsx';
import UInfoPagina from './pages/jsx/UInfoPagina.jsx';
import LoginPagina from './pages/jsx/LoginPagina.jsx';
import UBedrijven from './pages/jsx/UBedrijven.jsx';
import AdminDashboard from './pages/jsx/AdminDashboard.jsx';
import CompanyRegistrationForm from './pages/jsx/CompanyRegistrationForm.jsx';
import AdminStudent from './pages/jsx/AdminStudent.jsx';
import AdminBedrijf from './pages/jsx/AdminBedrijf.jsx';
import AdminBadge from './pages/jsx/AdminBadge.jsx';


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<GInfoPagina />} />

      <Route
        path="/login"
        element={<LoginPagina onLogin={() => setIsLoggedIn(true)} />}
      />

      <Route
        path="/bedrijf-registratie"
        element={<CompanyRegistrationForm />}
      />

      <Route
        path="/dashboard"
        element={
          isLoggedIn
            ? <UInfoPagina onLogout={() => setIsLoggedIn(false)} />
            : <GInfoPagina />
        }
      />

      <Route
        path="/bedrijven"
        element={
          isLoggedIn
            ? <UBedrijven />
            : <GInfoPagina />
        }
      />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/studenten" element={<AdminStudent />} />
      <Route path="/admin/bedrijven" element={<AdminBedrijf />} />
      <Route path="/admin/badges" element={<AdminBadge />} />
    </Routes>
    
  );
  
}
