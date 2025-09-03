const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  organizador_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tipo_reporte: {
    type: String,
    enum: ['ventas', 'asistencia', 'satisfaccion', 'productos', 'general'],
    required: true
  },
  titulo: {
    type: String,
    required: [true, 'El título del reporte es obligatorio'],
    trim: true,
    maxlength: [100, 'El título no puede exceder 100 caracteres']
  },
  descripcion: {
    type: String,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  metricas: {
    // Métricas de ventas
    total_ventas: {
      type: Number,
      default: 0
    },
    productos_vendidos: {
      type: Number,
      default: 0
    },
    ingreso_total: {
      type: Number,
      default: 0
    },
    
    // Métricas de asistencia
    total_visitantes: {
      type: Number,
      default: 0
    },
    visitantes_por_dia: [{
      fecha: Date,
      cantidad: Number
    }],
    
    // Métricas de satisfacción
    promedio_satisfaccion: {
      type: Number,
      default: 0
    },
    total_encuestas: {
      type: Number,
      default: 0
    },
    porcentaje_recomendacion: {
      type: Number,
      default: 0
    },
    
    // Productos más populares
    productos_populares: [{
      producto_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      nombre: String,
      cantidad_vendida: Number,
      ingresos: Number
    }],
    
    // Productores más exitosos
    productores_destacados: [{
      productor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      nombre: String,
      total_ventas: Number,
      productos_ofrecidos: Number
    }]
  },
  periodo: {
    fecha_inicio: {
      type: Date,
      required: true
    },
    fecha_fin: {
      type: Date,
      required: true
    }
  },
  generado_automaticamente: {
    type: Boolean,
    default: false
  },
  fecha_generacion: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['borrador', 'completado', 'archivado'],
    default: 'completado'
  }
}, {
  timestamps: true
});

// Índices para consultas eficientes
reportSchema.index({ organizador_id: 1, fecha_generacion: -1 });
reportSchema.index({ tipo_reporte: 1, 'periodo.fecha_inicio': 1 });

// Método para generar resumen ejecutivo
reportSchema.methods.resumenEjecutivo = function() {
  const metricas = this.metricas;
  return {
    titulo: this.titulo,
    periodo: this.periodo,
    puntos_clave: [
      `Total de ventas: S/ ${metricas.ingreso_total || 0}`,
      `Productos vendidos: ${metricas.productos_vendidos || 0}`,
      `Visitantes totales: ${metricas.total_visitantes || 0}`,
      `Satisfacción promedio: ${metricas.promedio_satisfaccion || 0}/5`,
      `Recomendación: ${metricas.porcentaje_recomendacion || 0}%`
    ]
  };
};

module.exports = mongoose.model('Report', reportSchema);
