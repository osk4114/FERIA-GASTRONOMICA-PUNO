const User = require('../models/User');
const Session = require('../models/Session');
const { generateToken, calculateExpirationDate } = require('../utils/jwt');
const { validationResult } = require('express-validator');

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { nombre, email, contraseña, rol, negocio, telefono, direccion } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear nuevo usuario
    const userData = {
      nombre,
      email: email.toLowerCase(),
      contraseña,
      rol: rol || 'visitante'
    };

    // Agregar campos específicos para productores
    if (rol === 'productor') {
      if (!negocio) {
        return res.status(400).json({
          success: false,
          message: 'El campo negocio es obligatorio para productores'
        });
      }
      userData.negocio = negocio;
      userData.telefono = telefono;
      userData.direccion = direccion;
    }

    const user = await User.create(userData);

    // Generar token y sesión únicos
    const tokenData = generateToken(user._id, user.rol);
    
    // Crear sesión en la base de datos
    const sessionData = {
      user_id: user._id,
      sessionId: tokenData.sessionId,
      token: tokenData.token,
      ip_address: req.ip || req.connection.remoteAddress || 'unknown',
      user_agent: req.get('User-Agent') || 'unknown',
      expiresAt: calculateExpirationDate(user.rol),
      loginLocation: 'Registro'
    };

    await Session.create(sessionData);

    // Actualizar último acceso
    user.ultimoAcceso = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: user.datosPublicos(),
        token: tokenData.token,
        sessionId: tokenData.sessionId,
        expiresIn: getTokenExpiration(user.rol)
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    console.log('🔐 Intento de login:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Errores de validación:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { email, contraseña } = req.body;
    console.log('📧 Email recibido:', email);
    console.log('🔑 Contraseña recibida:', contraseña ? '[PRESENTE]' : '[AUSENTE]');

    // Buscar usuario
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('👤 Usuario encontrado:', user ? `${user.nombre} (${user.email})` : 'NO ENCONTRADO');
    
    if (!user) {
      console.log('❌ Usuario no encontrado en BD');
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    console.log('🔍 Verificando contraseña...');
    const isPasswordValid = await user.compararContraseña(contraseña);
    console.log('✅ Contraseña válida:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    console.log('🟢 Usuario activo:', user.activo);
    if (!user.activo) {
      console.log('❌ Usuario desactivado');
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada. Contacte al administrador.'
      });
    }

    console.log('🔍 Verificando sesiones existentes...');

    console.log('🔍 Verificando sesiones existentes...');
    // VERIFICAR SESIÓN EXISTENTE - RECHAZAR SI YA HAY UNA SESIÓN ACTIVA
    const existingSession = await Session.findOne({
      user_id: user._id,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    console.log('📊 Sesión existente:', existingSession ? 'ENCONTRADA' : 'NO ENCONTRADA');

    if (existingSession) {
      console.log('⚠️ Rechazando login - sesión activa existe');
      // Obtener información de la sesión existente
      const sessionInfo = {
        loginTime: existingSession.createdAt,
        deviceInfo: existingSession.user_agent || 'Dispositivo desconocido',
        ipAddress: existingSession.ip_address || 'IP desconocida',
        location: existingSession.loginLocation || 'Ubicación desconocida',
        expiresAt: existingSession.expiresAt
      };

      return res.status(409).json({
        success: false,
        message: 'Ya existe una sesión activa para este usuario',
        code: 'EXISTING_SESSION',
        details: {
          message: `Una sesión ya está activa desde: ${sessionInfo.deviceInfo}`,
          sessionInfo: {
            activeFrom: sessionInfo.loginTime,
            expiresAt: sessionInfo.expiresAt,
            device: sessionInfo.deviceInfo,
            location: sessionInfo.location
          },
          action: 'Para iniciar sesión desde este dispositivo, primero debe cerrar la sesión activa desde el dispositivo original.'
        }
      });
    }

    console.log('✅ No hay sesiones activas, procediendo con login...');
    // Si no hay sesión activa, proceder con el login normal
    // Generar token y sesión únicos
    const tokenData = generateToken(user._id, user.rol);
    console.log('🎫 Token generado para:', user.email);
    
    // Crear nueva sesión en la base de datos
    const sessionData = {
      user_id: user._id,
      sessionId: tokenData.sessionId,
      token: tokenData.token,
      ip_address: req.ip || req.connection.remoteAddress || 'unknown',
      user_agent: req.get('User-Agent') || 'unknown',
      expiresAt: calculateExpirationDate(user.rol),
      loginLocation: 'Login directo',
      deviceInfo: req.get('User-Agent') || 'unknown'
    };

    await Session.create(sessionData);

    // Actualizar último acceso
    user.ultimoAcceso = new Date();
    await user.save();

    console.log('🎉 Login exitoso para:', user.email);

    res.json({
      success: true,
      message: `Bienvenido, ${user.nombre}`,
      data: {
        user: user.datosPublicos(),
        token: tokenData.token,
        sessionId: tokenData.sessionId,
        expiresIn: getTokenExpiration(user.rol),
        sessionInfo: {
          expiresAt: sessionData.expiresAt,
          deviceInfo: sessionData.deviceInfo
        }
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener perfil del usuario autenticado
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-contraseña');
    
    res.json({
      success: true,
      data: {
        user: user.datosPublicos()
      }
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Actualizar perfil del usuario
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { nombre, telefono, direccion, negocio } = req.body;
    
    const updateData = { nombre };
    
    // Solo productores pueden actualizar estos campos
    if (req.user.rol === 'productor') {
      if (telefono) updateData.telefono = telefono;
      if (direccion) updateData.direccion = direccion;
      if (negocio) updateData.negocio = negocio;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-contraseña');

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: {
        user: user.datosPublicos()
      }
    });

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Cambiar contraseña
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { contraseñaActual, nuevaContraseña } = req.body;

    // Buscar usuario
    const user = await User.findById(req.user._id);

    // Verificar contraseña actual
    const isCurrentPasswordValid = await user.compararContraseña(contraseñaActual);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña actual es incorrecta'
      });
    }

    // Actualizar contraseña
    user.contraseña = nuevaContraseña;
    await user.save();

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Cerrar sesión
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // Invalidar la sesión actual
    await Session.findOneAndUpdate(
      { sessionId: req.sessionId },
      { 
        isActive: false,
        invalidatedAt: new Date(),
        invalidationReason: 'Logout manual'
      }
    );

    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente',
      code: 'LOGOUT_SUCCESS'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Verificar estado de sesión
// @route   GET /api/auth/verify-session
// @access  Private
const verifySession = async (req, res) => {
  try {
    // Si llegamos aquí, el middleware ya validó la sesión
    res.json({
      success: true,
      message: 'Sesión válida',
      data: {
        user: req.user.datosPublicos(),
        sessionInfo: {
          sessionId: req.sessionId,
          expiresAt: req.session.expiresAt,
          lastActivity: req.session.lastActivity,
          loginLocation: req.session.loginLocation
        }
      }
    });

  } catch (error) {
    console.error('Error verificando sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Invalidar todas las sesiones del usuario
// @route   POST /api/auth/logout-all
// @access  Private
const logoutAll = async (req, res) => {
  try {
    // Invalidar todas las sesiones activas del usuario
    await Session.updateMany(
      { 
        user_id: req.user._id,
        isActive: true 
      },
      { 
        isActive: false,
        invalidatedAt: new Date(),
        invalidationReason: 'Logout de todas las sesiones'
      }
    );

    res.json({
      success: true,
      message: 'Todas las sesiones han sido cerradas exitosamente',
      code: 'LOGOUT_ALL_SUCCESS'
    });

  } catch (error) {
    console.error('Error en logout-all:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Función auxiliar para obtener tiempo de expiración
const getTokenExpiration = (role) => {
  switch (role) {
    case 'administrador':
      return '8 horas';
    case 'visitante':
      return '15 minutos';
    default:
      return '24 horas';
  }
};

// @desc    Forzar inicio de sesión (cerrar sesiones existentes)
// @route   POST /api/auth/force-login
// @access  Public
const forceLogin = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { email, contraseña } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.compararContraseña(contraseña);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!user.activo) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada. Contacte al administrador.'
      });
    }

    // FORZAR LOGOUT: Invalidar todas las sesiones activas del usuario
    const sessionsInvalidated = await Session.updateMany(
      { 
        user_id: user._id,
        isActive: true 
      },
      { 
        isActive: false,
        invalidatedAt: new Date(),
        invalidationReason: 'Login forzado desde nuevo dispositivo'
      }
    );

    console.log(`🔄 Login forzado - ${sessionsInvalidated.modifiedCount} sesiones anteriores invalidadas para usuario: ${user.email}`);

    // Generar token y sesión únicos
    const tokenData = generateToken(user._id, user.rol);
    
    // Crear nueva sesión en la base de datos
    const sessionData = {
      user_id: user._id,
      sessionId: tokenData.sessionId,
      token: tokenData.token,
      ip_address: req.ip || req.connection.remoteAddress || 'unknown',
      user_agent: req.get('User-Agent') || 'unknown',
      expiresAt: calculateExpirationDate(user.rol),
      loginLocation: 'Login forzado',
      deviceInfo: req.get('User-Agent') || 'unknown'
    };

    await Session.create(sessionData);

    // Actualizar último acceso
    user.ultimoAcceso = new Date();
    await user.save();

    res.json({
      success: true,
      message: `Bienvenido, ${user.nombre}. Sesiones anteriores cerradas.`,
      data: {
        user: user.datosPublicos(),
        token: tokenData.token,
        sessionId: tokenData.sessionId,
        expiresIn: getTokenExpiration(user.rol),
        sessionInfo: {
          expiresAt: sessionData.expiresAt,
          deviceInfo: sessionData.deviceInfo,
          previousSessionsClosed: sessionsInvalidated.modifiedCount
        }
      }
    });

  } catch (error) {
    console.error('Error en force-login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  register,
  login,
  forceLogin,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  verifySession,
  logoutAll
};
