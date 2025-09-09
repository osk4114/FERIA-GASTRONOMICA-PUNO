const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generar JWT token con sessionId único
const generateToken = (userId, role, sessionId = null) => {
  let expiresIn;
  
  // Diferentes tiempos de expiración según el rol
  switch (role) {
    case 'administrador':
      expiresIn = process.env.JWT_ADMIN_EXPIRES_IN || '8h';
      break;
    case 'visitante':
      expiresIn = process.env.JWT_VISITOR_EXPIRES_IN || '15m';
      break;
    default:
      expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  }

  // Generar sessionId único si no se proporciona
  const uniqueSessionId = sessionId || generateSessionId();

  return {
    token: jwt.sign(
      { 
        id: userId,
        role: role,
        sessionId: uniqueSessionId,
        iat: Math.floor(Date.now() / 1000)
      },
      process.env.JWT_SECRET,
      { expiresIn }
    ),
    sessionId: uniqueSessionId,
    expiresIn
  };
};

// Verificar JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Generar sessionId único
const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Calcular fecha de expiración basada en el rol
const calculateExpirationDate = (role) => {
  const now = new Date();
  
  switch (role) {
    case 'administrador':
      return new Date(now.getTime() + 8 * 60 * 60 * 1000); // 8 horas
    case 'visitante':
      return new Date(now.getTime() + 15 * 60 * 1000); // 15 minutos
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 horas
  }
};

// Extraer información del token sin verificar (para obtener sessionId)
const decodeToken = (token) => {
  return jwt.decode(token);
};

// Generar token de refresh (para futuras implementaciones)
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  generateSessionId,
  calculateExpirationDate,
  decodeToken
};
