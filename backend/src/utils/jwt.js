const jwt = require('jsonwebtoken');

// Generar JWT token
const generateToken = (userId, role) => {
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

  return jwt.sign(
    { 
      id: userId,
      role: role
    },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

// Verificar JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
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
  generateRefreshToken
};
