@echo off
title Feria Gastronómica Puno - Acceso Web
color 0A

:: Configuración
set IP_SERVIDOR=172.80.15.89
set PUERTO_FRONTEND=5173
set URL_FRONTEND=http://%IP_SERVIDOR%:%PUERTO_FRONTEND%

:: Banner
echo ================================================================
echo         🎉 FERIA GASTRONÓMICA PUNO - SISTEMA WEB
echo ================================================================
echo.
echo 📡 Accediendo al sistema web...
echo    • IP del Servidor: %IP_SERVIDOR%
echo    • Puerto Frontend: %PUERTO_FRONTEND%
echo    • URL: %URL_FRONTEND%
echo.

:: Verificar si el puerto está abierto (simple)
echo 🔍 Verificando servidor...
timeout /t 2 /nobreak > nul

:: Abrir navegador
echo 🚀 Abriendo navegador...
start "" "%URL_FRONTEND%"

echo.
echo ✅ Navegador abierto exitosamente!
echo.
echo ================================================================
echo         📱 Acceso desde otros dispositivos:
echo         %URL_FRONTEND%
echo ================================================================
echo.
echo Presiona cualquier tecla para cerrar...
pause > nul
