// ============================================================
//  MIDDLEWARE/AUTH.JS — JWT verification middleware
// ============================================================

const jwt = require('jsonwebtoken');

/**
 * Middleware: verifies the Bearer JWT token in the Authorization header.
 * Attaches decoded user payload to req.user on success.
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'default_studybot_secret_key';
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // { id, email, name, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid token. Please log in again.' });
  }
}

module.exports = { verifyToken };
