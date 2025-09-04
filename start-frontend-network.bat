@echo off
echo.
echo ==========================================
echo   FRONTEND FERIA GASTRONOMICA - RED LOCAL
echo ==========================================
echo.

cd frontend

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
echo 1. Encuentra la IP de la PC del BACKEND
echo    - En la PC del backend ejecuta: ipconfig
echo    - Busca "IPv4 Address" (ej: 192.168.1.100)
echo.
echo 2. Edita el archivo frontend\src\environments\environment.ts
echo    - Cambia apiUrl por: 'http://IP_DEL_BACKEND:3000/api'
echo    - Ejemplo: 'http://192.168.1.100:3000/api'
echo.
echo 3. El frontend estara disponible en:
echo    - http://localhost:4200 (esta PC)
echo    - http://TU_IP_LOCAL:4200 (otras PCs en la red)
echo.
echo Presiona ENTER para continuar...
pause >nul

echo.
echo Iniciando frontend...
npm start -- --host 0.0.0.0

pause
