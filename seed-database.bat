@echo off
echo ======================================
echo  FERIA GASTRONOMICA - POBLAR BASE DE DATOS
echo ======================================
echo.

cd /d "%~dp0backend"

echo 📁 Directorio actual: %cd%
echo.

echo 🔍 Verificando archivos necesarios...
if not exist "seed.js" (
    echo ❌ Error: seed.js no encontrado
    pause
    exit /b 1
)

if not exist ".env" (
    echo ❌ Error: archivo .env no encontrado
    echo Configura MongoDB Atlas primero
    pause
    exit /b 1
)

echo ✅ Archivos verificados
echo.

echo ⚠️  ATENCION: Este script eliminara todos los datos existentes
echo    y creara datos de prueba nuevos.
echo.
set /p confirm="¿Continuar? (S/N): "
if /i not "%confirm%"=="S" (
    echo Operacion cancelada
    pause
    exit /b 0
)

echo.
echo 🗄️  Poblando base de datos...
echo 📊 Creando usuarios, productos y encuestas de prueba...
echo.

node seed.js

echo.
echo ✅ Base de datos poblada exitosamente
echo.
echo 🔑 Credenciales disponibles:
echo    Admin: admin@feriapuno.com / admin123
echo    Productor: rosa.mamani@gmail.com / productor123
echo    Organizador: maria.condori@gmail.com / organizador123
echo    Visitante: juan.visitante@gmail.com / visitante123
echo.
pause
