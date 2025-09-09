const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '.env') });

// Importar modelo de usuario
const User = require('./src/models/User');

const debugUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    const users = await User.find({}).select('nombre email rol activo');
    
    console.log('\n👥 Usuarios en la base de datos:');
    console.log('================================');
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.nombre}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rol: ${user.rol}`);
      console.log(`   Activo: ${user.activo}`);
      console.log('   ---');
    });

    console.log(`\nTotal de usuarios: ${users.length}`);

    // Probar login con cada usuario
    console.log('\n🔐 Probando autenticación...');
    console.log('================================');

    const testCredentials = [
      { email: 'admin@feriapuno.com', password: 'admin123' },
      { email: 'rosa.mamani@gmail.com', password: 'productor123' },
      { email: 'carlos.quispe@gmail.com', password: 'productor123' },
      { email: 'maria.condori@gmail.com', password: 'organizador123' },
      { email: 'juan.visitante@gmail.com', password: 'visitante123' }
    ];

    for (const creds of testCredentials) {
      try {
        const user = await User.findOne({ email: creds.email.toLowerCase() });
        if (user) {
          const isValid = await user.compararContraseña(creds.password);
          console.log(`${user.email} - ${isValid ? '✅ OK' : '❌ FAIL'} (${user.rol})`);
        } else {
          console.log(`${creds.email} - ❌ NO EXISTE`);
        }
      } catch (error) {
        console.log(`${creds.email} - ❌ ERROR: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
};

debugUsers();
