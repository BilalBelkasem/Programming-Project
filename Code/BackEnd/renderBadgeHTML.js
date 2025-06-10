const QRCode = require('qrcode');

async function renderBadgeHTML(user, student) {

  const qrDataURL = await QRCode.toDataURL(`https://example.com/student/${user.id}`);

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .badge { border: 2px solid #000; padding: 20px; width: 400px; }
          .qr { margin-top: 20px; }
          ul { padding-left: 20px; }
        </style>
      </head>
      <body>
        <div class="badge">
          <h2>${user.name}</h2>
          <p><strong>${student.school}</strong> - ${student.education} (${student.year})</p>
          <p>${student.about}</p>

          <h4>Interesses:</h4>
          <ul>
            ${student.interest_jobstudent ? '<li>Jobstudent</li>' : ''}
            ${student.interest_stage ? '<li>Stage</li>' : ''}
            ${student.interest_job ? '<li>Job</li>' : ''}
            ${student.interest_connect ? '<li>Connecties</li>' : ''}
          </ul>

          <h4>Domeinen:</h4>
          <ul>
            ${student.domain_data ? '<li>Data</li>' : ''}
            ${student.domain_networking ? '<li>Netwerking</li>' : ''}
            ${student.domain_ai ? '<li>AI</li>' : ''}
            ${student.domain_software ? '<li>Software</li>' : ''}
          </ul>

          <div class="qr">
            <img src="${qrDataURL}" width="150" />
          </div>
        </div>
      </body>
    </html>
  `;
}

module.exports = renderBadgeHTML;
