const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '.env') });

// Importar modelos
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Survey = require('./src/models/Survey');
const Report = require('./src/models/Report');

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado para seeding');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Datos de ejemplo
const sampleUsers = [
  {
    nombre: 'Administrador Sistema',
    email: 'admin@feriapuno.com',
    contraseña: 'admin123',
    rol: 'administrador'
  },
  {
    nombre: 'Rosa Mamani',
    email: 'rosa.mamani@gmail.com',
    contraseña: 'productor123',
    rol: 'productor',
    negocio: 'Delicias Puneñas',
    telefono: '951234567',
    direccion: 'Jr. Lima 123, Puno'
  },
  {
    nombre: 'Carlos Quispe',
    email: 'carlos.quispe@gmail.com',
    contraseña: 'productor123',
    rol: 'productor',
    negocio: 'Sabores del Altiplano',
    telefono: '951234568',
    direccion: 'Av. El Sol 456, Puno'
  },
  {
    nombre: 'María Condori',
    email: 'maria.condori@gmail.com',
    contraseña: 'organizador123',
    rol: 'organizador'
  },
  {
    nombre: 'Juan Visitante',
    email: 'juan.visitante@gmail.com',
    contraseña: 'visitante123',
    rol: 'visitante'
  }
];

const createSampleProducts = (users) => {
  const productores = users.filter(u => u.rol === 'productor');
  
  return [
    {
      productor_id: productores[0]._id,
      nombre_producto: 'Quinua Chaufa',
      descripcion: 'Arroz chaufa preparado con quinua orgánica del altiplano puneño, verduras frescas y especias tradicionales.',
      precio: 15.00,
      categoria: 'plato_principal',
      ingredientes: ['quinua', 'verduras', 'soya', 'cebolla china', 'aji amarillo'],
      origen: 'Puno',
      stock: 20,
      calorias: 320,
      tiempo_preparacion: 25,
      es_vegetariano: true,
      es_vegano: false,
      contiene_gluten: false
    },
    {
      productor_id: productores[0]._id,
      nombre_producto: 'Trucha Frita del Titicaca',
      descripcion: 'Trucha fresca del lago Titicaca, frita con hierbas aromáticas y acompañada de papas nativas.',
      precio: 25.00,
      categoria: 'plato_principal',
      ingredientes: ['trucha', 'papas nativas', 'hierbas', 'aceite', 'limón'],
      origen: 'Lago Titicaca',
      stock: 15,
      calorias: 450,
      tiempo_preparacion: 30,
      es_vegetariano: false,
      es_vegano: false,
      contiene_gluten: false
    },
    {
      productor_id: productores[1]._id,
      nombre_producto: 'Empanadas de Quinua',
      descripcion: 'Empanadas horneadas rellenas de quinua, queso fresco y hierbas del altiplano.',
      precio: 8.00,
      categoria: 'entrada',
      ingredientes: ['harina', 'quinua', 'queso fresco', 'cebolla', 'especias'],
      origen: 'Puno',
      stock: 30,
      calorias: 180,
      tiempo_preparacion: 15,
      es_vegetariano: true,
      es_vegano: false,
      contiene_gluten: true
    },
    {
      productor_id: productores[1]._id,
      nombre_producto: 'Api Morado',
      descripcion: 'Bebida caliente tradicional de maíz morado con especias, canela y clavo de olor.',
      precio: 5.00,
      categoria: 'bebida',
      ingredientes: ['maíz morado', 'canela', 'clavo', 'azúcar', 'limón'],
      origen: 'Puno',
      stock: 50,
      calorias: 120,
      tiempo_preparacion: 20,
      es_vegetariano: true,
      es_vegano: true,
      contiene_gluten: false
    },
    {
      productor_id: productores[0]._id,
      nombre_producto: 'Mazamorra de Quinua',
      descripcion: 'Postre cremoso de quinua con leche, canela y frutas de la región.',
      precio: 7.00,
      categoria: 'postre',
      ingredientes: ['quinua', 'leche', 'azúcar', 'canela', 'frutas'],
      origen: 'Puno',
      stock: 25,
      calorias: 200,
      tiempo_preparacion: 35,
      es_vegetariano: true,
      es_vegano: false,
      contiene_gluten: false
    }
  ];
};

const createSampleSurveys = (users, products) => {
  const visitantes = users.filter(u => u.rol === 'visitante');
  
  return [
    {
      visitante_id: visitantes[0]._id,
      respuestas: {
        satisfaccion_general: 5,
        calidad_productos: 5,
        atencion_cliente: 4,
        variedad_productos: 4,
        precios: 4,
        organizacion_evento: 5,
        productos_favoritos: ['Quinua Chaufa', 'Trucha Frita del Titicaca'],
        comentarios: 'Excelente evento, los productos están deliciosos y muy bien preparados.',
        recomendaria: true,
        volveria: true,
        procedencia: 'Lima'
      }
    }
  ];
};

// Función principal de seeding
const seedDatabase = async () => {
  try {
    await connectDB();

    // Limpiar base de datos existente
    console.log('🧹 Limpiando base de datos...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Survey.deleteMany({});
    await Report.deleteMany({});

    // Crear usuarios
    console.log('👥 Creando usuarios...');
    const users = await User.create(sampleUsers);
    console.log(`✅ ${users.length} usuarios creados`);

    // Crear productos
    console.log('🥘 Creando productos...');
    const sampleProductsData = createSampleProducts(users);
    const products = await Product.create(sampleProductsData);
    console.log(`✅ ${products.length} productos creados`);

    // Crear encuestas
    console.log('📊 Creando encuestas...');
    const sampleSurveysData = createSampleSurveys(users, products);
    const surveys = await Survey.create(sampleSurveysData);
    console.log(`✅ ${surveys.length} encuestas creadas`);

    console.log('\n🎉 ¡Base de datos poblada exitosamente!');
    console.log('\n📋 Usuarios creados:');
    users.forEach(user => {
      console.log(`   - ${user.nombre} (${user.email}) - Rol: ${user.rol}`);
    });

    console.log('\n🔑 Credenciales de prueba:');
    console.log('   Admin: admin@feriapuno.com / admin123');
    console.log('   Productor 1: rosa.mamani@gmail.com / productor123');
    console.log('   Productor 2: carlos.quispe@gmail.com / productor123');
    console.log('   Organizador: maria.condori@gmail.com / organizador123');
    console.log('   Visitante: juan.visitante@gmail.com / visitante123');

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Conexión a MongoDB cerrada');
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
