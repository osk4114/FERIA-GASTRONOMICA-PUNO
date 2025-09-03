const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
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

    // Generar token
    const token = generateToken(user._id, user.rol);

    // Actualizar último acceso
    user.ultimoAcceso = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: user.datosPublicos(),
        token,
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

    // Generar token
    const token = generateToken(user._id, user.rol);

    // Actualizar último acceso
    user.ultimoAcceso = new Date();
    await user.save();

    res.json({
      success: true,
      message: `Bienvenido, ${user.nombre}`,
      data: {
        user: user.datosPublicos(),
        token,
        expiresIn: getTokenExpiration(user.rol)
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
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

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};
