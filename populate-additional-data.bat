@echo off
echo ===============================================
echo       POBLAR DATOS ADICIONALES
echo       Feria Gastronomica Puno
echo ===============================================
echo.

cd /d "%~dp0backend"

echo 🌱 Poblando base de datos con datos adicionales...
echo.

node populate-data.js

echo.
echo ===============================================
echo ✅ Proceso completado
echo ===============================================
echo.
pause
