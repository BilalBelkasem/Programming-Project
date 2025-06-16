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
import Bedrijveninfo from './pages/jsx/bedrijveninfopagina.jsx'
import Gbedrijveninfo from './pages/jsx/Gbedrijveninfopagina.jsx'
import StudentProfiel from './pages/jsx/Studentprofiel.jsx';

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
    // Geen localStorage.clear() hier, de useEffect zorgt voor sync
  };

  const ProfileRedirect = () => {
    if (!isLoggedIn || !user) return <Navigate to="/login" />;
    if (user.role === 'student') return <Navigate to={`/mijn-profiel`} />;
    if (user.role === 'bedrijf') return <Navigate to={`/mijn-profiel`} />;
    if (user.role === 'admin') return <Navigate to="/admin" />;
    return <Navigate to="/login" />;
  };

  // ProtectedRoute checkt login, rol en optioneel idParam
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
        element={
          isLoggedIn ? (
            <UInfoPagina onLogout={() => {
              setIsLoggedIn(false);
              setUser(null);
            }} />
          ) : (
            <Navigate to="/bedrijven" />
          )
        }
      />

      <Route path="/bedrijven"
        element={isLoggedIn ? <UBedrijven /> : <Navigate to="/login" />}
      />
      
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/studenten" element={<AdminStudent />} />
      <Route path="/admin/bedrijven" element={<AdminBedrijf />} />
      <Route path="/admin/badges" element={<AdminBadge />} />
      <Route path="/studentprofiel" element={<StudentProfiel />} />
      <Route path="/plattegrond" element={<UPlatteGrond />} />
      <Route path="/g-plattegrond" element={<GPlatteGrond />} />

      <Route path="/mijn-profiel" element={
        isLoggedIn && user?.role === 'student' ? (
          <ProfielStudent />
        ) : isLoggedIn && user?.role === 'bedrijf' ? (
          <ProfielBedrijven />
        ) : (
          <Navigate to="/login" />
        )
      } />

      <Route path="/favorieten" element={
        isLoggedIn && user?.role === 'student' ? (
          <UFavorietenBedrijven 
            favorieten={favorieteBedrijven}
            onUnsave={(id) =>
              setFavorieteBedrijven((prev) => prev.filter((b) => b.id !== id))
            }
          />
        ) : isLoggedIn && user?.role === 'bedrijf' ? (
          <BFavorietenStudenten
            favorieten={favorieteStudenten}
            onUnsave={(id) =>
              setFavorieteStudenten((prev) => prev.filter((s) => s.id !== id))
            }
          />
        ) : (
          <Navigate to="/login" />
        )
      } />
    </Routes>
  );
}
