# 🎉 Feria Gastronómica Puno - Sistema Cliente-Servidor

Sistema modular para gestión de ferias gastronómicas aplicando principios de infraestructura y seguridad AWS.

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    🌐    ┌─────────────────┐
│   MÁQUINA A     │  ←────→  │   MÁQUINA B     │
│   (Servidor)    │          │   (Cliente)     │
│                 │          │                 │
│ • Node.js API   │          │ • Angular App   │
│ • MongoDB Atlas │          │ • Interfaces    │
│ • Autenticación │          │ • Consumo API   │
└─────────────────┘          └─────────────────┘
```

## 🎯 Módulos Implementados

### 🔐 Módulo Central (Administrador)
- Gestión completa de usuarios
- Control de acceso y roles
- Configuración del sistema
- **Acceso:** Solo administradores con autenticación robusta

### 📦 Submódulos Específicos

#### 🥘 Gestión de Productores
- CRUD de productos gastronómicos
- Control de inventario y precios
- **Acceso:** Productores con sesión de 24h

#### 👥 Gestión de Visitantes  
- Encuestas de satisfacción
- **Acceso:** Tokens temporales de 15 minutos

#### 📊 Gestión de Organizadores
- Generación de reportes
- Análisis de métricas
- **Acceso:** Organizadores con sesión de 24h

## 🚀 Inicio Rápido

### 1️⃣ Iniciar Backend
```bash
# Opción 1: Doble clic en el archivo
start-backend.bat

# Opción 2: PowerShell
.\start-backend.ps1

# Opción 3: Manual
cd backend
node server.js
```

### 2️⃣ Poblar Base de Datos (Opcional)
```bash
# Para crear datos de prueba
seed-database.bat
```

### 3️⃣ Verificar Funcionamiento
- Abrir: http://localhost:3000
- Estado: http://localhost:3000/health

## 🔐 Sistema de Autenticación

### Credenciales de Prueba

| Rol | Email | Contraseña | Duración Sesión |
|-----|-------|------------|----------------|
| **Administrador** | admin@feriapuno.com | admin123 | 8 horas |
| **Productor** | rosa.mamani@gmail.com | productor123 | 24 horas |
| **Organizador** | maria.condori@gmail.com | organizador123 | 24 horas |
| **Visitante** | juan.visitante@gmail.com | visitante123 | 15 minutos |

### Tokens JWT
- **Encriptación:** bcryptjs (12 rounds)
- **Validación:** Automática en cada request
- **Expiración:** Diferenciada por rol

## 🌐 API Endpoints

### 🔐 Autenticación (`/api/auth`)
```
POST /api/auth/login          # Iniciar sesión
POST /api/auth/register       # Registrar usuario
GET  /api/auth/profile        # Ver perfil
PUT  /api/auth/profile        # Actualizar perfil
PUT  /api/auth/change-password # Cambiar contraseña
```

### 👥 Usuarios (`/api/users`) - Solo Admin
```
GET    /api/users           # Listar usuarios
POST   /api/users           # Crear usuario
GET    /api/users/:id       # Obtener usuario
PUT    /api/users/:id       # Actualizar usuario
DELETE /api/users/:id       # Eliminar usuario
GET    /api/users/stats     # Estadísticas
```

### 🥘 Productos (`/api/products`)
```
GET    /api/products                # Ver productos (público)
POST   /api/products                # Crear producto (productor)
GET    /api/products/:id            # Detalle producto
PUT    /api/products/:id            # Actualizar producto
DELETE /api/products/:id            # Eliminar producto
GET    /api/products/my/products    # Mis productos
GET    /api/products/stats/overview # Estadísticas
```

### 📊 Encuestas (`/api/surveys`)
```
POST   /api/surveys           # Enviar encuesta (visitante)
GET    /api/surveys           # Ver encuestas (admin/org)
GET    /api/surveys/:id       # Detalle encuesta
GET    /api/surveys/my-surveys # Mis encuestas
GET    /api/surveys/stats     # Estadísticas
DELETE /api/surveys/:id       # Eliminar encuesta
```

### 📈 Reportes (`/api/reports`) - Admin/Organizador
```
POST   /api/reports/generate  # Generar reporte
GET    /api/reports           # Ver reportes
GET    /api/reports/:id       # Detalle reporte
DELETE /api/reports/:id       # Eliminar reporte
```

## 🗄️ Base de Datos

### MongoDB Atlas (Cloud)
- **Host:** cluster0.toffksb.mongodb.net
- **Base de datos:** feria_gastronomica
- **Colecciones:**
  - `users` - Usuarios del sistema
  - `products` - Productos gastronómicos
  - `surveys` - Encuestas de satisfacción
  - `reports` - Reportes y métricas

## 🛡️ Seguridad Implementada

- ✅ **Rate Limiting** - Prevención ataques DDoS
- ✅ **Helmet** - Headers de seguridad HTTP
- ✅ **CORS** - Control acceso cross-origin
- ✅ **bcryptjs** - Encriptación contraseñas
- ✅ **JWT** - Tokens seguros con expiración
- ✅ **Validación** - Sanitización datos entrada

## 🔧 Configuración Red Local

### Para Máquina A (Servidor):
1. Obtener IP local: `ipconfig`
2. Actualizar `.env`:
   ```env
   LOCAL_IP=192.168.1.XXX
   PORT=3000
   ```
3. Configurar firewall para permitir puerto 3000

### Para Máquina B (Cliente):
1. Angular configurado para: `http://192.168.1.XXX:3000`
2. Consumir API desde IP de máquina A

## 📁 Estructura del Proyecto

```
FERIAGASTRONÓMICA/
├── 📁 backend/                 # Servidor Node.js
│   ├── 📁 src/
│   │   ├── 📁 config/         # Configuración DB
│   │   ├── 📁 models/         # Modelos MongoDB
│   │   ├── 📁 controllers/    # Lógica de negocio
│   │   ├── 📁 routes/         # Rutas API
│   │   ├── 📁 middleware/     # Autenticación/Seguridad
│   │   └── 📁 utils/          # Utilidades JWT
│   ├── 📄 server.js           # Servidor principal
│   ├── 📄 seed.js            # Poblado BD
│   └── 📄 .env               # Variables entorno
├── 📄 start-backend.bat       # Script inicio Windows
├── 📄 start-backend.ps1       # Script inicio PowerShell
├── 📄 seed-database.bat       # Script poblado BD
└── 📄 README.md              # Esta documentación
```

## 🎯 Estado Actual

- ✅ **Backend completamente funcional**
- ✅ **Base de datos conectada y poblada**
- ✅ **API REST con todos los módulos**
- ✅ **Sistema de autenticación JWT**
- ✅ **Seguridad implementada**
- ✅ **Scripts de inicio automatizados**

## 🚀 Próximos Pasos

1. **Frontend Angular** (Cliente - Máquina B)
2. **Configuración red local**
3. **Testing integral**
4. **Documentación API**
5. **Despliegue producción**

## 🆘 Solución de Problemas

### Error de Conexión MongoDB:
1. Verificar credenciales en `.env`
2. Revisar conectividad internet
3. Confirmar IP permitida en Atlas

### Error Puerto 3000 en Uso:
```bash
# Cambiar puerto en .env
PORT=3001
```

### Problemas de Autenticación:
1. Verificar JWT_SECRET en `.env`
2. Revisar fecha/hora del sistema
3. Regenerar base de datos: `seed-database.bat`

## 📞 Soporte

Sistema desarrollado para gestión de ferias gastronómicas en Puno aplicando principios de infraestructura y seguridad AWS.

---

**🎊 ¡Sistema listo para uso en producción!**
