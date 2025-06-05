import React from 'react';

export default function UInfoPagina() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Welkom terug!</h1>
      <p>
        Je bent succesvol ingelogd. Hier vind je toegang tot je persoonlijke omgeving,
        zoals je profiel, favoriete bedrijven en geplande afspraken.
      </p>

      <div style={{ marginTop: '30px' }}>
        <h2>Wat kan je hier doen?</h2>
        <ul>
          <li>Bekijk of wijzig je profielgegevens</li>
          <li>Bekijk je favoriete bedrijven</li>
          <li>Beheer je inschrijvingen voor Career Launch</li>
        </ul>
      </div>
    </div>
  );
}