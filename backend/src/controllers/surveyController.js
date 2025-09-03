const Survey = require('../models/Survey');
const { validationResult } = require('express-validator');

// @desc    Crear nueva encuesta
// @route   POST /api/surveys
// @access  Private (Visitante, Admin)
const createSurvey = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos',
        errors: errors.array()
      });
    }

    const {
      satisfaccion_general,
      calidad_productos,
      atencion_cliente,
      variedad_productos,
      precios,
      organizacion_evento,
      productos_favoritos,
      comentarios,
      recomendaria,
      volveria,
      procedencia
    } = req.body;

    const surveyData = {
      visitante_id: req.user._id,
      respuestas: {
        satisfaccion_general,
        calidad_productos,
        atencion_cliente,
        variedad_productos,
        precios,
        organizacion_evento,
        productos_favoritos: productos_favoritos || [],
        comentarios: comentarios || '',
        recomendaria,
        volveria,
        procedencia
      },
      ip_address: req.ip || req.connection.remoteAddress
    };

    const survey = await Survey.create(surveyData);

    res.status(201).json({
      success: true,
      message: 'Encuesta enviada exitosamente. ¡Gracias por tu participación!',
      data: {
        survey: {
          id: survey._id,
          fecha: survey.fecha,
          promedio_satisfaccion: survey.promedioSatisfaccion()
        }
      }
    });

  } catch (error) {
    console.error('Error creando encuesta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener todas las encuestas
// @route   GET /api/surveys
// @access  Private (Admin, Organizador)
const getSurveys = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      procedencia,
      fechaInicio,
      fechaFin,
      minSatisfaccion,
      maxSatisfaccion
    } = req.query;

    // Construir filtros
    const filter = {};
    
    if (procedencia) filter['respuestas.procedencia'] = procedencia;
    
    // Filtro por fecha
    if (fechaInicio || fechaFin) {
      filter.fecha = {};
      if (fechaInicio) filter.fecha.$gte = new Date(fechaInicio);
      if (fechaFin) filter.fecha.$lte = new Date(fechaFin);
    }

    const surveys = await Survey.find(filter)
      .populate('visitante_id', 'nombre email')
      .sort({ fecha: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Survey.countDocuments(filter);

    // Calcular promedios para cada encuesta
    const surveysWithAverage = surveys.map(survey => ({
      ...survey.toObject(),
      promedio_satisfaccion: survey.promedioSatisfaccion()
    }));

    // Filtrar por satisfacción si se especifica
    let filteredSurveys = surveysWithAverage;
    if (minSatisfaccion || maxSatisfaccion) {
      filteredSurveys = surveysWithAverage.filter(survey => {
        const promedio = parseFloat(survey.promedio_satisfaccion);
        let incluir = true;
        if (minSatisfaccion) incluir = incluir && promedio >= parseFloat(minSatisfaccion);
        if (maxSatisfaccion) incluir = incluir && promedio <= parseFloat(maxSatisfaccion);
        return incluir;
      });
    }

    res.json({
      success: true,
      data: {
        surveys: filteredSurveys,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo encuestas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener una encuesta por ID
// @route   GET /api/surveys/:id
// @access  Private (Admin, Organizador, Dueño de la encuesta)
const getSurveyById = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id)
      .populate('visitante_id', 'nombre email');
    
    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Encuesta no encontrada'
      });
    }

    // Verificar permisos: admin, organizador o dueño de la encuesta
    if (req.user.rol !== 'administrador' && 
        req.user.rol !== 'organizador' &&
        survey.visitante_id._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver esta encuesta'
      });
    }

    res.json({
      success: true,
      data: {
        survey: {
          ...survey.toObject(),
          promedio_satisfaccion: survey.promedioSatisfaccion()
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo encuesta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener mis encuestas
// @route   GET /api/surveys/my-surveys
// @access  Private (Visitante)
const getMySurveys = async (req, res) => {
  try {
    const surveys = await Survey.find({ visitante_id: req.user._id })
      .sort({ fecha: -1 });

    const surveysWithAverage = surveys.map(survey => ({
      id: survey._id,
      fecha: survey.fecha,
      promedio_satisfaccion: survey.promedioSatisfaccion(),
      procedencia: survey.respuestas.procedencia,
      recomendaria: survey.respuestas.recomendaria,
      volveria: survey.respuestas.volveria
    }));

    res.json({
      success: true,
      data: {
        surveys: surveysWithAverage,
        total: surveys.length
      }
    });

  } catch (error) {
    console.error('Error obteniendo mis encuestas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener estadísticas de encuestas
// @route   GET /api/surveys/stats
// @access  Private (Admin, Organizador)
const getSurveyStats = async (req, res) => {
  try {
    const totalSurveys = await Survey.countDocuments();
    
    // Estadísticas por procedencia
    const procedenciaStats = await Survey.aggregate([
      {
        $group: {
          _id: '$respuestas.procedencia',
          count: { $sum: 1 },
          promedio_satisfaccion: { $avg: '$respuestas.satisfaccion_general' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Promedios generales
    const promedios = await Survey.aggregate([
      {
        $group: {
          _id: null,
          satisfaccion_general: { $avg: '$respuestas.satisfaccion_general' },
          calidad_productos: { $avg: '$respuestas.calidad_productos' },
          atencion_cliente: { $avg: '$respuestas.atencion_cliente' },
          variedad_productos: { $avg: '$respuestas.variedad_productos' },
          precios: { $avg: '$respuestas.precios' },
          organizacion_evento: { $avg: '$respuestas.organizacion_evento' }
        }
      }
    ]);

    // Estadísticas de recomendación
    const recomendacionStats = await Survey.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          recomendaria: { $sum: { $cond: ['$respuestas.recomendaria', 1, 0] } },
          volveria: { $sum: { $cond: ['$respuestas.volveria', 1, 0] } }
        }
      }
    ]);

    // Productos más mencionados
    const productosFavoritos = await Survey.aggregate([
      {
        $unwind: '$respuestas.productos_favoritos'
      },
      {
        $group: {
          _id: '$respuestas.productos_favoritos',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Encuestas por día (últimos 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const encuestasPorDia = await Survey.aggregate([
      {
        $match: {
          fecha: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$fecha' }
          },
          count: { $sum: 1 },
          promedio_satisfaccion: { $avg: '$respuestas.satisfaccion_general' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const stats = {
      total: totalSurveys,
      porProcedencia: procedenciaStats,
      promedios: promedios[0] || {},
      recomendacion: {
        total: recomendacionStats[0]?.total || 0,
        recomendaria: recomendacionStats[0]?.recomendaria || 0,
        volveria: recomendacionStats[0]?.volveria || 0,
        porcentaje_recomendacion: recomendacionStats[0]?.total ? 
          ((recomendacionStats[0].recomendaria / recomendacionStats[0].total) * 100).toFixed(2) : 0,
        porcentaje_volveria: recomendacionStats[0]?.total ? 
          ((recomendacionStats[0].volveria / recomendacionStats[0].total) * 100).toFixed(2) : 0
      },
      productos_favoritos: productosFavoritos,
      tendencia_diaria: encuestasPorDia
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas de encuestas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Eliminar encuesta
// @route   DELETE /api/surveys/:id
// @access  Private (Admin, Dueño de la encuesta)
const deleteSurvey = async (req, res) => {
  try {
    const survey = await Survey.findById(req.params.id);
    
    if (!survey) {
      return res.status(404).json({
        success: false,
        message: 'Encuesta no encontrada'
      });
    }

    // Verificar permisos: admin o dueño de la encuesta
    if (req.user.rol !== 'administrador' && 
        survey.visitante_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta encuesta'
      });
    }

    await Survey.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Encuesta eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando encuesta:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  createSurvey,
  getSurveys,
  getSurveyById,
  getMySurveys,
  getSurveyStats,
  deleteSurvey
};
