<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-6 border max-w-2xl shadow-xl rounded-lg bg-white">
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

        <!-- Password (solo en creación) -->
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
              placeholder="Mínimo 6 caracteres"
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
              placeholder="Repita la contraseña"
            >
            <p v-if="errors.confirmarContraseña" class="mt-1 text-sm text-red-600">{{ errors.confirmarContraseña }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Rol -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Rol *
            </label>
            <select
              v-model="form.rol"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccione un rol</option>
              <option 
                v-for="role in roles" 
                :key="role.value" 
                :value="role.value"
              >
                {{ role.label }}
              </option>
            </select>
            <p v-if="errors.rol" class="mt-1 text-sm text-red-600">{{ errors.rol }}</p>
            <p v-if="form.rol" class="mt-1 text-xs text-gray-500">
              {{ getRoleDescription(form.rol) }}
            </p>
          </div>

          <!-- Teléfono -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              v-model="form.telefono"
              type="tel"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+51 999 999 999"
            >
            <p v-if="errors.telefono" class="mt-1 text-sm text-red-600">{{ errors.telefono }}</p>
          </div>
        </div>

        <!-- Campos específicos para productores -->
        <div v-if="form.rol === 'productor'" class="space-y-4">
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 class="text-sm font-medium text-orange-800 mb-3">Información del Productor</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del negocio *
                </label>
                <input
                  v-model="form.negocio"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre del negocio gastronómico"
                >
                <p v-if="errors.negocio" class="mt-1 text-sm text-red-600">{{ errors.negocio }}</p>
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

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Descripción del negocio
              </label>
              <textarea
                v-model="form.descripcion"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe brevemente tu negocio gastronómico..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Estado del usuario (solo en edición) -->
        <div v-if="isEdit" class="flex items-center space-x-3">
          <input
            v-model="form.activo"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          >
          <label class="text-sm font-medium text-gray-700">
            Usuario activo
          </label>
        </div>

        <!-- Botones -->
        <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </span>
            <span v-else>
              {{ isEdit ? 'Actualizar' : 'Crear' }} Usuario
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  },
  roles: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

const loading = ref(false)
const errors = ref({})

const form = ref({
  nombre: '',
  email: '',
  contraseña: '',
  confirmarContraseña: '',
  rol: '',
  telefono: '',
  negocio: '',
  direccion: '',
  descripcion: '',
  activo: true
})

const isEdit = computed(() => !!props.user)

const getRoleDescription = (roleValue) => {
  const role = props.roles.find(r => r.value === roleValue)
  return role?.description || ''
}

const resetForm = () => {
  form.value = {
    nombre: '',
    email: '',
    contraseña: '',
    confirmarContraseña: '',
    rol: '',
    telefono: '',
    negocio: '',
    direccion: '',
    descripcion: '',
    activo: true
  }
  errors.value = {}
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  // Validar nombre
  if (!form.value.nombre.trim()) {
    errors.value.nombre = 'El nombre es obligatorio'
    isValid = false
  } else if (form.value.nombre.length < 2) {
    errors.value.nombre = 'El nombre debe tener al menos 2 caracteres'
    isValid = false
  }

  // Validar email
  if (!form.value.email.trim()) {
    errors.value.email = 'El email es obligatorio'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'El email no es válido'
    isValid = false
  }

  // Validar contraseña (solo en creación)
  if (!isEdit.value) {
    if (!form.value.contraseña) {
      errors.value.contraseña = 'La contraseña es obligatoria'
      isValid = false
    } else if (form.value.contraseña.length < 6) {
      errors.value.contraseña = 'La contraseña debe tener al menos 6 caracteres'
      isValid = false
    }

    if (form.value.contraseña !== form.value.confirmarContraseña) {
      errors.value.confirmarContraseña = 'Las contraseñas no coinciden'
      isValid = false
    }
  }

  // Validar rol
  if (!form.value.rol) {
    errors.value.rol = 'El rol es obligatorio'
    isValid = false
  }

  // Validar campos específicos para productor
  if (form.value.rol === 'productor') {
    if (!form.value.negocio?.trim()) {
      errors.value.negocio = 'El nombre del negocio es obligatorio para productores'
      isValid = false
    }
  }

  // Validar teléfono si se proporciona
  if (form.value.telefono && !/^\+?[\d\s\-\(\)]+$/.test(form.value.telefono)) {
    errors.value.telefono = 'El formato del teléfono no es válido'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const userData = { ...form.value }
    
    // Limpiar campos vacíos opcionales
    Object.keys(userData).forEach(key => {
      if (userData[key] === '' && key !== 'activo') {
        delete userData[key]
      }
    })

    // Remover campos de confirmación
    delete userData.confirmarContraseña

    emit('save', userData)
  } catch (error) {
    console.error('Error in form submission:', error)
  } finally {
    loading.value = false
  }
}

// Watcher para limpiar campos específicos cuando cambia el rol
watch(() => form.value.rol, (newRole, oldRole) => {
  if (oldRole === 'productor' && newRole !== 'productor') {
    form.value.negocio = ''
    form.value.direccion = ''
    form.value.descripcion = ''
  }
})

// Inicializar formulario cuando se recibe un usuario para editar
watch(() => props.user, (newUser) => {
  if (newUser) {
    form.value = {
      nombre: newUser.nombre || '',
      email: newUser.email || '',
      contraseña: '',
      confirmarContraseña: '',
      rol: newUser.rol || '',
      telefono: newUser.telefono || '',
      negocio: newUser.negocio || '',
      direccion: newUser.direccion || '',
      descripcion: newUser.descripcion || '',
      activo: newUser.activo !== undefined ? newUser.activo : true
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Resetear formulario cuando se cierra el modal
watch(() => props.show, (show) => {
  if (!show) {
    setTimeout(() => {
      resetForm()
    }, 300) // Delay para animación de cierre
  }
})
</script>
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
