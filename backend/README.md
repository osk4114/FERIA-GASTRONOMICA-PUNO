# Feria Gastronómica Puno - Backend

Backend del sistema modular cliente-servidor para la gestión de feria gastronómica en Puno.

## 🏗️ Arquitectura

- **Framework**: Node.js + Express
- **Base de Datos**: MongoDB
- **Autenticación**: JWT (JSON Web Tokens)
- **Seguridad**: bcryptjs, helmet, rate limiting

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Configuración MongoDB
│   ├── models/
│   │   ├── User.js          # Modelo de usuarios
│   │   ├── Product.js       # Modelo de productos
│   │   ├── Survey.js        # Modelo de encuestas
│   │   └── Report.js        # Modelo de reportes
│   ├── middleware/
│   │   ├── auth.js          # Autenticación JWT
│   │   ├── rateLimiter.js   # Rate limiting
│   │   └── errorHandler.js  # Manejo de errores
│   ├── utils/
│   │   └── jwt.js           # Utilidades JWT
│   └── routes/              # Rutas (próximo paso)
├── .env                     # Variables de entorno
├── package.json
└── server.js               # Servidor principal
```

## 🚀 Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   - Editar `.env` con tu configuración local
   - Configurar IP de la máquina A para red local

3. **Instalar MongoDB:**
   - [Descargar MongoDB Community](https://www.mongodb.com/try/download/community)
   - Seguir instrucciones de instalación para Windows

## 🔧 Configuración

### Variables de Entorno (.env)

```env
# Puerto del servidor
PORT=3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/feria_gastronomica

# JWT Secret
JWT_SECRET=tu_clave_secreta_super_segura

# JWT Expiración
JWT_EXPIRES_IN=24h
JWT_ADMIN_EXPIRES_IN=8h
JWT_VISITOR_EXPIRES_IN=15m
```

### Red Local

Para configurar en red local (Máquina A como servidor):

1. **Obtener IP de la máquina A:**
   ```cmd
   ipconfig
   ```

2. **Actualizar .env:**
   ```env
   LOCAL_IP=192.168.1.XXX
   MONGODB_URI=mongodb://192.168.1.XXX:27017/feria_gastronomica
   ```

## 🎯 Módulos del Sistema

### 🔐 Módulo Central (Administrador)
- Gestión completa de usuarios
- Acceso a todos los submódulos
- Configuración del sistema

### 👥 Submódulos Específicos

1. **Productores**: Gestión de productos y platos típicos
2. **Visitantes**: Encuestas de satisfacción (tokens temporales)
3. **Organizadores**: Reportes y análisis de datos

## 🔒 Sistema de Autenticación

### Roles de Usuario
- **Administrador**: Acceso total (8h de sesión)
- **Productor**: Gestión de productos (24h)
- **Visitante**: Encuestas únicamente (15min)
- **Organizador**: Reportes y métricas (24h)

### Tokens JWT
- Encriptación con bcryptjs (12 rounds)
- Diferentes tiempos de expiración por rol
- Validación automática en cada request

## 🚀 Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## 📊 Base de Datos

### Colecciones MongoDB

1. **users**: Usuarios del sistema
2. **products**: Productos gastronómicos
3. **surveys**: Encuestas de satisfacción
4. **reports**: Reportes y métricas

## 🌐 Endpoints API

### Salud del Sistema
- `GET /` - Información general de la API
- `GET /health` - Estado del servidor

### Próximos Endpoints
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/users` - Listar usuarios
- `POST /api/products` - Crear producto
- `POST /api/surveys` - Enviar encuesta
- `GET /api/reports` - Generar reportes

## 🛡️ Seguridad

- **Rate Limiting**: Prevención de ataques DDoS
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de acceso cross-origin
- **Validación**: Sanitización de datos de entrada
- **Encriptación**: Contraseñas hasheadas con bcryptjs

## 📝 Próximos Pasos

1. ✅ Estructura básica y modelos
2. 🔄 **Crear rutas y controladores**
3. 🔄 Implementar autenticación
4. 🔄 Crear frontend Angular
5. 🔄 Configurar comunicación cliente-servidor
6. 🔄 Testing y despliegue

## 🤝 Equipo de Desarrollo

Sistema desarrollado para la gestión de ferias gastronómicas en Puno, aplicando principios de infraestructura y seguridad de AWS.

---

**Estado actual**: ✅ Backend base configurado - Listo para implementar rutas
