@echo off
echo ======================================
echo    FERIA GASTRONOMICA PUNO - BACKEND
echo ======================================
echo.

cd /d "%~dp0backend"

echo 📁 Directorio actual: %cd%
echo.

echo 🔍 Verificando archivos necesarios...
if not exist "server.js" (
    echo ❌ Error: server.js no encontrado
    echo Asegurate de estar en la carpeta correcta
    pause
    exit /b 1
)

if not exist ".env" (
    echo ❌ Error: archivo .env no encontrado
    echo Configura las variables de entorno primero
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo ⚠️  node_modules no encontrado
    echo 📦 Instalando dependencias...
    npm install
    if errorlevel 1 (
        echo ❌ Error instalando dependencias
        pause
        exit /b 1
    )
)

echo ✅ Archivos verificados correctamente
echo.

echo 🚀 Iniciando servidor backend...
echo 📡 URL: http://localhost:3000
echo 🗄️  Base de datos: MongoDB Atlas
echo.
echo ⚠️  Para detener el servidor presiona Ctrl+C
echo ======================================
echo.

node server.js
