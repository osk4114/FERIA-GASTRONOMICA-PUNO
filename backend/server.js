const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno desde el directorio correcto
dotenv.config({ path: path.join(__dirname, '.env') });

// Importar configuración de base de datos
const connectDB = require('./src/config/database');

// Importar middlewares
const errorHandler = require('./src/middleware/errorHandler');
const { apiLimiter } = require('./src/middleware/rateLimiter');

// Crear aplicación Express
const app = express();

// Conectar a MongoDB
connectDB();

// Configuración de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Configuración de CORS
app.use(cors({
  origin: [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
    process.env.FRONTEND_URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
app.use(apiLimiter);

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

// Importar rutas
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const productRoutes = require('./src/routes/products');
const surveyRoutes = require('./src/routes/surveys');
const reportRoutes = require('./src/routes/reports');

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎉 API Feria Gastronómica Puno - Backend funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      surveys: '/api/surveys',
      reports: '/api/reports'
    }
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Registrar rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/reports', reportRoutes);

// Manejo de rutas no encontradas
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`
  });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Puerto del servidor
const PORT = process.env.PORT || 3000;
const HOST = process.env.LOCAL_IP || 'localhost';

// Iniciar servidor
app.listen(PORT, HOST, () => {
  console.log('🚀=================================');
  console.log(`🎯 Servidor corriendo en: http://${HOST}:${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Red local: http://${HOST}:${PORT}`);
  console.log('🚀=================================');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err, promise) => {
  console.error('💥 Error no manejado:', err.message);
  // Cerrar servidor
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Excepción no capturada:', err.message);
  process.exit(1);
});

module.exports = app;
