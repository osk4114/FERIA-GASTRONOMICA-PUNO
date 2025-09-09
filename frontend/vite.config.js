import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: '0.0.0.0', // Permite acceso desde cualquier IP de la red
    port: 5173,      // Puerto específico
    strictPort: false, // Si el puerto está ocupado, busca otro
    open: false,     // No abrir automáticamente el navegador
    cors: true,      // Habilitar CORS
    // Configuración adicional de red
    hmr: {
      host: '10.1.3.14', // IP de tu máquina para Hot Module Replacement
      port: 5173
    }
  },
  preview: {
    host: '0.0.0.0', // También para el build de preview
    port: 4173,
    strictPort: false,
    open: false
  }
})
