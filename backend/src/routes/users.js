const express = require('express');
const { body } = require('express-validator');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Validaciones
const createUserValidation = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('contraseña')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  
  body('rol')
    .isIn(['administrador', 'productor', 'visitante', 'organizador'])
    .withMessage('Rol inválido'),
  
  body('negocio')
    .if(body('rol').equals('productor'))
    .notEmpty()
    .withMessage('El negocio es obligatorio para productores')
];

const updateUserValidation = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('rol')
    .optional()
    .isIn(['administrador', 'productor', 'visitante', 'organizador'])
    .withMessage('Rol inválido'),
  
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser booleano')
];

// Todas las rutas requieren autenticación de administrador
router.use(auth);
router.use(adminAuth);

// Rutas
router.get('/stats', getUserStats);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUserValidation, createUser);
router.put('/:id', updateUserValidation, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
