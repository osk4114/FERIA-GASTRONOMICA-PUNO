<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <!-- Header -->
      <div class="flex items-center mb-4">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-lg font-medium text-gray-900">
            {{ title }}
          </h3>
        </div>
      </div>

      <!-- Message -->
      <div class="mb-6">
        <p class="text-sm text-gray-500">
          {{ message }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancelar
        </button>
        <button
          @click="$emit('confirm')"
          :class="[
            'px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
            confirmClass || 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
          ]"
        >
          {{ confirmText || 'Confirmar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  confirmClass: {
    type: String,
    default: ''
  }
})

defineEmits(['confirm', 'cancel'])
</script>
    required: true
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  confirmClass: {
    type: String,
    default: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
  }
})

defineEmits(['confirm', 'cancel'])
</script>
