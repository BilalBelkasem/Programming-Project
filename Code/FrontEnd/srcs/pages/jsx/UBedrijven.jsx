import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logoerasmus.png';
import '../css/UBedrijven.css';
import axios from 'axios';
import SharedFooter from '../../components/SharedFooter';

export default function UBedrijven({ onLogout }) {
  return (
    <div className="pagina-wrapper">
      <main className="main-content">
        {/* ... main content ... */}
      </main>
      <SharedFooter />
    </div>
  );
} 