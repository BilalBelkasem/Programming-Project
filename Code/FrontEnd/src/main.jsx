// 📁 main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode intentionally double-invokes effects in development
  // to help detect side effects. This may cause API calls to be made twice.
  // This behavior only occurs in development mode, not in production.
  // If this causes issues during development, you can remove StrictMode:
  // <BrowserRouter>
  //   <App />
  // </BrowserRouter>
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

