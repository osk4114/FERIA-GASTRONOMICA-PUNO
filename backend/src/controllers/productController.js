const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      categoria, 
      disponible, 
      search,
      productor,
      precioMin,
      precioMax,
      sortBy = 'fechaRegistro',
      order = 'desc'
    } = req.query;

    // Construir filtros
    const filter = {};
    
    if (categoria) filter.categoria = categoria;
    if (disponible !== undefined) filter.disponible = disponible === 'true';
    if (productor) filter.productor_id = productor;
    
    // Filtro de precio
    if (precioMin || precioMax) {
      filter.precio = {};
      if (precioMin) filter.precio.$gte = parseFloat(precioMin);
      if (precioMax) filter.precio.$lte = parseFloat(precioMax);
    }
    
    // Búsqueda por texto
    if (search) {
      filter.$or = [
        { nombre_producto: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } },
        { ingredientes: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Paginación y ordenamiento
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObject = { [sortBy]: sortOrder };

    const products = await Product.find(filter)
      .populate('productor_id', 'nombre negocio telefono')
      .sort(sortObject)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('productor_id', 'nombre negocio telefono direccion');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        product
      }
    });

  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Crear nuevo producto
// @route   POST /api/products
// @access  Private (Productor, Admin)
const createProduct = async (req, res) => {
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
      nombre_producto,
      descripcion,
      precio,
      categoria,
      ingredientes,
      origen,
      stock,
      imagen_url,
      calorias,
      tiempo_preparacion,
      es_vegetariano,
      es_vegano,
      contiene_gluten
    } = req.body;

    // El productor_id será el usuario autenticado (si es productor) o el especificado (si es admin)
    let productor_id = req.user._id;
    
    // Si es admin, puede crear productos para otros productores
    if (req.user.rol === 'administrador' && req.body.productor_id) {
      productor_id = req.body.productor_id;
    }

    const productData = {
      productor_id,
      nombre_producto,
      descripcion,
      precio,
      categoria,
      ingredientes: ingredientes || [],
      origen: origen || 'Puno',
      stock: stock || 0,
      imagen_url,
      calorias,
      tiempo_preparacion,
      es_vegetariano: es_vegetariano || false,
      es_vegano: es_vegano || false,
      contiene_gluten: contiene_gluten || false
    };

    const product = await Product.create(productData);
    await product.populate('productor_id', 'nombre negocio telefono');

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: {
        product
      }
    });

  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Actualizar producto
// @route   PUT /api/products/:id
// @access  Private (Dueño del producto o Admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Verificar permisos: solo el dueño del producto o admin pueden modificar
    if (req.user.rol !== 'administrador' && 
        product.productor_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para modificar este producto'
      });
    }

    const updateData = { ...req.body };
    
    // No permitir cambiar el productor_id a menos que sea admin
    if (req.user.rol !== 'administrador') {
      delete updateData.productor_id;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('productor_id', 'nombre negocio telefono');

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: {
        product: updatedProduct
      }
    });

  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Eliminar producto
// @route   DELETE /api/products/:id
// @access  Private (Dueño del producto o Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Verificar permisos
    if (req.user.rol !== 'administrador' && 
        product.productor_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este producto'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener productos del productor autenticado
// @route   GET /api/products/my-products
// @access  Private (Productor)
const getMyProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, disponible, categoria } = req.query;

    const filter = { productor_id: req.user._id };
    if (disponible !== undefined) filter.disponible = disponible === 'true';
    if (categoria) filter.categoria = categoria;

    const products = await Product.find(filter)
      .sort({ fechaRegistro: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo mis productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// @desc    Obtener estadísticas de productos
// @route   GET /api/products/stats
// @access  Private (Admin, Organizador)
const getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const availableProducts = await Product.countDocuments({ disponible: true });
    
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$categoria',
          count: { $sum: 1 },
          avgPrice: { $avg: '$precio' }
        }
      }
    ]);

    const producerStats = await Product.aggregate([
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
        $project: {
          productor: '$productor.nombre',
          negocio: '$productor.negocio',
          productCount: 1,
          avgPrice: 1
        }
      },
      {
        $sort: { productCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: {
        total: totalProducts,
        disponibles: availableProducts,
        porCategoria: categoryStats,
        topProductores: producerStats
      }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getProductStats
};
