<template>
  <div class="min-h-screen bg-gray-50">
    <AppLayout>
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p class="mt-2 text-gray-600">Administra los usuarios del sistema</p>
        </div>

        <!-- Actions Bar -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div class="flex-1 min-w-0">
              <h2 class="text-lg font-medium text-gray-900">Lista de Usuarios</h2>
              <p class="mt-1 text-sm text-gray-500">
                Gestiona roles, estados y permisos de usuarios
              </p>
              <!-- Debug info -->
              <p class="mt-1 text-xs text-red-500">Debug: showCreateModal = {{ showCreateModal }}</p>
            </div>
            <div class="mt-4 sm:mt-0 sm:ml-4">
              <button
                @click="openCreateModal"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Crear Usuario
              </button>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                v-model="filters.search"
                type="text"
                placeholder="Nombre, email..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <select
                v-model="filters.role"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos los roles</option>
                <option value="administrador">Administrador</option>
                <option value="organizador">Organizador</option>
                <option value="productor">Productor</option>
                <option value="visitante">Visitante</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <select
                v-model="filters.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos</option>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
            <div class="flex items-end">
              <button
                @click="clearFilters"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">
              Usuarios ({{ adminStore.pagination?.totalUsers || adminStore.users.length }})
            </h2>
          </div>
          
          <div v-if="loading" class="p-6">
            <div class="animate-pulse space-y-4">
              <div v-for="i in 5" :key="i" class="flex items-center space-x-4">
                <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div class="h-3 bg-gray-300 rounded w-1/6"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="adminStore.users.length === 0" class="p-6 text-center text-gray-500">
            <svg class="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p>No se encontraron usuarios</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registro
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in adminStore.users" :key="user._id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                          <span class="text-sm font-medium text-white">
                            {{ user.nombre?.charAt(0)?.toUpperCase() }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ user.nombre }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ user.email }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getRoleBadgeClass(user.rol)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ user.rol }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="user.activo ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'" 
                          class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ user.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(user.fechaRegistro) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      @click="editUser(user)"
                      class="text-primary-600 hover:text-primary-900"
                    >
                      Editar
                    </button>
                    <button
                      @click="toggleUserStatus(user)"
                      :class="user.activo ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                    >
                      {{ user.activo ? 'Desactivar' : 'Activar' }}
                    </button>
                    <button
                      @click="deleteUser(user)"
                      :disabled="user.rol === 'administrador' && user._id === authStore.user?.id"
                      :class="[
                        'text-red-600 hover:text-red-900',
                        (user.rol === 'administrador' && user._id === authStore.user?.id) 
                          ? 'opacity-50 cursor-not-allowed' 
                          : ''
                      ]"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && adminStore.users.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Anterior
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando {{ ((currentPage - 1) * itemsPerPage) + 1 }} a {{ Math.min(currentPage * itemsPerPage, adminStore.pagination?.totalUsers || adminStore.users.length) }} de {{ adminStore.pagination?.totalUsers || adminStore.users.length }} usuarios
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Anterior
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Siguiente
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>

    <!-- Create/Edit User Modal -->
    <UserModal
      :show="showCreateModal"
      :user="editingUser"
      @close="closeModal"
      @save="handleUserSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/layout/AppLayout.vue'
import UserModal from '@/components/admin/UserModal.vue'
import { toast } from '@/utils/toast'

const adminStore = useAdminStore()
const authStore = useAuthStore()

// Reactive data
const loading = ref(false)
const showCreateModal = ref(false)
const editingUser = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10

const filters = ref({
  search: '',
  role: '',
  status: ''
})

// Computed
const filteredUsers = computed(() => {
  let filtered = adminStore.users

  if (filters.value.search) {
    filtered = filtered.filter(user => 
      user.nombre.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.value.search.toLowerCase())
    )
  }

  if (filters.value.role) {
    filtered = filtered.filter(user => user.rol === filters.value.role)
  }

  if (filters.value.status) {
    const isActive = filters.value.status === 'true'
    filtered = filtered.filter(user => user.activo === isActive)
  }

  return filtered
})

const totalPages = computed(() => adminStore.pagination?.totalPages || 1)

const paginatedUsers = computed(() => {
  // La paginación se maneja en el backend, así que devolvemos todos los usuarios filtrados
  return filteredUsers.value
})

// Methods
const loadUsers = async () => {
  loading.value = true
  try {
    console.log('Loading users from API...')
    
    const filterParams = {
      page: currentPage.value,
      limit: 10,
      search: filters.value?.search || '',
      role: filters.value?.role || '',
      status: filters.value?.status || ''
    }
    
    const result = await adminStore.fetchUsers(filterParams)
    console.log('Users loaded:', result)
    
    if (result.success) {
      // Los usuarios se almacenan automáticamente en adminStore.users
      console.log('Users from store:', adminStore.users)
      console.log('Pagination from store:', adminStore.pagination)
    }
  } catch (error) {
    console.error('Error loading users:', error)
    toast.error('Error al cargar usuarios')
  } finally {
    loading.value = false
  }
}

const clearFilters = async () => {
  filters.value = {
    search: '',
    role: '',
    status: ''
  }
  currentPage.value = 1
  await loadUsers()
}

const openCreateModal = () => {
  console.log('Opening create modal')
  console.log('showCreateModal before:', showCreateModal.value)
  editingUser.value = null
  showCreateModal.value = true
  console.log('showCreateModal after:', showCreateModal.value)
}

const editUser = (user) => {
  console.log('Editing user:', user)
  console.log('showCreateModal before:', showCreateModal.value)
  editingUser.value = { ...user }
  showCreateModal.value = true
  console.log('showCreateModal after:', showCreateModal.value)
}

const toggleUserStatus = async (user) => {
  try {
    const result = await adminStore.updateUser(user._id, { activo: !user.activo })
    if (result.success) {
      toast.success(`Usuario ${!user.activo ? 'activado' : 'desactivado'} correctamente`)
    }
  } catch (error) {
    console.error('Error toggling user status:', error)
    toast.error('Error al cambiar estado del usuario')
  }
}

const deleteUser = async (user) => {
  // Prevenir que el admin se elimine a sí mismo
  if (user.rol === 'administrador' && user._id === authStore.user?.id) {
    toast.error('No puedes eliminar tu propia cuenta de administrador')
    return
  }

  // Confirmar eliminación
  const confirmed = confirm(
    `¿Estás seguro de que quieres eliminar al usuario "${user.nombre}"?\n\n` +
    `Email: ${user.email}\n` +
    `Rol: ${user.rol}\n\n` +
    `Esta acción NO se puede deshacer.`
  )

  if (!confirmed) return

  try {
    const result = await adminStore.deleteUser(user._id)
    if (result.success) {
      toast.success(`Usuario "${user.nombre}" eliminado exitosamente`)
      // Recargar la lista de usuarios
      await loadUsers()
    } else {
      toast.error(result.message || 'Error al eliminar usuario')
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    toast.error('Error inesperado al eliminar usuario')
  }
}

const closeModal = () => {
  console.log('Closing modal')
  showCreateModal.value = false
  editingUser.value = null
}

const handleUserSave = async (userData) => {
  try {
    console.log('handleUserSave called with:', userData)
    console.log('editingUser:', editingUser.value)
    
    let result
    
    if (editingUser.value) {
      // Update existing user
      console.log('Updating user with ID:', editingUser.value._id)
      result = await adminStore.updateUser(editingUser.value._id, userData)
    } else {
      // Create new user
      console.log('Creating new user')
      result = await adminStore.createUser(userData)
    }
    
    console.log('Save result:', result)
    
    if (result.success) {
      closeModal()
      // Refresh the user list
      await loadUsers()
    } else {
      // Mostrar errores específicos del backend
      if (result.errors && result.errors.length > 0) {
        result.errors.forEach(error => {
          toast.error(`${error.param}: ${error.msg}`)
        })
      } else {
        toast.error(result.message || 'Error al guardar usuario')
      }
    }
  } catch (error) {
    console.error('Error saving user:', error)
    toast.error('Error inesperado al guardar usuario')
  }
}

const getRoleBadgeClass = (role) => {
  const classes = {
    administrador: 'text-purple-800 bg-purple-100',
    organizador: 'text-blue-800 bg-blue-100',
    productor: 'text-green-800 bg-green-100',
    visitante: 'text-gray-800 bg-gray-100'
  }
  return classes[role] || 'text-gray-800 bg-gray-100'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES')
}

const previousPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--
    await loadUsers()
  }
}

const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    await loadUsers()
  }
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>
