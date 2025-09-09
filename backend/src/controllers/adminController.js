const User = require('../models/User');
const Session = require('../models/Session');
const Product = require('../models/Product');
const Survey = require('../models/Survey');
const { validationResult } = require('express-validator');
const { generateToken, calculateExpirationDate } = require('../utils/jwt');

// @desc    Obtener estadísticas del dashboard
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin only)
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalProducts,
      totalSurveys,
      activeSessions,
      usersByRole
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ activo: true }),
      Product.countDocuments(),
      Survey.countDocuments(),
      Session.countDocuments({ isActive: true, expiresAt: { $gt: new Date() } }),
      User.aggregate([
        { $group: { _id: '$rol', count: { $sum: 1 } } }
      ])
    ]);

    // Estadísticas por rol
    const roleStats = {
      administrador: 0,
      organizador: 0,
      productor: 0,
      visitante: 0
    };

    usersByRole.forEach(role => {
      roleStats[role._id] = role.count;
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        totalProducts,
        totalSurveys,
        activeSessions,
        roleStats,
        systemHealth: {
          status: 'healthy',
          uptime: process.uptime(),
          memory: process.memoryUsage()
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener todas las sesiones activas
// @route   GET /api/admin/active-sessions
// @access  Private (Admin only)
const getActiveSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      isActive: true,
      expiresAt: { $gt: new Date() }
    })
    .populate('user_id', 'nombre email rol')
    .sort({ createdAt: -1 });

    const sessionsWithInfo = sessions.map(session => ({
      sessionId: session.sessionId,
      user: {
        id: session.user_id._id,
        nombre: session.user_id.nombre,
        email: session.user_id.email,
        rol: session.user_id.rol
      },
      deviceInfo: session.user_agent || 'Dispositivo desconocido',
      ipAddress: session.ip_address || 'IP desconocida',
      loginLocation: session.loginLocation || 'Ubicación desconocida',
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      lastActivity: session.lastActivity || session.createdAt
    }));

    res.json({
      success: true,
      data: {
        sessions: sessionsWithInfo,
        totalActiveSessions: sessionsWithInfo.length
      }
    });

  } catch (error) {
    console.error('Error obteniendo sesiones activas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Cerrar sesión específica
// @route   DELETE /api/admin/sessions/:sessionId
// @access  Private (Admin only)
const terminateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({ sessionId })
      .populate('user_id', 'nombre email');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Sesión no encontrada'
      });
    }

    await Session.findOneAndUpdate(
      { sessionId },
      {
        isActive: false,
        invalidatedAt: new Date(),
        invalidationReason: `Terminada por administrador: ${req.user.nombre}`
      }
    );

    console.log(`🔒 Admin ${req.user.email} terminó sesión de ${session.user_id.email}`);

    res.json({
      success: true,
      message: `Sesión de ${session.user_id.nombre} terminada exitosamente`,
      data: {
        terminatedUser: session.user_id.nombre,
        terminatedBy: req.user.nombre
      }
    });

  } catch (error) {
    console.error('Error terminando sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Cerrar todas las sesiones de un usuario
// @route   DELETE /api/admin/users/:userId/sessions
// @access  Private (Admin only)
const terminateUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    const result = await Session.updateMany(
      { 
        user_id: userId,
        isActive: true 
      },
      {
        isActive: false,
        invalidatedAt: new Date(),
        invalidationReason: `Todas las sesiones terminadas por administrador: ${req.user.nombre}`
      }
    );

    console.log(`🔒 Admin ${req.user.email} terminó ${result.modifiedCount} sesiones de ${user.email}`);

    res.json({
      success: true,
      message: `${result.modifiedCount} sesiones de ${user.nombre} terminadas exitosamente`,
      data: {
        sessionsTerminated: result.modifiedCount,
        targetUser: user.nombre,
        terminatedBy: req.user.nombre
      }
    });

  } catch (error) {
    console.error('Error terminando sesiones del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener todos los usuarios
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;
    
    const filter = {};
    
    if (role && role !== 'all') {
      filter.rol = role;
    }
    
    if (status && status !== 'all') {
      filter.activo = status === 'active';
    }
    
    if (search) {
      filter.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { negocio: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-contraseña')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalUsers = await User.countDocuments(filter);

    const usersWithSessionInfo = await Promise.all(
      users.map(async (user) => {
        const activeSessions = await Session.countDocuments({
          user_id: user._id,
          isActive: true,
          expiresAt: { $gt: new Date() }
        });

        return {
          ...user.toObject(),
          activeSessions,
          hasActiveSessions: activeSessions > 0
        };
      })
    );

    res.json({
      success: true,
      data: {
        users: usersWithSessionInfo,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNextPage: page * limit < totalUsers,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Crear nuevo usuario
// @route   POST /api/admin/users
// @access  Private (Admin only)
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const { nombre, email, contraseña, rol, negocio, telefono, direccion, activo = true } = req.body;

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    const userData = {
      nombre,
      email: email.toLowerCase(),
      contraseña,
      rol,
      activo
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

    console.log(`👤 Admin ${req.user.email} creó usuario: ${user.email} (${user.rol})`);

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: {
        user: user.datosPublicos(),
        createdBy: req.user.nombre
      }
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Actualizar usuario
// @route   PUT /api/admin/users/:userId
// @access  Private (Admin only)
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { nombre, email, rol, negocio, telefono, direccion, activo } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar email único si se está cambiando
    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está en uso'
        });
      }
    }

    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (email) updateData.email = email.toLowerCase();
    if (rol) updateData.rol = rol;
    if (typeof activo === 'boolean') updateData.activo = activo;

    // Campos específicos para productores
    if (rol === 'productor' || user.rol === 'productor') {
      if (negocio) updateData.negocio = negocio;
      if (telefono) updateData.telefono = telefono;
      if (direccion) updateData.direccion = direccion;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-contraseña');

    // Si se desactivó el usuario, terminar sus sesiones
    if (activo === false) {
      await Session.updateMany(
        { user_id: userId, isActive: true },
        {
          isActive: false,
          invalidatedAt: new Date(),
          invalidationReason: `Usuario desactivado por administrador: ${req.user.nombre}`
        }
      );
    }

    console.log(`✏️ Admin ${req.user.email} actualizó usuario: ${updatedUser.email}`);

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: {
        user: updatedUser.datosPublicos(),
        updatedBy: req.user.nombre
      }
    });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Eliminar usuario
// @route   DELETE /api/admin/users/:userId
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propia cuenta'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Terminar todas las sesiones del usuario
    await Session.updateMany(
      { user_id: userId, isActive: true },
      {
        isActive: false,
        invalidatedAt: new Date(),
        invalidationReason: `Usuario eliminado por administrador: ${req.user.nombre}`
      }
    );

    await User.findByIdAndDelete(userId);

    console.log(`🗑️ Admin ${req.user.email} eliminó usuario: ${user.email}`);

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      data: {
        deletedUser: user.nombre,
        deletedBy: req.user.nombre
      }
    });

  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getDashboardStats,
  getActiveSessions,
  terminateSession,
  terminateUserSessions,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
