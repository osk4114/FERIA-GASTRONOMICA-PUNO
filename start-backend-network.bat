@echo off
echo.
echo ========================================
echo   BACKEND FERIA GASTRONOMICA - RED LOCAL
echo ========================================
echo.

cd backend

echo Verificando dependencias...
if not exist node_modules (
    echo Instalando dependencias...
    npm install
)

echo.
echo ================================================
echo   IMPORTANTE: CONFIGURACION DE RED LOCAL
echo ================================================
echo.
echo 1. Encuentra la IP de esta PC:
echo    - Presiona Win+R, escribe "cmd", presiona Enter
echo    - Ejecuta: ipconfig
echo    - Busca "IPv4 Address" (ej: 192.168.1.100)
echo.
echo 2. Edita el archivo backend\.env
echo    - Cambia LOCAL_IP=0.0.0.0 por LOCAL_IP=TU_IP_REAL
echo    - Ejemplo: LOCAL_IP=192.168.1.100
echo.
echo 3. En la PC del frontend, edita:
echo    - frontend\src\environments\environment.ts
echo    - Cambia la IP en apiUrl por la IP de esta PC
echo.
echo Presiona ENTER para continuar...
pause >nul

echo.
echo Iniciando backend en red local...
npm start

pause
