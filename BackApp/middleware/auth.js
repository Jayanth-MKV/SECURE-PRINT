const jwt = require('jsonwebtoken');

function requireAuth(request, response, next) {
  const authorization = request.get('authorization') || '';
  if (!authorization.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Authentication required' });
  }

  try {
    request.user = jwt.verify(authorization.slice(7), process.env.JWT_SECRET, {
      issuer: 'secure-print-local',
      audience: 'secure-print-clients',
    });
    return next();
  } catch {
    return response.status(401).json({ message: 'Invalid or expired session' });
  }
}

module.exports = requireAuth;
