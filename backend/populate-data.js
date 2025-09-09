const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '.env') });

// Importar modelos
const Product = require('./src/models/Product');
const Survey = require('./src/models/Survey');
const User = require('./src/models/User');

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado para poblar datos adicionales');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Productos adicionales de ejemplo
const sampleProducts = [
  {
    nombre_producto: 'Quinua Real Puno',
    descripcion: 'Quinua orgánica de alta calidad cultivada en el altiplano puneño',
    precio: 12.50,
    categoria: 'plato_principal',
    ingredientes: ['Quinua real', 'Agua'],
    origen: 'Puno, Perú',
    disponible: true,
    stock: 50,
    imagen_url: 'quinua-real.jpg'
  },
  {
    nombre_producto: 'Trucha Frita del Titicaca',
    descripcion: 'Trucha fresca del lago Titicaca preparada con especias tradicionales',
    precio: 25.00,
    categoria: 'plato_principal',
    ingredientes: ['Trucha fresca', 'Ajo', 'Comino', 'Sal', 'Pimienta'],
    origen: 'Lago Titicaca, Puno',
    disponible: true,
    stock: 30,
    imagen_url: 'trucha-frita.jpg'
  },
  {
    nombre_producto: 'Papa Rellena Puneña',
    descripcion: 'Papa amarilla rellena con carne, huevo y aceitunas',
    precio: 8.00,
    categoria: 'entrada',
    ingredientes: ['Papa amarilla', 'Carne molida', 'Huevo', 'Aceitunas'],
    origen: 'Puno, Perú',
    disponible: true,
    stock: 25,
    imagen_url: 'papa-rellena.jpg'
  },
  {
    nombre_producto: 'Thimpu de Tarwi',
    descripcion: 'Guiso tradicional de tarwi con verduras andinas',
    precio: 15.00,
    categoria: 'plato_principal',
    ingredientes: ['Tarwi', 'Papa', 'Cebolla', 'Ají amarillo'],
    origen: 'Puno, Perú',
    disponible: true,
    stock: 20,
    imagen_url: 'thimpu-tarwi.jpg',
    es_vegetariano: true
  },
  {
    nombre_producto: 'Chairo Puneño',
    descripcion: 'Sopa espesa con chuño, papa, carne y verduras',
    precio: 18.00,
    categoria: 'plato_principal',
    ingredientes: ['Chuño', 'Papa', 'Carne de res', 'Habas', 'Zanahoria'],
    origen: 'Puno, Perú',
    disponible: true,
    stock: 15,
    imagen_url: 'chairo-puneno.jpg'
  },
  {
    nombre_producto: 'Ceviche de Trucha',
    descripcion: 'Trucha marinada en limón con ají y cebolla roja',
    precio: 22.00,
    categoria: 'entrada',
    ingredientes: ['Trucha', 'Limón', 'Ají amarillo', 'Cebolla roja', 'Culantro'],
    origen: 'Puno, Perú',
    disponible: true,
    stock: 18,
    imagen_url: 'ceviche-trucha.jpg'
  },
  {
    nombre_producto: 'Cancacho',
    descripcion: 'Cordero asado a las brasas con papas nativas',
    precio: 35.00,
    categoria: 'plato_principal',
    ingredientes: ['Cordero', 'Papas nativas', 'Ají panca', 'Chicha de jora'],
    origen: 'Puno, Perú',
    disponible: true,
    stock: 10,
    imagen_url: 'cancacho.jpg'
  },
  {
    nombre_producto: 'Api Morado',
    descripcion: 'Bebida caliente de maíz morado con especias',
    precio: 5.00,
    categoria: 'bebida',
    ingredientes: ['Maíz morado', 'Canela', 'Clavo', 'Azúcar', 'Limón'],
    origen: 'Puno, Perú',
    disponible: true,
    stock: 40,
    imagen_url: 'api-morado.jpg'
  },
  {
    nombre_producto: 'Mazamorra de Quinua',
    descripcion: 'Postre tradicional de quinua con leche y canela',
    precio: 7.00,
    categoria: 'postre',
    ingredientes: ['Quinua', 'Leche', 'Azúcar', 'Canela', 'Vainilla'],
    origen: 'Puno, Perú',
    disponible: true,
    stock: 22,
    imagen_url: 'mazamorra-quinua.jpg',
    es_vegetariano: true
  },
  {
    nombre_producto: 'Tunta Phuti',
    descripcion: 'Snack crujiente de papa deshidratada tradicional',
    precio: 3.50,
    categoria: 'snack',
    ingredientes: ['Tunta', 'Sal', 'Aceite'],
    origen: 'Puno, Perú',
    disponible: true,
    stock: 60,
    imagen_url: 'tunta-phuti.jpg',
    es_vegetariano: true,
    es_vegano: true
  }
];

// Encuestas de ejemplo
const sampleSurveys = [
  {
    respuestas: {
      satisfaccion_general: 5,
      calidad_productos: 5,
      atencion_cliente: 4,
      variedad_productos: 5,
      precios: 4,
      organizacion_evento: 5,
      productos_favoritos: ['Quinua Real Puno', 'Trucha Frita del Titicaca'],
      comentarios: 'Excelente comida tradicional, muy auténtica y deliciosa',
      recomendaria: true,
      volveria: true,
      procedencia: 'Lima'
    }
  },
  {
    respuestas: {
      satisfaccion_general: 4,
      calidad_productos: 4,
      atencion_cliente: 5,
      variedad_productos: 4,
      precios: 3,
      organizacion_evento: 4,
      productos_favoritos: ['Papa Rellena Puneña', 'Chairo Puneño'],
      comentarios: 'Muy buena variedad de platos típicos. Precios un poco altos.',
      recomendaria: true,
      volveria: true,
      procedencia: 'Arequipa'
    }
  },
  {
    respuestas: {
      satisfaccion_general: 5,
      calidad_productos: 5,
      atencion_cliente: 5,
      variedad_productos: 5,
      precios: 4,
      organizacion_evento: 5,
      productos_favoritos: ['Ceviche de Trucha', 'Api Morado'],
      comentarios: 'Increíble sabor, productos frescos del lago',
      recomendaria: true,
      volveria: true,
      procedencia: 'Cusco'
    }
  },
  {
    respuestas: {
      satisfaccion_general: 4,
      calidad_productos: 4,
      atencion_cliente: 4,
      variedad_productos: 5,
      precios: 4,
      organizacion_evento: 4,
      productos_favoritos: ['Thimpu de Tarwi'],
      comentarios: 'Interesante propuesta vegetariana con productos locales',
      recomendaria: true,
      volveria: true,
      procedencia: 'Puno'
    }
  },
  {
    respuestas: {
      satisfaccion_general: 3,
      calidad_productos: 4,
      atencion_cliente: 3,
      variedad_productos: 3,
      precios: 2,
      organizacion_evento: 3,
      productos_favoritos: ['Cancacho'],
      comentarios: 'Buena comida pero algo caro para el presupuesto',
      recomendaria: false,
      volveria: false,
      procedencia: 'Bolivia'
    }
  },
  {
    respuestas: {
      satisfaccion_general: 5,
      calidad_productos: 5,
      atencion_cliente: 5,
      variedad_productos: 4,
      precios: 5,
      organizacion_evento: 4,
      productos_favoritos: ['Tunta Phuti', 'Mazamorra de Quinua'],
      comentarios: 'Excelente variedad de productos vegetarianos y veganos',
      recomendaria: true,
      volveria: true,
      procedencia: 'Lima'
    }
  },
  {
    respuestas: {
      satisfaccion_general: 4,
      calidad_productos: 3,
      atencion_cliente: 4,
      variedad_productos: 4,
      precios: 3,
      organizacion_evento: 4,
      productos_favoritos: ['Chairo Puneño', 'Api Morado'],
      comentarios: 'Buena experiencia en general, podrían mejorar la presentación',
      recomendaria: true,
      volveria: true,
      procedencia: 'Otro'
    }
  }
];

// Función para poblar datos
const populateAdditionalData = async () => {
  try {
    console.log('🌱 Poblando datos adicionales...');

    // Buscar usuarios para asignar como productores y visitantes
    const users = await User.find();
    const productores = users.filter(u => u.rol === 'productor');
    const visitantes = users.filter(u => u.rol === 'visitante');

    if (productores.length === 0) {
      console.log('⚠️ No hay productores disponibles. Ejecuta primero seed.js');
      return;
    }

    // Limpiar productos existentes adicionales (mantener los básicos)
    console.log('🧹 Limpiando productos adicionales...');
    
    // Agregar productos con productores aleatorios
    console.log('📦 Agregando productos...');
    for (const productData of sampleProducts) {
      const randomProducer = productores[Math.floor(Math.random() * productores.length)];
      
      const existingProduct = await Product.findOne({ nombre_producto: productData.nombre_producto });
      if (!existingProduct) {
        await Product.create({
          ...productData,
          productor_id: randomProducer._id
        });
        console.log(`✅ Producto agregado: ${productData.nombre_producto}`);
      } else {
        console.log(`⏭️ Producto ya existe: ${productData.nombre_producto}`);
      }
    }

    // Agregar encuestas con visitantes aleatorios
    if (visitantes.length > 0) {
      console.log('📋 Agregando encuestas...');
      for (const surveyData of sampleSurveys) {
        const randomVisitante = visitantes[Math.floor(Math.random() * visitantes.length)];
        
        await Survey.create({
          visitante_id: randomVisitante._id,
          respuestas: surveyData.respuestas,
          fecha: new Date(),
          ip_address: '127.0.0.1',
          completada: true
        });
        console.log(`✅ Encuesta agregada con satisfacción: ${surveyData.respuestas.satisfaccion_general}`);
      }
    } else {
      console.log('⚠️ No hay visitantes disponibles para crear encuestas');
    }

    console.log('🎉 ¡Datos adicionales poblados exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`📦 Productos totales: ${await Product.countDocuments()}`);
    console.log(`📋 Encuestas totales: ${await Survey.countDocuments()}`);
    console.log(`👥 Usuarios totales: ${await User.countDocuments()}`);

  } catch (error) {
    console.error('❌ Error poblando datos adicionales:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Ejecutar script
connectDB().then(populateAdditionalData);
