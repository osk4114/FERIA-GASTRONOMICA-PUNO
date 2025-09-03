# 🗄️ Configuración MongoDB Atlas

## Pasos para configurar MongoDB Atlas

### 1. Crear cuenta
- Ve a: https://www.mongodb.com/atlas
- Regístrate gratis

### 2. Crear cluster
- Selecciona **M0 Sandbox** (gratis)
- Región: **AWS us-east-1**
- Nombre: **feria-gastronomica**

### 3. Configurar usuario
- Usuario: **admin_feria**
- Contraseña: **[GENERA UNA SEGURA]**

### 4. Configurar red
- Network Access → Add IP Address
- IP: **0.0.0.0/0** (permite acceso desde cualquier IP)

### 5. Obtener connection string
- Database → Connect → Drivers
- Copiar el string de conexión
- Formato: `mongodb+srv://admin_feria:<password>@feria-gastronomica.xxxxx.mongodb.net/feria_gastronomica?retryWrites=true&w=majority`

### 6. Actualizar .env
Reemplaza en el archivo `.env`:
```env
MONGODB_URI=mongodb+srv://admin_feria:TU_PASSWORD@feria-gastronomica.xxxxx.mongodb.net/feria_gastronomica?retryWrites=true&w=majority
```

### 7. Probar conexión
```bash
node server.js
```

## 📊 Base de datos

### Colecciones que se crearán automáticamente:
- **users** - Usuarios del sistema
- **products** - Productos gastronómicos  
- **surveys** - Encuestas de satisfacción
- **reports** - Reportes y métricas

## 🔧 Troubleshooting

### Error de conexión:
1. Verifica que la IP esté permitida
2. Revisa usuario y contraseña
3. Asegúrate de que el cluster esté activo

### Error de autenticación:
1. Verifica credenciales en Atlas
2. Regenera contraseña si es necesario
