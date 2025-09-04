# 🎉 Feria Gastronómica Puno - Frontend
# =====================================

Write-Host "🎉 Iniciando Frontend - Feria Gastronómica Puno" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

Set-Location "d:\FERIAGASTRONOMICA\frontend"

Write-Host ""
Write-Host "📦 Verificando dependencias..." -ForegroundColor Yellow

if (!(Test-Path "node_modules")) {
    Write-Host "⚠️  Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "🚀 Iniciando servidor de desarrollo Angular..." -ForegroundColor Green
Write-Host "📱 El frontend estará disponible en: http://localhost:4200" -ForegroundColor Green
Write-Host ""
Write-Host "⚡ Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

npm start
