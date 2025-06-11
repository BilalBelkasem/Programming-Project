import "../../pages/Css/UProfilePage.css";
// App.jsx or wherever your routes are
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UProfilePage from './pages/UProfilePage'; // adjust path

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/user/:userId" element={<UProfilePage />} />
        {/* other routes */}
      </Routes>
    </Router>
  );
}
