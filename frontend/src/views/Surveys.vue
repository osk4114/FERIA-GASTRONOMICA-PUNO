<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Encuestas</h1>
        <button class="btn-primary" v-if="authStore.userRole !== 'visitante'">
          <PlusIcon class="w-5 h-5 mr-2" />
          Nueva Encuesta
        </button>
      </div>
      
      <div class="card">
        <div class="text-center py-12">
          <ClipboardDocumentListIcon class="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Sistema de Encuestas</h3>
          <p class="text-gray-600">
            {{ authStore.userRole === 'visitante' 
              ? 'Aquí podrás participar en las encuestas disponibles.' 
              : 'Aquí podrás crear y gestionar las encuestas del sistema.' 
            }}
          </p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { ClipboardDocumentListIcon, PlusIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
</script>
