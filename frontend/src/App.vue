<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize auth interceptors
  authStore.initializeInterceptors()
  
  // Check session on app start
  authStore.checkSession()
})
</script>
