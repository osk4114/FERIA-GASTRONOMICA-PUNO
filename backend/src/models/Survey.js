const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  visitante_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  respuestas: {
    // Satisfacción general (1-5)
    satisfaccion_general: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    // Calidad de los productos (1-5)
    calidad_productos: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    // Atención al cliente (1-5)
    atencion_cliente: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    // Variedad de productos (1-5)
    variedad_productos: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    // Precios (1-5)
    precios: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    // Organización del evento (1-5)
    organizacion_evento: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    // Productos favoritos (lista)
    productos_favoritos: [{
      type: String,
      trim: true
    }],
    // Comentarios adicionales
    comentarios: {
      type: String,
      maxlength: [500, 'Los comentarios no pueden exceder 500 caracteres']
    },
    // ¿Recomendaría el evento?
    recomendaria: {
      type: Boolean,
      required: true
    },
    // ¿Volvería el próximo año?
    volveria: {
      type: Boolean,
      required: true
    },
    // Procedencia del visitante
    procedencia: {
      type: String,
      enum: ['Puno', 'Lima', 'Arequipa', 'Cusco', 'Bolivia', 'Otro'],
      required: true
    }
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  ip_address: {
    type: String
  },
  completada: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice para consultas eficientes
surveySchema.index({ fecha: -1 });
surveySchema.index({ 'respuestas.procedencia': 1 });

// Método para calcular promedio de satisfacción
surveySchema.methods.promedioSatisfaccion = function() {
  const respuestas = this.respuestas;
  const campos = [
    'satisfaccion_general',
    'calidad_productos', 
    'atencion_cliente',
    'variedad_productos',
    'precios',
    'organizacion_evento'
  ];
  
  const suma = campos.reduce((total, campo) => total + respuestas[campo], 0);
  return (suma / campos.length).toFixed(2);
};

module.exports = mongoose.model('Survey', surveySchema);
