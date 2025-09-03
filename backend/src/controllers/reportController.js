const Report = require('../models/Report');
const Product = require('../models/Product');
const Survey = require('../models/Survey');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Generar reporte automático
// @route   POST /api/reports/generate
// @access  Private (Admin, Organizador)
const generateReport = async (req, res) => {
  try {
    const { tipo_reporte, fecha_inicio, fecha_fin, titulo, descripcion } = req.body;

    const fechaInicio = new Date(fecha_inicio);
    const fechaFin = new Date(fecha_fin);

    let metricas = {};

    switch (tipo_reporte) {
      case 'ventas':
        metricas = await generateVentasMetrics(fechaInicio, fechaFin);
        break;
      case 'asistencia':
        metricas = await generateAsistenciaMetrics(fechaInicio, fechaFin);
        break;
      case 'satisfaccion':
        metricas = await generateSatisfaccionMetrics(fechaInicio, fechaFin);
        break;
      case 'productos':
        metricas = await generateProductosMetrics(fechaInicio, fechaFin);
        break;
      case 'general':
        metricas = await generateGeneralMetrics(fechaInicio, fechaFin);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Tipo de reporte inválido'
        });
    }

    const reportData = {
      organizador_id: req.user._id,
      tipo_reporte,
      titulo: titulo || `Reporte ${tipo_reporte} - ${new Date().toLocaleDateString()}`,
      descripcion: descripcion || `Reporte automático generado para el período del ${fechaInicio.toLocaleDateString()} al ${fechaFin.toLocaleDateString()}`,
      metricas,
      periodo: {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      },
      generado_automaticamente: true
    };

    const report = await Report.create(reportData);
    await report.populate('organizador_id', 'nombre email');

    res.status(201).json({
      success: true,
      message: 'Reporte generado exitosamente',
      data: {
        report,
        resumen: report.resumenEjecutivo()
      }
    });

  } catch (error) {
    console.error('Error generando reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener todos los reportes
// @route   GET /api/reports
// @access  Private (Admin, Organizador)
const getReports = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      tipo_reporte, 
      organizador,
      fechaInicio,
      fechaFin 
    } = req.query;

    const filter = {};
    
    if (tipo_reporte) filter.tipo_reporte = tipo_reporte;
    if (organizador) filter.organizador_id = organizador;
    
    // Solo organizadores ven sus propios reportes (excepto admin)
    if (req.user.rol === 'organizador') {
      filter.organizador_id = req.user._id;
    }
    
    if (fechaInicio || fechaFin) {
      filter.fecha_generacion = {};
      if (fechaInicio) filter.fecha_generacion.$gte = new Date(fechaInicio);
      if (fechaFin) filter.fecha_generacion.$lte = new Date(fechaFin);
    }

    const reports = await Report.find(filter)
      .populate('organizador_id', 'nombre email')
      .sort({ fecha_generacion: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Report.countDocuments(filter);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo reportes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener un reporte por ID
// @route   GET /api/reports/:id
// @access  Private (Admin, Organizador dueño)
const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('organizador_id', 'nombre email')
      .populate('metricas.productos_populares.producto_id', 'nombre_producto precio categoria')
      .populate('metricas.productores_destacados.productor_id', 'nombre negocio');
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado'
      });
    }

    // Verificar permisos
    if (req.user.rol === 'organizador' && 
        report.organizador_id._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver este reporte'
      });
    }

    res.json({
      success: true,
      data: {
        report,
        resumen: report.resumenEjecutivo()
      }
    });

  } catch (error) {
    console.error('Error obteniendo reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Eliminar reporte
// @route   DELETE /api/reports/:id
// @access  Private (Admin, Organizador dueño)
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Reporte no encontrado'
      });
    }

    // Verificar permisos
    if (req.user.rol === 'organizador' && 
        report.organizador_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este reporte'
      });
    }

    await Report.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Reporte eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando reporte:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Funciones auxiliares para generar métricas

const generateVentasMetrics = async (fechaInicio, fechaFin) => {
  // Por ahora simularemos datos de ventas
  // En una implementación real, tendríamos una colección de ventas/transacciones
  const productos = await Product.find({
    fechaRegistro: { $gte: fechaInicio, $lte: fechaFin }
  }).populate('productor_id', 'nombre negocio');

  const productosPopulares = productos.slice(0, 10).map(producto => ({
    producto_id: producto._id,
    nombre: producto.nombre_producto,
    cantidad_vendida: Math.floor(Math.random() * 50) + 10, // Simulado
    ingresos: (Math.floor(Math.random() * 50) + 10) * producto.precio
  }));

  return {
    total_ventas: Math.floor(Math.random() * 500) + 100,
    productos_vendidos: productosPopulares.reduce((acc, p) => acc + p.cantidad_vendida, 0),
    ingreso_total: productosPopulares.reduce((acc, p) => acc + p.ingresos, 0),
    productos_populares: productosPopulares
  };
};

const generateAsistenciaMetrics = async (fechaInicio, fechaFin) => {
  const totalVisitantes = await User.countDocuments({
    rol: 'visitante',
    fechaRegistro: { $gte: fechaInicio, $lte: fechaFin }
  });

  // Simular visitantes por día
  const dias = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
  const visitantesPorDia = [];
  
  for (let i = 0; i < dias; i++) {
    const fecha = new Date(fechaInicio);
    fecha.setDate(fecha.getDate() + i);
    visitantesPorDia.push({
      fecha,
      cantidad: Math.floor(Math.random() * 100) + 50
    });
  }

  return {
    total_visitantes: totalVisitantes,
    visitantes_por_dia: visitantesPorDia
  };
};

const generateSatisfaccionMetrics = async (fechaInicio, fechaFin) => {
  const surveys = await Survey.find({
    fecha: { $gte: fechaInicio, $lte: fechaFin }
  });

  if (surveys.length === 0) {
    return {
      promedio_satisfaccion: 0,
      total_encuestas: 0,
      porcentaje_recomendacion: 0
    };
  }

  const promedioSatisfaccion = surveys.reduce((acc, survey) => {
    return acc + parseFloat(survey.promedioSatisfaccion());
  }, 0) / surveys.length;

  const recomendaciones = surveys.filter(s => s.respuestas.recomendaria).length;
  const porcentajeRecomendacion = (recomendaciones / surveys.length) * 100;

  return {
    promedio_satisfaccion: parseFloat(promedioSatisfaccion.toFixed(2)),
    total_encuestas: surveys.length,
    porcentaje_recomendacion: parseFloat(porcentajeRecomendacion.toFixed(2))
  };
};

const generateProductosMetrics = async (fechaInicio, fechaFin) => {
  const productos = await Product.find({
    fechaRegistro: { $gte: fechaInicio, $lte: fechaFin }
  }).populate('productor_id', 'nombre negocio');

  const productoresPorProductos = await Product.aggregate([
    {
      $match: {
        fechaRegistro: { $gte: fechaInicio, $lte: fechaFin }
      }
    },
    {
      $group: {
        _id: '$productor_id',
        productCount: { $sum: 1 },
        avgPrice: { $avg: '$precio' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'productor'
      }
    },
    {
      $unwind: '$productor'
    },
    {
      $sort: { productCount: -1 }
    },
    {
      $limit: 5
    }
  ]);

  const productoresDestacados = productoresPorProductos.map(p => ({
    productor_id: p._id,
    nombre: p.productor.nombre,
    total_ventas: Math.floor(Math.random() * 10000) + 1000, // Simulado
    productos_ofrecidos: p.productCount
  }));

  return {
    productos_populares: productos.slice(0, 10).map(p => ({
      producto_id: p._id,
      nombre: p.nombre_producto,
      cantidad_vendida: Math.floor(Math.random() * 50) + 10,
      ingresos: (Math.floor(Math.random() * 50) + 10) * p.precio
    })),
    productores_destacados: productoresDestacados
  };
};

const generateGeneralMetrics = async (fechaInicio, fechaFin) => {
  const ventasMetrics = await generateVentasMetrics(fechaInicio, fechaFin);
  const asistenciaMetrics = await generateAsistenciaMetrics(fechaInicio, fechaFin);
  const satisfaccionMetrics = await generateSatisfaccionMetrics(fechaInicio, fechaFin);
  const productosMetrics = await generateProductosMetrics(fechaInicio, fechaFin);

  return {
    ...ventasMetrics,
    ...asistenciaMetrics,
    ...satisfaccionMetrics,
    ...productosMetrics
  };
};

module.exports = {
  generateReport,
  getReports,
  getReportById,
  deleteReport
};
