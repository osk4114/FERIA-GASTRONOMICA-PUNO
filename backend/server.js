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

// Importar modelo de sesiones para limpieza
const Session = require('./src/models/Session');

// Crear aplicación Express
const app = express();

// Conectar a MongoDB
connectDB().then(async () => {
  // Limpiar sesiones expiradas al iniciar el servidor
  try {
    console.log('🧹 Limpiando sesiones expiradas...');
    const result = await Session.cleanExpiredSessions();
    console.log(`✅ ${result.deletedCount} sesiones expiradas eliminadas`);
    
    // También invalidar todas las sesiones activas (reinicio del servidor)
    const invalidatedResult = await Session.updateMany(
      { isActive: true },
      { 
        isActive: false,
        invalidatedAt: new Date(),
        invalidationReason: 'Servidor reiniciado'
      }
    );
    console.log(`🔄 ${invalidatedResult.modifiedCount} sesiones activas invalidadas por reinicio`);
  } catch (error) {
    console.error('❌ Error limpiando sesiones:', error.message);
  }
});

// Configuración de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Configuración de CORS para red local
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (apps móviles, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Permitir localhost y 127.0.0.1 en cualquier puerto
    if (origin.match(/^https?:\/\/(localhost|127\.0\.0\.1):\d+$/)) {
      return callback(null, true);
    }
    
    // Permitir IPs de red local (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    if (origin.match(/^https?:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+):\d+$/)) {
      return callback(null, true);
    }
    
    // Si tienes una URL específica de frontend, también la permitimos
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    
    // Para desarrollo, permite cualquier origen
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    callback(new Error('No permitido por CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
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
const sessionRoutes = require('./src/routes/sessions');
const adminRoutes = require('./src/routes/admin');

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
      reports: '/api/reports',
      sessions: '/api/sessions',
      admin: '/api/admin'
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
app.use('/api/sessions', sessionRoutes);
app.use('/api/admin', adminRoutes);

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
const HOST = process.env.HOST || '0.0.0.0'; // Escuchar en todas las interfaces de red

// Iniciar servidor
app.listen(PORT, HOST, () => {
  console.log('🚀=================================');
  console.log(`🎯 Servidor corriendo en: http://${HOST}:${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Acceso local: http://localhost:${PORT}`);
  console.log(`🌐 Acceso red local: http://[TU_IP]:${PORT}`);
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
