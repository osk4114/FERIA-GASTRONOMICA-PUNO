# ======================================
# FERIA GASTRONOMICA PUNO - BACKEND
# ======================================

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   FERIA GASTRONOMICA PUNO - BACKEND" -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Cambiar al directorio backend
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $scriptPath "backend"

if (Test-Path $backendPath) {
    Set-Location $backendPath
    Write-Host "📁 Directorio actual: $((Get-Location).Path)" -ForegroundColor Green
} else {
    Write-Host "❌ Error: Directorio backend no encontrado" -ForegroundColor Red
    Write-Host "Asegurate de estar en la carpeta correcta del proyecto" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""
Write-Host "🔍 Verificando archivos necesarios..." -ForegroundColor Blue

# Verificar archivos necesarios
if (-not (Test-Path "server.js")) {
    Write-Host "❌ Error: server.js no encontrado" -ForegroundColor Red
    Write-Host "Asegurate de estar en la carpeta correcta" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: archivo .env no encontrado" -ForegroundColor Red
    Write-Host "Configura las variables de entorno primero" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules no encontrado" -ForegroundColor Yellow
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Blue
    
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "Error en npm install"
        }
    }
    catch {
        Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
}

Write-Host "✅ Archivos verificados correctamente" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Iniciando servidor backend..." -ForegroundColor Green
Write-Host "📡 URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🗄️  Base de datos: MongoDB Atlas" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Para detener el servidor presiona Ctrl+C" -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Iniciar servidor
try {
    node server.js
}
catch {
    Write-Host ""
    Write-Host "❌ Error iniciando el servidor" -ForegroundColor Red
    Write-Host "Revisa la configuración y vuelve a intentar" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
}

Write-Host ""
Write-Host "🔌 Servidor detenido" -ForegroundColor Yellow
Read-Host "Presiona Enter para salir"
