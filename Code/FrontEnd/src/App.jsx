import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';

import GInfoPagina from './pages/jsx/GInfoPagina.jsx';
import UInfoPagina from './pages/jsx/UInfoPagina.jsx';
import LoginPagina from './pages/jsx/LoginPagina.jsx';
import UBedrijven from './pages/jsx/UBedrijven.jsx';
import GBedrijven from './pages/jsx/GBedrijven.jsx';
import AdminDashboard from './pages/jsx/AdminDashboard.jsx';
import CompanyRegistrationForm from './pages/jsx/CompanyRegistrationForm.jsx';
import AdminStudent from './pages/jsx/AdminStudent.jsx';
import AdminBedrijf from './pages/jsx/AdminBedrijf.jsx';
import AdminBadge from './pages/jsx/AdminBadge.jsx';
import AdminSpeeddateConfig from './pages/jsx/AdminSpeeddateConfig.jsx';
import ClientRegistration from './pages/jsx/ClientRegistration.jsx';
import ProfielBedrijven from './pages/jsx/ProfielBedrijven.jsx';
import ProfielStudent from './pages/jsx/ProfielStudent.jsx';
import UPlatteGrond from './pages/jsx/UPlatteGrond.jsx';
import UFavorietenBedrijven from './pages/jsx/UFavorietenBedrijven.jsx';
import GPlatteGrond from "./pages/jsx/GPlatteGrond.jsx"; 
import BFavorietenStudenten from './pages/jsx/BFavorietenBezoeker.jsx';
import StudentProfiel from './pages/jsx/StudentProfiel.jsx';
import BedrijfProfiel from './pages/jsx/BedrijfProfiel.jsx';
import Speeddates from './pages/jsx/Speeddates.jsx';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  function ProtectedRoute({ children, role, idParam }) {
    console.log('[ProtectedRoute] Check start:', { isLoggedIn, user, role, idParam });

    if (!isLoggedIn || !user) {
      console.warn('[ProtectedRoute] Niet ingelogd. Redirect naar /login');
      return <Navigate to="/login" replace />;
    }

    if (role) {
      const allowed = Array.isArray(role) ? role.includes(user.role) : user.role === role;
      if (!allowed) {
        console.warn(`[ProtectedRoute] Rol "${user.role}" niet toegestaan. Redirect naar /login`);
        return <Navigate to="/login" replace />;
      }
    }
    return children;
  }

  return (
    <Routes>
      <Route path="/" element={<GInfoPagina />} />

      <Route
        path="/login"
        element={
          <LoginPagina
            onLogin={(userData) => {
              setUser(userData);
              setIsLoggedIn(true);
            }}
          />
        }
      />

      <Route path="/bedrijf-registratie" element={<CompanyRegistrationForm />} />
      <Route path="/registreer" element={<ClientRegistration />} />

      <Route
        path="/dashboard"
        element={isLoggedIn ? <UInfoPagina onLogout={handleLogout} /> : <Navigate to="/bedrijven" replace />}
      />

      <Route path="/bedrijven" element={<Navigate to={isLoggedIn ? "/ubedrijven" : "/gbedrijven"} replace />} />
      <Route path="/ubedrijven" element={<UBedrijven />} />
      <Route path="/gbedrijven" element={<GBedrijven />} />

      <Route
        path="/admin"
        element={isLoggedIn && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/admin/studenten"
        element={isLoggedIn && user?.role === 'admin' ? <AdminStudent /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/admin/bedrijven"
        element={isLoggedIn && user?.role === 'admin' ? <AdminBedrijf /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/admin/badges"
        element={isLoggedIn && user?.role === 'admin' ? <AdminBadge /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/admin/speeddate-config"
        element={isLoggedIn && user?.role === 'admin' ? <AdminSpeeddateConfig /> : <Navigate to="/login" replace />}
      />

      {/* Studentprofiel met idParam beveiliging */}
      <Route
        path="/studentprofiel/:id"
        element={
          <ProtectedRoute role={['admin', 'student']} idParam={true}>
            <StudentProfiel />
          </ProtectedRoute>
        }
      />

      <Route path="/bedrijfprofiel" element={<BedrijfProfiel />} />
      <Route path="/plattegrond" element={<UPlatteGrond />} />
      <Route path="/g-plattegrond" element={<GPlatteGrond />} />

      <Route
        path="/mijn-profiel"
        element={
          <ProtectedRoute role={['student', 'bedrijf']}>
            {user?.role === 'student' ? (
              <ProfielStudent user={user} />
            ) : user?.role === 'bedrijf' ? (
              <ProfielBedrijven user={user} />
            ) : (
              <Navigate to="/login" replace />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/favorieten"
        element={
          isLoggedIn && user ? (
            user.role === 'student' ? (
              <UFavorietenBedrijven onLogout={handleLogout} />
            ) : user.role === 'bedrijf' ? (
              <UFavorietenBedrijven onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route 
        path="/speeddates" 
        element={
          <ProtectedRoute role={['student', 'bedrijf']}>
            <Speeddates />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
