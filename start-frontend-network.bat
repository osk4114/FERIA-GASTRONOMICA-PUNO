@echo off
title Frontend - Feria Gastronomica Puno
echo =========================================
echo   FERIA GASTRONOMICA PUNO - FRONTEND
echo =========================================
echo.
echo Iniciando servidor frontend...
echo El servidor estara disponible en:
echo - Local: http://localhost:5173
echo - Red: http://[IP-DE-TU-PC]:5173
echo.
echo IMPORTANTE: 
echo 1. Asegurate de que el backend este corriendo primero
echo 2. Si necesitas cambiar la IP del backend, edita el archivo .env
echo.
echo Para detener el servidor presiona Ctrl+C
echo.
cd /d "%~dp0frontend"
npm run dev
pause
