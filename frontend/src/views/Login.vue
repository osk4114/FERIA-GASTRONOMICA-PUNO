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
          {{ showRegisterForm ? 'Crear nueva cuenta' : 'Inicia sesión en tu cuenta' }}
        </p>
      </div>

      <!-- Login Form -->
      <form v-if="!showRegisterForm" class="mt-8 space-y-6" @submit.prevent="handleLogin">
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

      </form>

      <!-- Register link -->
      <div v-if="!showRegisterForm" class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          ¿No tienes una cuenta?
          <button
            type="button"
            @click="showRegisterForm = true"
            class="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
          >
            Regístrate aquí
          </button>
        </p>
      </div>

      <!-- Register Form -->
      <form v-if="showRegisterForm" class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <!-- Nombre completo -->
          <div>
            <label for="reg-nombre" class="block text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <input
              id="reg-nombre"
              v-model="registerForm.nombre"
              type="text"
              required
              class="input-field mt-1"
              placeholder="Tu nombre completo"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="reg-email" class="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="reg-email"
              v-model="registerForm.email"
              type="email"
              required
              class="input-field mt-1"
              placeholder="tu@email.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="reg-password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="reg-password"
              v-model="registerForm.password"
              type="password"
              required
              class="input-field mt-1"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <!-- Role -->
          <div>
            <label for="reg-role" class="block text-sm font-medium text-gray-700">
              Tipo de cuenta
            </label>
            <select
              id="reg-role"
              v-model="registerForm.role"
              required
              class="input-field mt-1"
            >
              <option value="">Selecciona tu rol</option>
              <option value="visitante">Visitante</option>
              <option value="productor">Productor</option>
            </select>
          </div>

          <!-- Campos adicionales para productor -->
          <div v-if="registerForm.role === 'productor'" class="space-y-4 pt-4 border-t">
            <div>
              <label for="reg-negocio" class="block text-sm font-medium text-gray-700">
                Nombre del negocio
              </label>
              <input
                id="reg-negocio"
                v-model="registerForm.negocio"
                type="text"
                required
                class="input-field mt-1"
                placeholder="Nombre de tu negocio"
              />
            </div>
            
            <div>
              <label for="reg-telefono" class="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                id="reg-telefono"
                v-model="registerForm.telefono"
                type="tel"
                required
                class="input-field mt-1"
                placeholder="Tu número de teléfono"
              />
            </div>
            
            <div>
              <label for="reg-direccion" class="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <input
                id="reg-direccion"
                v-model="registerForm.direccion"
                type="text"
                required
                class="input-field mt-1"
                placeholder="Tu dirección"
              />
            </div>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex space-x-3">
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="btn-primary flex-1"
            :class="{ 'opacity-50 cursor-not-allowed': authStore.isLoading }"
          >
            <ArrowPathIcon 
              v-if="authStore.isLoading"
              class="animate-spin -ml-1 mr-2 h-4 w-4"
            />
            {{ authStore.isLoading ? 'Registrando...' : 'Crear cuenta' }}
          </button>
          <button
            type="button"
            @click="showRegisterForm = false"
            :disabled="authStore.isLoading"
            class="btn-secondary flex-1"
            :class="{ 'opacity-50 cursor-not-allowed': authStore.isLoading }"
          >
            Volver al login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/utils/toast'
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
const showRegisterForm = ref(false)

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const registerForm = reactive({
  nombre: '',
  email: '',
  password: '',
  role: '',
  negocio: '',
  telefono: '',
  direccion: ''
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

const validateRegisterForm = () => {
  // Validar campos básicos
  if (!registerForm.nombre.trim()) {
    toast.error('El nombre es obligatorio')
    return false
  }
  
  if (!registerForm.email.trim()) {
    toast.error('El email es obligatorio')
    return false
  }
  
  if (!registerForm.email.includes('@')) {
    toast.error('Ingresa un email válido')
    return false
  }
  
  if (!registerForm.password.trim()) {
    toast.error('La contraseña es obligatoria')
    return false
  }
  
  if (registerForm.password.length < 6) {
    toast.error('La contraseña debe tener al menos 6 caracteres')
    return false
  }
  
  if (!registerForm.role) {
    toast.error('Selecciona un tipo de cuenta')
    return false
  }
  
  // Validar campos específicos de productor
  if (registerForm.role === 'productor') {
    if (!registerForm.negocio.trim()) {
      toast.error('El nombre del negocio es obligatorio para productores')
      return false
    }
    
    if (!registerForm.telefono.trim()) {
      toast.error('El teléfono es obligatorio para productores')
      return false
    }
    
    if (!registerForm.direccion.trim()) {
      toast.error('La dirección es obligatoria para productores')
      return false
    }
  }
  
  return true
}

const handleRegister = async () => {
  // Prevenir múltiples envíos
  if (authStore.isLoading) {
    console.log('⏳ Registro ya en proceso, ignorando...')
    return
  }

  // Validar formulario antes de enviar
  if (!validateRegisterForm()) {
    return
  }

  try {
    const userData = {
      nombre: registerForm.nombre,
      email: registerForm.email,
      contraseña: registerForm.password, // Mapear password -> contraseña para el backend
      rol: registerForm.role // Mapear role -> rol para el backend
    }

    // Agregar campos específicos de productor si aplica
    if (registerForm.role === 'productor') {
      userData.negocio = registerForm.negocio
      userData.telefono = registerForm.telefono
      userData.direccion = registerForm.direccion
    }

    console.log('🚀 Frontend enviando registro:', userData)
    
    const result = await authStore.register(userData)
    
    if (result.success) {
      // Guardar credenciales antes de limpiar el formulario
      const emailToLogin = registerForm.email
      const passwordToLogin = registerForm.password
      
      showRegisterForm.value = false
      // Limpiar formulario de registro
      Object.keys(registerForm).forEach(key => {
        registerForm[key] = ''
      })
      
      // Si el registro incluyó autenticación automática, redirigir al dashboard
      if (result.autoLogin) {
        const redirect = route.query.redirect || '/dashboard'
        router.push(redirect)
      } else {
        // Si no, preparar para login manual
        toast.success('¡Cuenta creada exitosamente!')
        
        form.email = emailToLogin
        form.password = passwordToLogin
        
        // Esperar un momento antes del login automático
        setTimeout(async () => {
          await handleLogin()
        }, 1000)
      }
    }
  } catch (error) {
    console.error('Error en registro:', error)
    toast.error('Error inesperado en el registro')
  }
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

onMounted(() => {
  // Si ya está autenticado, redirigir al dashboard
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  }
})
</script>
