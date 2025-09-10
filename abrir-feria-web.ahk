#NoEnv
#SingleInstance Force
#Persistent
SetBatchLines -1

; Configuración
IP_SERVIDOR := "172.80.15.89"
PUERTO_FRONTEND := "5173"
URL_FRONTEND := "http://" . IP_SERVIDOR . ":" . PUERTO_FRONTEND

; Mostrar ventana de información
MsgBox, 0, Feria Gastronómica Puno, 🎉 ACCESO AL SISTEMA WEB`n`n📡 Abriendo navegador...`n`n• URL: %URL_FRONTEND%`n• IP: %IP_SERVIDOR%`n• Puerto: %PUERTO_FRONTEND%`n`nPresiona OK para continuar...

; Abrir navegador
Run, %URL_FRONTEND%

; Mostrar mensaje final
MsgBox, 0, Sistema Abierto, ✅ ¡Navegador abierto exitosamente!`n`n📱 Para acceder desde otros dispositivos:`n%URL_FRONTEND%`n`nEsta ventana se cerrará automáticamente.

; Cerrar script
ExitApp
