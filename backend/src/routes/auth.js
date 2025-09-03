const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Validaciones
const registerValidation = [
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
    .optional()
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

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  
  body('contraseña')
    .notEmpty()
    .withMessage('La contraseña es obligatoria')
];

const changePasswordValidation = [
  body('contraseñaActual')
    .notEmpty()
    .withMessage('La contraseña actual es obligatoria'),
  
  body('nuevaContraseña')
    .isLength({ min: 6 })
    .withMessage('La nueva contraseña debe tener al menos 6 caracteres')
];

// Rutas públicas
router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);

// Rutas privadas (requieren autenticación)
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePasswordValidation, changePassword);

module.exports = router;
