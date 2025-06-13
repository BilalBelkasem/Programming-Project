const express = require('express');
const app = express();

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.get('/api/test-direct', (req, res) => {
  console.log('Direct /api/test-direct route hit');
  res.send('Direct route works!');
});

app.listen(3000, () => {
  console.log('Test server running on port 3000');
});

nanana