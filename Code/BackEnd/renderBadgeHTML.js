const QRCode = require('qrcode');

async function renderBadgeHTML(data, student = null) {
  // Determine if we're receiving new badge assignment format or old student format
  const isNewFormat = data.badge_id !== undefined;

  let qrDataURL, name, title, organization, school, interests, domains, about;

  if (isNewFormat) {
    // New badge assignment format
    name = data.custom_name || data.user_name;
    title = data.custom_title || '';
    organization = data.custom_organization || '';

    // Generate QR code from either URL or data
    qrDataURL = await QRCode.toDataURL(data.qr_code_url || data.qr_code_data || `https://careerlaunch.be/verify/${data.id}`);
  } else {
    // Old student format
    const user = data;
    name = user.name;
    title = `${student.education} (${student.year})`;
    organization = student.school;
    about = student.about;

    // Generate QR code for student
    qrDataURL = await QRCode.toDataURL(`https://careerlaunch.be/student/${user.id}`);

    // Prepare interests and domains lists if they exist
    interests = [
      student.interest_jobstudent ? 'Jobstudent' : null,
      student.interest_stage ? 'Stage' : null,
      student.interest_job ? 'Job' : null,
      student.interest_connect ? 'Connecties' : null
    ].filter(Boolean);

    domains = [
      student.domain_data ? 'Data' : null,
      student.domain_networking ? 'Networking' : null,
      student.domain_ai ? 'AI' : null,
      student.domain_software ? 'Software' : null
    ].filter(Boolean);
  }

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .badge { 
            border: 2px solid #000; 
            padding: 20px; 
            width: 400px;
            background-color: ${isNewFormat ? (data.background_color || '#f8f9fa') : '#ffffff'};
            color: ${isNewFormat ? (data.text_color || '#333333') : '#000000'};
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .logo {
            max-height: 30px;
          }
          .qr { 
            margin-top: 20px;
            text-align: center;
          }
          ul { 
            padding-left: 20px;
            margin: 10px 0;
          }
          .badge-type {
            font-style: italic;
            color: #666;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="badge">
          ${isNewFormat ? `
            <div class="header">
            ${data.default_logo ? `<img src="${process.env.BASE_URL || 'http://localhost:3000'}/assets/default-logo.png" class="logo" alt="Logo">` : ''}            </div>
              <h2>${name}</h2>
            <div class="badge-type">${data.template_type ? data.template_type.toUpperCase() : ''} BADGE</div>
            ${title ? `<p><strong>${title}</strong></p>` : ''}
            ${organization ? `<p>${organization}</p>` : ''}
          ` : `
            <h2>${name}</h2>
            <p><strong>${organization}</strong> - ${title}</p>
            ${about ? `<p>${about}</p>` : ''}
          `}

          ${!isNewFormat && interests.length > 0 ? `
            <h4>Interesses:</h4>
            <ul>
              ${interests.map(interest => `<li>${interest}</li>`).join('')}
            </ul>
          ` : ''}

          ${!isNewFormat && domains.length > 0 ? `
            <h4>Domeinen:</h4>
            <ul>
              ${domains.map(domain => `<li>${domain}</li>`).join('')}
            </ul>
          ` : ''}

          <div class="qr">
            <img src="${qrDataURL}" width="150" />
            ${isNewFormat ? `<p>Scan voor verificatie</p>` : ''}
          </div>
        </div>
      </body>
    </html>
  `;
}

module.exports = renderBadgeHTML;