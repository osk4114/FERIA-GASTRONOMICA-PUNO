const express = require('express');
const {
  getActiveSessions,
  getSessionStats,
  invalidateSession,
  cleanupSessions
} = require('../controllers/sessionController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación de administrador
router.use(auth);
router.use(adminAuth);

// Rutas de gestión de sesiones
router.get('/active', getActiveSessions);           // Listar sesiones activas
router.get('/stats', getSessionStats);              // Estadísticas de sesiones
router.delete('/:sessionId', invalidateSession);    // Invalidar sesión específica
router.post('/cleanup', cleanupSessions);           // Limpiar sesiones expiradas

module.exports = router;
