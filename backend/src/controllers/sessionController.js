const Session = require('../models/Session');
const User = require('../models/User');

// @desc    Obtener sesiones activas del sistema (Admin)
// @route   GET /api/sessions/active
// @access  Private (Admin)
const getActiveSessions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const sessions = await Session.find({ isActive: true })
      .populate('user_id', 'nombre email rol')
      .sort({ lastActivity: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Session.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        sessions: sessions.map(session => ({
          sessionId: session.sessionId,
          user: session.user_id,
          ip_address: session.ip_address,
          user_agent: session.user_agent,
          createdAt: session.createdAt,
          lastActivity: session.lastActivity,
          expiresAt: session.expiresAt,
          loginLocation: session.loginLocation
        })),
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
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

// @desc    Estadísticas de sesiones
// @route   GET /api/sessions/stats
// @access  Private (Admin)
const getSessionStats = async (req, res) => {
  try {
    const totalActiveSessions = await Session.countDocuments({ isActive: true });
    const totalSessions = await Session.countDocuments();
    
    // Sesiones por rol
    const sessionsByRole = await Session.aggregate([
      { $match: { isActive: true } },
      { 
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: '$user.rol',
          count: { $sum: 1 }
        }
      }
    ]);

    // Sesiones por día (últimos 7 días)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const sessionsByDay = await Session.aggregate([
      { 
        $match: { 
          createdAt: { $gte: sevenDaysAgo },
          isActive: true
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalActiveSessions,
        totalSessions,
        sessionsByRole,
        sessionsByDay
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas de sesiones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Invalidar sesión específica (Admin)
// @route   DELETE /api/sessions/:sessionId
// @access  Private (Admin)
const invalidateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOneAndUpdate(
      { sessionId, isActive: true },
      { 
        isActive: false,
        invalidatedAt: new Date(),
        invalidationReason: 'Invalidada por administrador'
      },
      { new: true }
    ).populate('user_id', 'nombre email');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Sesión no encontrada o ya invalidada'
      });
    }

    res.json({
      success: true,
      message: `Sesión de ${session.user_id.nombre} invalidada exitosamente`,
      data: {
        sessionId: session.sessionId,
        user: session.user_id.nombre,
        invalidatedAt: session.invalidatedAt
      }
    });

  } catch (error) {
    console.error('Error invalidando sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Limpiar sesiones expiradas manualmente
// @route   POST /api/sessions/cleanup
// @access  Private (Admin)
const cleanupSessions = async (req, res) => {
  try {
    const result = await Session.cleanExpiredSessions();

    res.json({
      success: true,
      message: 'Limpieza de sesiones completada',
      data: {
        deletedCount: result.deletedCount
      }
    });

  } catch (error) {
    console.error('Error en limpieza de sesiones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getActiveSessions,
  getSessionStats,
  invalidateSession,
  cleanupSessions
};
