<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p class="text-gray-600">Administra los usuarios del sistema</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon class="h-5 w-5 mr-2" />
          Nuevo Usuario
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Usuarios"
          :value="stats.totalUsers"
          icon="UsersIcon"
          color="blue"
          :loading="statsLoading"
        />
        <StatCard
          title="Administradores"
          :value="stats.admins"
          icon="ShieldCheckIcon"
          color="purple"
          :loading="statsLoading"
        />
        <StatCard
          title="Productores"
          :value="stats.producers"
          icon="CubeIcon"
          color="green"
          :loading="statsLoading"
        />
        <StatCard
          title="Visitantes"
          :value="stats.visitors"
          icon="UserIcon"
          color="yellow"
          :loading="statsLoading"
        />
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
              <option value="admin">Administrador</option>
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
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
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
            Usuarios ({{ filteredUsers.length }})
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

        <div v-else-if="filteredUsers.length === 0" class="p-6 text-center text-gray-500">
          <UserIcon class="h-12 w-12 mx-auto text-gray-300 mb-4" />
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
                  Último Acceso
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user._id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <UserIcon class="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.nombre }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getRoleColor(user.rol)
                  ]">
                    {{ getRoleLabel(user.rol) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    {{ user.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDateTime(user.ultimoAcceso) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="editUser(user)"
                      class="text-primary-600 hover:text-primary-900"
                      title="Editar"
                    >
                      <PencilIcon class="h-5 w-5" />
                    </button>
                    <button
                      @click="confirmDelete(user)"
                      class="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <TrashIcon class="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create/Edit User Modal -->
      <UserModal
        v-if="showCreateModal || showEditModal"
        :user="selectedUser"
        :is-edit="showEditModal"
        @close="closeModals"
        @saved="handleUserSaved"
      />

      <!-- Delete Confirmation Modal -->
      <ConfirmModal
        v-if="showDeleteModal"
        title="Eliminar Usuario"
        :message="`¿Estás seguro de que deseas eliminar al usuario ${userToDelete?.nombre}? Esta acción no se puede deshacer.`"
        confirm-text="Eliminar"
        confirm-class="bg-red-600 hover:bg-red-700"
        @confirm="deleteUser"
        @cancel="showDeleteModal = false"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import AppLayout from '@/components/layout/AppLayout.vue'
import StatCard from '@/components/ui/StatCard.vue'
import UserModal from '@/components/admin/UserModal.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { toast } from '@/utils/toast'

// Heroicons
import {
  PlusIcon,
  UsersIcon,
  UserIcon,
  ShieldCheckIcon,
  CubeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

const adminStore = useAdminStore()

// Reactive data
const loading = ref(true)
const statsLoading = ref(true)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedUser = ref(null)
const userToDelete = ref(null)

const filters = ref({
  search: '',
  role: '',
  status: ''
})

const stats = computed(() => ({
  totalUsers: adminStore.users.length,
  admins: adminStore.users.filter(u => u.rol === 'admin').length,
  producers: adminStore.users.filter(u => u.rol === 'productor').length,
  visitors: adminStore.users.filter(u => u.rol === 'visitante').length
}))

// Computed properties
const filteredUsers = computed(() => {
  let filtered = adminStore.users

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(user => 
      user.nombre.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    )
  }

  if (filters.value.role) {
    filtered = filtered.filter(user => user.rol === filters.value.role)
  }

  if (filters.value.status) {
    const isActive = filters.value.status === 'active'
    filtered = filtered.filter(user => user.activo === isActive)
  }

  return filtered
})

// Methods
const getRoleColor = (role) => {
  const colors = {
    administrador: 'bg-purple-100 text-purple-800',
    organizador: 'bg-blue-100 text-blue-800',
    productor: 'bg-green-100 text-green-800',
    visitante: 'bg-yellow-100 text-yellow-800'
  }
  return colors[role] || 'bg-gray-100 text-gray-800'
}

const getRoleLabel = (role) => {
  const labels = {
    administrador: 'Administrador',
    organizador: 'Organizador',
    productor: 'Productor',
    visitante: 'Visitante'
  }
  return labels[role] || role
}

const formatDateTime = (date) => {
  if (!date) return 'Nunca'
  return new Date(date).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const clearFilters = () => {
  filters.value = {
    search: '',
    role: '',
    status: ''
  }
}

const editUser = (user) => {
  selectedUser.value = { ...user }
  showEditModal.value = true
}

const confirmDelete = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const deleteUser = async () => {
  try {
    await adminStore.deleteUser(userToDelete.value._id)
    toast.success('Usuario eliminado exitosamente')
    showDeleteModal.value = false
    userToDelete.value = null
  } catch (error) {
    console.error('Error deleting user:', error)
    toast.error('Error al eliminar usuario')
  }
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedUser.value = null
}

const handleUserSaved = () => {
  closeModals()
  loadUsers()
}

const loadUsers = async () => {
  try {
    loading.value = true
    await adminStore.fetchUsers()
  } catch (error) {
    console.error('Error loading users:', error)
    toast.error('Error al cargar usuarios')
  } finally {
    loading.value = false
    statsLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>
