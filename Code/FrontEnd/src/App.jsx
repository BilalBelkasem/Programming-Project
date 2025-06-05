import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import GInfoPagina from './pages/GInfoPagina.jsx';
import UInfoPagina from './pages/UInfoPagina.jsx';
import LoginPagina from './pages/LoginPagina.jsx';

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
        element={isLoggedIn ? <UInfoPagina /> : <GInfoPagina />}
      />
    </Routes>
  );
}