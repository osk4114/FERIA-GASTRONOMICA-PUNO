const express = require('express');
const { body } = require('express-validator');
const {
  getDashboardStats,
  getActiveSessions,
  terminateSession,
  terminateUserSessions,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllRoles,
  changeUserRole,
  toggleUserStatus,
  getUserStats
} = require('../controllers/adminController');
const { auth, requireRole } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Middleware para todas las rutas admin - solo administradores
router.use(auth);
router.use(requireRole(['administrador']));

// Validaciones para crear usuario
const createUserValidation = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
  body('email')
    .isEmail()
    .withMessage('Email inválido'),
  
  body('contraseña')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('rol')
    .isIn(['administrador', 'productor', 'visitante', 'organizador'])
    .withMessage('Rol inválido'),
  
  body('negocio')
    .if(body('rol').equals('productor'))
    .notEmpty()
    .withMessage('El negocio es obligatorio para productores'),
  
  body('telefono')
    .optional()
    .isMobilePhone('es-PE')
    .withMessage('Teléfono inválido')
];

// Validaciones para actualizar usuario
const updateUserValidation = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido'),
  
  body('rol')
    .optional()
    .isIn(['administrador', 'productor', 'visitante', 'organizador'])
    .withMessage('Rol inválido'),
  
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser true o false'),
  
  body('telefono')
    .optional()
    .isMobilePhone('es-PE')
    .withMessage('Teléfono inválido')
];

// === RUTAS DE DASHBOARD ===
// Obtener estadísticas del dashboard
router.get('/dashboard-stats', getDashboardStats);

// === RUTAS DE GESTIÓN DE SESIONES ===
// Obtener todas las sesiones activas
router.get('/active-sessions', getActiveSessions);

// Terminar sesión específica
router.delete('/sessions/:sessionId', terminateSession);

// Terminar todas las sesiones de un usuario
router.delete('/users/:userId/sessions', terminateUserSessions);

// === RUTAS DE GESTIÓN DE USUARIOS ===
// Obtener estadísticas de usuarios por rol
router.get('/user-stats', getUserStats);

// Obtener todos los usuarios (con paginación y filtros)
router.get('/users', getAllUsers);

// Crear nuevo usuario
router.post('/users', authLimiter, createUserValidation, createUser);

// Actualizar usuario
router.put('/users/:userId', updateUserValidation, updateUser);

// Eliminar usuario
router.delete('/users/:userId', deleteUser);

// === RUTAS DE GESTIÓN DE ROLES ===
// Obtener todos los roles disponibles
router.get('/roles', getAllRoles);

// Cambiar rol de usuario
router.put('/users/:id/role', [
  body('rol')
    .isIn(['administrador', 'organizador', 'productor', 'visitante'])
    .withMessage('Rol inválido')
], changeUserRole);

// Activar/Desactivar usuario
router.put('/users/:id/status', toggleUserStatus);

module.exports = router;
