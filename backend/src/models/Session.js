const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  ip_address: {
    type: String,
    required: true
  },
  user_agent: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Información adicional para auditoría
  loginLocation: {
    type: String
  },
  deviceInfo: {
    type: String
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
sessionSchema.index({ user_id: 1 });
sessionSchema.index({ sessionId: 1 });
sessionSchema.index({ token: 1 });
sessionSchema.index({ expiresAt: 1 });
sessionSchema.index({ isActive: 1 });

// Índice TTL para eliminar sesiones expiradas automáticamente
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Método para verificar si la sesión está activa
sessionSchema.methods.isSessionActive = function() {
  return this.isActive && this.expiresAt > new Date();
};

// Método para invalidar sesión
sessionSchema.methods.invalidate = function() {
  this.isActive = false;
  return this.save();
};

// Método para actualizar actividad
sessionSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

// Middleware para eliminar sesiones del mismo usuario al crear una nueva
sessionSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Invalidar todas las sesiones activas del mismo usuario
    await mongoose.model('Session').updateMany(
      { 
        user_id: this.user_id,
        _id: { $ne: this._id },
        isActive: true 
      },
      { 
        isActive: false,
        invalidatedAt: new Date(),
        invalidationReason: 'Nueva sesión iniciada'
      }
    );
  }
  next();
});

// Método estático para limpiar sesiones expiradas
sessionSchema.statics.cleanExpiredSessions = async function() {
  const result = await this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isActive: false }
    ]
  });
  return result;
};

// Método estático para invalidar todas las sesiones de un usuario
sessionSchema.statics.invalidateUserSessions = async function(userId) {
  const result = await this.updateMany(
    { user_id: userId, isActive: true },
    { 
      isActive: false,
      invalidatedAt: new Date(),
      invalidationReason: 'Sesiones invalidadas por administrador'
    }
  );
  return result;
};

// Método estático para obtener sesiones activas de un usuario
sessionSchema.statics.getActiveSessions = async function(userId) {
  return this.find({
    user_id: userId,
    isActive: true,
    expiresAt: { $gt: new Date() }
  }).sort({ lastActivity: -1 });
};

module.exports = mongoose.model('Session', sessionSchema);
