# Sistema de Feria Gastronómica - Puno

Sistema web completo para la gestión de ferias gastronómicas con autenticación avanzada, sesiones únicas y panel de administración.

## 🚀 Características Principales

### ✨ Sistema de Autenticación Avanzado
- **Sesiones Únicas**: Un usuario solo puede tener una sesión activa a la vez
- **Tokens JWT**: Con identificadores únicos de sesión (sessionId)
- **Expiración por Rol**: 
  - Admin: 8 horas
  - Visitante: 15 minutos
  - Otros roles: 24 horas
- **Invalidación Automática**: Al reiniciar el servidor se invalidan todas las sesiones

### 👥 Roles de Usuario
- **Admin**: Control total del sistema, gestión de usuarios y sesiones
- **Organizador**: Gestión de eventos y reportes
- **Productor**: Gestión de productos y ventas
- **Visitante**: Exploración de productos y encuestas

### 🎨 Frontend Profesional
- **Vue.js 3** con Composition API
- **Pinia** para gestión de estado
- **Tailwind CSS** para estilos
- **Vite** como bundler
- **Arquitectura Modular** con stores, componentes reutilizables y layouts

### 🔧 Panel de Administración
- **Dashboard Estadístico**: Métricas en tiempo real
- **Gestión de Usuarios**: CRUD completo con validaciones
- **Gestión de Sesiones**: Control y terminación de sesiones activas
- **Monitoreo del Sistema**: Estado de servicios y actividad

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** con Express.js
- **MongoDB Atlas** como base de datos
- **JWT** para autenticación
- **bcryptjs** para encriptación
- **express-validator** para validaciones
- **CORS** configurado para desarrollo

### Frontend
- **Vue.js 3** con Composition API
- **Vue Router 4** para navegación
- **Pinia** para estado global
- **Axios** para peticiones HTTP
- **Tailwind CSS** para estilos
- **Heroicons** para iconografía
- **Vue3-Toastify** para notificaciones

## 📦 Instalación y Configuración

### Prerequisitos
- Node.js (v16 o superior)
- npm o yarn
- Cuenta de MongoDB Atlas

### Instalación Rápida

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd feria-gastronomica-puno
```

2. **Ejecutar script de inicio automático**
```bash
# En Windows
start-system.bat

# En Linux/Mac
chmod +x start-system.sh
./start-system.sh
```

### Instalación Manual

#### Backend
```bash
cd backend
npm install
```

Crear archivo `.env`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://dev:dev123@cluster0.z8ykb.mongodb.net/feriaGastronomica?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_2024
NODE_ENV=development
```

```bash
npm start
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🎯 Uso del Sistema

### Acceso al Sistema
- **URL**: http://localhost:5173
- **API**: http://localhost:3000

### Credenciales de Prueba
```
Admin:       admin@test.com    / admin123
Organizador: org@test.com      / org123
Productor:   prod@test.com     / prod123
Visitante:   visit@test.com    / visit123
```

### Funcionalidades por Rol

#### Administrador
- ✅ Dashboard con estadísticas completas
- ✅ Gestión de usuarios (crear, editar, eliminar)
- ✅ Gestión de sesiones activas
- ✅ Control de acceso y permisos
- ✅ Monitoreo del sistema

#### Organizador
- ✅ Dashboard con métricas de eventos
- ✅ Gestión de eventos y participantes
- ✅ Reportes y estadísticas
- ✅ Gestión de encuestas

#### Productor
- ✅ Dashboard con métricas de productos
- ✅ Gestión de productos propios
- ✅ Control de ventas y valoraciones
- ✅ Perfil de productor

#### Visitante
- ✅ Dashboard con productos disponibles
- ✅ Exploración de la feria
- ✅ Completar encuestas
- ✅ Sistema de favoritos

## 🏗️ Arquitectura del Sistema

### Estructura del Proyecto
```
feria-gastronomica-puno/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuración de BD
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middleware/     # Middleware personalizado
│   │   ├── models/         # Modelos de MongoDB
│   │   ├── routes/         # Rutas de la API
│   │   └── utils/          # Utilidades
│   ├── server.js          # Servidor principal
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── layouts/       # Layouts de página
│   │   ├── stores/        # Estado con Pinia
│   │   ├── utils/         # Utilidades
│   │   ├── views/         # Vistas/Páginas
│   │   └── router/        # Configuración de rutas
│   └── package.json
└── README.md
```

### API Endpoints

#### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Información del usuario
- `POST /api/auth/check-session` - Verificar sesión

#### Administración
- `GET /api/admin/dashboard-stats` - Estadísticas del dashboard
- `GET /api/admin/active-sessions` - Sesiones activas
- `DELETE /api/admin/sessions/:sessionId` - Terminar sesión
- `GET /api/admin/users` - Listar usuarios
- `POST /api/admin/users` - Crear usuario
- `PUT /api/admin/users/:id` - Actualizar usuario
- `DELETE /api/admin/users/:id` - Eliminar usuario

## 🔐 Seguridad

### Características de Seguridad
- **Sesiones Únicas**: Previene múltiples logins simultáneos
- **Tokens JWT**: Con expiración automática por rol
- **Validación de Entrada**: En todos los endpoints
- **Encriptación**: Contraseñas con bcrypt
- **CORS**: Configurado para desarrollo seguro
- **Rate Limiting**: Protección contra ataques de fuerza bruta

### Control de Acceso
- **Role-Based Access Control (RBAC)**
- **Middleware de Autenticación**: Verificación en cada request protegido
- **Validación de Roles**: Endpoints específicos por rol
- **Sesiones Seguras**: Invalidación automática y manual

## 🐛 Debugging y Desarrollo

### Scripts Disponibles

#### Backend
```bash
npm start          # Iniciar servidor
npm run dev        # Modo desarrollo con nodemon
npm run seed       # Poblar base de datos
```

#### Frontend
```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción
npm run preview    # Preview del build
```

### Variables de Entorno
```env
# Backend
PORT=3000
MONGODB_URI=<tu-uri-de-mongodb>
JWT_SECRET=<tu-jwt-secret>
NODE_ENV=development

# Frontend (opcional)
VITE_API_URL=http://localhost:3000
```

## 📊 Base de Datos

### Modelos Principales
- **User**: Usuarios del sistema con roles
- **Session**: Sesiones activas con tokens únicos
- **Product**: Productos de la feria
- **Survey**: Encuestas y respuestas
- **Report**: Reportes del sistema

### Conexión
- **MongoDB Atlas** en la nube
- **Conexión Persistente** con reintentos automáticos
- **Validaciones** con Mongoose schemas

## 🚀 Despliegue

### Para Producción
1. **Backend**: 
   - Configurar variables de entorno de producción
   - Usar proceso manager (PM2)
   - Configurar proxy reverso (Nginx)

2. **Frontend**:
   - Build de producción: `npm run build`
   - Servir archivos estáticos
   - Configurar dominio y HTTPS

### Docker (Opcional)
```dockerfile
# Ejemplo de Dockerfile para backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch de feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -am 'Agregar nueva característica'`)
4. Push al branch (`git push origin feature/nueva-caracteristica`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo

---

**Desarrollado con ❤️ para la Feria Gastronómica de Puno**
