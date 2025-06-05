
import React, { useState } from 'react';
import './CompanyRegistrationForm.css';


export default function CompanyRegistrationForm() {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    companyName: '',
    website: '',
    sector: '',
    beursContactName: '',
    poNumber: '',
    street: '',
    city: '',
    postcode: '',
    beursContactEmail: '',
    invoiceContactName: '',
    invoiceContactEmail: '',
    vatNumber: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-semibold text-center">registreren bedrijf</h2>

      {[
        { label: 'E-mailadres', name: 'email' },
        { label: 'Telefoonnummer', name: 'phone' },
        { label: 'Bedrijfsnaam', name: 'companyName' },
        { label: 'Website of LinkedIn pagina van uw bedrijf', name: 'website' },
        { label: 'Sector waarin het bedrijf actief is', name: 'sector' },
        { label: 'Naam Contactpersoon vertegenwoordigers beurs', name: 'beursContactName' },
        { label: 'PO nummer', name: 'poNumber' },
        { label: 'Straat', name: 'street' },
        { label: 'Gemeente', name: 'city' },
        { label: 'Postcode', name: 'postcode' },
        { label: 'Email Contactpersoon vertegenwoordigers beurs', name: 'beursContactEmail' },
        { label: 'Naam Contactpersoon facturatie', name: 'invoiceContactName' },
        { label: 'E-mailadres Contactpersoon facturatie', name: 'invoiceContactEmail' },
        { label: 'BTW-nummer', name: 'vatNumber' },
      ].map((field) => (
        <div key={field.name}>
          <label className="block mb-1 font-medium">{field.label}</label>
          <input
            type="text"
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition"
      >
        registreren
      </button>
      <p className="text-center mt-2 text-sm text-gray-500 hover:underline cursor-pointer">terug</p>
    </form>
  );
}
