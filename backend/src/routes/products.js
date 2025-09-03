const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getProductStats
} = require('../controllers/productController');
const { auth, productorAuth, rolesAuth } = require('../middleware/auth');

const router = express.Router();

// Validaciones
const createProductValidation = [
  body('nombre_producto')
    .notEmpty()
    .withMessage('El nombre del producto es obligatorio')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('descripcion')
    .notEmpty()
    .withMessage('La descripción es obligatoria')
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('precio')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  
  body('categoria')
    .isIn(['plato_principal', 'entrada', 'postre', 'bebida', 'snack'])
    .withMessage('Categoría inválida'),
  
  body('ingredientes')
    .optional()
    .isArray()
    .withMessage('Los ingredientes deben ser un array'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero positivo'),
  
  body('calorias')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Las calorías deben ser un número entero positivo'),
  
  body('tiempo_preparacion')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El tiempo de preparación debe ser un número entero positivo'),
  
  body('es_vegetariano')
    .optional()
    .isBoolean()
    .withMessage('El campo vegetariano debe ser booleano'),
  
  body('es_vegano')
    .optional()
    .isBoolean()
    .withMessage('El campo vegano debe ser booleano'),
  
  body('contiene_gluten')
    .optional()
    .isBoolean()
    .withMessage('El campo contiene gluten debe ser booleano')
];

const updateProductValidation = [
  body('nombre_producto')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('descripcion')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres'),
  
  body('precio')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  
  body('categoria')
    .optional()
    .isIn(['plato_principal', 'entrada', 'postre', 'bebida', 'snack'])
    .withMessage('Categoría inválida'),
  
  body('disponible')
    .optional()
    .isBoolean()
    .withMessage('El campo disponible debe ser booleano'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero positivo')
];

// Rutas públicas
router.get('/', getProducts);
router.get('/:id', getProductById);

// Rutas privadas
router.use(auth);

// Rutas para productores y administradores
router.get('/my/products', productorAuth, getMyProducts);
router.post('/', productorAuth, createProductValidation, createProduct);
router.put('/:id', productorAuth, updateProductValidation, updateProduct);
router.delete('/:id', productorAuth, deleteProduct);

// Rutas para administradores y organizadores
router.get('/stats/overview', rolesAuth('administrador', 'organizador'), getProductStats);

module.exports = router;
