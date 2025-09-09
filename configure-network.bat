@echo off
title Configurar IP para Red Local
echo =========================================
echo   CONFIGURACION IP PARA RED LOCAL
echo =========================================
echo.
echo Este script te ayudara a configurar la IP del servidor
echo para que otras PCs puedan acceder a la aplicacion.
echo.
echo Primero necesitas obtener la IP de esta PC:
echo 1. Presiona Windows + R
echo 2. Escribe "cmd" y presiona Enter
echo 3. Escribe "ipconfig" y presiona Enter
echo 4. Busca "Adaptador de red Ethernet" o "Wi-Fi"
echo 5. Anota la "Direccion IPv4" (ejemplo: 192.168.1.100)
echo.

set /p SERVER_IP="Ingresa la IP de esta PC (servidor): "

if "%SERVER_IP%"=="" (
    echo Error: No ingresaste una IP valida
    pause
    exit /b 1
)

echo.
echo Configurando archivo .env con IP: %SERVER_IP%
echo.

cd /d "%~dp0frontend"

echo # URL del API Backend > .env
echo # Configuracion automatica para red local >> .env
echo VITE_API_BASE_URL=http://%SERVER_IP%:3000/api >> .env
echo. >> .env
echo # Para desarrollo local usar: >> .env
echo # VITE_API_BASE_URL=http://localhost:3000/api >> .env

echo =========================================
echo   CONFIGURACION COMPLETADA
echo =========================================
echo.
echo La aplicacion ahora esta configurada para:
echo - Servidor backend: http://%SERVER_IP%:3000
echo - Servidor frontend: http://%SERVER_IP%:5173
echo.
echo PARA USAR LA APLICACION:
echo 1. Ejecuta "start-backend-network.bat"
echo 2. Ejecuta "start-frontend-network.bat"
echo 3. En otras PCs navega a: http://%SERVER_IP%:5173
echo.
echo NOTA: Asegurate de que:
echo - El firewall de Windows permita los puertos 3000 y 5173
echo - Todas las PCs esten en la misma red local
echo.
pause
