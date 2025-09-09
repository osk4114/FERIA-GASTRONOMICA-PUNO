@echo off
title Backend - Feria Gastronomica Puno
echo =========================================
echo   FERIA GASTRONOMICA PUNO - BACKEND
echo =========================================
echo.
echo Iniciando servidor backend...
echo El servidor estara disponible en:
echo - Local: http://localhost:3000
echo - Red: http://[IP-DE-TU-PC]:3000
echo.
echo Para detener el servidor presiona Ctrl+C
echo.
cd /d "%~dp0backend"
node server.js
pause
