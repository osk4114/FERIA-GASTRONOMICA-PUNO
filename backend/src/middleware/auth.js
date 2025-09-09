const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Session = require('../models/Session');
const { verifyToken, decodeToken } = require('../utils/jwt');

// Middleware principal de autenticación con validación de sesión
const auth = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. Token no proporcionado.',
        code: 'NO_TOKEN'
      });
    }

    // Extraer el token
    const token = authHeader.substring(7); // Quitar "Bearer "

    // Verificar token JWT
    const decoded = verifyToken(token);
    
    // Verificar que la sesión existe y está activa
    const session = await Session.findOne({
      sessionId: decoded.sessionId,
      token: token,
      isActive: true
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Sesión inválida o expirada. Inicie sesión nuevamente.',
        code: 'INVALID_SESSION'
      });
    }

    // Verificar que la sesión no ha expirado
    if (!session.isSessionActive()) {
      await session.invalidate();
      return res.status(401).json({
        success: false,
        message: 'Sesión expirada. Inicie sesión nuevamente.',
        code: 'SESSION_EXPIRED'
      });
    }
    
    // Buscar usuario
    const user = await User.findById(decoded.id).select('-contraseña');
    
    if (!user) {
      await session.invalidate();
      return res.status(401).json({
        success: false,
        message: 'Token inválido. Usuario no encontrado.',
        code: 'USER_NOT_FOUND'
      });
    }

    if (!user.activo) {
      await session.invalidate();
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada. Contacte al administrador.',
        code: 'ACCOUNT_DISABLED'
      });
    }

    // Actualizar actividad de la sesión
    await session.updateActivity();

    // Agregar usuario y sesión a la request
    req.user = user;
    req.session = session;
    req.sessionId = decoded.sessionId;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Intentar obtener sessionId del token expirado para invalidar la sesión
      try {
        const decodedExpired = decodeToken(req.header('Authorization').substring(7));
        if (decodedExpired?.sessionId) {
          await Session.findOneAndUpdate(
            { sessionId: decodedExpired.sessionId },
            { isActive: false, invalidationReason: 'Token expirado' }
          );
        }
      } catch (e) {
        // Ignorar errores al intentar invalidar sesión expirada
      }
      
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Inicie sesión nuevamente.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido.',
        code: 'INVALID_TOKEN'
      });
    }

    console.error('Error en middleware de autenticación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      code: 'SERVER_ERROR'
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

// Alias para requireRole (más descriptivo)
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!Array.isArray(roles)) {
      roles = [roles];
    }
    
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere uno de los siguientes roles: ${roles.join(', ')}`,
        code: 'INSUFFICIENT_PERMISSIONS'
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
  requireRole,
  ownerAuth,
  productorAuth,
  organizadorAuth
};
