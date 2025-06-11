import React, { useState, useEffect } from 'react';
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
import UPlatteGrond from './pages/jsx/UPlatteGrond.jsx';
import UFavorietenBedrijven from './pages/jsx/UFavorietenBedrijven.jsx';
import GPlatteGrond from "./pages/jsx/GPlatteGrond.jsx"; 
import BFavorietenStudenten from './pages/jsx/BFavorietenBezoeker.jsx';
import UBedrijfView from './pages/jsx/UProfielBedrijfView.jsx';


export default function App() {
  // Persistent isLoggedIn state via localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  // Synchroniseer localStorage bij verandering van isLoggedIn
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  const [favorieteBedrijven, setFavorieteBedrijven] = useState([
    { id: 1, naam: 'CoolCompany', beschrijving: 'Innovatief softwarebedrijf' },
    { id: 2, naam: 'Techies BV', beschrijving: 'Specialist in AI-oplossingen' }
  ]);

  const [favorieteStudenten, setFavorieteStudenten] = useState([
  { id: 101, naam: 'Jelle Peeters', studierichting: 'Toegepaste Informatica' },
  { id: 102, naam: 'Sara Jacobs', studierichting: 'Marketing' }
]);

  return (
    <Routes>
      <Route path="/" element={<GInfoPagina />} />

      <Route
        path="/login"
        element={<LoginPagina onLogin={() => setIsLoggedIn(true)} />}
      />

      <Route path="/bedrijf-registratie" element={<CompanyRegistrationForm />} />
      <Route path="/registreer" element={<ClientRegistration />} />
      <Route path="/profiel-bedrijf" element={<ProfielBedrijven />} />

      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <UInfoPagina onLogout={() => setIsLoggedIn(false)} />
          ) : (
            <Navigate to="/bedrijven" />
          )
        }
      />

      <Route
        path="/bedrijven"
        element={isLoggedIn ? <UBedrijven /> : <Navigate to="/login" />}
      />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/studenten" element={<AdminStudent />} />
      <Route path="/admin/bedrijven" element={<AdminBedrijf />} />
      <Route path="/admin/badges" element={<AdminBadge />} />

      <Route path="/plattegrond" element={<UPlatteGrond />} />
      <Route path="/g-plattegrond" element={<GPlatteGrond />} />


      <Route path="/b-favorieten" element={<BFavorietenStudenten 
          favorieten={favorieteStudenten}
          onUnsave={(id) => setFavorieteStudenten((prev) => 
            prev.filter((s) => s.id !== id))}/>}/>
      
      <Route path="/favorieten" element={isLoggedIn ? (
      <UFavorietenBedrijven favorieten={favorieteBedrijven} onUnsave={(id) =>
          setFavorieteBedrijven((prev) => prev.filter((b) => b.id !== id))}/>
      ) : (<Navigate to="/login" />)}/>

    </Routes>
  );
  
}
