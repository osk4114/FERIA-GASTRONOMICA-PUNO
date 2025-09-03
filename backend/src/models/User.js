const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  contraseña: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  rol: {
    type: String,
    enum: ['administrador', 'productor', 'visitante', 'organizador'],
    default: 'visitante',
    required: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  ultimoAcceso: {
    type: Date
  },
  // Campos específicos para productores
  negocio: {
    type: String,
    required: function() { return this.rol === 'productor'; }
  },
  telefono: {
    type: String
  },
  direccion: {
    type: String
  }
}, {
  timestamps: true
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
  // Solo encriptar si la contraseña fue modificada
  if (!this.isModified('contraseña')) return next();
  
  try {
    // Hash de la contraseña con bcrypt
    const salt = await bcrypt.genSalt(12);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.compararContraseña = async function(contraseñaIngresada) {
  return await bcrypt.compare(contraseñaIngresada, this.contraseña);
};

// Método para obtener datos públicos del usuario
userSchema.methods.datosPublicos = function() {
  return {
    id: this._id,
    nombre: this.nombre,
    email: this.email,
    rol: this.rol,
    negocio: this.negocio,
    telefono: this.telefono,
    fechaRegistro: this.fechaRegistro,
    ultimoAcceso: this.ultimoAcceso
  };
};

module.exports = mongoose.model('User', userSchema);
