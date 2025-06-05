
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InfoPagina from './InfoPagina';
import LoginPagina from './LoginPagina';

function App() {
  return (
<<<<<<< Updated upstream
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>ddd</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
=======
    <Router>
      <Routes>
        <Route path="/" element={<InfoPagina />} />
        <Route path="/login" element={<LoginPagina />} />
      </Routes>
    </Router>
  );
>>>>>>> Stashed changes
}

export default App;