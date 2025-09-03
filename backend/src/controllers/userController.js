const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Private (Solo Admin)
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, rol, activo, search } = req.query;
    
    // Construir filtros
    const filter = {};
    
    if (rol) filter.rol = rol;
    if (activo !== undefined) filter.activo = activo === 'true';
    if (search) {
      filter.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { negocio: { $regex: search, $options: 'i' } }
      ];
    }

    // Paginación
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      select: '-contraseña',
      sort: { fechaRegistro: -1 }
    };

    const users = await User.find(filter)
      .select('-contraseña')
      .sort(options.sort)
      .limit(options.limit * 1)
      .skip((options.page - 1) * options.limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users: users.map(user => user.datosPublicos()),
        pagination: {
          current: options.page,
          pages: Math.ceil(total / options.limit),
          total,
          limit: options.limit
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

// @desc    Obtener un usuario por ID
// @route   GET /api/users/:id
// @access  Private (Solo Admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-contraseña');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.datosPublicos()
      }
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Crear nuevo usuario
// @route   POST /api/users
// @access  Private (Solo Admin)
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

    const { nombre, email, contraseña, rol, negocio, telefono, direccion } = req.body;

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
      rol
    };

    // Agregar campos específicos para productores
    if (rol === 'productor') {
      userData.negocio = negocio;
      userData.telefono = telefono;
      userData.direccion = direccion;
    }

    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: {
        user: user.datosPublicos()
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
// @route   PUT /api/users/:id
// @access  Private (Solo Admin)
const updateUser = async (req, res) => {
  try {
    const { nombre, email, rol, activo, negocio, telefono, direccion } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si el nuevo email ya existe (si se está cambiando)
    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está registrado'
        });
      }
    }

    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (email) updateData.email = email.toLowerCase();
    if (rol) updateData.rol = rol;
    if (activo !== undefined) updateData.activo = activo;

    // Campos específicos para productores
    if (rol === 'productor' || user.rol === 'productor') {
      if (negocio) updateData.negocio = negocio;
      if (telefono) updateData.telefono = telefono;
      if (direccion) updateData.direccion = direccion;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-contraseña');

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: {
        user: updatedUser.datosPublicos()
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
// @route   DELETE /api/users/:id
// @access  Private (Solo Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // No permitir que el admin se elimine a sí mismo
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propia cuenta'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener estadísticas de usuarios
// @route   GET /api/users/stats
// @access  Private (Solo Admin)
const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$rol',
          count: { $sum: 1 },
          activos: {
            $sum: { $cond: [{ $eq: ['$activo', true] }, 1, 0] }
          }
        }
      }
    ]);

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ activo: true });
    const recentUsers = await User.countDocuments({
      fechaRegistro: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      success: true,
      data: {
        total: totalUsers,
        activos: activeUsers,
        nuevosUltimaSemana: recentUsers,
        porRol: stats
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
};
