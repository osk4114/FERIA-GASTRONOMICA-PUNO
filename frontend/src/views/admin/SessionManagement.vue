<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Gestión de Sesiones</h1>
          <p class="text-gray-600">Monitor y controla las sesiones activas del sistema</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="refreshSessions"
            :disabled="loading"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowPathIcon :class="['h-5 w-5 mr-2', { 'animate-spin': loading }]" />
            Actualizar
          </button>
          <button
            @click="showTerminateAllModal = true"
            :disabled="adminStore.activeSessions.length === 0"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XMarkIcon class="h-5 w-5 mr-2" />
            Terminar Todas
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Sesiones Activas"
          :value="adminStore.activeSessions.length"
          icon="UserGroupIcon"
          color="blue"
          :loading="statsLoading"
        />
        <StatCard
          title="Administradores"
          :value="sessionsByRole.admin"
          icon="ShieldCheckIcon"
          color="purple"
          :loading="statsLoading"
        />
        <StatCard
          title="Productores"
          :value="sessionsByRole.productor"
          icon="CubeIcon"
          color="green"
          :loading="statsLoading"
        />
        <StatCard
          title="Visitantes"
          :value="sessionsByRole.visitante"
          icon="UserIcon"
          color="yellow"
          :loading="statsLoading"
        />
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar Usuario</label>
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

      <!-- Sessions Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            Sesiones Activas ({{ filteredSessions.length }})
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

        <div v-else-if="filteredSessions.length === 0" class="p-6 text-center text-gray-500">
          <UserGroupIcon class="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p>No hay sesiones activas</p>
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
                  Duración
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inicio de Sesión
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expira
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="session in filteredSessions" :key="session.sessionId" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <UserIcon class="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ session.user.nombre }}</div>
                      <div class="text-sm text-gray-500">{{ session.user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getRoleColor(session.user.rol)
                  ]">
                    {{ getRoleLabel(session.user.rol) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getSessionDuration(session.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDateTime(session.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    isExpiringSoon(session.expiresAt) ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  ]">
                    {{ formatDateTime(session.expiresAt) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="confirmTerminate(session)"
                    class="text-red-600 hover:text-red-900 inline-flex items-center"
                    title="Terminar sesión"
                  >
                    <XMarkIcon class="h-5 w-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Session Timeline -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Actividad de Sesiones (Últimas 24h)</h2>
        <div class="space-y-3">
          <div v-for="session in recentSessions" :key="session.sessionId" 
               class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <UserIcon class="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ session.user.nombre }}</p>
                <p class="text-xs text-gray-500">{{ session.user.rol }} • Inició sesión {{ formatRelativeTime(session.createdAt) }}</p>
              </div>
            </div>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Activo
            </span>
          </div>
          <div v-if="recentSessions.length === 0" class="text-center text-gray-500 py-4">
            No hay actividad reciente
          </div>
        </div>
      </div>

      <!-- Terminate Session Modal -->
      <ConfirmModal
        v-if="showTerminateModal"
        title="Terminar Sesión"
        :message="`¿Estás seguro de que deseas terminar la sesión de ${sessionToTerminate?.user.nombre}?`"
        confirm-text="Terminar"
        confirm-class="bg-red-600 hover:bg-red-700"
        @confirm="terminateSession"
        @cancel="showTerminateModal = false"
      />

      <!-- Terminate All Sessions Modal -->
      <ConfirmModal
        v-if="showTerminateAllModal"
        title="Terminar Todas las Sesiones"
        message="¿Estás seguro de que deseas terminar todas las sesiones activas? Esta acción no se puede deshacer."
        confirm-text="Terminar Todas"
        confirm-class="bg-red-600 hover:bg-red-700"
        @confirm="terminateAllSessions"
        @cancel="showTerminateAllModal = false"
      />
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import AppLayout from '@/components/layout/AppLayout.vue'
import StatCard from '@/components/ui/StatCard.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { toast } from '@/utils/toast'

// Heroicons
import {
  ArrowPathIcon,
  XMarkIcon,
  UserGroupIcon,
  UserIcon,
  ShieldCheckIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'

const adminStore = useAdminStore()

// Reactive data
const loading = ref(false)
const statsLoading = ref(true)
const showTerminateModal = ref(false)
const showTerminateAllModal = ref(false)
const sessionToTerminate = ref(null)
const refreshInterval = ref(null)

const filters = ref({
  search: '',
  role: ''
})

// Computed properties
const sessionsByRole = computed(() => {
  const sessions = adminStore.activeSessions
  return {
    admin: sessions.filter(s => s.user.rol === 'admin').length,
    organizador: sessions.filter(s => s.user.rol === 'organizador').length,
    productor: sessions.filter(s => s.user.rol === 'productor').length,
    visitante: sessions.filter(s => s.user.rol === 'visitante').length
  }
})

const filteredSessions = computed(() => {
  let filtered = adminStore.activeSessions

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(session => 
      session.user.nombre.toLowerCase().includes(search) ||
      session.user.email.toLowerCase().includes(search)
    )
  }

  if (filters.value.role) {
    filtered = filtered.filter(session => session.user.rol === filters.value.role)
  }

  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const recentSessions = computed(() => {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  
  return adminStore.activeSessions
    .filter(session => new Date(session.createdAt) >= oneDayAgo)
    .slice(0, 10)
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
  if (!date) return 'No disponible'
  return new Date(date).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatRelativeTime = (date) => {
  const now = new Date()
  const time = new Date(date)
  const diff = now - time
  
  if (diff < 60000) return 'hace un momento'
  if (diff < 3600000) return `hace ${Math.floor(diff / 60000)} minutos`
  if (diff < 86400000) return `hace ${Math.floor(diff / 3600000)} horas`
  return `hace ${Math.floor(diff / 86400000)} días`
}

const getSessionDuration = (startTime) => {
  const now = new Date()
  const start = new Date(startTime)
  const diff = now - start
  
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

const isExpiringSoon = (expiresAt) => {
  if (!expiresAt) return false
  const now = new Date()
  const expires = new Date(expiresAt)
  const diff = expires - now
  
  // Less than 30 minutes
  return diff < 30 * 60 * 1000
}

const clearFilters = () => {
  filters.value = {
    search: '',
    role: ''
  }
}

const confirmTerminate = (session) => {
  sessionToTerminate.value = session
  showTerminateModal.value = true
}

const terminateSession = async () => {
  try {
    const result = await adminStore.terminateSession(sessionToTerminate.value.sessionId)
    if (result.success) {
      // El toast de éxito ya se muestra en el store
      showTerminateModal.value = false
      sessionToTerminate.value = null
    }
  } catch (error) {
    console.error('Error terminating session:', error)
    // El toast de error ya se muestra en el store
  }
}

const terminateAllSessions = async () => {
  try {
    const sessions = [...adminStore.activeSessions]
    let successCount = 0
    
    for (const session of sessions) {
      const result = await adminStore.terminateSession(session.sessionId)
      if (result.success) {
        successCount++
      }
    }
    
    if (successCount === sessions.length) {
      toast.success(`Todas las ${successCount} sesiones han sido terminadas`)
    } else if (successCount > 0) {
      toast.warn(`Se terminaron ${successCount} de ${sessions.length} sesiones`)
    } else {
      toast.error('No se pudieron terminar las sesiones')
    }
    
    showTerminateAllModal.value = false
  } catch (error) {
    console.error('Error terminating all sessions:', error)
    toast.error('Error al terminar las sesiones')
  }
}

const refreshSessions = async () => {
  try {
    loading.value = true
    await adminStore.fetchActiveSessions()
  } catch (error) {
    console.error('Error refreshing sessions:', error)
    toast.error('Error al actualizar sesiones')
  } finally {
    loading.value = false
    statsLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  refreshSessions()
  
  // Auto-refresh every 30 seconds
  refreshInterval.value = setInterval(() => {
    if (!loading.value) {
      refreshSessions()
    }
  }, 30000)
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>
