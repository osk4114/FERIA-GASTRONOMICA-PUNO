@echo off
echo ====================================
echo INICIANDO SISTEMA FERIA GASTRONOMICA
echo ====================================
echo.

echo [INFO] Verificando dependencias...

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado
    pause
    exit /b 1
)

REM Verificar si npm está disponible
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm no está disponible
    pause
    exit /b 1
)

echo [OK] Node.js y npm están disponibles

REM Verificar directorio backend
if not exist "backend\" (
    echo [ERROR] Directorio backend no encontrado
    pause
    exit /b 1
)

REM Verificar directorio frontend
if not exist "frontend\" (
    echo [ERROR] Directorio frontend no encontrado
    pause
    exit /b 1
)

echo [OK] Directorios backend y frontend encontrados

REM Instalar dependencias del backend si es necesario
echo.
echo [INFO] Verificando dependencias del backend...
cd backend
if not exist "node_modules\" (
    echo [INFO] Instalando dependencias del backend...
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Error instalando dependencias del backend
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencias del backend ya instaladas
)

REM Verificar archivo .env del backend
if not exist ".env" (
    echo [WARNING] Archivo .env no encontrado en backend
    echo [INFO] Creando archivo .env básico...
    echo PORT=3000 > .env
    echo MONGODB_URI=mongodb+srv://dev:dev123@cluster0.z8ykb.mongodb.net/feriaGastronomica?retryWrites=true^&w=majority^&appName=Cluster0 >> .env
    echo JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_2024 >> .env
    echo NODE_ENV=development >> .env
    echo [OK] Archivo .env creado
)

cd ..

REM Instalar dependencias del frontend si es necesario
echo.
echo [INFO] Verificando dependencias del frontend...
cd frontend
if not exist "node_modules\" (
    echo [INFO] Instalando dependencias del frontend...
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Error instalando dependencias del frontend
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencias del frontend ya instaladas
)

cd ..

echo.
echo ====================================
echo INICIANDO SERVICIOS
echo ====================================

REM Abrir nueva ventana para el backend
echo [INFO] Iniciando servidor backend en puerto 3000...
start "Backend Server" cmd /k "cd backend && npm start"

REM Esperar un poco para que el backend se inicie
timeout /t 3 /nobreak >nul

REM Abrir nueva ventana para el frontend
echo [INFO] Iniciando servidor frontend en puerto 5173...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ====================================
echo SISTEMA INICIADO
echo ====================================
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo [INFO] Ambos servidores están iniciándose en ventanas separadas
echo [INFO] El frontend estará disponible en unos segundos
echo.
echo Credenciales de prueba:
echo - Admin: admin@test.com / admin123
echo - Organizador: org@test.com / org123  
echo - Productor: prod@test.com / prod123
echo - Visitante: visit@test.com / visit123
echo.
echo Funcionalidades disponibles:
echo - Sistema de autenticación con sesiones únicas
echo - Dashboard personalizado por rol
echo - Gestión de usuarios (solo admin)
echo - Gestión de sesiones activas (solo admin)
echo - Interfaz profesional con Vue.js 3
echo.
echo ====================================
echo PRESIONA CUALQUIER TECLA PARA ABRIR EL NAVEGADOR
echo ====================================
pause >nul

REM Abrir el navegador
start "" "http://localhost:5173"

echo.
echo [INFO] Sistema iniciado correctamente
echo [INFO] Para detener los servidores, cierra las ventanas correspondientes
echo.
pause
