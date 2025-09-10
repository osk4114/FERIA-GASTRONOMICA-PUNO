<template>
  <div class="space-y-6">
    <!-- Header con botón de crear usuario -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
      <button 
        @click="showCreateModal = true"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Crear Usuario
      </button>
    </div>

    <!-- Estadísticas rápidas -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Usuarios</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalUsers }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Usuarios Activos</p>
            <p class="text-2xl font-bold text-green-600">{{ activeUsers }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Productores</p>
            <p class="text-2xl font-bold text-orange-600">{{ userStats.productor?.total || 0 }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <svg class="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Visitantes</p>
            <p class="text-2xl font-bold text-purple-600">{{ userStats.visitante?.total || 0 }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <svg class="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por nombre o email..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Rol</label>
          <select
            v-model="selectedRole"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            v-model="selectedStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="loadUsers"
            class="w-full px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Filtrar
          </button>
        </div>
      </div>
    </div>

    <!-- Tabla de usuarios -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Registro</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-700">{{ user.nombre?.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.nombre }}</div>
                    <div class="text-sm text-gray-500" v-if="user.negocio">{{ user.negocio }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.email }}</div>
                <div class="text-sm text-gray-500" v-if="user.telefono">{{ user.telefono }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select
                  :value="user.rol"
                  @change="changeUserRole(user._id, $event.target.value)"
                  :disabled="user._id === currentUserId && user.rol === 'administrador'"
                  class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{
                    'bg-blue-100 text-blue-800': user.rol === 'administrador',
                    'bg-green-100 text-green-800': user.rol === 'organizador',
                    'bg-orange-100 text-orange-800': user.rol === 'productor',
                    'bg-purple-100 text-purple-800': user.rol === 'visitante'
                  }"
                >
                  <option value="administrador">Administrador</option>
                  <option value="organizador">Organizador</option>
                  <option value="productor">Productor</option>
                  <option value="visitante">Visitante</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click="toggleUserStatus(user._id, user.activo)"
                  :disabled="user._id === currentUserId && user.rol === 'administrador'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200"
                  :class="{
                    'bg-green-100 text-green-800 hover:bg-green-200': user.activo,
                    'bg-red-100 text-red-800 hover:bg-red-200': !user.activo,
                    'opacity-50 cursor-not-allowed': user._id === currentUserId && user.rol === 'administrador'
                  }"
                >
                  {{ user.activo ? 'Activo' : 'Inactivo' }}
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.fechaRegistro) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  @click="editUser(user)"
                  class="text-blue-600 hover:text-blue-900 inline-flex items-center"
                >
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button
                  @click="confirmDeleteUser(user)"
                  :disabled="user._id === currentUserId"
                  class="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Mostrando <span class="font-medium">{{ (currentPage - 1) * limit + 1 }}</span>
              a <span class="font-medium">{{ Math.min(currentPage * limit, totalUsers) }}</span>
              de <span class="font-medium">{{ totalUsers }}</span> resultados
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Anterior</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                :class="{
                  'z-10 bg-blue-50 border-blue-500 text-blue-600': page === currentPage,
                  'bg-white border-gray-300 text-gray-500 hover:bg-gray-50': page !== currentPage
                }"
              >
                {{ page }}
              </button>
              
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Siguiente</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de creación de usuario -->
    <UserModal
      v-if="showCreateModal"
      :show="showCreateModal"
      :user="null"
      :roles="availableRoles"
      @close="showCreateModal = false"
      @save="handleCreateUser"
    />

    <!-- Modal de edición de usuario -->
    <UserModal
      v-if="showEditModal"
      :show="showEditModal"
      :user="editingUser"
      :roles="availableRoles"
      @close="showEditModal = false"
      @save="handleEditUser"
    />

    <!-- Modal de confirmación de eliminación -->
    <ConfirmModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :title="'Eliminar Usuario'"
      :message="`¿Estás seguro de que deseas eliminar al usuario ${deletingUser?.nombre}? Esta acción no se puede deshacer.`"
      :confirmText="'Eliminar'"
      :confirmClass="'bg-red-600 hover:bg-red-700'"
      @close="showDeleteModal = false"
      @confirm="handleDeleteUser"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/utils/toast'
import UserModal from './UserModal.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

const authStore = useAuthStore()
const toast = useToast()

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://172.80.15.89:3000/api'

const apiCall = async (url, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authStore.token}`,
      ...options.headers
    }
  })
  return response
}

// Estado
const users = ref([])
const userStats = ref({})
const availableRoles = ref([])
const loading = ref(false)

// Filtros y búsqueda
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')

// Paginación
const currentPage = ref(1)
const limit = ref(10)
const totalUsers = ref(0)
const totalPages = ref(0)

// Modales
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editingUser = ref(null)
const deletingUser = ref(null)

// Propiedades computadas
const currentUserId = computed(() => authStore.user.id)

const activeUsers = computed(() => {
  return users.value.filter(user => user.activo).length
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Métodos
const loadUsers = async () => {
  try {
    loading.value = true
    
    const params = new URLSearchParams({
      page: currentPage.value,
      limit: limit.value
    })
    
    if (searchQuery.value) params.append('search', searchQuery.value)
    if (selectedRole.value) params.append('rol', selectedRole.value)
    if (selectedStatus.value) params.append('activo', selectedStatus.value)
    
    const response = await apiCall(`/admin/users?${params}`)
    const data = await response.json()
    
    if (data.success) {
      users.value = data.data.users
      totalUsers.value = data.data.total
      totalPages.value = Math.ceil(totalUsers.value / limit.value)
    } else {
      toast.error(data.message || 'Error al cargar usuarios')
    }
  } catch (error) {
    console.error('Error loading users:', error)
    toast.error('Error al cargar usuarios')
  } finally {
    loading.value = false
  }
}

const loadUserStats = async () => {
  try {
    const response = await apiCall('/admin/user-stats')
    const data = await response.json()
    
    if (data.success) {
      userStats.value = data.data
    }
  } catch (error) {
    console.error('Error loading user stats:', error)
  }
}

const loadRoles = async () => {
  try {
    const response = await apiCall('/admin/roles')
    const data = await response.json()
    
    if (data.success) {
      availableRoles.value = data.data
    }
  } catch (error) {
    console.error('Error loading roles:', error)
  }
}

const changeUserRole = async (userId, newRole) => {
  try {
    const response = await apiCall(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ rol: newRole })
    })
    
    const data = await response.json()
    
    if (data.success) {
      toast.success('Rol actualizado exitosamente')
      await loadUsers()
      await loadUserStats()
    } else {
      toast.error(data.message || 'Error al cambiar rol')
    }
  } catch (error) {
    console.error('Error changing user role:', error)
    toast.error('Error al cambiar rol')
  }
}

const toggleUserStatus = async (userId, currentStatus) => {
  try {
    const response = await apiCall(`/admin/users/${userId}/status`, {
      method: 'PUT'
    })
    
    const data = await response.json()
    
    if (data.success) {
      toast.success(data.message)
      await loadUsers()
      await loadUserStats()
    } else {
      toast.error(data.message || 'Error al cambiar estado')
    }
  } catch (error) {
    console.error('Error toggling user status:', error)
    toast.error('Error al cambiar estado')
  }
}

const editUser = (user) => {
  editingUser.value = { ...user }
  showEditModal.value = true
}

const confirmDeleteUser = (user) => {
  deletingUser.value = user
  showDeleteModal.value = true
}

const handleCreateUser = async (userData) => {
  try {
    const response = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(userData)
    })
    
    const data = await response.json()
    
    if (data.success) {
      toast.success('Usuario creado exitosamente')
      showCreateModal.value = false
      await loadUsers()
      await loadUserStats()
    } else {
      toast.error(data.message || 'Error al crear usuario')
    }
  } catch (error) {
    console.error('Error creating user:', error)
    toast.error('Error al crear usuario')
  }
}

const handleEditUser = async (userData) => {
  try {
    const response = await fetch(`/api/admin/users/${editingUser.value._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(userData)
    })
    
    const data = await response.json()
    
    if (data.success) {
      toast.success('Usuario actualizado exitosamente')
      showEditModal.value = false
      editingUser.value = null
      await loadUsers()
    } else {
      toast.error(data.message || 'Error al actualizar usuario')
    }
  } catch (error) {
    console.error('Error updating user:', error)
    toast.error('Error al actualizar usuario')
  }
}

const handleDeleteUser = async () => {
  try {
    const response = await fetch(`/api/admin/users/${deletingUser.value._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    const data = await response.json()
    
    if (data.success) {
      toast.success('Usuario eliminado exitosamente')
      showDeleteModal.value = false
      deletingUser.value = null
      await loadUsers()
      await loadUserStats()
    } else {
      toast.error(data.message || 'Error al eliminar usuario')
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    toast.error('Error al eliminar usuario')
  }
}

// Métodos de paginación
const goToPage = (page) => {
  currentPage.value = page
  loadUsers()
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadUsers()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadUsers()
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Watchers
watch([searchQuery, selectedRole, selectedStatus], () => {
  currentPage.value = 1
  loadUsers()
}, { debounce: 300 })

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadUsers(),
    loadUserStats(),
    loadRoles()
  ])
})
</script>
