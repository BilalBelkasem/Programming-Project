import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import GInfoPagina from './pages/jsx/GInfoPagina.jsx';
import UInfoPagina from './pages/jsx/UInfoPagina.jsx';
import LoginPagina from './pages/jsx/LoginPagina.jsx';
import UBedrijven from './pages/jsx/UBedrijven.jsx';


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
    isLoggedIn ? <UBedrijven /> : <GInfoPagina />
  }
/>
    </Routes>
  );
}