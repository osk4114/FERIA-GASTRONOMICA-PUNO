# 🌐 Configuración para Red Local - Feria Gastronómica Puno

## 📋 Pasos para configurar el acceso desde otras PCs

### 1. 🖥️ En la PC Servidor (donde ejecutarás la aplicación):

#### **Opción A: Configuración Automática (Recomendado)**
1. Ejecuta `configure-network.bat`
2. Sigue las instrucciones en pantalla
3. Ingresa la IP de tu PC cuando se solicite

#### **Opción B: Configuración Manual**
1. Obtén la IP de tu PC:
   - Presiona `Windows + R`
   - Escribe `cmd` y presiona Enter
   - Escribe `ipconfig` y presiona Enter
   - Anota la "Dirección IPv4" (ej: `192.168.1.100`)

2. Edita el archivo `frontend/.env`:
   ```
   VITE_API_BASE_URL=http://[TU-IP]:3000/api
   ```
   Ejemplo: `VITE_API_BASE_URL=http://192.168.1.100:3000/api`

### 2. 🚀 Iniciar los Servidores:

1. **Backend**: Ejecuta `start-backend-network.bat`
2. **Frontend**: Ejecuta `start-frontend-network.bat`

### 3. 🌍 Acceso desde otras PCs:

Las otras PCs podrán acceder navegando a:
```
http://[IP-DEL-SERVIDOR]:5173
```

Ejemplo: `http://192.168.1.100:5173`

## 🔧 Configuración Manual de Firewall (Si es necesario)

Si otras PCs no pueden conectarse, configura el firewall de Windows:

1. **Abrir Firewall de Windows Defender**
2. **Configuración Avanzada**
3. **Reglas de Entrada** → **Nueva Regla**
4. **Puerto** → **TCP** → **Puertos específicos**: `3000, 5173`
5. **Permitir la conexión**
6. **Aplicar a todos los perfiles**

## 📱 URLs de Acceso

### PC Servidor:
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

### Otras PCs en la red:
- Frontend: `http://[IP-SERVIDOR]:5173`

## 🔑 Credenciales de Administrador

- **Email**: `admin@admin.com`
- **Contraseña**: `123456`

## 🚨 Solución de Problemas

### ❌ "No se puede conectar al servidor"
1. Verifica que ambos servidores estén corriendo
2. Confirma que la IP en `.env` sea correcta
3. Verifica la configuración del firewall
4. Asegúrate de que todas las PCs estén en la misma red

### ❌ "Error de CORS"
- El backend ya está configurado para aceptar conexiones de red local
- Si persiste, reinicia ambos servidores

### ❌ "Puerto en uso"
- Los scripts automáticamente buscarán puertos alternativos
- Backend: Puerto 3000
- Frontend: Puerto 5173 (si está ocupado, usará 5174, 5175, etc.)

## 📞 Información Técnica

- **Backend**: Node.js + Express (Puerto 3000)
- **Frontend**: Vue.js + Vite (Puerto 5173)
- **Base de Datos**: MongoDB Atlas (Cloud)
- **Configuración**: CORS habilitado para red local

## 🎯 ¡Listo para Usar!

Una vez configurado, la aplicación estará disponible para todas las PCs en tu red local. Los usuarios podrán registrarse, iniciar sesión y usar todas las funcionalidades del sistema.
