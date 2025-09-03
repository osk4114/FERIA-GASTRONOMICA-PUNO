const express = require('express');
const { body } = require('express-validator');
const {
  generateReport,
  getReports,
  getReportById,
  deleteReport
} = require('../controllers/reportController');
const { auth, rolesAuth } = require('../middleware/auth');

const router = express.Router();

// Validaciones para generar reporte
const generateReportValidation = [
  body('tipo_reporte')
    .isIn(['ventas', 'asistencia', 'satisfaccion', 'productos', 'general'])
    .withMessage('Tipo de reporte inválido'),
  
  body('fecha_inicio')
    .isISO8601()
    .withMessage('Fecha de inicio inválida'),
  
  body('fecha_fin')
    .isISO8601()
    .withMessage('Fecha de fin inválida')
    .custom((fechaFin, { req }) => {
      if (new Date(fechaFin) <= new Date(req.body.fecha_inicio)) {
        throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
      }
      return true;
    }),
  
  body('titulo')
    .optional()
    .isLength({ min: 5, max: 100 })
    .withMessage('El título debe tener entre 5 y 100 caracteres'),
  
  body('descripcion')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres')
];

// Todas las rutas requieren autenticación de admin u organizador
router.use(auth);
router.use(rolesAuth('administrador', 'organizador'));

// Rutas
router.post('/generate', generateReportValidation, generateReport);
router.get('/', getReports);
router.get('/:id', getReportById);
router.delete('/:id', deleteReport);

module.exports = router;
