<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Usuarios</h1>
        <button class="btn-primary">
          <PlusIcon class="w-5 h-5 mr-2" />
          Nuevo Usuario
        </button>
      </div>
      
      <div class="card">
        <div class="text-center py-12">
          <UsersIcon class="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Gestión de Usuarios</h3>
          <p class="text-gray-600">Aquí podrás gestionar todos los usuarios del sistema.</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { UsersIcon, PlusIcon } from '@heroicons/vue/24/outline'
</script>
