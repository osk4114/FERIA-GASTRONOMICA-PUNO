@echo off
echo 🎉 Iniciando Frontend - Feria Gastronómica Puno
echo =============================================

cd /d "d:\FERIAGASTRONOMICA\frontend"

echo.
echo 📦 Verificando dependencias...
if not exist "node_modules" (
    echo ⚠️  Instalando dependencias...
    npm install
)

echo.
echo 🚀 Iniciando servidor de desarrollo Angular...
echo 📱 El frontend estará disponible en: http://localhost:4200
echo.
echo ⚡ Presiona Ctrl+C para detener el servidor
echo.

npm start

pause
