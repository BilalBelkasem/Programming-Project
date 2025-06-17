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
import ClientRegistration from './pages/jsx/ClientRegistration.jsx';
import ProfielBedrijven from './pages/jsx/ProfielBedrijven.jsx';
import ProfielStudent from './pages/jsx/ProfielStudent.jsx';
import UPlatteGrond from './pages/jsx/UPlatteGrond.jsx';
import UFavorietenBedrijven from './pages/jsx/UFavorietenBedrijven.jsx';
import GPlatteGrond from "./pages/jsx/GPlatteGrond.jsx"; 
import BFavorietenStudenten from './pages/jsx/BFavorietenBezoeker.jsx';
import StudentProfiel from '../src/pages/jsx/StudentProfiel.jsx';
import BedrijfProfiel from './pages/jsx/BedrijfProfiel.jsx';
import Speeddates from './pages/jsx/Speeddates.jsx'; // ✅ NIEUW

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

  const ProfileRedirect = () => {
    if (!isLoggedIn || !user) return <Navigate to="/login" />;
    if (user.role === 'student') return <Navigate to={`/mijn-profiel`} />;
    if (user.role === 'bedrijf') return <Navigate to={`/mijn-profiel`} />;
    if (user.role === 'admin') return <Navigate to="/admin" />;
    return <Navigate to="/login" />;
  };

  function ProtectedRoute({ children, role, idParam }) {
    if (!isLoggedIn || !user) {
      return <Navigate to="/login" />;
    }

    if (role) {
      if (Array.isArray(role)) {
        if (!role.includes(user.role)) {
          return <Navigate to="/login" />;
        }
      } else {
        if (user.role !== role) {
          return <Navigate to="/login" />;
        }
      }
    }

    if (idParam && idParam !== user.id) {
      return <Navigate to="/login" />;
    }

    return children;
  }

  return (
    <Routes>
      <Route path="/" element={<GInfoPagina />} />

      <Route
        path="/login"
        element={
          isLoggedIn && user ? (
            <Navigate to="/mijn-profiel" />
          ) : (
            <LoginPagina
              onLogin={(userData) => {
                setUser(userData);
                setIsLoggedIn(true);
              }}
            />
          )
        }
      />

      <Route path="/bedrijf-registratie" element={<CompanyRegistrationForm />} />
      <Route path="/registreer" element={<ClientRegistration />} />

      <Route
        path="/dashboard"
        element={isLoggedIn ? <UInfoPagina onLogout={handleLogout} /> : <Navigate to="/bedrijven" />}
      />

      <Route path="/bedrijven" element={<Navigate to={isLoggedIn ? "/ubedrijven" : "/gbedrijven"} />} />
      <Route path="/ubedrijven" element={<UBedrijven />} />
      <Route path="/gbedrijven" element={<GBedrijven />} />

      <Route
        path="/admin"
        element={isLoggedIn && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin/studenten"
        element={isLoggedIn && user?.role === 'admin' ? <AdminStudent /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin/bedrijven"
        element={isLoggedIn && user?.role === 'admin' ? <AdminBedrijf /> : <Navigate to="/login" />}
      />
      <Route
        path="/admin/badges"
        element={isLoggedIn && user?.role === 'admin' ? <AdminBadge /> : <Navigate to="/login" />}
      />

      <Route path="/studentprofiel" element={<StudentProfiel />} />
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
              <Navigate to="/login" />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/favorieten"
        element={
          isLoggedIn && user ? (
            user.role === 'student' ? (
              <UFavorietenBedrijven favorieten={[]} onUnsave={() => {}} />
            ) : user.role === 'bedrijf' ? (
              <BFavorietenStudenten favorieten={[]} onUnsave={() => {}} />
            ) : (
              <Navigate to="/login" />
            )
          ) : (
            <Navigate to="/login" />
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