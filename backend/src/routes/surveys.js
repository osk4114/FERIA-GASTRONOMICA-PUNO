const express = require('express');
const { body } = require('express-validator');
const {
  createSurvey,
  getSurveys,
  getSurveyById,
  getMySurveys,
  getSurveyStats,
  deleteSurvey
} = require('../controllers/surveyController');
const { auth, rolesAuth } = require('../middleware/auth');
const { surveyLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Validaciones para crear encuesta
const createSurveyValidation = [
  body('satisfaccion_general')
    .isInt({ min: 1, max: 5 })
    .withMessage('La satisfacción general debe ser un número entre 1 y 5'),
  
  body('calidad_productos')
    .isInt({ min: 1, max: 5 })
    .withMessage('La calidad de productos debe ser un número entre 1 y 5'),
  
  body('atencion_cliente')
    .isInt({ min: 1, max: 5 })
    .withMessage('La atención al cliente debe ser un número entre 1 y 5'),
  
  body('variedad_productos')
    .isInt({ min: 1, max: 5 })
    .withMessage('La variedad de productos debe ser un número entre 1 y 5'),
  
  body('precios')
    .isInt({ min: 1, max: 5 })
    .withMessage('La calificación de precios debe ser un número entre 1 y 5'),
  
  body('organizacion_evento')
    .isInt({ min: 1, max: 5 })
    .withMessage('La organización del evento debe ser un número entre 1 y 5'),
  
  body('productos_favoritos')
    .optional()
    .isArray()
    .withMessage('Los productos favoritos deben ser un array'),
  
  body('comentarios')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Los comentarios no pueden exceder 500 caracteres'),
  
  body('recomendaria')
    .isBoolean()
    .withMessage('El campo recomendaría debe ser booleano'),
  
  body('volveria')
    .isBoolean()
    .withMessage('El campo volvería debe ser booleano'),
  
  body('procedencia')
    .isIn(['Puno', 'Lima', 'Arequipa', 'Cusco', 'Bolivia', 'Otro'])
    .withMessage('Procedencia inválida')
];

// Rutas que requieren autenticación
router.use(auth);

// Rutas públicas para visitantes (con rate limiting)
router.post('/', surveyLimiter, createSurveyValidation, createSurvey);
router.get('/my-surveys', getMySurveys);

// Rutas para administradores y organizadores
router.get('/', rolesAuth('administrador', 'organizador'), getSurveys);
router.get('/stats', rolesAuth('administrador', 'organizador'), getSurveyStats);
router.get('/:id', getSurveyById);

// Ruta para eliminar (admin y dueño)
router.delete('/:id', deleteSurvey);

module.exports = router;
