<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <div class="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
          <CubeIcon class="h-8 w-8 text-white" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Feria Gastronómica Puno
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Inicia sesión en tu cuenta
        </p>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="input-field mt-1"
              :class="{ 'border-error-500': errors.email }"
              placeholder="tu@email.com"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-error-600">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div class="relative mt-1">
              <input
                id="password"
                v-model="form.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="input-field pr-10"
                :class="{ 'border-error-500': errors.password }"
                placeholder="Tu contraseña"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="showPassword = !showPassword"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5 text-gray-400" />
                <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-error-600">
              {{ errors.password }}
            </p>
          </div>
        </div>

        <!-- Remember me -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Recordarme
            </label>
          </div>
        </div>

        <!-- Submit button -->
        <div>
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="btn-primary w-full flex justify-center items-center"
            :class="{ 'opacity-50 cursor-not-allowed': authStore.isLoading }"
          >
            <ArrowPathIcon 
              v-if="authStore.isLoading"
              class="animate-spin -ml-1 mr-2 h-4 w-4"
            />
            {{ authStore.isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
          </button>
        </div>

        <!-- Existing session warning -->
        <div 
          v-if="existingSessionInfo" 
          class="bg-warning-50 border border-warning-200 rounded-lg p-4"
        >
          <div class="flex">
            <ExclamationTriangleIcon class="h-5 w-5 text-warning-400" />
            <div class="ml-3">
              <h3 class="text-sm font-medium text-warning-800">
                Sesión activa encontrada
              </h3>
              <div class="mt-2 text-sm text-warning-700">
                <p>Ya tienes una sesión activa desde:</p>
                <p class="font-medium">{{ existingSessionInfo.device }}</p>
                <p class="text-xs">Expira: {{ formatDate(existingSessionInfo.expiresAt) }}</p>
              </div>
              <div class="mt-4">
                <button
                  type="button"
                  @click="forceLogin"
                  :disabled="authStore.isLoading"
                  class="btn-warning text-sm mr-3"
                >
                  Cerrar sesión anterior e iniciar aquí
                </button>
                <button
                  type="button"
                  @click="clearExistingSessionInfo"
                  class="btn-secondary text-sm"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick access buttons -->
        <div class="mt-6">
          <div class="text-center text-sm text-gray-600 mb-4">
            Acceso rápido para pruebas:
          </div>
          <div class="grid grid-cols-1 gap-2">
            <button
              type="button"
              @click="quickLogin('admin')"
              class="btn-secondary w-full text-sm"
              :disabled="authStore.isLoading"
            >
              🔑 Admin (admin@feriapuno.com)
            </button>
            <button
              type="button"
              @click="quickLogin('organizador')"
              class="btn-warning w-full text-sm"
              :disabled="authStore.isLoading"
            >
              👨‍💼 Organizador (maria.condori@gmail.com)
            </button>
            <button
              type="button"
              @click="quickLogin('visitante')"
              class="btn-success w-full text-sm"
              :disabled="authStore.isLoading"
            >
              👤 Visitante (juan.visitante@gmail.com)
            </button>
            <button
              type="button"
              @click="quickLogin('productor1')"
              class="btn-info w-full text-sm"
              :disabled="authStore.isLoading"
            >
              🏪 Productora Rosa (rosa.mamani@gmail.com)
            </button>
            <button
              type="button"
              @click="quickLogin('productor2')"
              class="btn-info w-full text-sm"
              :disabled="authStore.isLoading"
            >
              🏪 Productor Carlos (carlos.quispe@gmail.com)
            </button>
          </div>
        </div>
      </form>

      <!-- Session Status -->
      <div class="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Estado de la sesión:</h3>
        <div class="text-sm text-gray-600">
          <div class="flex items-center justify-between">
            <span>Estado:</span>
            <span :class="[
              'px-2 py-1 rounded text-xs font-medium',
              authStore.sessionStatus === 'active' ? 'bg-success-100 text-success-700' : 'bg-gray-200 text-gray-700'
            ]">
              {{ authStore.sessionStatus === 'active' ? 'Activa' : 'Inactiva' }}
            </span>
          </div>
          <div v-if="authStore.isAuthenticated" class="flex items-center justify-between mt-1">
            <span>Usuario:</span>
            <span class="font-medium">{{ authStore.userName }}</span>
          </div>
          <div v-if="authStore.isAuthenticated" class="flex items-center justify-between mt-1">
            <span>Rol:</span>
            <span class="font-medium capitalize">{{ authStore.userRole }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  CubeIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const showPassword = ref(false)
const existingSessionInfo = ref(null)

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: ''
})

const validateForm = () => {
  errors.email = ''
  errors.password = ''
  
  if (!form.email) {
    errors.email = 'El correo electrónico es requerido'
    return false
  }
  
  if (!form.email.includes('@')) {
    errors.email = 'Ingresa un correo electrónico válido'
    return false
  }
  
  if (!form.password) {
    errors.password = 'La contraseña es requerida'
    return false
  }
  
  if (form.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
    return false
  }
  
  return true
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  console.log('🚀 Frontend enviando login:', {
    email: form.email,
    password: form.password ? '[PRESENTE]' : '[AUSENTE]'
  });
  
  const result = await authStore.login({
    email: form.email,
    password: form.password
  })
  
  if (result.success) {
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  } else if (result.code === 'EXISTING_SESSION') {
    // Mostrar información de la sesión existente
    existingSessionInfo.value = result.sessionInfo
  }
}

const forceLogin = async () => {
  const result = await authStore.forceLogout({
    email: form.email,
    password: form.password
  })
  
  if (result.success) {
    existingSessionInfo.value = null
    const redirect = route.query.redirect || '/dashboard'
    router.push(redirect)
  }
}

const clearExistingSessionInfo = () => {
  existingSessionInfo.value = null
}

const formatDate = (dateString) => {
  if (!dateString) return 'Fecha desconocida'
  return new Date(dateString).toLocaleString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const quickLogin = async (role) => {
  const credentials = {
    admin: { email: 'admin@feriapuno.com', password: 'admin123' },
    organizador: { email: 'maria.condori@gmail.com', password: 'organizador123' },
    visitante: { email: 'juan.visitante@gmail.com', password: 'visitante123' },
    productor1: { email: 'rosa.mamani@gmail.com', password: 'productor123' },
    productor2: { email: 'carlos.quispe@gmail.com', password: 'productor123' }
  }
  
  const creds = credentials[role]
  console.log('🎯 QuickLogin seleccionado:', role, creds);
  
  if (creds) {
    form.email = creds.email
    form.password = creds.password
    console.log('📝 Formulario actualizado:', {
      email: form.email,
      password: form.password ? '[PRESENTE]' : '[AUSENTE]'
    });
    await handleLogin()
  }
}

onMounted(() => {
  // Si ya está autenticado, redirigir al dashboard
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>
