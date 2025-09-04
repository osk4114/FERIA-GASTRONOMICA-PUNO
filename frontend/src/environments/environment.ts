export const environment = {
  production: false,
  // IMPORTANTE: Cambiar esta IP por la IP real de la PC donde corre el backend
  // Para encontrar la IP: abrir cmd -> ejecutar "ipconfig" -> buscar "IPv4 Address"
  apiUrl: 'http://172.40.15.19:3000/api', // IP actual de la red
  backendHost: '172.40.15.19', // IP de la PC del backend
  frontendHost: '172.40.15.20', // IP de la PC del frontend (ajustar según sea necesario)
  
  // URLs de desarrollo local
  localApiUrl: 'http://localhost:3000/api'
};
