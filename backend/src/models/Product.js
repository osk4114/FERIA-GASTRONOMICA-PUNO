const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nombre_producto: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  categoria: {
    type: String,
    enum: ['plato_principal', 'entrada', 'postre', 'bebida', 'snack'],
    required: true
  },
  ingredientes: [{
    type: String,
    trim: true
  }],
  origen: {
    type: String,
    default: 'Puno',
    trim: true
  },
  disponible: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  imagen_url: {
    type: String
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  // Información nutricional opcional
  calorias: Number,
  tiempo_preparacion: Number, // en minutos
  es_vegetariano: {
    type: Boolean,
    default: false
  },
  es_vegano: {
    type: Boolean,
    default: false
  },
  contiene_gluten: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índice para búsquedas eficientes
productSchema.index({ productor_id: 1, nombre_producto: 1 });
productSchema.index({ categoria: 1, disponible: 1 });

// Método para obtener información completa del producto
productSchema.methods.informacionCompleta = async function() {
  await this.populate('productor_id', 'nombre negocio telefono');
  return this;
};

module.exports = mongoose.model('Product', productSchema);
