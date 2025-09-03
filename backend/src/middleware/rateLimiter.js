const rateLimit = require('express-rate-limit');

// Rate limiting para autenticación (más restrictivo)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por IP
  message: {
    success: false,
    message: 'Demasiados intentos de inicio de sesión. Intente nuevamente en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting general para API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por IP
  message: {
    success: false,
    message: 'Demasiadas peticiones. Intente nuevamente en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting para encuestas (más permisivo)
const surveyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // 10 encuestas por hora por IP
  message: {
    success: false,
    message: 'Límite de encuestas alcanzado. Intente nuevamente en 1 hora.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  apiLimiter,
  surveyLimiter
};
