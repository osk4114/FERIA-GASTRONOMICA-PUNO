<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">
          {{ isEdit ? 'Editar Usuario' : 'Crear Usuario' }}
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            v-model="form.nombre"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Nombre completo"
          >
          <p v-if="errors.nombre" class="mt-1 text-sm text-red-600">{{ errors.nombre }}</p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            :disabled="isEdit"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="correo@ejemplo.com"
          >
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <!-- Password (solo en creación) -->
        <div v-if="!isEdit">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Contraseña *
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="••••••••"
          >
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
        </div>

        <!-- Rol -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Rol *
          </label>
          <select
            v-model="form.rol"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Selecciona un rol</option>
            <option value="admin">Administrador</option>
            <option value="organizador">Organizador</option>
            <option value="productor">Productor</option>
            <option value="visitante">Visitante</option>
          </select>
          <p v-if="errors.rol" class="mt-1 text-sm text-red-600">{{ errors.rol }}</p>
        </div>

        <!-- Estado -->
        <div>
          <label class="flex items-center">
            <input
              v-model="form.activo"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            >
            <span class="ml-2 text-sm text-gray-700">Usuario activo</span>
          </label>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </span>
            <span v-else>
              {{ isEdit ? 'Actualizar' : 'Crear' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { toast } from '@/utils/toast'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'saved'])

const adminStore = useAdminStore()

// Reactive data
const loading = ref(false)
const form = ref({
  nombre: '',
  email: '',
  password: '',
  rol: '',
  activo: true
})

const errors = ref({})

// Methods
const validateForm = () => {
  const newErrors = {}

  if (!form.value.nombre.trim()) {
    newErrors.nombre = 'El nombre es requerido'
  }

  if (!form.value.email.trim()) {
    newErrors.email = 'El email es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    newErrors.email = 'El email no es válido'
  }

  if (!props.isEdit && !form.value.password.trim()) {
    newErrors.password = 'La contraseña es requerida'
  } else if (!props.isEdit && form.value.password.length < 6) {
    newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  if (!form.value.rol) {
    newErrors.rol = 'El rol es requerido'
  }

  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  try {
    loading.value = true
    let result

    if (props.isEdit) {
      result = await adminStore.updateUser(props.user._id, {
        nombre: form.value.nombre,
        email: form.value.email,
        password: form.value.password || undefined,
        rol: form.value.rol,
        activo: form.value.activo
      })
    } else {
      result = await adminStore.createUser({
        nombre: form.value.nombre,
        email: form.value.email,
        password: form.value.password,
        rol: form.value.rol,
        activo: form.value.activo
      })
    }

    if (result.success) {
      emit('saved')
    } else {
      // El error ya se mostró en el store via toast, pero manejamos errores específicos
      if (result.errors && result.errors.length > 0) {
        const newErrors = {}
        result.errors.forEach(error => {
          newErrors[error.path] = error.msg
        })
        errors.value = newErrors
      }
    }
  } catch (error) {
    console.error('Error saving user:', error)
    toast.error(props.isEdit ? 'Error al actualizar usuario' : 'Error al crear usuario')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    nombre: '',
    email: '',
    password: '',
    rol: '',
    activo: true
  }
  errors.value = {}
}

// Watchers
watch(() => props.user, (newUser) => {
  if (newUser && props.isEdit) {
    form.value = {
      nombre: newUser.nombre || '',
      email: newUser.email || '',
      password: '',
      rol: newUser.rol || '',
      activo: newUser.activo !== false
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Lifecycle
onMounted(() => {
  if (props.user && props.isEdit) {
    form.value = {
      nombre: props.user.nombre || '',
      email: props.user.email || '',
      password: '',
      rol: props.user.rol || '',
      activo: props.user.activo !== false
    }
  }
})
</script>
