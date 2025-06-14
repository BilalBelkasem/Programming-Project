const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}


function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  }
  next();
}

function isStudent(req, res, next) {
  if (!req.user || req.user.role !== 'student') {
    return res.status(403).json({ error: 'Access denied: Students only' });
  }
  next();
}

function isCompany(req, res, next) {
  if (!req.user || req.user.role !== 'bedrijf') {
    return res.status(403).json({ error: 'Access denied: Companies only' });
  }
  next();
}


module.exports = {
  authenticateToken,
  isAdmin,
  isStudent,
  isCompany
};
