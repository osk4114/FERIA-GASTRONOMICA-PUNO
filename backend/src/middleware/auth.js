const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware principal de autenticación
const auth = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. Token no proporcionado.'
      });
    }

    // Extraer el token
    const token = authHeader.substring(7); // Quitar "Bearer "

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario
    const user = await User.findById(decoded.id).select('-contraseña');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido. Usuario no encontrado.'
      });
    }

    if (!user.activo) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada. Contacte al administrador.'
      });
    }

    // Agregar usuario a la request
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Inicie sesión nuevamente.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido.'
      });
    }

    console.error('Error en middleware de autenticación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware para verificar rol de administrador
const adminAuth = (req, res, next) => {
  if (req.user.rol !== 'administrador') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de administrador.'
    });
  }
  next();
};

// Middleware para verificar múltiples roles
const rolesAuth = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere uno de los siguientes roles: ${roles.join(', ')}`
      });
    }
    next();
  };
};

// Middleware para verificar que el usuario solo acceda a sus propios recursos
const ownerAuth = (req, res, next) => {
  // Si es administrador, puede acceder a todo
  if (req.user.rol === 'administrador') {
    return next();
  }

  // Verificar que el user_id en params coincida con el usuario autenticado
  if (req.params.userId && req.params.userId !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Solo puede acceder a sus propios recursos.'
    });
  }

  next();
};

// Middleware para verificar permisos de productor
const productorAuth = (req, res, next) => {
  if (req.user.rol !== 'productor' && req.user.rol !== 'administrador') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de productor.'
    });
  }
  next();
};

// Middleware para verificar permisos de organizador
const organizadorAuth = (req, res, next) => {
  if (req.user.rol !== 'organizador' && req.user.rol !== 'administrador') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado. Se requieren permisos de organizador.'
    });
  }
  next();
};

module.exports = {
  auth,
  adminAuth,
  rolesAuth,
  ownerAuth,
  productorAuth,
  organizadorAuth
};
