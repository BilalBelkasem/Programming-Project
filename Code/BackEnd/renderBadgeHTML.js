const QRCode = require('qrcode');

// Gebruik een baseurl die kan worden ingesteld via een environment variable, standaard localhost
const baseurl = process.env.BASEURL || 'http://localhost:5173'; //uw ip adress als je het als server doet

async function renderBadgeHTML(data, student = null) {
  const isNewFormat = student === null;

  let qrDataURL, name, title, organization, roleText;

  if (isNewFormat) {
    name = data.user_name || 'Unknown';
    title = data.sector || '';
    organization = data.company_name || '';
    // Link naar bedrijfprofiel
    qrDataURL = await QRCode.toDataURL(
      `${baseurl}/bedrijfprofiel/${data.id}`
    );
    roleText = data.role === 'bedrijf' ? 'Exhibitor Badge' : 'Badge';
  } else {
    name = data.name;
    title = `${student.education}`;
    organization = student.school;
    // Link naar studentenprofiel
    qrDataURL = await QRCode.toDataURL(`${baseurl}/studentenprofiel/${data.id}`);
    roleText = 'Student Badge';
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif; margin: 0; padding: 0;
    }
    .badge {
      position: relative;
      border: 2px solid #000;
      width: 105mm;
      height: 148mm;
      padding: 10mm;
      box-sizing: border-box;
      background-color: #fff;
      color: #000;
    }
.header {
  display: flex;
  align-items: center;
  margin-left: calc(-10mm + 12px);
   margin-bottom: 20px;
  width: calc(100% + 10mm - 12px); 
  box-sizing: border-box;
}

.logo {
  width: 75px;
  height: auto;
  flex-shrink: 0;
  margin-right: -17px; /* ruimte tussen logo en naam */
}

.name {
  font-size: 1.6em;
  font-weight: bold;
  margin: 0;
  text-align: center;
  flex-grow: 1;
}
   .content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}
    .content p {
      margin: 5px 0;
    }
    .role-text {
      margin-top: 10px;
      font-weight: bold;
      font-size: 1em;
    }
    .qr {
      margin-top: 30px;
      text-align: center;
    }
    .qr p {
      margin-top: 10px;
      font-style: italic;
      font-size: 0.9em;
    }
    .keycord-hole {
      position: absolute;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      width: 14px;
      height: 14px;
      background-color: black;
      border-radius: 50%;
    }
      .role-text {
      color: red;
      font-style: italic;
      text-transform: uppercase;
      }
  </style>
</head>
<body>
  <div class="badge">
    <div class="keycord-hole"></div>

    <div class="header">
      <img src="/assets/default-logo.png" class="logo" alt="Logo" />
      <h2 class="name">${name}</h2>
    </div>

    <div class="content">
      ${title ? `<p><strong>${title}</strong></p>` : ''}
      ${organization ? `<p>${organization}</p>` : ''}
      <p class="role-text">${roleText}</p>
    </div>

    <div class="qr">
      <img src="${qrDataURL}" width="150" />
      <p>Scan hier om het profiel te bekijken</p>
    </div>
  </div>
</body>
</html>
  `;
}

module.exports = renderBadgeHTML;
