const jwt = require('jsonwebtoken');

function protect(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'No token provided.' });

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, username, isPro, iat, exp }
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Token expired.' : 'Invalid token.';
    return res.status(401).json({ success: false, message });
  }
}

function requirePro(req, res, next) {
  if (!req.user?.isPro)
    return res.status(403).json({ success: false, message: 'Pro subscription required.' });
  next();
}

module.exports = { protect, requirePro };
