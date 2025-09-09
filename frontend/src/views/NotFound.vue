<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="mx-auto h-24 w-24 bg-error-100 rounded-full flex items-center justify-center mb-6">
        <ExclamationTriangleIcon class="h-12 w-12 text-error-600" />
      </div>
      <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <h2 class="text-xl font-medium text-gray-600 mb-6">Página no encontrada</h2>
      <p class="text-gray-500 mb-8">Lo sentimos, la página que buscas no existe.</p>
      <router-link 
        to="/dashboard" 
        class="btn-primary"
      >
        <HomeIcon class="w-5 h-5 mr-2" />
        Volver al Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ExclamationTriangleIcon, HomeIcon } from '@heroicons/vue/24/outline'
</script>
