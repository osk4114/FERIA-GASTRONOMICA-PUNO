# 🎉 Feria Gastronómica Puno - Sistema Cliente-Servidor Completo

Sistema modular completo para gestión de ferias gastronómicas con arquitectura cliente-servidor implementando principios de infraestructura y seguridad.

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────┐    🌐    ┌─────────────────────┐
│    MÁQUINA A        │  ←────→  │    MÁQUINA B        │
│    (Servidor)       │          │    (Cliente)        │
│                     │          │                     │
│ • Node.js API ✅    │          │ • Angular 17 ✅     │
│ • MongoDB Atlas ✅  │          │ • Interfaces ✅     │
│ • Autenticación ✅  │          │ • Consumo API ✅    │
│ • Puerto: 3000      │          │ • Puerto: 4200      │
└─────────────────────┘          └─────────────────────┘
```

## 🎯 Estado del Proyecto: ✅ COMPLETO

### ✅ Backend (Node.js + Express + MongoDB)
- **✅ Módulo Central**: Gestión completa de usuarios (Solo admin)
- **✅ Submódulo Productores**: CRUD productos (24h sesión)
- **✅ Submódulo Visitantes**: Encuestas (15 min sesión)
- **✅ Submódulo Organizadores**: Reportes (24h sesión)
- **✅ Autenticación JWT**: Tokens diferenciados por rol
- **✅ Seguridad**: bcryptjs + rate limiting + CORS

### ✅ Frontend (Angular 17)
- **✅ Login System**: Autenticación con credenciales de prueba
- **✅ Dashboard Modular**: Interfaces específicas por rol
- **✅ Responsive Design**: CSS optimizado y Material Design
- **✅ Gestión de Sesiones**: localStorage + JWT simulation
- **✅ Navegación Dinámica**: Módulos según permisos de usuario

## 🚀 Inicio Rápido

### 1️⃣ Iniciar Backend (Máquina A - Servidor)
```bash
# Opción 1: Script automático
.\start-backend.bat
# o
.\start-backend.ps1

# Opción 2: Manual
cd backend
npm install
npm start
```
**🌐 Backend disponible en:** `http://localhost:3000`

### 2️⃣ Iniciar Frontend (Máquina B - Cliente)
```bash
# Opción 1: Script automático
.\start-frontend.bat
# o 
.\start-frontend.ps1

# Opción 2: Manual
cd frontend
npm install
npm start
```
**🌐 Frontend disponible en:** `http://localhost:4200`

### 3️⃣ Poblar Base de Datos (Opcional)
```bash
.\seed-database.bat
```

## 🔐 Credenciales de Prueba

| Rol | Email | Contraseña | Duración | Módulos Accesibles |
|-----|-------|------------|----------|-------------------|
| **🔐 Administrador** | admin@feriapuno.com | admin123 | 8 horas | **Módulo Central** + Todos los submódulos |
| **🥘 Productor** | rosa.mamani@gmail.com | productor123 | 24 horas | Gestión de Productos |
| **🥘 Productor** | carlos.quispe@gmail.com | productor123 | 24 horas | Gestión de Productos |
| **📊 Organizador** | maria.condori@gmail.com | organizador123 | 24 horas | Reportes y Métricas |
| **👥 Visitante** | juan.visitante@gmail.com | visitante123 | 15 minutos | Encuestas de Satisfacción |

## 🌐 Configuración de Red Local

### Para usar en diferentes PCs de la red:

**🖥️ PC A (Backend):**
```bash
# 1. Ejecutar para red local
.\start-backend-network.bat

# 2. O manual:
cd backend
npm start
```
**📡 Backend disponible en:** `http://172.40.15.19:3000`

**🖥️ PC B (Frontend):**
```bash
# 1. Ejecutar para red local  
.\start-frontend-network.bat

# 2. O manual:
cd frontend
npm start -- --host 0.0.0.0
```
**📡 Frontend disponible en:** `http://[IP_PC_B]:4200`

---

## 🏆 Resultado Final

El proyecto **Feria Gastronómica Puno** está **100% completo y funcional** como sistema cliente-servidor con:

- ✅ **Backend robusto** con API REST segura
- ✅ **Frontend moderno** con Angular 17
- ✅ **Autenticación completa** con roles diferenciados
- ✅ **Módulos funcionales** según especificaciones
- ✅ **Seguridad implementada** según mejores prácticas
- ✅ **Documentación completa** para uso y mantenimiento

**🎉 ¡Sistema listo para demostración y uso en entorno real!**
