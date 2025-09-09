<template>
  <AppLayout>
    <div class="space-y-6">
      <h1 class="text-2xl font-bold text-gray-900">Mi Perfil</h1>
      
      <div class="card">
        <div class="text-center py-12">
          <UserCircleIcon class="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Perfil de Usuario</h3>
          <p class="text-gray-600">Aquí podrás gestionar tu información personal.</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { UserCircleIcon } from '@heroicons/vue/24/outline'
</script>
