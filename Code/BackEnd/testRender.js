const renderBadgeHTML = require('./renderBadgeHTML');

(async () => {
  const user = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com'
  };

  const student = {
    user_id: 1,
    school: 'Example School',
    education: 'Computer Science',
    year: '2025',
    about: 'I love coding!',
    interest_jobstudent: true,
    interest_stage: true,
    interest_job: false,
    interest_connect: true,
    domain_data: true,
    domain_networking: false,
    domain_ai: true,
    domain_software: true
  };

  const html = await renderBadgeHTML(user, student);
  console.log(html);
})();
