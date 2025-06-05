import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import GInfoPagina from './pages/jsx/GInfoPagina.jsx';
import UInfoPagina from './pages/jsx/UInfoPagina.jsx';
import LoginPagina from './pages/jsx/LoginPagina.jsx';
import UBedrijven from './pages/jsx/UBedrijven.jsx';
import CompanyRegistrationForm from './components/CompanyRegistrationForm';


function App() {
  const [count, setCount] = useState(0)

  return (
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
}

export default App
