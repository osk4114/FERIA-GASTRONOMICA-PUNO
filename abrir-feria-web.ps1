# Script para abrir Feria Gastronómica Puno en el navegador
# Autor: Sistema Feria Gastronómica
# Fecha: $(Get-Date -Format "dd/MM/yyyy")

# Configuración
$IP_SERVIDOR = "172.80.15.89"
$PUERTO_FRONTEND = "5173"
$URL_FRONTEND = "http://$IP_SERVIDOR`:$PUERTO_FRONTEND"

# Función para mostrar mensaje con colores
function Write-ColorMessage {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Función para detectar navegador predeterminado
function Get-DefaultBrowser {
    try {
        $regPath = "HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice"
        $progId = (Get-ItemProperty $regPath).ProgId
        
        switch -Wildcard ($progId) {
            "*Chrome*" { return "Chrome" }
            "*Firefox*" { return "Firefox" }
            "*Edge*" { return "Edge" }
            "*Opera*" { return "Opera" }
            default { return "Navegador predeterminado" }
        }
    }
    catch {
        return "Navegador predeterminado"
    }
}

# Limpiar pantalla
Clear-Host

# Banner del sistema
Write-ColorMessage "================================================================" "Cyan"
Write-ColorMessage "        🎉 FERIA GASTRONÓMICA PUNO - SISTEMA WEB" "Yellow"
Write-ColorMessage "================================================================" "Cyan"
Write-ColorMessage ""

# Información del sistema
Write-ColorMessage "📡 Configuración de Acceso:" "Green"
Write-ColorMessage "   • IP del Servidor: $IP_SERVIDOR" "White"
Write-ColorMessage "   • Puerto Frontend: $PUERTO_FRONTEND" "White"
Write-ColorMessage "   • URL Completa: $URL_FRONTEND" "White"
Write-ColorMessage ""

# Detectar navegador
$navegador = Get-DefaultBrowser
Write-ColorMessage "🌐 Navegador detectado: $navegador" "Cyan"
Write-ColorMessage ""

# Verificar conectividad
Write-ColorMessage "🔍 Verificando conectividad..." "Yellow"

try {
    $response = Test-NetConnection -ComputerName $IP_SERVIDOR -Port $PUERTO_FRONTEND -WarningAction SilentlyContinue
    
    if ($response.TcpTestSucceeded) {
        Write-ColorMessage "✅ Servidor disponible en $IP_SERVIDOR`:$PUERTO_FRONTEND" "Green"
        Write-ColorMessage ""
        
        # Abrir navegador
        Write-ColorMessage "🚀 Abriendo navegador..." "Yellow"
        Start-Process $URL_FRONTEND
        
        Write-ColorMessage "✅ Navegador abierto exitosamente!" "Green"
        Write-ColorMessage ""
        Write-ColorMessage "📌 URL copiada al portapapeles para fácil acceso" "Cyan"
        
        # Copiar URL al portapapeles
        Set-Clipboard -Value $URL_FRONTEND
        
    } else {
        Write-ColorMessage "❌ No se puede conectar al servidor" "Red"
        Write-ColorMessage "   • Verifica que el frontend esté ejecutándose" "Yellow"
        Write-ColorMessage "   • Comando: cd frontend && npm run dev" "Gray"
        Write-ColorMessage ""
        Write-ColorMessage "¿Quieres abrir el navegador de todas formas? (s/n): " "Yellow" -NoNewline
        $respuesta = Read-Host
        
        if ($respuesta -eq "s" -or $respuesta -eq "S") {
            Start-Process $URL_FRONTEND
            Write-ColorMessage "🌐 Navegador abierto (servidor puede no estar disponible)" "Yellow"
        }
    }
}
catch {
    Write-ColorMessage "⚠️  Error verificando conectividad, abriendo navegador..." "Yellow"
    Start-Process $URL_FRONTEND
}

Write-ColorMessage ""
Write-ColorMessage "================================================================" "Cyan"
Write-ColorMessage "         📱 Acceso desde otros dispositivos en la red:" "Green"
Write-ColorMessage "         $URL_FRONTEND" "White"
Write-ColorMessage "================================================================" "Cyan"
Write-ColorMessage ""
Write-ColorMessage "Presiona cualquier tecla para cerrar..." "Gray"
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
