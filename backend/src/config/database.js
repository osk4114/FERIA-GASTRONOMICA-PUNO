const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Verificar que existe la URI de MongoDB
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI no está definida en las variables de entorno');
      console.log('📝 Revisa el archivo .env y configura MongoDB Atlas');
      console.log('📖 Ver instrucciones en: MONGODB_ATLAS_SETUP.md');
      process.exit(1);
    }

    console.log('🔄 Conectando a MongoDB Atlas...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB conectado exitosamente!`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    console.log(`🔗 Tipo: MongoDB Atlas (Cloud)`);
    
    // Evento para cuando se desconecte
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB desconectado');
    });

    // Evento para errores
    mongoose.connection.on('error', (err) => {
      console.error('💥 Error de MongoDB:', err.message);
    });

    // Evento para reconexión
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconectado');
    });

  } catch (error) {
    console.error('❌ Error conectando a MongoDB Atlas:');
    console.error(`   Mensaje: ${error.message}`);
    
    if (error.message.includes('authentication failed')) {
      console.log('🔑 Problema de autenticación:');
      console.log('   - Verifica usuario y contraseña en Atlas');
      console.log('   - Revisa el string de conexión en .env');
    }
    
    if (error.message.includes('network')) {
      console.log('🌐 Problema de red:');
      console.log('   - Verifica tu conexión a internet');
      console.log('   - Revisa que la IP esté permitida en Atlas');
    }
    
    console.log('📖 Ver guía completa en: MONGODB_ATLAS_SETUP.md');
    process.exit(1);
  }
};

module.exports = connectDB;
