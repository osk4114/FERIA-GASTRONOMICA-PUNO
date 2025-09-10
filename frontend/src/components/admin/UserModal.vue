<template>
  <div v-if="show" 
       style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;"
       @click.self="$emit('close')">
    <div style="background-color: white; border-radius: 8px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); max-width: 32rem; width: 100%; margin: 1rem; max-height: 90vh; overflow-y: auto;">
      <div style="padding: 24px;">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ isEdit ? 'Editar Usuario' : 'Crear Usuario' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo *
            </label>
            <input
              v-model="form.nombre"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese el nombre completo"
            >
            <p v-if="errors.nombre" class="mt-1 text-sm text-red-600">{{ errors.nombre }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico *
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              :disabled="isEdit"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="correo@ejemplo.com"
            >
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>
        </div>

        <!-- Password (solo para nuevos usuarios) -->
        <div v-if="!isEdit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña *
            </label>
            <input
              v-model="form.contraseña"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingrese la contraseña"
            >
            <p v-if="errors.contraseña" class="mt-1 text-sm text-red-600">{{ errors.contraseña }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Confirmar contraseña *
            </label>
            <input
              v-model="form.confirmarContraseña"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirme la contraseña"
            >
            <p v-if="errors.confirmarContraseña" class="mt-1 text-sm text-red-600">{{ errors.confirmarContraseña }}</p>
          </div>
        </div>

        <!-- Rol -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Rol del usuario *
          </label>
          
          <select
            v-model="form.rol"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecciona un rol</option>
            <option value="administrador">Administrador</option>
            <option value="organizador">Organizador</option>
            <option value="productor">Productor</option>
            <option value="visitante">Visitante</option>
          </select>
          <p v-if="errors.rol" class="mt-1 text-sm text-red-600">{{ errors.rol }}</p>
        </div>

        <!-- Campos específicos para productor -->
        <div v-if="form.rol === 'productor'" class="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 class="text-md font-medium text-green-800">Información del Productor</h4>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Negocio *
            </label>
            <input
              v-model="form.negocio"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre del negocio o marca"
            >
            <p v-if="errors.negocio" class="mt-1 text-sm text-red-600">{{ errors.negocio }}</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                v-model="form.telefono"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="999999999"
              >
              <p class="mt-1 text-xs text-gray-500">Formato: 999999999 (9 dígitos)</p>
              <p v-if="errors.telefono" class="mt-1 text-sm text-red-600">{{ errors.telefono }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input
                v-model="form.direccion"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dirección del negocio"
              >
            </div>
          </div>
        </div>

        <!-- Estado -->
        <div>
          <label class="flex items-center">
            <input
              v-model="form.activo"
              type="checkbox"
              class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
            <span class="ml-2 text-sm text-gray-700">Usuario activo</span>
          </label>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear') }}
          </button>
        </div>
      </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

// Props
const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  show: {
    type: Boolean,
    default: false
  }
})

// Debug: Watch show prop
watch(() => props.show, (newShow) => {
  console.log('UserModal show prop changed:', newShow)
  if (newShow) {
    console.log('UserModal should be visible now')
  }
})

// Emits
const emit = defineEmits(['close', 'save'])

// Data
const loading = ref(false)
const errors = ref({})

const form = ref({
  nombre: '',
  email: '',
  contraseña: '',
  confirmarContraseña: '',
  rol: '',
  activo: true,
  negocio: '',
  telefono: '',
  direccion: ''
})

// Computed
const isEdit = computed(() => !!props.user)

// Methods
const resetForm = () => {
  form.value = {
    nombre: '',
    email: '',
    contraseña: '',
    confirmarContraseña: '',
    rol: '',
    activo: true,
    negocio: '',
    telefono: '',
    direccion: ''
  }
  errors.value = {}
}

// Watch for user changes
watch(() => props.user, (newUser) => {
  if (newUser) {
    // Populate form with user data
    form.value = {
      nombre: newUser.nombre || '',
      email: newUser.email || '',
      contraseña: '',
      confirmarContraseña: '',
      rol: newUser.rol || '',
      activo: newUser.activo !== undefined ? newUser.activo : true,
      negocio: newUser.negocio || '',
      telefono: newUser.telefono || '',
      direccion: newUser.direccion || ''
    }
  } else {
    // Reset form for new user
    resetForm()
  }
}, { immediate: true })

// Methods
const validateForm = () => {
  errors.value = {}

  if (!form.value.nombre.trim()) {
    errors.value.nombre = 'El nombre es requerido'
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'El email es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'El formato del email no es válido'
  }

  if (!isEdit.value) {
    if (!form.value.contraseña) {
      errors.value.contraseña = 'La contraseña es requerida'
    } else if (form.value.contraseña.length < 6) {
      errors.value.contraseña = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (form.value.contraseña !== form.value.confirmarContraseña) {
      errors.value.confirmarContraseña = 'Las contraseñas no coinciden'
    }
  }

  if (!form.value.rol) {
    errors.value.rol = 'El rol es requerido'
  }

  // Validación específica para productores
  if (form.value.rol === 'productor') {
    if (!form.value.negocio || !form.value.negocio.trim()) {
      errors.value.negocio = 'El nombre del negocio es requerido para productores'
    }
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    // Crear objeto base con campos comunes
    const userData = {
      nombre: form.value.nombre,
      email: form.value.email,
      rol: form.value.rol,
      activo: form.value.activo
    }
    
    // Agregar contraseña solo si no estamos editando o si se proporcionó
    if (!isEdit.value || form.value.contraseña) {
      userData.contraseña = form.value.contraseña
    }
    
    // Solo agregar campos específicos de productor si el rol es productor
    if (form.value.rol === 'productor') {
      // Negocio es obligatorio para productores
      userData.negocio = form.value.negocio
      
      // Campos opcionales solo si tienen valor
      if (form.value.telefono && form.value.telefono.trim()) {
        userData.telefono = form.value.telefono.trim()
      }
      if (form.value.direccion && form.value.direccion.trim()) {
        userData.direccion = form.value.direccion.trim()
      }
    }
    
    // Add ID if editing
    if (isEdit.value && props.user) {
      userData._id = props.user._id
    }

    emit('save', userData)
  } catch (error) {
    console.error('Error saving user:', error)
  } finally {
    loading.value = false
  }
}
</script>
